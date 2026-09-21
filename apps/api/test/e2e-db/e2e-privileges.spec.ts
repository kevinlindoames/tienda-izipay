import { assertRuntimePrivileges } from './e2e-privileges';

const valid = {
  roleName: 'e2e_example',
  elevated: false,
  schemaCreate: false,
  schemaUsage: true,
  anonymousAccess: false,
  migrationsWritable: false,
  tablesAccessible: true,
  ownsTables: false,
  membershipCount: 0,
};

describe('runtime privilege assertions', () => {
  it('accepts only the restricted role', () => {
    expect(() => assertRuntimePrivileges(valid, valid.roleName)).not.toThrow();
  });
  it.each([
    { roleName: 'postgres' },
    { elevated: true },
    { schemaCreate: true },
    { schemaUsage: false },
    { anonymousAccess: true },
    { migrationsWritable: true },
    { tablesAccessible: false },
    { ownsTables: true },
    { membershipCount: 1 },
  ])('rejects privilege drift %j', (overrides) => {
    expect(() =>
      assertRuntimePrivileges({ ...valid, ...overrides }, valid.roleName),
    ).toThrow('privilege isolation');
  });
  it('rejects missing evidence', () => {
    expect(() => assertRuntimePrivileges(undefined, valid.roleName)).toThrow();
  });
});
