"use strict";

const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "+00:00",
});

const execute = async (query, params = []) => {
  try {
    const [rows] = await db.query(query, params);

    console.log("----------SQL----------");
    console.log("query : ", query);
    console.log("params : ", params);

    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

db.on("connection", () => {
  console.log("DB 연결 성공");
});

module.exports = execute;
