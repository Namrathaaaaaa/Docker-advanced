const os = require('os');
const express = require('express');
const app = express();
const redis = require('redis');

const redisClient = redis.createClient({
  host: 'redis',
  port: 6379
});

app.get('/', function(req, res) {
    redisClient.get('numVisits', function(err, numVisits) {
        let numVisitsToDisplay = parseInt(numVisits) || 0;
        numVisitsToDisplay += 1;

        redisClient.set('numVisits', numVisitsToDisplay);
        res.send(os.hostname() + ': Number of visits is: ' + numVisitsToDisplay);
    });
});

app.listen(5000, '0.0.0.0', function() {
    console.log('Web application is listening on port 5000');
});
