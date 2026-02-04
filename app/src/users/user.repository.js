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
      "INSERT INTO users(email, password, name, nickname, address) VALUES(?, ?, ?, ?, ?);";

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

  async getFollowInfo(userId) {
    const followingQuery = `
      SELECT u.id, u.nickname, u.image_url
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
    `;
    const followingRows = await execute(followingQuery, [userId]);
    const followingList = camelcaseKeys(followingRows, { deep: true });

    const followerQuery = `
      SELECT u.id, u.nickname, u.image_url
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
    `;
    const followerRows = await execute(followerQuery, [userId]);
    const followerList = camelcaseKeys(followerRows, { deep: true });

    return {
      followingList,
      followerList,
      followingCnt: followingList.length,
      followerCnt: followerList.length,
    };
  }

  async updateNickname(userId, nickname) {
    const query = "UPDATE users SET nickname = ? WHERE id = ?";
    await execute(query, [nickname, userId]);
  }

  async updateDescription(userId, description) {
    const query = "UPDATE users SET description = ? WHERE id = ?";
    await execute(query, [description, userId]);
  }

  async checkFollow(followerId, followingId) {
    const query = `
      SELECT * FROM follows
      WHERE follower_id = ? AND following_id = ?
    `;
    const rows = await execute(query, [followerId, followingId]);
    return rows.length > 0;
  }

  async createFollow(followerId, followingId) {
    const query = `
      INSERT INTO follows (follower_id, following_id)
      VALUES (?, ?)
    `;
    await execute(query, [followerId, followingId]);
  }

  async deleteFollow(followerId, followingId) {
    const query = `
      DELETE FROM follows
      WHERE follower_id = ? AND following_id = ?
    `;
    await execute(query, [followerId, followingId]);
  }
}

module.exports = UserRepository;
