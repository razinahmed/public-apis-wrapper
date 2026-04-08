const request = require('supertest');
const app = require('../../src/app');
const nock = require('nock');

describe('Public APIs Wrapper - Integration Tests', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  describe('GET /api/weather', () => {
    it('proxies request to OpenWeatherMap and returns normalized data', async () => {
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query({ q: 'London', appid: /.+/ })
        .reply(200, { main: { temp: 285.15 }, weather: [{ description: 'cloudy' }] });

      const res = await request(app).get('/api/weather?city=London');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('temperature');
      expect(res.body).toHaveProperty('description', 'cloudy');
    });

    it('returns 400 when city parameter is missing', async () => {
      const res = await request(app).get('/api/weather');
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/city.*required/i);
    });
  });

  describe('GET /api/github/repos/:username', () => {
    it('returns a list of public repositories', async () => {
      nock('https://api.github.com')
        .get('/users/octocat/repos')
        .reply(200, [{ name: 'hello-world', stargazers_count: 100 }]);

      const res = await request(app).get('/api/github/repos/octocat');
      expect(res.status).toBe(200);
      expect(res.body[0]).toHaveProperty('name', 'hello-world');
      expect(res.body[0]).toHaveProperty('stars', 100);
    });
  });

  describe('Rate Limiting', () => {
    it('returns 429 after exceeding request limit', async () => {
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .times(60)
        .reply(200, { main: { temp: 290 }, weather: [{ description: 'clear' }] });

      const requests = Array.from({ length: 55 }, () =>
        request(app).get('/api/weather?city=London')
      );
      await Promise.all(requests);

      const res = await request(app).get('/api/weather?city=London');
      expect(res.status).toBe(429);
      expect(res.body.error).toMatch(/rate limit/i);
    });
  });

  describe('GET /api/news/headlines', () => {
    it('returns top headlines from NewsAPI', async () => {
      nock('https://newsapi.org')
        .get('/v2/top-headlines')
        .query(true)
        .reply(200, { articles: [{ title: 'Breaking News', source: { name: 'BBC' } }] });

      const res = await request(app).get('/api/news/headlines?country=us');
      expect(res.status).toBe(200);
      expect(res.body.articles).toHaveLength(1);
      expect(res.body.articles[0]).toHaveProperty('title');
    });
  });

  describe('Error handling', () => {
    it('returns 502 when upstream API is unavailable', async () => {
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .replyWithError('ECONNREFUSED');

      const res = await request(app).get('/api/weather?city=London');
      expect(res.status).toBe(502);
      expect(res.body.error).toMatch(/upstream/i);
    });
  });
});
