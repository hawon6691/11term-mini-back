"use strict";

const db = require("./../config/db");

class UserRepository {
  // 테스트
  async getUsers() {
    try {
      const query = "SELECT * FROM users";

      const [results] = await db.query(query);

      return results;
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}

module.exports = UserRepository;
