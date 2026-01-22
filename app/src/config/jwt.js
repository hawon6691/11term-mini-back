module.exports = {
  accessSecret: process.env.ACCESS_TOKEN_KEY,
  refreshSecret: process.env.REFRESH_TOKEN_KEY,

  accessExpiresIn: process.env.ACCESS_EXPIRES,
  refreshExpiresIn: process.env.REFRESH_EXPIRES,
};
