import {
  buildE2eSchemaName,
  buildScopedE2eDatabaseUrl,
  createE2eRunId,
  EXPECTED_E2E_PROJECT_REF,
  sanitizeE2eText,
  safeE2eErrorMessage,
  validateE2eConnectionEnvironment,
  validateMutableE2eEnvironment,
} from './e2e-database-target';

const validE2eUrl = `postgresql://postgres:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`;
const normalDevelopmentUrl =
  'postgresql://postgres:development-secret@db.aaaaaaaaaaaaaaaaaaaa.supabase.co:5432/postgres?sslmode=require';

function validEnvironment(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    DATABASE_URL: normalDevelopmentUrl,
    DATABASE_URL_E2E: validE2eUrl,
    E2E_MUTABLE: '1',
    E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
    E2E_RUN_ID: 'r20260831120000_abcdef123456',
    E2E_SCHEMA: 'e2e_r20260831120000_abcdef123456',
    NODE_ENV: 'test',
    PLAYWRIGHT_TEST: '1',
    ...overrides,
  };
}

describe('E2E database target guard', () => {
  it.each([
    ['E2E_MUTABLE', undefined, 'E2E_MUTABLE'],
    ['PLAYWRIGHT_TEST', undefined, 'PLAYWRIGHT_TEST'],
    ['NODE_ENV', 'production', 'NODE_ENV'],
  ])('rejects an invalid %s guard variable', (key, value, message) => {
    expect(() =>
      validateMutableE2eEnvironment(validEnvironment({ [key]: value })),
    ).toThrow(message);
  });

  it('rejects a missing DATABASE_URL_E2E', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: undefined }),
      ),
    ).toThrow('DATABASE_URL_E2E is required');
  });

  it('rejects a malformed DATABASE_URL_E2E', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: 'not-a-url' }),
      ),
    ).toThrow('valid PostgreSQL URL');
  });

  it('rejects a URL without a database credential', () => {
    const urlWithoutPassword = `postgresql://postgres@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: urlWithoutPassword }),
      ),
    ).toThrow('database credential');
  });

  it('rejects an unexpected direct-connection user', () => {
    const wrongUserUrl = `postgresql://service:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: wrongUserUrl }),
      ),
    ).toThrow('direct-connection user');
  });

  it('rejects the same target as DATABASE_URL', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL: validE2eUrl }),
      ),
    ).toThrow('normal DATABASE_URL');
  });

  it('rejects the same project through different Supabase endpoints', () => {
    const pooledNormalUrl = `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:normal-secret@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL: pooledNormalUrl }),
      ),
    ).toThrow('normal or development');
  });

  it.each(['postgres', 'prisma'])(
    'accepts distinct projects on a shared pooler with normal role %s',
    (role) => {
      const host = 'aws-0-us-west-1.pooler.supabase.com';
      const result = validateMutableE2eEnvironment(
        validEnvironment({
          DATABASE_URL: `postgresql://${role}.aaaaaaaaaaaaaaaaaaaa:normal-secret@${host}:5432/postgres?sslmode=require`,
          DATABASE_URL_E2E: `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@${host}:5432/postgres?sslmode=require`,
        }),
      );
      expect(result.projectRef).toBe(EXPECTED_E2E_PROJECT_REF);
    },
  );

  it.each(['postgres', 'prisma'])(
    'rejects the same project on a shared pooler with normal role %s',
    (role) => {
      const host = 'aws-0-us-west-1.pooler.supabase.com';
      expect(() =>
        validateMutableE2eEnvironment(
          validEnvironment({
            DATABASE_URL: `postgresql://${role}.${EXPECTED_E2E_PROJECT_REF}:normal-secret@${host}:5432/postgres?sslmode=require`,
            DATABASE_URL_E2E: `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@${host}:5432/postgres?sslmode=require`,
          }),
        ),
      ).toThrow('normal or development');
    },
  );

  it('rejects the same project with a custom role through another endpoint', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({
          DATABASE_URL: `postgresql://prisma.${EXPECTED_E2E_PROJECT_REF}:normal-secret@aws-0-us-west-1.pooler.supabase.com:5432/postgres?sslmode=require`,
        }),
      ),
    ).toThrow('normal or development');
  });

  it('accepts a restricted runtime role on a pooler shared with another project', () => {
    const host = 'aws-0-us-west-1.pooler.supabase.com';
    const environment = validEnvironment();
    expect(() =>
      validateMutableE2eEnvironment(
        {
          ...environment,
          DATABASE_URL: `postgresql://postgres.aaaaaaaaaaaaaaaaaaaa:normal-secret@${host}:5432/postgres?sslmode=require`,
          DATABASE_URL_E2E: `postgresql://${String(environment.E2E_SCHEMA)}.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@${host}:5432/postgres?sslmode=require`,
        },
        'runtime',
      ),
    ).not.toThrow();
  });

  it('keeps rejecting a shared endpoint when the normal project is unidentified', () => {
    const host = 'aws-0-us-west-1.pooler.supabase.com';
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({
          DATABASE_URL: `postgresql://unidentified:normal-secret@${host}:5432/postgres?sslmode=require`,
          DATABASE_URL_E2E: `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@${host}:5432/postgres?sslmode=require`,
        }),
      ),
    ).toThrow('normal or development');
  });

  it('rejects an incorrect project ref in the URL', () => {
    const wrongProjectUrl =
      'postgresql://postgres:e2e-secret@db.bbbbbbbbbbbbbbbbbbbb.supabase.co:5432/postgres?sslmode=require';

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: wrongProjectUrl }),
      ),
    ).toThrow('approved E2E project');
  });

  it('rejects the development project ref as the E2E URL', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: normalDevelopmentUrl }),
      ),
    ).toThrow('approved E2E project');
  });

  it('rejects an incorrect configured project ref', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ E2E_PROJECT_REF: 'bbbbbbbbbbbbbbbbbbbb' }),
      ),
    ).toThrow('E2E_PROJECT_REF');
  });

  it('rejects the public schema', () => {
    expect(() =>
      validateMutableE2eEnvironment(validEnvironment({ E2E_SCHEMA: 'public' })),
    ).toThrow('public schema');
  });

  it('rejects an invalid schema', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ E2E_SCHEMA: 'e2e_invalid-name' }),
      ),
    ).toThrow('E2E_SCHEMA has an unsafe format');
  });

  it('rejects a schema that was not derived from the run id', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ E2E_SCHEMA: 'e2e_r20260831120000_000000000000' }),
      ),
    ).toThrow('derived from E2E_RUN_ID');
  });

  it('rejects an invalid run id', () => {
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ E2E_RUN_ID: 'unsafe-run-id' }),
      ),
    ).toThrow('E2E_RUN_ID');
  });

  it('rejects the transaction pooler port', () => {
    const transactionPoolerUrl = `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: transactionPoolerUrl }),
      ),
    ).toThrow('direct or session-pooler port');
  });

  it('rejects a custom host even if the project ref appears elsewhere', () => {
    const customHostUrl = `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@example.test:5432/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: customHostUrl }),
      ),
    ).toThrow('approved Supabase endpoint');
  });

  it('rejects a custom host when the project ref appears only in a password', () => {
    const customHostUrl = `postgresql://postgres:secret-${EXPECTED_E2E_PROJECT_REF}@example.test:5432/postgres?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: customHostUrl }),
      ),
    ).toThrow('approved Supabase endpoint');
  });

  it('rejects a database other than postgres', () => {
    const wrongDatabaseUrl = `postgresql://postgres:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/template1?sslmode=require`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: wrongDatabaseUrl }),
      ),
    ).toThrow('expected database');
  });

  it('rejects an unsafe SSL mode', () => {
    const unsafeSslUrl = `postgresql://postgres:e2e-secret@db.${EXPECTED_E2E_PROJECT_REF}.supabase.co:5432/postgres?sslmode=disable`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: unsafeSslUrl }),
      ),
    ).toThrow('SSL mode');
  });

  it('rejects duplicate SSL modes', () => {
    const ambiguousSslUrl = `${validE2eUrl}&sslmode=disable`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: ambiguousSslUrl }),
      ),
    ).toThrow('SSL mode');
  });

  it('rejects unsupported connection parameters', () => {
    const parameterizedUrl = `${validE2eUrl}&application_name=e2e`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: parameterizedUrl }),
      ),
    ).toThrow('unsupported connection parameter');
  });

  it('rejects connection parameters that can redirect the schema', () => {
    const schemaUrl = `${validE2eUrl}&schema=public`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: schemaUrl }),
      ),
    ).toThrow('forbidden connection parameter');
  });

  it('rejects a run id beyond the guarded maximum length', () => {
    const oversizedRunId = `r${'a'.repeat(48)}`;

    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({
          E2E_RUN_ID: oversizedRunId,
          E2E_SCHEMA: `e2e_${oversizedRunId}`,
        }),
      ),
    ).toThrow('E2E_RUN_ID');
  });

  it('accepts the approved direct connection configuration', () => {
    const result = validateMutableE2eEnvironment(validEnvironment());

    expect(result).toMatchObject({
      databaseName: 'postgres',
      projectRef: EXPECTED_E2E_PROJECT_REF,
      runId: 'r20260831120000_abcdef123456',
      schema: 'e2e_r20260831120000_abcdef123456',
    });
  });

  it('accepts the approved session-pooler configuration', () => {
    const sessionPoolerUrl = `postgresql://postgres.${EXPECTED_E2E_PROJECT_REF}:e2e-secret@aws-0-us-east-1.pooler.supabase.com:5432/postgres?sslmode=verify-full`;
    const result = validateMutableE2eEnvironment(
      validEnvironment({ DATABASE_URL_E2E: sessionPoolerUrl }),
    );

    expect(result.projectRef).toBe(EXPECTED_E2E_PROJECT_REF);
  });

  it('supports read-only connection validation without mutable run variables', () => {
    const result = validateE2eConnectionEnvironment({
      DATABASE_URL: normalDevelopmentUrl,
      DATABASE_URL_E2E: validE2eUrl,
      E2E_PROJECT_REF: EXPECTED_E2E_PROJECT_REF,
      NODE_ENV: 'test',
    });

    expect(result.databaseName).toBe('postgres');
  });

  it('derives a safe run id and schema', () => {
    const runId = createE2eRunId(
      new Date('2026-08-31T12:00:00.000Z'),
      'abcdef123456',
    );

    expect(runId).toBe('r20260831120000_abcdef123456');
    expect(buildE2eSchemaName(runId)).toBe('e2e_r20260831120000_abcdef123456');
  });

  it('builds a scoped URL without changing the validated target', () => {
    const target = validateMutableE2eEnvironment(validEnvironment());
    const scopedUrl = new URL(buildScopedE2eDatabaseUrl(target));

    expect(scopedUrl.searchParams.get('schema')).toBe(target.schema);
    expect(scopedUrl.searchParams.get('sslmode')).toBe('verify-full');
    expect(target.connectionString).toBe(
      validE2eUrl.replace('sslmode=require', 'sslmode=verify-full'),
    );
  });

  it.each(['require', 'verify-ca', 'verify-full'])(
    'enforces full verification for %s',
    (mode) => {
      const target = validateMutableE2eEnvironment(
        validEnvironment({
          DATABASE_URL_E2E: validE2eUrl.replace(
            'sslmode=require',
            `sslmode=${mode}`,
          ),
        }),
      );
      expect(new URL(target.connectionString).search).toBe(
        '?sslmode=verify-full',
      );
    },
  );

  it('rejects a runtime credential belonging to another run', () => {
    const url = validE2eUrl.replace(
      'postgres:e2e-secret',
      'e2e_another_run:e2e-secret',
    );
    expect(() =>
      validateMutableE2eEnvironment(
        validEnvironment({ DATABASE_URL_E2E: url }),
        'runtime',
      ),
    ).toThrow('user');
  });

  it('sanitizes connection strings and unexpected errors', () => {
    const sentinel = 'do-not-leak-this-password';
    const text = sanitizeE2eText(
      `Failure for postgresql://postgres:${sentinel}@example.test:5432/postgres`,
      [sentinel],
    );

    expect(text).not.toContain(sentinel);
    expect(text).not.toContain('postgresql://');
    expect(safeE2eErrorMessage(new Error(sentinel))).not.toContain(sentinel);
  });
});
