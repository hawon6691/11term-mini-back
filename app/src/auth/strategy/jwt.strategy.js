const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwtConfig = require("../../config/jwt");

const UserRepository = require("../../users/user.repository");
const userRepository = new UserRepository();

// accessToken 검증
module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.accessSecret,
      },
      async (payload, done) => {
        try {
          const user = await userRepository.findUserById(payload.id);

          if (!user) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }
    )
  );
};
