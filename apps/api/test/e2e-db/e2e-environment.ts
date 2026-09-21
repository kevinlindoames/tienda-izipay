import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { parse } from 'dotenv';

import {
  buildE2eSchemaName,
  E2eSafetyError,
  type MutableE2eTarget,
} from '../../src/config/e2e-database-target';

const SAFE_PLAYWRIGHT_ENVIRONMENT_KEYS = new Set([
  'APPDATA',
  'CI',
  'COLORTERM',
  'COMSPEC',
  'ComSpec',
  'FORCE_COLOR',
  'HOME',
  'HOMEDRIVE',
  'HOMEPATH',
  'LOCALAPPDATA',
  'NODE_EXTRA_CA_CERTS',
  'NUMBER_OF_PROCESSORS',
  'OS',
  'PATH',
  'PATHEXT',
  'PNPM_HOME',
  'PROCESSOR_ARCHITECTURE',
  'PROGRAMDATA',
  'PROGRAMFILES',
  'Path',
  'SYSTEMDRIVE',
  'SYSTEMROOT',
  'SystemRoot',
  'TEMP',
  'TERM',
  'TMP',
  'TZ',
  'USERPROFILE',
  'WINDIR',
]);

function parseEnvironmentFile(path: string): Record<string, string> {
  if (!existsSync(path)) {
    return {};
  }

  try {
    return parse(readFileSync(path));
  } catch {
    throw new E2eSafetyError(
      'The local E2E environment file could not be loaded safely.',
    );
  }
}

export function loadE2eEnvironment(
  apiRoot: string = process.cwd(),
  processEnvironment: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  const normalEnvironment = parseEnvironmentFile(resolve(apiRoot, '.env'));
  const localE2eEnvironment = parseEnvironmentFile(
    resolve(apiRoot, '.env.e2e.local'),
  );

  return {
    ...normalEnvironment,
    ...localE2eEnvironment,
    ...processEnvironment,
  };
}

export function buildMutableE2eEnvironment(
  environment: NodeJS.ProcessEnv,
  runId: string,
): NodeJS.ProcessEnv {
  const mutable: NodeJS.ProcessEnv = {
    ...environment,
    E2E_MUTABLE: '1',
    E2E_RUN_ID: runId,
    E2E_SCHEMA: buildE2eSchemaName(runId),
    NODE_ENV: 'test',
    PLAYWRIGHT_TEST: '1',
  };
  // Playwright forces colors in its subprocesses. Do not inherit a conflicting
  // NO_COLOR or arbitrary Node options that could weaken TLS/startup isolation.
  delete mutable.NO_COLOR;
  delete mutable.NODE_OPTIONS;
  delete mutable.NODE_TLS_REJECT_UNAUTHORIZED;
  return mutable;
}

export function buildSanitizedPlaywrightEnvironment(
  processEnvironment: NodeJS.ProcessEnv,
  target: MutableE2eTarget,
): NodeJS.ProcessEnv {
  const sanitized: NodeJS.ProcessEnv = {};

  for (const [key, value] of Object.entries(processEnvironment)) {
    if (SAFE_PLAYWRIGHT_ENVIRONMENT_KEYS.has(key) && value !== undefined) {
      sanitized[key] = value;
    }
  }

  Object.assign(sanitized, {
    E2E_MUTABLE: '1',
    E2E_PROJECT_REF: target.projectRef,
    E2E_RUN_ID: target.runId,
    E2E_SCHEMA: target.schema,
    NODE_ENV: 'test',
    PLAYWRIGHT_TEST: '1',
  });

  return sanitized;
}
