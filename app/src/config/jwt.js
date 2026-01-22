module.exports = {
  accessSecret: process.env.ACCESS_TOKEN_KEY,
  refreshSecret: process.env.REFRESH_TOKEN_KEY,

  accessExpiresIn: "30m",
  refreshExpiresIn: "14d",
};
