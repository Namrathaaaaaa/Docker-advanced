const os = require('os');
const express = require('express');
const redis = require('redis');

const app = express();

// Create Redis client
const redisClient = redis.createClient({
  socket: {
    host: 'redis', // Must match Docker service name
    port: 6379
  }
});

// Handle Redis errors
redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

// Self-executing async function
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');

    app.get('/', async (req, res) => {
      try {
        let numVisits = await redisClient.get('numVisits');
        let count = parseInt(numVisits) || 0;
        count += 1;
        await redisClient.set('numVisits', count);
        res.send(`${os.hostname()}: Number of visits is: ${count}`);
      } catch (err) {
        console.error('❌ Error during request:', err);
        res.status(500).send('Error talking to Redis');
      }
    });

    app.listen(5000, '0.0.0.0', () => {
      console.log('🌐 Web application is listening on port 5000');
    });
  } catch (err) {
    console.error('❌ Failed to start app:', err);
  }
})();
