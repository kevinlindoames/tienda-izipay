import 'dotenv/config';

import { defineConfig } from 'prisma/config';

import {
  buildScopedE2eDatabaseUrl,
  validateMutableE2eEnvironment,
} from './src/config/e2e-database-target';

const target = validateMutableE2eEnvironment(process.env);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: buildScopedE2eDatabaseUrl(target),
  },
});
