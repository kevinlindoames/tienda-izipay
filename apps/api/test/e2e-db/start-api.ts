import { resolve } from 'node:path';
import { spawn } from 'node:child_process';

import {
  safeE2eErrorMessage,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import { loadE2eEnvironment } from './e2e-environment';
import { buildRuntimeEnvironment } from './e2e-runtime-role';

const apiRoot = resolve(__dirname, '../..');

async function main(): Promise<void> {
  const environment = loadE2eEnvironment(apiRoot);
  const target = validateMutableE2eEnvironment(environment);

  // The trusted launcher reads the provisioner credential, but the API process
  // receives ONLY the per-run restricted credential and ignores .env files.
  const child = spawn(process.execPath, [resolve(apiRoot, 'dist/main.js')], {
    cwd: apiRoot,
    env: buildRuntimeEnvironment(environment, target),
    stdio: 'inherit',
    windowsHide: true,
  });
  const stop = (): void => {
    child.kill('SIGTERM');
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
  await new Promise<void>((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code) => {
      process.exitCode = code ?? 1;
      resolve();
    });
  });
}

void main().catch((error: unknown) => {
  process.stderr.write(`${safeE2eErrorMessage(error)}\n`);
  process.exitCode = 1;
});
