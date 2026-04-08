# API Endpoints

Base URL: `https://api.example.com/v1`

All requests require an `x-api-key` header. Rate limit: 50 requests per minute per key.

## Weather

### GET `/api/weather`

Returns current weather for a city.

| Parameter | In | Type | Required | Description |
|-----------|------|------|----------|-------------|
| `city` | query | string | Yes | City name (e.g., `London`) |
| `units` | query | string | No | `metric` (default) or `imperial` |

**Response 200:**
```json
{ "city": "London", "temperature": 18, "humidity": 65, "description": "partly cloudy" }
```

## GitHub

### GET `/api/github/repos/:username`

Returns public repositories for a GitHub user.

| Parameter | In | Type | Required | Description |
|-----------|------|------|----------|-------------|
| `username` | path | string | Yes | GitHub username |
| `sort` | query | string | No | `stars`, `updated`, or `name` |

**Response 200:**
```json
[{ "name": "repo-name", "stars": 120, "language": "JavaScript", "isFork": false }]
```

## News

### GET `/api/news/headlines`

Returns top news headlines.

| Parameter | In | Type | Required | Description |
|-----------|------|------|----------|-------------|
| `country` | query | string | Yes | ISO 3166-1 country code |
| `category` | query | string | No | `business`, `technology`, `sports`, etc. |

**Response 200:**
```json
{ "articles": [{ "title": "...", "source": "BBC", "url": "...", "publishedAt": "2025-01-15T10:00:00Z" }] }
```

## Crypto

### GET `/api/crypto/prices`

Returns current prices for top cryptocurrencies.

| Parameter | In | Type | Required | Description |
|-----------|------|------|----------|-------------|
| `symbols` | query | string | No | Comma-separated (e.g., `BTC,ETH`). Defaults to top 10. |
| `currency` | query | string | No | Fiat currency code. Default: `USD` |

**Response 200:**
```json
[{ "symbol": "BTC", "price": 43250.00, "change24h": 2.5 }]
```

## Error Responses

| Status | Description |
|--------|-------------|
| 400 | Missing or invalid parameters |
| 401 | Invalid or missing API key |
| 429 | Rate limit exceeded |
| 502 | Upstream API unavailable |
