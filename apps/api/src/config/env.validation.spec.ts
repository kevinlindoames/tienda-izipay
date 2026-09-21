import { validateEnvironment } from './env.validation';
import { EXPECTED_E2E_PROJECT_REF } from './e2e-database-target';

describe('validateEnvironment', () => {
  it('normalizes a valid PostgreSQL environment', () => {
    const result = validateEnvironment({
      NODE_ENV: 'test',
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    });

    expect(result.NODE_ENV).toBe('test');
    expect(result.PORT).toBe(3001);
    expect(result.DATABASE_URL).toBe(
      'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    );
  });

  it('uses the API port default', () => {
    const result = validateEnvironment({
      DATABASE_URL: 'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    });

    expect(result.PORT).toBe(3001);
  });

  it('rejects a missing database URL', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'test',
      }),
    ).toThrow('DATABASE_URL');
  });

  it('rejects a malformed database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'not-a-url',
      }),
    ).toThrow('valid URL');
  });

  it('rejects a non PostgreSQL database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'https://localhost/database',
      }),
    ).toThrow('postgresql');
  });

  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({
        PORT: '70000',
        DATABASE_URL:
          'postgresql://postgres:secret@localhost:5432/tienda_izipay',
      }),
    ).toThrow('PORT');
  });

  it('rejects an invalid node environment', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'staging',
        DATABASE_URL:
          'postgresql://postgres:secret@localhost:5432/tienda_izipay',
      }),
    ).toThrow('NODE_ENV');
  });

  it('validates mutable E2E configuration without replacing DATABASE_URL', () => {
    const normalDatabaseUrl =
      'postgresql://postgres:normal-secret@localhost:5432/tienda_izipay';
    const e2eDatabaseUrl = `postgresql://e2e_r20260831120000_abcdef123456:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=verify-full`;
    const result = validateEnvironment({
      DATABASE_URL: normalDatabaseUrl,
      DATABASE_URL_E2E: e2eDatabaseUrl,
      E2E_MUTABLE: '1',
      E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      E2E_RUN_ID: 'r20260831120000_abcdef123456',
      E2E_SCHEMA: 'e2e_r20260831120000_abcdef123456',
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: '1',
    });

    expect(result.DATABASE_URL).toBe(normalDatabaseUrl);
    expect(result.DATABASE_URL_E2E).toBe(e2eDatabaseUrl);
    expect(result.E2E_SCHEMA).toBe('e2e_r20260831120000_abcdef123456');
  });
});
