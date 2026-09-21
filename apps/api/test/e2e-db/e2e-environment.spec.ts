import {
  EXPECTED_E2E_PROJECT_REF,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import {
  buildMutableE2eEnvironment,
  buildSanitizedPlaywrightEnvironment,
} from './e2e-environment';

const runId = 'r20260831120000_abcdef123456';
const connectionString = `postgresql://postgres:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`;

describe('E2E environment helpers', () => {
  it('builds an explicit mutable execution context', () => {
    const environment = buildMutableE2eEnvironment(
      {
        DATABASE_URL_E2E: connectionString,
        E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      },
      runId,
    );

    expect(environment).toMatchObject({
      E2E_MUTABLE: '1',
      E2E_RUN_ID: runId,
      E2E_SCHEMA: `e2e_${runId}`,
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: '1',
    });
  });

  it('passes only allowlisted system values and non-secret E2E identity to Playwright', () => {
    const target = validateMutableE2eEnvironment({
      DATABASE_URL_E2E: connectionString,
      E2E_MUTABLE: '1',
      E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      E2E_RUN_ID: runId,
      E2E_SCHEMA: `e2e_${runId}`,
      NODE_ENV: 'test',
      PLAYWRIGHT_TEST: '1',
    });
    const result = buildSanitizedPlaywrightEnvironment(
      {
        DATABASE_URL: 'normal-secret',
        DATABASE_URL_E2E: connectionString,
        E2E_ADMIN_PASSWORD: 'admin-secret',
        NODE_EXTRA_CA_CERTS: 'D:\\test certificates\\supabase-ca.crt',
        NODE_TLS_REJECT_UNAUTHORIZED: '0',
        NODE_OPTIONS: '--require unsafe-startup.js',
        NO_COLOR: '1',
        FORCE_COLOR: '1',
        PATH: 'safe-path',
        UNRELATED_PRIVATE_TOKEN: 'private-token',
      },
      target,
    );

    expect(result).toMatchObject({
      E2E_MUTABLE: '1',
      E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      E2E_RUN_ID: runId,
      E2E_SCHEMA: `e2e_${runId}`,
      NODE_ENV: 'test',
      NODE_EXTRA_CA_CERTS: 'D:\\test certificates\\supabase-ca.crt',
      PATH: 'safe-path',
      PLAYWRIGHT_TEST: '1',
    });
    expect(result).not.toHaveProperty('DATABASE_URL');
    expect(result).not.toHaveProperty('DATABASE_URL_E2E');
    expect(result).not.toHaveProperty('E2E_ADMIN_PASSWORD');
    expect(result).not.toHaveProperty('NODE_TLS_REJECT_UNAUTHORIZED');
    expect(result).not.toHaveProperty('NODE_OPTIONS');
    expect(result).not.toHaveProperty('NO_COLOR');
    expect(result.FORCE_COLOR).toBe('1');
    expect(result).not.toHaveProperty('UNRELATED_PRIVATE_TOKEN');
  });

  it('does not forward unsafe Node overrides or conflicting colors to preparation', () => {
    const source = {
      NO_COLOR: '1',
      FORCE_COLOR: '1',
      NODE_OPTIONS: '--no-warnings',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
    };
    const result = buildMutableE2eEnvironment(source, runId);
    expect(result).not.toHaveProperty('NO_COLOR');
    expect(result).not.toHaveProperty('NODE_OPTIONS');
    expect(result).not.toHaveProperty('NODE_TLS_REJECT_UNAUTHORIZED');
    expect(result.FORCE_COLOR).toBe('1');
    expect(source.NO_COLOR).toBe('1');
  });
});
