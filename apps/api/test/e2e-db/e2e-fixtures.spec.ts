import type { PrismaClient } from '../../src/generated/prisma/client';
import { AdminRole } from '../../src/generated/prisma/client';
import {
  E2E_FIXTURE_IDS,
  E2E_PRODUCT_FIXTURES,
  loadE2eFixtures,
  requireE2eAdminPassword,
} from './e2e-fixtures';

interface ModelOperationArguments {
  data: unknown;
}

interface FakeModel {
  create: jest.Mock<Promise<unknown>, [ModelOperationArguments]>;
  createMany: jest.Mock<Promise<{ count: number }>, [ModelOperationArguments]>;
}

interface FakeModels {
  adminUser: FakeModel;
  category: FakeModel;
  inventory: FakeModel;
  inventoryMovement: FakeModel;
  mediaAsset: FakeModel;
  order: FakeModel;
  product: FakeModel;
  productImage: FakeModel;
}

type TransactionOperation = (client: FakeModels) => Promise<unknown>;

function createFixtureClient(): {
  client: PrismaClient;
  models: FakeModels;
  transaction: jest.Mock<Promise<unknown>, [TransactionOperation]>;
} {
  const model = (): FakeModel => ({
    create: jest.fn<Promise<unknown>, [ModelOperationArguments]>(() =>
      Promise.resolve({}),
    ),
    createMany: jest.fn<Promise<{ count: number }>, [ModelOperationArguments]>(
      () => Promise.resolve({ count: 1 }),
    ),
  });
  const models = {
    adminUser: model(),
    category: model(),
    inventory: model(),
    inventoryMovement: model(),
    mediaAsset: model(),
    order: model(),
    product: model(),
    productImage: model(),
  };
  const transaction = jest.fn<Promise<unknown>, [TransactionOperation]>(
    (operation) => operation(models),
  );

  return {
    client: { $transaction: transaction } as unknown as PrismaClient,
    models,
    transaction,
  };
}

function firstData<T>(
  operation: FakeModel['createMany'] | FakeModel['create'],
): T {
  const firstCall = operation.mock.calls[0];

  if (!firstCall) {
    throw new Error('Expected the fixture operation to have been called.');
  }

  return firstCall[0].data as T;
}

describe('E2E fixtures', () => {
  it('requires a bounded test-only admin password', () => {
    expect(() => requireE2eAdminPassword({})).toThrow(
      'E2E_ADMIN_PASSWORD is required',
    );
    expect(() =>
      requireE2eAdminPassword({ E2E_ADMIN_PASSWORD: 'too-short' }),
    ).toThrow('between 12 and 72');
    expect(
      requireE2eAdminPassword({
        E2E_ADMIN_PASSWORD: 'test-only-password',
      }),
    ).toBe('test-only-password');
  });

  it('loads deterministic fake identities and relations in one transaction', async () => {
    const fixtureClient = createFixtureClient();
    const hashPassword = jest.fn<Promise<string>, [string, number]>(() =>
      Promise.resolve('deterministic-test-hash'),
    );

    await loadE2eFixtures(
      fixtureClient.client,
      'test-only-password',
      hashPassword,
    );

    expect(hashPassword).toHaveBeenCalledWith('test-only-password', 12);
    expect(fixtureClient.transaction.mock.calls).toHaveLength(1);

    const admins = firstData<
      Array<{ email: string; id: string; role: AdminRole }>
    >(fixtureClient.models.adminUser.createMany);
    expect(admins.map(({ id, role }) => ({ id, role }))).toEqual([
      { id: E2E_FIXTURE_IDS.admins[0], role: AdminRole.OWNER },
      { id: E2E_FIXTURE_IDS.admins[1], role: AdminRole.ADMIN },
    ]);
    expect(admins.every(({ email }) => email.endsWith('.invalid'))).toBe(true);

    const categories = firstData<Array<{ id: string; isActive: boolean }>>(
      fixtureClient.models.category.createMany,
    );
    expect(categories.map(({ id, isActive }) => ({ id, isActive }))).toEqual([
      { id: E2E_FIXTURE_IDS.categories[0], isActive: true },
      { id: E2E_FIXTURE_IDS.categories[1], isActive: false },
    ]);

    expect(
      firstData<unknown[]>(fixtureClient.models.product.createMany),
    ).toHaveLength(E2E_PRODUCT_FIXTURES.length);
    const media = firstData<Array<{ desktopUrl: string; mobileUrl: string }>>(
      fixtureClient.models.mediaAsset.createMany,
    );
    expect(
      media.every(
        ({ desktopUrl, mobileUrl }) =>
          desktopUrl === '/e2e/placeholder.png' &&
          mobileUrl === '/e2e/placeholder.png',
      ),
    ).toBe(true);
    expect(
      firstData<unknown[]>(fixtureClient.models.inventory.createMany),
    ).toHaveLength(E2E_PRODUCT_FIXTURES.length);
    const movements = firstData<Array<{ quantityDelta: number }>>(
      fixtureClient.models.inventoryMovement.createMany,
    );
    expect(movements.length).toBeGreaterThan(0);
    expect(movements.every(({ quantityDelta }) => quantityDelta > 0)).toBe(
      true,
    );
    const historicalOrder = firstData<{
      id: string;
      items: { create: { id: string; productId: string } };
    }>(fixtureClient.models.order.create);
    expect(historicalOrder).toMatchObject({
      id: E2E_FIXTURE_IDS.historicalOrder,
      items: {
        create: {
          id: E2E_FIXTURE_IDS.historicalOrderItem,
          productId: E2E_FIXTURE_IDS.products[5],
        },
      },
    });
  });
});
