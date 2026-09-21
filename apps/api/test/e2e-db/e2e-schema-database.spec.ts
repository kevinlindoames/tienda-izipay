import type { PrismaClient } from '../../src/generated/prisma/client';
import {
  EXPECTED_E2E_PROJECT_REF,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import { E2eSchemaDatabase } from './e2e-schema-database';

const runId = 'r20260831120000_abcdef123456';
const target = validateMutableE2eEnvironment({
  DATABASE_URL_E2E: `postgresql://postgres:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`,
  E2E_MUTABLE: '1',
  E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
  E2E_RUN_ID: runId,
  E2E_SCHEMA: `e2e_${runId}`,
  NODE_ENV: 'test',
  PLAYWRIGHT_TEST: '1',
});

interface FakePrismaClient {
  $disconnect: jest.Mock<Promise<void>, []>;
  $executeRawUnsafe: jest.Mock<Promise<number>, [string, ...unknown[]]>;
  $queryRawUnsafe: jest.Mock<Promise<unknown[]>, [string, ...unknown[]]>;
  $transaction: jest.Mock<Promise<void>, [(client: unknown) => Promise<void>]>;
}

function createFakeClient(
  marker: string | null | undefined,
  databaseName = 'postgres',
): FakePrismaClient {
  const queryRawUnsafe = jest.fn<Promise<unknown[]>, [string, ...unknown[]]>(
    (query: string) => {
      if (query.includes('current_database()')) {
        return Promise.resolve([{ canCreateSchema: true, databaseName }]);
      }

      if (query.includes('pg_namespace')) {
        return Promise.resolve(marker === undefined ? [] : [{ marker }]);
      }

      if (query.includes('shobj_description')) {
        return Promise.resolve(marker === undefined ? [] : [{ marker }]);
      }

      return Promise.resolve([]);
    },
  );
  const transaction = jest.fn<
    Promise<void>,
    [(client: unknown) => Promise<void>]
  >();
  const client: FakePrismaClient = {
    $disconnect: jest.fn(() => Promise.resolve()),
    $executeRawUnsafe: jest.fn<Promise<number>, [string, ...unknown[]]>(() =>
      Promise.resolve(0),
    ),
    $queryRawUnsafe: queryRawUnsafe,
    $transaction: transaction,
  };

  client.$transaction.mockImplementation((operation) => operation(client));

  return client;
}

function createDatabase(client: FakePrismaClient): E2eSchemaDatabase {
  return new E2eSchemaDatabase(() => client as unknown as PrismaClient);
}

describe('E2eSchemaDatabase', () => {
  it('validates database identity and CREATE privilege without mutations', async () => {
    const client = createFakeClient(undefined);

    await createDatabase(client).validateConnection(target);

    expect(client.$queryRawUnsafe).toHaveBeenCalledTimes(1);
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
    expect(client.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('creates only the exact guarded schema and ownership marker', async () => {
    const client = createFakeClient(undefined);

    await createDatabase(client).createSchema(target);

    const commands = client.$executeRawUnsafe.mock.calls.map(
      ([query]) => query,
    );
    expect(commands[0]).toContain(
      `CREATE ROLE "${target.schema}" LOGIN NOINHERIT NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS`,
    );
    expect(commands[1]).toBe(
      `COMMENT ON ROLE "${target.schema}" IS '${target.marker}'`,
    );
    expect(commands.slice(2)).toEqual([
      `CREATE SCHEMA "${target.schema}"`,
      `REVOKE ALL ON SCHEMA "${target.schema}" FROM PUBLIC, anon, authenticated`,
      `COMMENT ON SCHEMA "${target.schema}" IS '${target.marker}'`,
    ]);
  });

  it('refuses to reuse a pre-existing schema', async () => {
    const client = createFakeClient('unowned-schema');

    await expect(createDatabase(client).createSchema(target)).rejects.toThrow(
      'already exists',
    );
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it('refuses to reuse a pre-existing runtime role', async () => {
    const client = createFakeClient(undefined);
    const query = client.$queryRawUnsafe.getMockImplementation()!;
    client.$queryRawUnsafe.mockImplementation((sql, ...values) =>
      sql.includes('SELECT rolname AS name')
        ? Promise.resolve([{ name: target.schema }])
        : query(sql, ...values),
    );
    await expect(createDatabase(client).createSchema(target)).rejects.toThrow(
      'runtime role already exists',
    );
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it('refuses cleanup when the role marker differs even if the schema is owned', async () => {
    const client = createFakeClient(target.marker);
    const query = client.$queryRawUnsafe.getMockImplementation()!;
    client.$queryRawUnsafe.mockImplementation((sql, ...values) =>
      sql.includes('shobj_description')
        ? Promise.resolve([{ marker: 'foreign-role' }])
        : query(sql, ...values),
    );
    await expect(
      createDatabase(client).dropOwnedSchema(target),
    ).rejects.toThrow('runtime role ownership marker');
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it('drops only the exact schema when its ownership marker matches', async () => {
    const client = createFakeClient(target.marker);

    await createDatabase(client).dropOwnedSchema(target);

    expect(client.$executeRawUnsafe).toHaveBeenCalledTimes(2);
    expect(client.$executeRawUnsafe).toHaveBeenCalledWith(
      `DROP SCHEMA "${target.schema}" CASCADE`,
    );
    expect(client.$executeRawUnsafe).toHaveBeenLastCalledWith(
      `DROP ROLE "${target.schema}"`,
    );
  });

  it('grants only DML and preserves read-only migration history', async () => {
    const client = createFakeClient(target.marker);
    await createDatabase(client).grantRuntimeAccess(target);
    expect(client.$executeRawUnsafe).toHaveBeenCalledWith(
      `GRANT USAGE ON SCHEMA "${target.schema}" TO "${target.schema}"`,
    );
    expect(client.$executeRawUnsafe).toHaveBeenCalledWith(
      `REVOKE INSERT, UPDATE, DELETE ON "${target.schema}"."_prisma_migrations" FROM "${target.schema}"`,
    );
    expect(
      client.$executeRawUnsafe.mock.calls.some(([query]) =>
        query.includes('GRANT ALL'),
      ),
    ).toBe(false);
  });

  it('refuses to grant access to an unowned schema', async () => {
    const client = createFakeClient('foreign');
    await expect(
      createDatabase(client).grantRuntimeAccess(target),
    ).rejects.toThrow('ownership marker');
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it('refuses cleanup when the ownership marker differs', async () => {
    const client = createFakeClient('different-marker');

    await expect(
      createDatabase(client).dropOwnedSchema(target),
    ).rejects.toThrow('ownership marker');
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });

  it('refuses all mutations when the connected database identity differs', async () => {
    const client = createFakeClient(undefined, 'unexpected');

    await expect(createDatabase(client).createSchema(target)).rejects.toThrow(
      'approved E2E database',
    );
    expect(client.$executeRawUnsafe).not.toHaveBeenCalled();
  });
});
