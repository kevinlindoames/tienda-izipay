import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Server } from 'node:http';
import request from 'supertest';
import { validateMutableE2eEnvironment } from './../src/config/e2e-database-target';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/database/prisma.service';
import { randomUUID } from 'node:crypto';

const target = validateMutableE2eEnvironment(process.env, 'runtime');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/health (GET)', () => {
    const httpServer = app.getHttpServer() as Server;

    return request(httpServer).get('/api/v1/health').expect(200).expect({
      status: 'ok',
      service: 'api',
    });
  });

  it('runs business queries with the restricted identity, not the provisioner', async () => {
    const prisma = app.get(PrismaService);
    const rows = await prisma.$queryRawUnsafe<{ role: string }[]>(
      'SELECT current_user AS role',
    );
    expect(rows[0]?.role).toBe(target.schema);
    expect(process.env.DATABASE_URL).toBeUndefined();
    expect(process.env.E2E_ADMIN_PASSWORD).toBeUndefined();
    await prisma.$transaction(async (transaction) => {
      const category = await transaction.category.create({
        data: {
          slug: `role-probe-${randomUUID()}`,
          name: 'Runtime privilege probe',
        },
      });
      expect(
        await transaction.category.findUnique({ where: { id: category.id } }),
      ).not.toBeNull();
      const updated = await transaction.category.update({
        where: { id: category.id },
        data: { name: 'Updated probe' },
      });
      expect(updated.name).toBe('Updated probe');
      await transaction.category.delete({ where: { id: category.id } });
    });
  });
});
