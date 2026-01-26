"use strict";

const camelcaseKeys = require("camelcase-keys").default;
const { execute } = require("./../config/db");

class UserRepository {
  async findUserById(id) {
    const query = "SELECT * FROM users WHERE id = ?";
    const rows = await execute(query, [id]);
    const result = camelcaseKeys(rows, { deep: true });

    return result[0] || null;
  }

  async findUserByEmail(email) {
    const query = "SELECT * FROM users WHERE email = ?";
    const rows = await execute(query, [email]);
    const result = camelcaseKeys(rows, { deep: true });

    return result[0] || null;
  }

  async findUserByNickname(nickname) {
    const query = "SELECT * FROM users WHERE nickname = ?";
    const rows = await execute(query, [nickname]);
    const result = camelcaseKeys(rows, { deep: true });

    return result[0] || null;
  }

  async create(userInfo) {
    const query =
      "INSERT INTO users(email, password, name, nickname, address) VALUE(?, ?, ?, ?, ?);";

    const rows = await execute(query, [
      userInfo.email,
      userInfo.password,
      userInfo.name,
      userInfo.nickname,
      userInfo.address,
    ]);

    return rows.affectedRows > 0;
  }

  async findRefreshToken(id) {
    const query = "SELECT * FROM refresh_token WHERE user_id = ?;";
    const rows = await execute(query, [id]);

    return rows[0] || null;
  }

  async saveRefreshToken(id, refreshToken) {
    const user = await this.findRefreshToken(id);

    const saveQuery = user
      ? "UPDATE refresh_token SET token = ? WHERE user_id = ?;"
      : "INSERT INTO refresh_token(token, user_id) VALUES(?, ?);";

    const rows = await execute(saveQuery, [refreshToken, id]);

    return rows.affectedRows > 0;
  }

  async removeRefreshToken(token) {
    const query = "DELETE FROM refresh_token WHERE token = ?;";
    const rows = await execute(query, [token]);

    return rows.affectedRows > 0;
  }
}

module.exports = UserRepository;
