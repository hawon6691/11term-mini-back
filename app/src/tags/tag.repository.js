"use strict";

const { execute } = require("./../config/db");

class TagRepository {
  async create(tagNames, connection) {
    const query = "INSERT INTO tags(name) VALUES ?;";

    const values = tagNames.map((tagName) => [tagName]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }

  async findTagsByIds(tags) {
    const query = "SELECT * from tags WHERE id IN (?);";

    const rows = await execute(query, [tags]);
    return rows || [];
  }

  async findTagsByNames(tags, connection) {
    const query = "SELECT * from tags WHERE name IN (?);";

    const [rows] = await connection.query(query, [tags]);
    return rows || [];
  }
}

module.exports = TagRepository;
