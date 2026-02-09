"use strict";

const { execute } = require("../config/db");

class SearchRepository {
  async saveSearchLog(keyword, userId = null) {
    const query = `
      INSERT INTO search_logs (keyword, user_id)
      VALUES (?, ?)
    `;
    await execute(query, [keyword, userId]);
  }

  async getPopularKeywords(limit = 10) {
    const query = `
      SELECT keyword, COUNT(*) as search_count
      FROM search_logs
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
      GROUP BY keyword
      ORDER BY search_count DESC
      LIMIT ?
    `;
    const rows = await execute(query, [limit]);
    return rows;
  }
}

module.exports = SearchRepository;
