"use strict";

const passport = require("passport");

const authGuard = () => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: true }, async (err, user, info) => {
      if (err) return next(err);

      if (!user) return res.status(401).json({ message: "로그인이 필요합니다." });

      req.user = user;

      next();
    })(req, res, next);
  };
};

module.exports = authGuard;
