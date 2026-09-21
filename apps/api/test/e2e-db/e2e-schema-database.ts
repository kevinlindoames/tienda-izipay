import type { PrismaClient } from '../../src/generated/prisma/client';
import {
  E2E_SCHEMA_PATTERN,
  E2eSafetyError,
  type E2eConnectionTarget,
  type MutableE2eTarget,
} from '../../src/config/e2e-database-target';
import { createBaseE2ePrismaClient } from './e2e-prisma';
import { runtimeRolePassword } from './e2e-runtime-role';

type E2ePrismaClientFactory = (target: E2eConnectionTarget) => PrismaClient;

interface RawDatabaseClient {
  $executeRawUnsafe(query: string, ...values: any[]): Promise<number>;
  $queryRawUnsafe<T>(query: string, ...values: any[]): Promise<T>;
}

interface DatabaseIdentityRow {
  canCreateSchema: boolean;
  databaseName: string;
}

interface SchemaMarkerRow {
  marker: string | null;
}

function quoteSchemaIdentifier(schema: string): string {
  if (
    schema === 'public' ||
    !E2E_SCHEMA_PATTERN.test(schema) ||
    Buffer.byteLength(schema, 'utf8') > 63
  ) {
    throw new E2eSafetyError('Refusing to use an unsafe E2E schema name.');
  }

  return `"${schema}"`;
}

function quoteMarker(marker: string): string {
  if (!/^tienda-izipay-e2e:[a-z0-9]+:[a-z0-9_]+$/.test(marker)) {
    throw new E2eSafetyError('Refusing to use an unsafe E2E schema marker.');
  }

  return `'${marker}'`;
}

async function assertConnectedDatabase(
  client: RawDatabaseClient,
  target: E2eConnectionTarget,
  requireCreatePrivilege: boolean,
): Promise<void> {
  const rows = await client.$queryRawUnsafe<DatabaseIdentityRow[]>(
    `SELECT current_database() AS "databaseName",
            has_database_privilege(current_user, current_database(), 'CREATE') AS "canCreateSchema"`,
  );
  const row = rows[0];

  if (!row || row.databaseName !== target.databaseName) {
    throw new E2eSafetyError(
      'The connected database does not match the approved E2E database.',
    );
  }

  if (requireCreatePrivilege && row.canCreateSchema !== true) {
    throw new E2eSafetyError(
      'The E2E database role cannot create isolated schemas.',
    );
  }
}

async function findSchemaMarker(
  client: RawDatabaseClient,
  schema: string,
): Promise<SchemaMarkerRow | undefined> {
  const rows = await client.$queryRawUnsafe<SchemaMarkerRow[]>(
    `SELECT obj_description(oid, 'pg_namespace') AS "marker"
       FROM pg_namespace
      WHERE nspname = $1`,
    schema,
  );

  return rows[0];
}

async function assertOwnedRole(
  client: RawDatabaseClient,
  target: MutableE2eTarget,
): Promise<void> {
  const rows = await client.$queryRawUnsafe<SchemaMarkerRow[]>(
    `SELECT shobj_description(oid, 'pg_authid') AS marker
       FROM pg_roles WHERE rolname = $1`,
    target.schema,
  );
  if (rows[0]?.marker !== target.marker) {
    throw new E2eSafetyError(
      'The E2E runtime role ownership marker does not match.',
    );
  }
}

export class E2eSchemaDatabase {
  constructor(
    private readonly createClient: E2ePrismaClientFactory = createBaseE2ePrismaClient,
  ) {}

  async validateConnection(target: E2eConnectionTarget): Promise<void> {
    const prisma = this.createClient(target);

    try {
      await assertConnectedDatabase(prisma, target, true);
    } finally {
      await prisma.$disconnect();
    }
  }

  async createSchema(target: MutableE2eTarget): Promise<void> {
    const prisma = this.createClient(target);
    const quotedSchema = quoteSchemaIdentifier(target.schema);
    const quotedMarker = quoteMarker(target.marker);

    try {
      await prisma.$transaction(async (transaction) => {
        const client = transaction as unknown as RawDatabaseClient;
        await assertConnectedDatabase(client, target, true);

        if (await findSchemaMarker(client, target.schema)) {
          throw new E2eSafetyError(
            'The isolated E2E schema already exists; refusing to reuse it.',
          );
        }

        const roles = await client.$queryRawUnsafe<{ name: string }[]>(
          'SELECT rolname AS name FROM pg_roles WHERE rolname = $1',
          target.schema,
        );
        if (roles.length > 0) {
          throw new E2eSafetyError(
            'The E2E runtime role already exists; refusing to reuse it.',
          );
        }

        const password = runtimeRolePassword(target); // hex only, never logged
        const expires = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();
        await client.$executeRawUnsafe(
          `CREATE ROLE ${quotedSchema} LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS CONNECTION LIMIT 10 PASSWORD '${password}' VALID UNTIL '${expires}'`,
        );
        await client.$executeRawUnsafe(
          `COMMENT ON ROLE ${quotedSchema} IS ${quotedMarker}`,
        );

        await client.$executeRawUnsafe(`CREATE SCHEMA ${quotedSchema}`);
        await client.$executeRawUnsafe(
          `REVOKE ALL ON SCHEMA ${quotedSchema} FROM PUBLIC, anon, authenticated`,
        );
        await client.$executeRawUnsafe(
          `COMMENT ON SCHEMA ${quotedSchema} IS ${quotedMarker}`,
        );
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async grantRuntimeAccess(target: MutableE2eTarget): Promise<void> {
    const prisma = this.createClient(target);
    const quoted = quoteSchemaIdentifier(target.schema);
    try {
      await prisma.$transaction(async (transaction) => {
        const client = transaction as unknown as RawDatabaseClient;
        await assertConnectedDatabase(client, target, false);
        if (
          (await findSchemaMarker(client, target.schema))?.marker !==
          target.marker
        ) {
          throw new E2eSafetyError(
            'The E2E schema ownership marker does not match.',
          );
        }
        await assertOwnedRole(client, target);
        await client.$executeRawUnsafe(
          `GRANT USAGE ON SCHEMA ${quoted} TO ${quoted}`,
        );
        await client.$executeRawUnsafe(
          `REVOKE ALL ON ALL TABLES IN SCHEMA ${quoted} FROM PUBLIC, anon, authenticated`,
        );
        await client.$executeRawUnsafe(
          `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ${quoted} TO ${quoted}`,
        );
        await client.$executeRawUnsafe(
          `REVOKE INSERT, UPDATE, DELETE ON ${quoted}."_prisma_migrations" FROM ${quoted}`,
        );
        await client.$executeRawUnsafe(
          `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA ${quoted} TO ${quoted}`,
        );
      });
    } finally {
      await prisma.$disconnect();
    }
  }

  async dropOwnedSchema(target: MutableE2eTarget): Promise<void> {
    const prisma: PrismaClient = this.createClient(target);
    const quotedSchema = quoteSchemaIdentifier(target.schema);

    try {
      await prisma.$transaction(async (transaction) => {
        const client = transaction as unknown as RawDatabaseClient;
        await assertConnectedDatabase(client, target, false);

        const schema = await findSchemaMarker(client, target.schema);

        if (!schema || schema.marker !== target.marker) {
          throw new E2eSafetyError(
            'The E2E schema ownership marker does not match; cleanup was refused.',
          );
        }

        await assertOwnedRole(client, target);
        await client.$executeRawUnsafe(`DROP SCHEMA ${quotedSchema} CASCADE`);
        await client.$executeRawUnsafe(`DROP ROLE ${quotedSchema}`);
      });
    } finally {
      await prisma.$disconnect();
    }
  }
}
