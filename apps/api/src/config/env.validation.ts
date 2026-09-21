import { validateMutableE2eEnvironment } from './e2e-database-target';

const allowedNodeEnvironments = new Set(['development', 'test', 'production']);

function requireDatabaseUrl(value: unknown): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error('DATABASE_URL is required.');
  }

  const normalized = value.trim();

  let parsed: URL;

  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error('DATABASE_URL must be a valid URL.');
  }

  if (parsed.protocol !== 'postgresql:' && parsed.protocol !== 'postgres:') {
    throw new Error(
      'DATABASE_URL must use the postgresql or postgres protocol.',
    );
  }

  return normalized;
}

function resolvePort(value: unknown): number {
  if (value === undefined || value === null || value === '') {
    return 3001;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

export function validateEnvironment(
  config: Record<string, unknown>,
): Record<string, unknown> {
  if (config.E2E_MUTABLE === '1') {
    const target = validateMutableE2eEnvironment(config, 'runtime');

    return {
      ...config,
      DATABASE_URL_E2E: target.connectionString,
      E2E_PROJECT_REF: target.projectRef,
      E2E_RUN_ID: target.runId,
      E2E_SCHEMA: target.schema,
      NODE_ENV: 'test',
      PORT: resolvePort(config.PORT),
    };
  }

  const nodeEnvironment =
    typeof config.NODE_ENV === 'string' && config.NODE_ENV.length > 0
      ? config.NODE_ENV
      : 'development';

  if (!allowedNodeEnvironments.has(nodeEnvironment)) {
    throw new Error('NODE_ENV must be development, test or production.');
  }

  return {
    ...config,
    NODE_ENV: nodeEnvironment,
    PORT: resolvePort(config.PORT),
    DATABASE_URL: requireDatabaseUrl(config.DATABASE_URL),
  };
}
