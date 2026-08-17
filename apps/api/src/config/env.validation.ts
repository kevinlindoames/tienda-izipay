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
