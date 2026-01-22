"use strict";

const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const UserRepository = require("../../users/user.repository");
const userRepository = new UserRepository();

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await userRepository.findUserByEmail(email);

          /**
           * done의 첫번째 인수는 에러
           * 두번째 인수는 유저 정보, 검증 실패시 null
           * 세번쨰 인수는 실패 정보
           */
          if (!user) {
            return done(null, false, { message: "존재하지 않은 사용자입니다." });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, { message: "비밀번호가 일치하지 않습니다." });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
