module.exports = (err, req, res, next) => {
  console.error("error : ", err);

  const status = err.statusCode || 500;
  const message = err.isOperational ? err.message : "서버 에러";

  res.status(status).json({ message });
};
