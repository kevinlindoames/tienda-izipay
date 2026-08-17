import { extractBearerToken } from './admin-auth.guard';

describe('extractBearerToken', () => {
  it('extracts a bearer token', () => {
    expect(extractBearerToken('Bearer opaque-token')).toBe('opaque-token');
  });

  it('rejects a missing authorization header', () => {
    expect(extractBearerToken(undefined)).toBeNull();
  });

  it('rejects unsupported authorization schemes', () => {
    expect(extractBearerToken('Basic abc123')).toBeNull();
  });
});
