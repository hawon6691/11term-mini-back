"use strict";

const CustomError = require("../utils/customError");
const camelcaseKeys = require("camelcase-keys").default;
const execute = require("./../config/db");

class UserRepository {
  async findUserById(id) {
    try {
      const query = "SELECT * FROM users WHERE id = ?";

      const rows = await execute(query, [id]);

      const result = camelcaseKeys(rows, { deep: true });

      return result[0] || null;
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : findUserById 실패");
    }
  }

  async findUserByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = ?";

      const rows = await execute(query, [email]);

      const result = camelcaseKeys(rows, { deep: true });

      return result[0] || null;
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : findUserByEmail 실패");
    }
  }

  async findUserByNickname(nickname) {
    try {
      const query = "SELECT * FROM users WHERE nickname = ?";

      const rows = await execute(query, [nickname]);

      const result = camelcaseKeys(rows, { deep: true });

      return result[0] || null;
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : findUserByNickname 실패");
    }
  }

  async create(userInfo) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : create 실패");
    }
  }

  async findRefreshToken(id) {
    try {
      const query = "SELECT * FROM refresh_token WHERE user_id = ?;";

      const rows = await execute(query, [id]);

      return rows[0] || null;
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : findRefreshToken 싪패");
    }
  }

  async saveRefreshToken(id, refreshToken) {
    try {
      const user = await this.findRefreshToken(id);

      const saveQuery = user
        ? "UPDATE refresh_token SET token = ? WHERE user_id = ?;"
        : "INSERT INTO refresh_token(token, user_id) VALUES(?, ?);";

      const rows = await execute(saveQuery, [refreshToken, id]);

      return rows.affectedRows > 0;
    } catch (error) {
      console.error("error : ", error);
      throw new CustomError("DB 오류 : saveRefreshToken 실패");
    }
  }

  async removeRefreshToken(token) {
    try {
      const query = "DELETE FROM refresh_token WHERE token = ?;";

      const rows = await execute(query, [token]);

      return rows.affectedRows > 0;
    } catch (error) {
      console.error(error);
      throw new CustomError("DB 오류 : removeRefreshToken 실패");
    }
  }
}

module.exports = UserRepository;
