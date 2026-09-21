import {
  E2eSafetyError,
  type E2eEnvironment,
  validateMutableE2eEnvironment,
} from '../config/e2e-database-target';

export interface E2eRuntimeDatabaseState {
  catalogTable: string | null;
  databaseName: string;
  marker: string | null;
  migrationsTable: string | null;
}

export type PrismaRuntimeConfig =
  | {
      connectionString: string;
      mode: 'normal';
    }
  | {
      connectionString: string;
      databaseName: string;
      marker: string;
      mode: 'e2e';
      schema: string;
    };

export function resolvePrismaRuntimeConfig(
  environment: E2eEnvironment,
): PrismaRuntimeConfig {
  if (environment.E2E_MUTABLE === '1') {
    const target = validateMutableE2eEnvironment(environment, 'runtime');

    return {
      connectionString: target.connectionString,
      databaseName: target.databaseName,
      marker: target.marker,
      mode: 'e2e',
      schema: target.schema,
    };
  }

  const connectionString = environment.DATABASE_URL;

  if (typeof connectionString !== 'string' || connectionString.length === 0) {
    throw new Error('DATABASE_URL is required by PrismaService.');
  }

  return {
    connectionString,
    mode: 'normal',
  };
}

export function assertE2eRuntimeDatabaseReady(
  state: E2eRuntimeDatabaseState | undefined,
  expected: Extract<PrismaRuntimeConfig, { mode: 'e2e' }>,
): void {
  if (
    !state ||
    state.databaseName !== expected.databaseName ||
    state.marker !== expected.marker ||
    state.catalogTable === null ||
    state.migrationsTable === null
  ) {
    throw new E2eSafetyError(
      'The isolated E2E schema is not owned and migrated for this run.',
    );
  }
}
