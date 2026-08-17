import { validateEnvironment } from './env.validation';

describe('validateEnvironment', () => {
  it('normalizes a valid PostgreSQL environment', () => {
    const result = validateEnvironment({
      NODE_ENV: 'test',
      PORT: '3001',
      DATABASE_URL: 'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    });

    expect(result.NODE_ENV).toBe('test');
    expect(result.PORT).toBe(3001);
    expect(result.DATABASE_URL).toBe(
      'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    );
  });

  it('uses the API port default', () => {
    const result = validateEnvironment({
      DATABASE_URL: 'postgresql://postgres:secret@localhost:5432/tienda_izipay',
    });

    expect(result.PORT).toBe(3001);
  });

  it('rejects a missing database URL', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'test',
      }),
    ).toThrow('DATABASE_URL');
  });

  it('rejects a malformed database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'not-a-url',
      }),
    ).toThrow('valid URL');
  });

  it('rejects a non PostgreSQL database URL', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: 'https://localhost/database',
      }),
    ).toThrow('postgresql');
  });

  it('rejects an invalid port', () => {
    expect(() =>
      validateEnvironment({
        PORT: '70000',
        DATABASE_URL:
          'postgresql://postgres:secret@localhost:5432/tienda_izipay',
      }),
    ).toThrow('PORT');
  });

  it('rejects an invalid node environment', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'staging',
        DATABASE_URL:
          'postgresql://postgres:secret@localhost:5432/tienda_izipay',
      }),
    ).toThrow('NODE_ENV');
  });
});
