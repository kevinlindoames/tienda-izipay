import {
  E2eSafetyError,
  type MutableE2eTarget,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import { createScopedE2ePrismaClient } from './e2e-prisma';

interface Privileges {
  roleName: string;
  elevated: boolean;
  schemaCreate: boolean;
  schemaUsage: boolean;
  anonymousAccess: boolean;
  migrationsWritable: boolean;
  tablesAccessible: boolean;
  ownsTables: boolean;
  membershipCount: number;
}

export function assertRuntimePrivileges(
  row: Privileges | undefined,
  schema: string,
): void {
  if (
    !row ||
    row.roleName !== schema ||
    row.elevated ||
    row.schemaCreate ||
    !row.schemaUsage ||
    row.anonymousAccess ||
    row.migrationsWritable ||
    !row.tablesAccessible ||
    row.ownsTables ||
    row.membershipCount !== 0
  ) {
    throw new E2eSafetyError(
      'The E2E database privilege isolation check failed.',
    );
  }
}

export async function assertE2ePrivileges(
  provisioner: MutableE2eTarget,
  environment: NodeJS.ProcessEnv,
): Promise<void> {
  const target = validateMutableE2eEnvironment(environment, 'runtime');
  if (
    target.schema !== provisioner.schema ||
    target.marker !== provisioner.marker
  ) {
    throw new E2eSafetyError(
      'The E2E runtime target differs from its provisioner.',
    );
  }
  const prisma = createScopedE2ePrismaClient(target);
  try {
    const rows = await prisma.$queryRawUnsafe<Privileges[]>(
      `SELECT current_user AS "roleName",
              (r.rolsuper OR r.rolcreatedb OR r.rolcreaterole OR r.rolbypassrls OR r.rolreplication
               OR has_database_privilege(current_user, current_database(), 'CREATE')) AS elevated,
              has_schema_privilege(current_user, $1, 'CREATE') AS "schemaCreate",
              has_schema_privilege(current_user, $1, 'USAGE') AS "schemaUsage",
              (has_schema_privilege('anon', $1, 'USAGE')
               OR has_schema_privilege('authenticated', $1, 'USAGE')
               OR EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                    WHERE n.nspname = $1 AND c.relkind IN ('r', 'p') AND
                    (has_table_privilege('anon', c.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')
                     OR has_table_privilege('authenticated', c.oid, 'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')))) AS "anonymousAccess",
              has_table_privilege(current_user, $2, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') AS "migrationsWritable",
              (SELECT bool_and(has_table_privilege(current_user, c.oid, 'SELECT') AND
                         has_table_privilege(current_user, c.oid, 'INSERT') AND
                         has_table_privilege(current_user, c.oid, 'UPDATE') AND
                         has_table_privilege(current_user, c.oid, 'DELETE'))
                 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                WHERE n.nspname = $1 AND c.relkind IN ('r', 'p') AND c.relname <> '_prisma_migrations') AS "tablesAccessible",
              EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                       WHERE n.nspname = $1 AND c.relowner = r.oid) AS "ownsTables",
              (SELECT count(*)::int FROM pg_auth_members WHERE member = r.oid) AS "membershipCount"
         FROM pg_roles r WHERE rolname = current_user`,
      target.schema,
      `${target.schema}._prisma_migrations`,
    );
    assertRuntimePrivileges(rows[0], target.schema);
    process.stdout.write(
      'E2E runtime role, table privileges and anonymous-access isolation validated.\n',
    );
  } finally {
    await prisma.$disconnect();
  }
}
