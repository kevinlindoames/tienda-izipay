import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../generated/prisma/client';
import { E2eSafetyError } from '../config/e2e-database-target';
import {
  assertE2eRuntimeDatabaseReady,
  type E2eRuntimeDatabaseState,
  type PrismaRuntimeConfig,
  resolvePrismaRuntimeConfig,
} from './prisma-runtime-config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly mutableE2eConfig:
    Extract<PrismaRuntimeConfig, { mode: 'e2e' }> | undefined;

  constructor(configService: ConfigService) {
    const runtimeConfig = resolvePrismaRuntimeConfig({
      DATABASE_URL: configService.get<string>('DATABASE_URL'),
      DATABASE_URL_E2E: configService.get<string>('DATABASE_URL_E2E'),
      E2E_MUTABLE: configService.get<string>('E2E_MUTABLE'),
      E2E_PROJECT_REF: configService.get<string>('E2E_PROJECT_REF'),
      E2E_RUN_ID: configService.get<string>('E2E_RUN_ID'),
      E2E_SCHEMA: configService.get<string>('E2E_SCHEMA'),
      NODE_ENV: configService.get<string>('NODE_ENV'),
      PLAYWRIGHT_TEST: configService.get<string>('PLAYWRIGHT_TEST'),
    });

    const adapter =
      runtimeConfig.mode === 'e2e'
        ? new PrismaPg(
            { connectionString: runtimeConfig.connectionString },
            { schema: runtimeConfig.schema },
          )
        : new PrismaPg({ connectionString: runtimeConfig.connectionString });

    super({
      adapter,
    });

    this.mutableE2eConfig =
      runtimeConfig.mode === 'e2e' ? runtimeConfig : undefined;
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();

      if (this.mutableE2eConfig) {
        const rows = await this.$queryRawUnsafe<E2eRuntimeDatabaseState[]>(
          `SELECT current_database() AS "databaseName",
                  (SELECT obj_description(oid, 'pg_namespace')
                     FROM pg_namespace
                    WHERE nspname = $1) AS "marker",
                  to_regclass($2)::text AS "migrationsTable",
                  to_regclass($3)::text AS "catalogTable"`,
          this.mutableE2eConfig.schema,
          `${this.mutableE2eConfig.schema}._prisma_migrations`,
          `${this.mutableE2eConfig.schema}.products`,
        );

        assertE2eRuntimeDatabaseReady(rows[0], this.mutableE2eConfig);
      }
    } catch (error: unknown) {
      if (error instanceof E2eSafetyError) {
        throw error;
      }

      if (this.mutableE2eConfig) {
        throw new E2eSafetyError(
          'The isolated E2E database connection could not be established.',
        );
      }

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
