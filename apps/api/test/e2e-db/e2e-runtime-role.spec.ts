import {
  EXPECTED_E2E_PROJECT_REF,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import {
  buildRuntimeEnvironment,
  runtimeRolePassword,
} from './e2e-runtime-role';

const runId = 'r20260920120000_abcdef123456';
const environment = {
  DATABASE_URL: 'postgresql://normal:normal-secret@localhost/normal',
  DATABASE_URL_E2E: `postgresql://postgres:setup-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`,
  E2E_MUTABLE: '1',
  E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
  E2E_RUN_ID: runId,
  E2E_SCHEMA: `e2e_${runId}`,
  NODE_ENV: 'test',
  PLAYWRIGHT_TEST: '1',
  E2E_ADMIN_PASSWORD: 'admin-secret',
  NODE_EXTRA_CA_CERTS: 'D:\\cert.crt',
  PORT: '3101',
};

describe('E2E runtime credentials', () => {
  it.each(['direct', 'pooler'])(
    'isolates the %s runtime principal and environment',
    (mode) => {
      const input = { ...environment };
      if (mode === 'pooler') {
        input.DATABASE_URL_E2E = `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:setup-secret@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require`;
      }
      const target = validateMutableE2eEnvironment(input);
      const runtime = buildRuntimeEnvironment(input, target);
      const parsed = new URL(runtime.DATABASE_URL_E2E!);
      expect(parsed.username).toBe(
        mode === 'pooler'
          ? `${target.schema}.${target.projectRef}`
          : target.schema,
      );
      expect(parsed.password).not.toBe('setup-secret');
      expect(parsed.searchParams.get('sslmode')).toBe('verify-full');
      expect(runtime).not.toHaveProperty('DATABASE_URL');
      expect(runtime).not.toHaveProperty('E2E_ADMIN_PASSWORD');
      expect(runtime.PORT).toBe('3101');
      expect(runtime.NODE_EXTRA_CA_CERTS).toBe(environment.NODE_EXTRA_CA_CERTS);
      expect(() =>
        validateMutableE2eEnvironment(runtime, 'runtime'),
      ).not.toThrow();
      expect(() => validateMutableE2eEnvironment(runtime)).toThrow();
      expect(() => validateMutableE2eEnvironment(input, 'runtime')).toThrow();
    },
  );
  it('derives reproducible credentials isolated by run', () => {
    const target = validateMutableE2eEnvironment(environment);
    expect(runtimeRolePassword(target)).toMatch(/^[a-f0-9]{64}$/);
    expect(runtimeRolePassword(target)).toBe(runtimeRolePassword(target));
    expect(
      runtimeRolePassword({ ...target, schema: `${target.schema}_other` }),
    ).not.toBe(runtimeRolePassword(target));
  });
});
