# System Architecture

## Overview

Public APIs Wrapper is a unified proxy layer that normalizes responses from multiple third-party APIs (OpenWeatherMap, GitHub, NewsAPI, CoinGecko) into a consistent JSON schema. It handles authentication, caching, rate limiting, and error normalization so clients only integrate with one API surface.

## Request Flow

```
Client Request
    |
    v
Express Router  -->  Auth Middleware (validate x-api-key)
    |
    v
Rate Limiter (per-IP sliding window, in-memory store)
    |
    v
Cache Layer (check Redis/in-memory for cached response)
    |  cache hit --> return cached response
    v  cache miss
API Adapter (selects correct upstream client)
    |
    v
Transformer (normalize upstream JSON to standard schema)
    |
    v
Cache Write (store normalized response with TTL)
    |
    v
Client Response
```

## Key Modules

### API Adapters (`src/adapters/`)

Each upstream API has a dedicated adapter class that handles:
- Building the request URL with correct auth parameters
- Setting appropriate timeout and retry policies
- Mapping HTTP errors to internal error codes

Adapters: `WeatherAdapter`, `GitHubAdapter`, `NewsAdapter`, `CryptoAdapter`

### Transformers (`src/transformers/`)

Each adapter has a paired transformer that converts the raw upstream response into the wrapper's canonical schema. This isolates consumers from upstream schema changes.

### Rate Limiter (`src/middleware/rateLimiter.js`)

Implements a sliding-window counter per client IP. Configuration:
- Default: 50 requests per 60-second window
- Configurable via `RATE_LIMIT_MAX` and `RATE_LIMIT_WINDOW_MS` env vars
- Returns `429 Too Many Requests` with `Retry-After` header

### Cache Layer (`src/cache/`)

Two-tier caching strategy:
1. **In-memory LRU** (node-lru-cache) for sub-millisecond responses on hot keys
2. **Redis** (optional) for shared cache across multiple instances

TTL varies by endpoint: weather 5 min, news 15 min, crypto 30 sec, GitHub repos 10 min.

## Configuration

All secrets and tuning parameters are read from environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server listen port | `3000` |
| `OPENWEATHER_KEY` | OpenWeatherMap API key | - |
| `GITHUB_TOKEN` | GitHub personal access token | - |
| `NEWS_API_KEY` | NewsAPI key | - |
| `REDIS_URL` | Redis connection string (optional) | - |
| `RATE_LIMIT_MAX` | Max requests per window | `50` |

## Error Handling

All upstream errors are caught and mapped to standard HTTP responses. Network failures return `502 Bad Gateway` with a descriptive message. The error middleware logs structured JSON to stdout for aggregation by external log collectors.

## Deployment

The application runs as a stateless Node.js process. Horizontal scaling is supported when Redis caching is enabled. Docker and docker-compose files are provided for local development and CI.
