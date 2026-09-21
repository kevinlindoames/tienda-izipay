import { createHmac } from 'node:crypto';

import {
  type MutableE2eTarget,
  validateMutableE2eEnvironment,
} from '../../src/config/e2e-database-target';
import { buildSanitizedPlaywrightEnvironment } from './e2e-environment';

// The trusted harness and API launcher independently derive a per-run password.
// No runtime password is persisted, logged, or passed through Playwright/Next.
export function runtimeRolePassword(target: MutableE2eTarget): string {
  return createHmac(
    'sha256',
    decodeURIComponent(new URL(target.connectionString).password),
  )
    .update(`tienda-izipay-runtime-v1:${target.projectRef}:${target.schema}`)
    .digest('hex');
}

export function buildRuntimeEnvironment(
  environment: NodeJS.ProcessEnv,
  target: MutableE2eTarget,
): NodeJS.ProcessEnv {
  const url = new URL(target.connectionString);
  url.username = url.hostname.endsWith('.pooler.supabase.com')
    ? `${target.schema}.${target.projectRef}`
    : target.schema;
  url.password = runtimeRolePassword(target);

  const runtime = {
    ...buildSanitizedPlaywrightEnvironment(environment, target),
    DATABASE_URL_E2E: url.toString(),
    ...(environment.PORT ? { PORT: environment.PORT } : {}),
  };
  validateMutableE2eEnvironment(runtime, 'runtime');
  return runtime;
}
