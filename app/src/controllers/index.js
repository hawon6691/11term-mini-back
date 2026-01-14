"use strict";

const hello = (req, res) => {
  res.status(200).json({ success: true });
};

module.exports = {
  hello,
};
