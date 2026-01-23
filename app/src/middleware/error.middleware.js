"use strict";

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "서버 에러";

  res.status(status).json({ message });
};
