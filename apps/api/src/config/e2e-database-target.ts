import { randomBytes } from 'node:crypto';

export const EXPECTED_E2E_PROJECT_REF = 'xggarsmihlmqbdvnicks';
export const EXPECTED_E2E_DATABASE_NAME = 'postgres';

export const E2E_RUN_ID_PATTERN = /^[a-z0-9][a-z0-9_]{5,47}$/;
export const E2E_SCHEMA_PATTERN = /^e2e_[a-z0-9_]+$/;

const SUPABASE_PROJECT_REF_PATTERN = /^[a-z0-9]{20}$/;
const SUPABASE_DIRECT_HOST_PATTERN = /^db\.([a-z0-9]{20})\.supabase\.co$/;
const SUPABASE_POOLER_HOST_PATTERN = /^[a-z0-9-]+\.pooler\.supabase\.com$/;
const SUPABASE_POOLER_USER_PATTERN = /^[a-z0-9_]+\.([a-z0-9]{20})$/;
const SAFE_SSL_MODES = new Set(['require', 'verify-ca', 'verify-full']);
const FORBIDDEN_CONNECTION_PARAMETERS = new Set([
  'database',
  'dbname',
  'host',
  'hostaddr',
  'options',
  'passfile',
  'password',
  'port',
  'schema',
  'search_path',
  'service',
  'servicefile',
  'user',
]);

export type E2eEnvironment = Record<string, unknown>;

export interface E2eConnectionTarget {
  connectionString: string;
  databaseName: typeof EXPECTED_E2E_DATABASE_NAME;
  projectRef: typeof EXPECTED_E2E_PROJECT_REF;
}

export interface MutableE2eTarget extends E2eConnectionTarget {
  marker: string;
  runId: string;
  schema: string;
}

interface ComparableDatabaseTarget {
  databaseName: string;
  host: string;
  port: string;
  projectRef: string | null;
}

export class E2eSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'E2eSafetyError';
  }
}

function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

function requiredString(value: unknown, message: string): string {
  const normalized = optionalString(value);

  if (!normalized) {
    throw new E2eSafetyError(message);
  }

  return normalized;
}

function parsePostgresUrl(value: string, message: string): URL {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new E2eSafetyError(message);
  }

  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new E2eSafetyError(message);
  }

  return parsed;
}

function decodedDatabaseName(parsed: URL, message: string): string {
  try {
    return decodeURIComponent(parsed.pathname.replace(/^\//, ''));
  } catch {
    throw new E2eSafetyError(message);
  }
}

function extractSupabaseProjectRef(parsed: URL): string | null {
  const directMatch = parsed.hostname
    .toLowerCase()
    .match(SUPABASE_DIRECT_HOST_PATTERN);

  if (directMatch?.[1]) {
    return directMatch[1];
  }

  if (!SUPABASE_POOLER_HOST_PATTERN.test(parsed.hostname.toLowerCase())) {
    return null;
  }

  const poolerUserMatch = parsed.username.match(SUPABASE_POOLER_USER_PATTERN);
  return poolerUserMatch?.[1] ?? null;
}

function validateConnectionParameters(parsed: URL): void {
  const sslModes: string[] = [];

  for (const [key, value] of parsed.searchParams) {
    const normalizedKey = key.toLowerCase();

    if (FORBIDDEN_CONNECTION_PARAMETERS.has(normalizedKey)) {
      throw new E2eSafetyError(
        'DATABASE_URL_E2E contains a forbidden connection parameter.',
      );
    }

    if (normalizedKey === 'sslmode') {
      sslModes.push(value.toLowerCase());
      continue;
    }

    throw new E2eSafetyError(
      'DATABASE_URL_E2E contains an unsupported connection parameter.',
    );
  }

  if (sslModes.length !== 1 || !SAFE_SSL_MODES.has(sslModes[0] ?? '')) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must enforce a supported SSL mode.',
    );
  }
}

function validateExpectedSupabaseEndpoint(parsed: URL, role: string): string {
  const hostname = parsed.hostname.toLowerCase();
  const port = parsed.port || '5432';

  if (port !== '5432') {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must use the direct or session-pooler port.',
    );
  }

  const directMatch = hostname.match(SUPABASE_DIRECT_HOST_PATTERN);

  if (directMatch) {
    if (parsed.username !== role) {
      throw new E2eSafetyError(
        'DATABASE_URL_E2E has an unexpected direct-connection user.',
      );
    }

    return directMatch[1] ?? '';
  }

  if (!SUPABASE_POOLER_HOST_PATTERN.test(hostname)) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must use an approved Supabase endpoint.',
    );
  }

  const poolerUserMatch = parsed.username.match(
    /^([a-z0-9_]+)\.([a-z0-9]{20})$/,
  );

  if (!poolerUserMatch?.[2] || poolerUserMatch[1] !== role) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E has an unexpected session-pooler user.',
    );
  }

  return poolerUserMatch[2];
}

function comparableTarget(value: string): ComparableDatabaseTarget {
  const parsed = parsePostgresUrl(
    value,
    'DATABASE_URL could not be safely compared with the E2E target.',
  );

  return {
    databaseName: decodedDatabaseName(
      parsed,
      'DATABASE_URL could not be safely compared with the E2E target.',
    ),
    host: parsed.hostname.toLowerCase(),
    port: parsed.port || '5432',
    projectRef: extractSupabaseProjectRef(parsed),
  };
}

function assertDifferentFromNormalDatabase(
  e2eConnectionString: string,
  e2eParsed: URL,
  normalConnectionString: string | undefined,
): void {
  if (!normalConnectionString) {
    return;
  }

  if (normalConnectionString.trim() === e2eConnectionString) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must not equal the normal DATABASE_URL.',
    );
  }

  const normalTarget = comparableTarget(normalConnectionString);
  const e2eTarget: ComparableDatabaseTarget = {
    databaseName: decodedDatabaseName(
      e2eParsed,
      'DATABASE_URL_E2E must select the expected database.',
    ),
    host: e2eParsed.hostname.toLowerCase(),
    port: e2eParsed.port || '5432',
    projectRef: extractSupabaseProjectRef(e2eParsed),
  };

  if (
    normalTarget.projectRef === EXPECTED_E2E_PROJECT_REF ||
    (normalTarget.projectRef !== null &&
      normalTarget.projectRef === e2eTarget.projectRef) ||
    // Shared poolers serve distinct projects on the same host/port/database.
    // Fall back to endpoint equality only when project identity is unknown.
    ((normalTarget.projectRef === null || e2eTarget.projectRef === null) &&
      normalTarget.host === e2eTarget.host &&
      normalTarget.port === e2eTarget.port &&
      normalTarget.databaseName === e2eTarget.databaseName)
  ) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E resolves to the normal or development database target.',
    );
  }
}

export function buildE2eSchemaName(runId: string): string {
  if (!E2E_RUN_ID_PATTERN.test(runId)) {
    throw new E2eSafetyError('E2E_RUN_ID has an unsafe format.');
  }

  const schema = `e2e_${runId}`;

  if (
    schema === 'public' ||
    !E2E_SCHEMA_PATTERN.test(schema) ||
    Buffer.byteLength(schema, 'utf8') > 63
  ) {
    throw new E2eSafetyError('The derived E2E schema has an unsafe format.');
  }

  return schema;
}

export function createE2eRunId(
  now: Date = new Date(),
  randomSuffix: string = randomBytes(6).toString('hex'),
): string {
  const timestamp = now.toISOString().replace(/\D/g, '').slice(0, 14);
  const runId = `r${timestamp}_${randomSuffix.toLowerCase()}`;

  if (!E2E_RUN_ID_PATTERN.test(runId)) {
    throw new E2eSafetyError('The generated E2E run identifier is unsafe.');
  }

  return runId;
}

export function validateE2eConnectionEnvironment(
  environment: E2eEnvironment,
  role = 'postgres',
): E2eConnectionTarget {
  if (environment.NODE_ENV !== 'test') {
    throw new E2eSafetyError('NODE_ENV must be test for E2E database access.');
  }

  const configuredProjectRef = requiredString(
    environment.E2E_PROJECT_REF,
    'E2E_PROJECT_REF is required for E2E database access.',
  );

  if (configuredProjectRef !== EXPECTED_E2E_PROJECT_REF) {
    throw new E2eSafetyError(
      'E2E_PROJECT_REF does not match the approved E2E project.',
    );
  }

  const connectionString = requiredString(
    environment.DATABASE_URL_E2E,
    'DATABASE_URL_E2E is required for E2E database access.',
  );
  const parsed = parsePostgresUrl(
    connectionString,
    'DATABASE_URL_E2E must be a valid PostgreSQL URL.',
  );

  if (!parsed.password) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must contain a database credential.',
    );
  }

  validateConnectionParameters(parsed);

  const projectRef = validateExpectedSupabaseEndpoint(parsed, role);

  if (
    !SUPABASE_PROJECT_REF_PATTERN.test(projectRef) ||
    projectRef !== EXPECTED_E2E_PROJECT_REF
  ) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E does not identify the approved E2E project.',
    );
  }

  const databaseName = decodedDatabaseName(
    parsed,
    'DATABASE_URL_E2E must select the expected database.',
  );

  if (databaseName !== EXPECTED_E2E_DATABASE_NAME) {
    throw new E2eSafetyError(
      'DATABASE_URL_E2E must select the expected database.',
    );
  }

  assertDifferentFromNormalDatabase(
    connectionString,
    parsed,
    optionalString(environment.DATABASE_URL),
  );

  // Pin certificate AND hostname verification, including for legacy local URLs.
  parsed.search = '?sslmode=verify-full';

  return {
    connectionString: parsed.toString(),
    databaseName: EXPECTED_E2E_DATABASE_NAME,
    projectRef: EXPECTED_E2E_PROJECT_REF,
  };
}

export function validateMutableE2eEnvironment(
  environment: E2eEnvironment,
  purpose: 'provisioner' | 'runtime' = 'provisioner',
): MutableE2eTarget {
  if (environment.E2E_MUTABLE !== '1') {
    throw new E2eSafetyError(
      'E2E_MUTABLE must be enabled for mutable E2E operations.',
    );
  }

  if (environment.PLAYWRIGHT_TEST !== '1') {
    throw new E2eSafetyError(
      'PLAYWRIGHT_TEST must be enabled for mutable E2E operations.',
    );
  }

  const runId = requiredString(
    environment.E2E_RUN_ID,
    'E2E_RUN_ID is required for mutable E2E operations.',
  );

  if (!E2E_RUN_ID_PATTERN.test(runId)) {
    throw new E2eSafetyError('E2E_RUN_ID has an unsafe format.');
  }

  const schema = requiredString(
    environment.E2E_SCHEMA,
    'E2E_SCHEMA is required for mutable E2E operations.',
  );

  if (schema === 'public') {
    throw new E2eSafetyError('The public schema is forbidden for E2E tests.');
  }

  if (
    !E2E_SCHEMA_PATTERN.test(schema) ||
    Buffer.byteLength(schema, 'utf8') > 63
  ) {
    throw new E2eSafetyError('E2E_SCHEMA has an unsafe format.');
  }

  if (schema !== buildE2eSchemaName(runId)) {
    throw new E2eSafetyError(
      'E2E_SCHEMA must match the schema derived from E2E_RUN_ID.',
    );
  }

  const connectionTarget = validateE2eConnectionEnvironment(
    environment,
    purpose === 'runtime' ? schema : 'postgres',
  );

  return {
    ...connectionTarget,
    marker: `tienda-izipay-e2e:${EXPECTED_E2E_PROJECT_REF}:${runId}`,
    runId,
    schema,
  };
}

export function buildScopedE2eDatabaseUrl(target: MutableE2eTarget): string {
  const parsed = new URL(target.connectionString);
  parsed.searchParams.set('schema', target.schema);
  return parsed.toString();
}

export function sanitizeE2eText(
  value: string,
  sensitiveValues: readonly string[] = [],
): string {
  let sanitized = value.replace(
    /postgres(?:ql)?:\/\/[^\s"']+/gi,
    '[REDACTED_DATABASE_URL]',
  );

  for (const sensitiveValue of sensitiveValues) {
    if (sensitiveValue.length > 0) {
      sanitized = sanitized.replaceAll(sensitiveValue, '[REDACTED]');
    }
  }

  return sanitized;
}

export function safeE2eErrorMessage(error: unknown): string {
  if (error instanceof E2eSafetyError) {
    return error.message;
  }

  return 'The E2E database operation failed without exposing connection details.';
}
