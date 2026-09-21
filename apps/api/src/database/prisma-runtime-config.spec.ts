import { EXPECTED_E2E_PROJECT_REF } from '../config/e2e-database-target';
import {
  assertE2eRuntimeDatabaseReady,
  resolvePrismaRuntimeConfig,
} from './prisma-runtime-config';

describe('resolvePrismaRuntimeConfig', () => {
  it('preserves the normal DATABASE_URL behavior', () => {
    const connectionString =
      'postgresql://postgres:secret@localhost:5432/tienda_izipay';

    expect(
      resolvePrismaRuntimeConfig({ DATABASE_URL: connectionString }),
    ).toEqual({
      connectionString,
      mode: 'normal',
    });
  });

  it('uses only DATABASE_URL_E2E and the validated schema in mutable mode', () => {
    const connectionString = `postgresql://e2e_r20260831120000_abcdef123456:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=verify-full`;

    expect(
      resolvePrismaRuntimeConfig({
        DATABASE_URL:
          'postgresql://postgres:normal-secret@localhost:5432/tienda_izipay',
        DATABASE_URL_E2E: connectionString,
        E2E_MUTABLE: '1',
        E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
        E2E_RUN_ID: 'r20260831120000_abcdef123456',
        E2E_SCHEMA: 'e2e_r20260831120000_abcdef123456',
        NODE_ENV: 'test',
        PLAYWRIGHT_TEST: '1',
      }),
    ).toEqual({
      connectionString,
      databaseName: 'postgres',
      marker: `tienda-izipay-e2e:${EXPECTED_E2E_PROJECT_REF}:r20260831120000_abcdef123456`,
      mode: 'e2e',
      schema: 'e2e_r20260831120000_abcdef123456',
    });
  });

  it('requires the exact runtime marker and migrated tables', () => {
    const expected = resolvePrismaRuntimeConfig({
      DATABASE_URL_E2E: `postgresql://e2e_r20260831120000_abcdef123456:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=verify-full`,
      E2E_MUTABLE: '1',
      E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      E2E_RUN_ID: 'r20260831120000_abcdef123456',
      E2E_SCHEMA: 'e2e_r20260831120000_abcdef123456',
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: '1',
    });

    if (expected.mode !== 'e2e') {
      throw new Error('Expected an E2E runtime configuration.');
    }

    expect(() =>
      assertE2eRuntimeDatabaseReady(
        {
          catalogTable: 'e2e_r20260831120000_abcdef123456.products',
          databaseName: 'postgres',
          marker: expected.marker,
          migrationsTable:
            'e2e_r20260831120000_abcdef123456._prisma_migrations',
        },
        expected,
      ),
    ).not.toThrow();

    expect(() =>
      assertE2eRuntimeDatabaseReady(
        {
          catalogTable: null,
          databaseName: 'postgres',
          marker: expected.marker,
          migrationsTable:
            'e2e_r20260831120000_abcdef123456._prisma_migrations',
        },
        expected,
      ),
    ).toThrow('owned and migrated');
  });
});
