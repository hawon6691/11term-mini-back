const localStrategy = require("./../auth/strategy/local.strategy");
const jwtStrategy = require("./../auth/strategy/jwt.strategy");

module.exports = (passport) => {
  localStrategy(passport);
  jwtStrategy(passport);
};
