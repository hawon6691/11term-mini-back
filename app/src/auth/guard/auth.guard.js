const passport = require("passport");

const authGuard = () => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: true }, async (err, user, info) => {
      if (err) return next(err);

      if (!user) return res.status(401).json({ message: info?.message || "Unauthorized" });

      req.user = user;

      next();
    })(req, res, next);
  };
};

module.exports = authGuard;
