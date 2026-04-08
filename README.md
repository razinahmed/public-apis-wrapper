<div align="center">

# 🌍 Public APIs Wrapper (Node.js)

<img src="https://placehold.co/900x250/1e1e2e/3b82f6.png?text=Node.js+%7C+Express+%7C+REST+%26+GraphQL+API+Gateway" alt="Public APIs Wrapper Banner" />

<br/>

**A beautifully structured Node.js backend that wraps dozens of popular public APIs into a single, unified REST and GraphQL endpoint — with caching, rate limiting, and full TypeScript support.**

[![Node.js](https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

[APIs](#-supported-apis) · [Endpoints](#-api-endpoint-reference) · [Quick Start](#-quick-start) · [Deployment](#-deployment) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Supported APIs](#-supported-apis)
- [API Endpoint Reference](#-api-endpoint-reference)
- [Response Examples](#-response-examples)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Rate Limiting](#-rate-limiting)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 About

**Public APIs Wrapper** acts as a unified API gateway and proxy that aggregates data from multiple popular public APIs into a single, consistent interface. It eliminates CORS issues for frontend applications, adds intelligent Redis caching to reduce latency, and implements rate limiting to prevent upstream API bans. Built with **TypeScript** for type safety and **Express.js** for performance.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Unified Gateway** | Access multiple public APIs through a single base URL |
| **CORS Proxy** | Eliminates cross-origin issues for frontend applications |
| **Redis Caching** | Intelligent response caching with configurable TTL per endpoint |
| **Rate Limiting** | Per-IP rate limiting to prevent upstream API bans |
| **GraphQL Support** | Optional GraphQL endpoint alongside REST routes |
| **TypeScript** | Fully typed request/response schemas with strict mode |
| **Error Handling** | Consistent error format with upstream API error passthrough |
| **Health Checks** | Built-in health and readiness endpoints for monitoring |
| **Swagger Docs** | Auto-generated OpenAPI/Swagger documentation |
| **Docker Ready** | Production-optimized Dockerfile included |

---

## 🔌 Supported APIs

| API | Provider | Category | Auth Required | Cache TTL |
|---|---|---|:-:|---|
| **Cryptocurrency Prices** | [CoinGecko](https://www.coingecko.com/en/api) | Finance | ❌ | 60s |
| **Current Weather** | [OpenWeatherMap](https://openweathermap.org/api) | Weather | ✅ (Free tier) | 300s |
| **Top Anime** | [Jikan (MAL)](https://jikan.moe/) | Entertainment | ❌ | 3600s |
| **Random Memes** | [Meme API](https://github.com/D3vd/Meme_Api) | Fun | ❌ | 30s |
| **Country Info** | [REST Countries](https://restcountries.com/) | Geography | ❌ | 86400s |
| **Random Quotes** | [Quotable](https://quotable.io/) | Inspiration | ❌ | 60s |
| **GitHub User** | [GitHub API](https://docs.github.com/en/rest) | Developer | ❌ | 600s |
| **News Headlines** | [NewsAPI](https://newsapi.org/) | News | ✅ (Free tier) | 900s |

---

## 📡 API Endpoint Reference

### Base URL

```
Development: http://localhost:5000/api
Production:  https://your-domain.com/api
```

### Cryptocurrency

| Method | Endpoint | Description | Parameters |
|:-:|---|---|---|
| GET | `/api/crypto/prices` | Get current prices | `coin` (required), `currency` (default: usd) |
| GET | `/api/crypto/markets` | Get top coins by market cap | `limit` (default: 10), `currency` (default: usd) |
| GET | `/api/crypto/history` | Get price history | `coin` (required), `days` (default: 7) |

### Weather

| Method | Endpoint | Description | Parameters |
|:-:|---|---|---|
| GET | `/api/weather/current` | Get current weather | `city` (required), `units` (default: metric) |
| GET | `/api/weather/forecast` | Get 5-day forecast | `city` (required), `units` (default: metric) |

### Entertainment

| Method | Endpoint | Description | Parameters |
|:-:|---|---|---|
| GET | `/api/anime/top` | Get top-rated anime | `page` (default: 1), `limit` (default: 25) |
| GET | `/api/anime/search` | Search anime by title | `q` (required), `page` (default: 1) |
| GET | `/api/memes/random` | Get a random meme | `count` (default: 1) |

### Utilities

| Method | Endpoint | Description | Parameters |
|:-:|---|---|---|
| GET | `/api/countries/:name` | Get country information | `:name` (path param) |
| GET | `/api/quotes/random` | Get a random quote | `tag` (optional) |
| GET | `/api/github/user/:username` | Get GitHub user profile | `:username` (path param) |
| GET | `/api/news/headlines` | Get top news headlines | `country` (default: us), `category` (optional) |

### System

| Method | Endpoint | Description |
|:-:|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger UI documentation |

---

## 📦 Response Examples

### GET `/api/crypto/prices?coin=bitcoin`

```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "current_price": 67432.00,
    "market_cap": 1324567890123,
    "price_change_24h": -2.34,
    "last_updated": "2025-01-15T12:00:00Z"
  },
  "cached": true,
  "cache_ttl": 60
}
```

### GET `/api/weather/current?city=London`

```json
{
  "success": true,
  "data": {
    "city": "London",
    "country": "GB",
    "temperature": 12.5,
    "feels_like": 10.2,
    "humidity": 78,
    "description": "Overcast clouds",
    "wind_speed": 5.4
  },
  "cached": false
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": 429,
    "message": "Rate limit exceeded. Please try again in 60 seconds.",
    "retry_after": 60
  }
}
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Redis (optional, falls back to in-memory cache)
- npm, yarn, or pnpm

### 1. Clone and Install

```bash
git clone https://github.com/razinahmed/public-apis-wrapper.git
cd public-apis-wrapper
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

### 3. Run in Development Mode

```bash
npm run dev
```

The server will start on port `5000`.

### 4. Try It Out

```bash
# Get Bitcoin price
curl http://localhost:5000/api/crypto/prices?coin=bitcoin

# Get current weather
curl http://localhost:5000/api/weather/current?city=Tokyo

# Get a random meme
curl http://localhost:5000/api/memes/random

# Check API health
curl http://localhost:5000/api/health
```

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|---|:-:|---|---|
| `PORT` | ❌ | `5000` | Server port |
| `NODE_ENV` | ❌ | `development` | Environment mode |
| `REDIS_URL` | ❌ | `redis://localhost:6379` | Redis connection URL |
| `OPENWEATHER_API_KEY` | ✅ | — | OpenWeatherMap API key |
| `NEWS_API_KEY` | ❌ | — | NewsAPI.org API key |
| `RATE_LIMIT_WINDOW` | ❌ | `60000` | Rate limit window in ms |
| `RATE_LIMIT_MAX` | ❌ | `100` | Max requests per window |
| `CACHE_ENABLED` | ❌ | `true` | Enable/disable caching |

---

## 🚦 Rate Limiting

To protect both your server and the upstream APIs, rate limiting is applied per IP address:

| Tier | Requests | Window | Use Case |
|---|:-:|---|---|
| **Default** | 100 | 1 minute | General usage |
| **Burst** | 20 | 10 seconds | Short burst protection |
| **Upstream Protection** | Varies | Per API | Prevents upstream bans |

Rate limit headers are included in every response:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705312800
```

---

## 📁 Project Structure

```
public-apis-wrapper/
├── src/
│   ├── routes/                 # API route handlers
│   │   ├── crypto.ts           # Cryptocurrency endpoints
│   │   ├── weather.ts          # Weather endpoints
│   │   ├── anime.ts            # Anime/entertainment endpoints
│   │   ├── memes.ts            # Meme endpoints
│   │   └── index.ts            # Route aggregator
│   ├── middleware/              # Express middleware
│   │   ├── rateLimiter.ts      # Rate limiting middleware
│   │   ├── cache.ts            # Redis cache middleware
│   │   └── errorHandler.ts     # Global error handler
│   ├── services/               # API client services
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Helper functions
│   └── app.ts                  # Express app configuration
├── tests/                      # Unit and integration tests
├── .env.example                # Environment variable template
├── Dockerfile                  # Production Docker image
├── docker-compose.yml          # Docker Compose with Redis
├── tsconfig.json               # TypeScript configuration
├── package.json
├── LICENSE
└── README.md
```

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js 4.x |
| **Language** | TypeScript 5.0 |
| **Caching** | Redis, node-cache (fallback) |
| **Rate Limiting** | express-rate-limit |
| **Documentation** | Swagger / OpenAPI 3.0 |
| **Validation** | Zod |
| **Testing** | Jest, Supertest |
| **Containerization** | Docker, Docker Compose |

---

## 🚢 Deployment

### Deploy with Docker

```bash
docker-compose up -d
```

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template)

### Deploy to Render

1. Connect your GitHub repository
2. Set the build command: `npm run build`
3. Set the start command: `npm start`
4. Add environment variables in the dashboard

---

## 🤝 Contributing

Contributions are welcome! To add a new API wrapper:

1. **Fork** this repository
2. **Create** a route file in `src/routes/`
3. **Add** the service client in `src/services/`
4. **Register** the route in `src/routes/index.ts`
5. **Write** tests in `tests/`
6. **Submit** a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built by [Razin Ahmed](https://github.com/razinahmed)**

If this wrapper saved you time, please give the repo a ⭐

<img src="https://komarev.com/ghpvc/?username=razinahmed&style=flat-square&color=3b82f6&label=REPO+VIEWS" alt="Repo Views" />

</div>
