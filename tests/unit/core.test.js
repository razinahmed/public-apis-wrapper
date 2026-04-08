const { normalizeWeather } = require('../../src/transformers/weather');
const { normalizeRepo } = require('../../src/transformers/github');
const { RateLimiter } = require('../../src/middleware/rateLimiter');
const { validateApiKey } = require('../../src/middleware/auth');
const { CacheManager } = require('../../src/cache');

describe('Weather Transformer', () => {
  it('normalizes OpenWeatherMap response to standard format', () => {
    const raw = { main: { temp: 295.15, humidity: 60 }, weather: [{ description: 'clear sky' }], name: 'London' };
    const result = normalizeWeather(raw);
    expect(result).toEqual({
      city: 'London',
      temperature: 22,
      humidity: 60,
      description: 'clear sky',
    });
  });

  it('handles missing weather array gracefully', () => {
    const raw = { main: { temp: 290 }, weather: [], name: 'Paris' };
    const result = normalizeWeather(raw);
    expect(result.description).toBe('unknown');
  });

  it('converts Kelvin to Celsius correctly', () => {
    const raw = { main: { temp: 273.15, humidity: 50 }, weather: [{ description: 'snow' }], name: 'Oslo' };
    const result = normalizeWeather(raw);
    expect(result.temperature).toBe(0);
  });
});

describe('GitHub Transformer', () => {
  it('normalizes GitHub repo response', () => {
    const raw = { name: 'my-repo', stargazers_count: 42, language: 'JavaScript', fork: false };
    const result = normalizeRepo(raw);
    expect(result).toEqual({ name: 'my-repo', stars: 42, language: 'JavaScript', isFork: false });
  });

  it('defaults language to null when not specified', () => {
    const raw = { name: 'empty', stargazers_count: 0, language: null, fork: true };
    expect(normalizeRepo(raw).language).toBeNull();
  });
});

describe('RateLimiter', () => {
  let limiter;
  beforeEach(() => {
    limiter = new RateLimiter({ maxRequests: 3, windowMs: 1000 });
  });

  it('allows requests within the limit', () => {
    expect(limiter.consume('127.0.0.1')).toBe(true);
    expect(limiter.consume('127.0.0.1')).toBe(true);
    expect(limiter.consume('127.0.0.1')).toBe(true);
  });

  it('rejects requests exceeding the limit', () => {
    limiter.consume('127.0.0.1');
    limiter.consume('127.0.0.1');
    limiter.consume('127.0.0.1');
    expect(limiter.consume('127.0.0.1')).toBe(false);
  });

  it('tracks different IPs independently', () => {
    limiter.consume('10.0.0.1');
    limiter.consume('10.0.0.1');
    limiter.consume('10.0.0.1');
    expect(limiter.consume('10.0.0.2')).toBe(true);
  });
});

describe('Auth Middleware', () => {
  it('rejects requests without an API key', () => {
    const req = { headers: {} };
    const result = validateApiKey(req);
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/API key required/);
  });

  it('accepts requests with a valid API key', () => {
    const req = { headers: { 'x-api-key': 'test-key-12345' } };
    const result = validateApiKey(req);
    expect(result.valid).toBe(true);
  });
});

describe('CacheManager', () => {
  let cache;
  beforeEach(() => {
    cache = new CacheManager({ ttl: 300 });
  });

  it('stores and retrieves cached responses', () => {
    cache.set('/api/weather?city=London', { temperature: 20 });
    expect(cache.get('/api/weather?city=London')).toEqual({ temperature: 20 });
  });

  it('returns null for expired entries', () => {
    cache.set('/api/test', { data: 1 }, { ttl: -1 });
    expect(cache.get('/api/test')).toBeNull();
  });

  it('clears all entries', () => {
    cache.set('/a', 1);
    cache.set('/b', 2);
    cache.clear();
    expect(cache.get('/a')).toBeNull();
    expect(cache.get('/b')).toBeNull();
  });
});
