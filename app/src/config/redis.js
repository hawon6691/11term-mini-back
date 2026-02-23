"use strict";

const { createClient } = require("redis");

const redisClient = createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
});

redisClient.on("connect", () => {
  console.log("Redis client connected");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.connect().catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

module.exports = redisClient;
