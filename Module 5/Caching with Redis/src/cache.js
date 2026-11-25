'use strict';

// Redis helpers for the cache-aside pattern.
// Every helper degrades gracefully: a Redis failure is logged and the request
// continues (a cache outage slows the app down, it does not break it).

const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  lazyConnect: true,
});

// Without a listener, ioredis connection errors can surface as unhandled events.
redis.on('error', (err) => console.error('[cache] redis error:', err.message));

async function cacheGet(key) {
  try {
    const value = await redis.get(key);
    if (value === null) return null;   // cache miss
    return JSON.parse(value);
  } catch (err) {
    console.error(`[cache] get "${key}" failed:`, err.message);
    return null;
  }
}

async function cacheSet(key, data, ttlSeconds) {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error(`[cache] set "${key}" failed:`, err.message);
  }
}

async function cacheDel(key) {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`[cache] del "${key}" failed:`, err.message);
  }
}

module.exports = { cacheGet, cacheSet, cacheDel };
