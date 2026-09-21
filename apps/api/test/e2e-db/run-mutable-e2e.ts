import { resolve } from 'node:path';

import {
  createE2eRunId,
  E2eSafetyError,
  safeE2eErrorMessage,
  type MutableE2eTarget,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import {
  buildMutableE2eEnvironment,
  buildSanitizedPlaywrightEnvironment,
  loadE2eEnvironment,
} from './e2e-environment';
import { loadE2eFixtures, requireE2eAdminPassword } from './e2e-fixtures';
import { runE2eLifecycle } from './e2e-lifecycle';
import { createScopedE2ePrismaClient } from './e2e-prisma';
import { runPnpmCommand } from './e2e-process';
import { E2eSchemaDatabase } from './e2e-schema-database';
import { runE2eSmoke } from './e2e-smoke';
import { buildRuntimeEnvironment } from './e2e-runtime-role';
import { assertE2ePrivileges } from './e2e-privileges';

const apiRoot = resolve(__dirname, '../..');
const repositoryRoot = resolve(apiRoot, '../..');

function assertSameTarget(
  expected: MutableE2eTarget,
  actual: MutableE2eTarget,
): void {
  if (
    actual.connectionString !== expected.connectionString ||
    actual.databaseName !== expected.databaseName ||
    actual.marker !== expected.marker ||
    actual.projectRef !== expected.projectRef ||
    actual.runId !== expected.runId ||
    actual.schema !== expected.schema
  ) {
    throw new E2eSafetyError(
      'The E2E target changed during the run; the operation was refused.',
    );
  }
}

function loadMutableTarget(runId: string): {
  environment: NodeJS.ProcessEnv;
  target: MutableE2eTarget;
} {
  const environment = buildMutableE2eEnvironment(
    loadE2eEnvironment(apiRoot),
    runId,
  );

  return {
    environment,
    target: validateMutableE2eEnvironment(environment),
  };
}

async function main(): Promise<void> {
  const runId = createE2eRunId();
  const initial = loadMutableTarget(runId);
  const database = new E2eSchemaDatabase();

  const revalidate = (): {
    environment: NodeJS.ProcessEnv;
    target: MutableE2eTarget;
  } => {
    const current = loadMutableTarget(runId);
    assertSameTarget(initial.target, current.target);
    return current;
  };

  await runE2eLifecycle({
    validate: async () => {
      const current = revalidate();
      await database.validateConnection(current.target);
    },
    createSchema: async () => {
      const current = revalidate();
      await database.createSchema(current.target);
    },
    migrate: async () => {
      const current = revalidate();
      const migrationEnvironment: NodeJS.ProcessEnv = {
        ...current.environment,
        DATABASE_URL_E2E: current.target.connectionString,
      };
      const adminPassword = migrationEnvironment.E2E_ADMIN_PASSWORD;

      delete migrationEnvironment.E2E_ADMIN_PASSWORD;

      await runPnpmCommand({
        args: [
          'exec',
          'prisma',
          'migrate',
          'deploy',
          '--config',
          'prisma.e2e.config.ts',
        ],
        cwd: apiRoot,
        environment: migrationEnvironment,
        label: 'The isolated Prisma migration deployment',
        sensitiveValues: [
          current.target.connectionString,
          typeof adminPassword === 'string' ? adminPassword : '',
        ],
      });
    },
    fixtures: async () => {
      const current = revalidate();
      const adminPassword = requireE2eAdminPassword(current.environment);
      const prisma = createScopedE2ePrismaClient(current.target);

      try {
        await loadE2eFixtures(prisma, adminPassword);
      } finally {
        await prisma.$disconnect();
      }
    },
    smoke: async () => {
      const current = revalidate();
      await runE2eSmoke(current.target);
      await database.grantRuntimeAccess(current.target);
      await assertE2ePrivileges(
        current.target,
        buildRuntimeEnvironment(current.environment, current.target),
      );
    },
    tests: async () => {
      const current = revalidate();
      const apiTestEnvironment = buildRuntimeEnvironment(
        current.environment,
        current.target,
      );

      await runPnpmCommand({
        args: [
          'exec',
          'node',
          // Prisma loads runtime modules dynamically inside Jest's VM.
          '--experimental-vm-modules',
          'node_modules/jest/bin/jest.js',
          '--config',
          './test/jest-e2e.json',
          '--runInBand',
        ],
        cwd: apiRoot,
        environment: apiTestEnvironment,
        label: 'The isolated Nest E2E suite',
        sensitiveValues: [
          current.target.connectionString,
          apiTestEnvironment.DATABASE_URL_E2E ?? '',
        ],
      });

      const revalidated = revalidate();
      const playwrightEnvironment = buildSanitizedPlaywrightEnvironment(
        process.env,
        revalidated.target,
      );

      await runPnpmCommand({
        args: ['--filter', 'web', 'test:e2e:mutable:runner'],
        cwd: repositoryRoot,
        environment: playwrightEnvironment,
        label: 'The isolated mutable Playwright suite',
        streamOutput: true,
      });
    },
    cleanup: async () => {
      const current = revalidate();
      await database.dropOwnedSchema(current.target);
    },
  });
}

void main().catch((error: unknown) => {
  process.stderr.write(`${safeE2eErrorMessage(error)}\n`);
  process.exitCode = 1;
});
