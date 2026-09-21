import { resolve } from 'node:path';

import {
  safeE2eErrorMessage,
  validateE2eConnectionEnvironment,
} from '../../src/config/e2e-database-target';
import { loadE2eEnvironment } from './e2e-environment';
import { E2eSchemaDatabase } from './e2e-schema-database';

const apiRoot = resolve(__dirname, '../..');

async function main(): Promise<void> {
  const environment = {
    ...loadE2eEnvironment(apiRoot),
    NODE_ENV: 'test',
  };
  const target = validateE2eConnectionEnvironment(environment);
  const database = new E2eSchemaDatabase();

  await database.validateConnection(target);
  process.stdout.write(
    'E2E database identity and schema-create privilege validated.\n',
  );
}

void main().catch((error: unknown) => {
  process.stderr.write(`${safeE2eErrorMessage(error)}\n`);
  process.exitCode = 1;
});
