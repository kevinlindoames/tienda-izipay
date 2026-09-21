export interface E2eLifecycleSteps {
  cleanup: () => Promise<void>;
  createSchema: () => Promise<void>;
  fixtures: () => Promise<void>;
  migrate: () => Promise<void>;
  smoke: () => Promise<void>;
  tests: () => Promise<void>;
  validate: () => Promise<void>;
}

function normalizeLifecycleError(error: unknown): Error {
  return error instanceof Error
    ? error
    : new Error('An E2E lifecycle phase failed with an invalid error value.');
}

export async function runE2eLifecycle(steps: E2eLifecycleSteps): Promise<void> {
  await steps.validate();

  let schemaCreated = false;
  let primaryError: Error | undefined;

  try {
    await steps.createSchema();
    schemaCreated = true;
    await steps.migrate();
    await steps.fixtures();
    await steps.smoke();
    await steps.tests();
  } catch (error: unknown) {
    primaryError = normalizeLifecycleError(error);
  }

  let cleanupError: Error | undefined;

  if (schemaCreated) {
    try {
      await steps.cleanup();
    } catch (error: unknown) {
      cleanupError = normalizeLifecycleError(error);
    }
  }

  if (primaryError && cleanupError) {
    throw new AggregateError(
      [primaryError, cleanupError],
      'The E2E run and its guarded cleanup both failed.',
    );
  }

  if (primaryError) {
    throw primaryError;
  }

  if (cleanupError) {
    throw cleanupError;
  }
}
