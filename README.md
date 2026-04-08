# 🌍 Public APIs Wrapper (Node.js)

<div align="center">

<img src="https://placehold.co/800x200/1e1e2e/3b82f6.png?text=Node.js+%2B+Express+API+Wrapper" alt="API Wrapper Banner" />

**A beautifully structured Node.js backend that elegantly wraps dozens of popular public and free APIs into a single GraphQL and REST endpoint.**

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)

</div>

---

## 🔌 APIs Wrapped
This wrapper acts as a proxy/gateway to fetch data cleanly without hitting cross-origin (CORS) limits on the frontend.
* **Crypto:** Coingecko API wrapper routes (`/api/crypto/prices`)
* **Weather:** OpenWeatherMap API wrapper routes (`/api/weather/current`)
* **Anime:** Jikan (MyAnimeList) API wrapper routes (`/api/anime/top`)
* **Memes:** Meme API wrapper (`/api/memes/random`)

## 🚀 Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/razinahmed/public-apis-wrapper.git
cd public-apis-wrapper
npm install
```

2. **Run in Development Mode:**
```bash
npm run dev
```
*The server will start on port `5000`.*

3. **Try it out!**
Make a GET request using `curl` or Postman:
```bash
curl http://localhost:5000/api/crypto/prices?coin=bitcoin
```

## 🛠 Features
- High-performance caching using Redis.
- Built-in rate limiting to prevent IP banning from the public APIs.
- Fully typed using TypeScript.
