import { runE2eLifecycle, type E2eLifecycleSteps } from './e2e-lifecycle';

function createSteps(order: string[]): jest.Mocked<E2eLifecycleSteps> {
  const step = (name: string): jest.Mock<Promise<void>, []> =>
    jest.fn(() => {
      order.push(name);
      return Promise.resolve();
    });

  return {
    cleanup: step('cleanup'),
    createSchema: step('createSchema'),
    fixtures: step('fixtures'),
    migrate: step('migrate'),
    smoke: step('smoke'),
    tests: step('tests'),
    validate: step('validate'),
  };
}

describe('runE2eLifecycle', () => {
  it('runs every phase in order and cleans up after success', async () => {
    const order: string[] = [];
    const steps = createSteps(order);

    await runE2eLifecycle(steps);

    expect(order).toEqual([
      'validate',
      'createSchema',
      'migrate',
      'fixtures',
      'smoke',
      'tests',
      'cleanup',
    ]);
    expect(steps.cleanup.mock.calls).toHaveLength(1);
  });

  it('does not clean up when validation fails', async () => {
    const steps = createSteps([]);
    steps.validate.mockRejectedValueOnce(new Error('validation failure'));

    await expect(runE2eLifecycle(steps)).rejects.toThrow('validation failure');
    expect(steps.createSchema.mock.calls).toHaveLength(0);
    expect(steps.cleanup.mock.calls).toHaveLength(0);
  });

  it('does not clean up when schema creation fails transactionally', async () => {
    const steps = createSteps([]);
    steps.createSchema.mockRejectedValueOnce(new Error('create failure'));

    await expect(runE2eLifecycle(steps)).rejects.toThrow('create failure');
    expect(steps.migrate.mock.calls).toHaveLength(0);
    expect(steps.cleanup.mock.calls).toHaveLength(0);
  });

  it.each(['migrate', 'fixtures', 'smoke', 'tests'] as const)(
    'cleans up exactly once when %s fails',
    async (failingStep) => {
      const steps = createSteps([]);
      steps[failingStep].mockRejectedValueOnce(
        new Error(`${failingStep} failure`),
      );

      await expect(runE2eLifecycle(steps)).rejects.toThrow(
        `${failingStep} failure`,
      );
      expect(steps.cleanup.mock.calls).toHaveLength(1);
    },
  );

  it('preserves both the primary and cleanup failures', async () => {
    const steps = createSteps([]);
    const primaryError = new Error('test failure');
    const cleanupError = new Error('cleanup failure');
    steps.tests.mockRejectedValueOnce(primaryError);
    steps.cleanup.mockRejectedValueOnce(cleanupError);

    await expect(runE2eLifecycle(steps)).rejects.toMatchObject({
      errors: [primaryError, cleanupError],
    });
  });
});
