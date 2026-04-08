const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// 1. Crypto Prices Proxy
app.get('/api/crypto/prices', async (req, res) => {
    // In a real app, you would fetch from CoinGecko here.
    // Simulating response to avoid real API keys in the boilerplate.
    const { coin } = req.query;
    res.json({
        cached: true,
        data: {
            coin: coin || 'bitcoin',
            price_usd: 64230.50,
            last_updated: new Date().toISOString()
        }
    });
});

// 2. Weather Proxy
app.get('/api/weather/current', (req, res) => {
    const { city } = req.query;
    res.json({
        cached: true,
        data: {
            city: city || 'Dubai',
            temperature: '32°C',
            condition: 'Sunny'
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Public APIs Wrapper listening on port ${PORT}`);
});
