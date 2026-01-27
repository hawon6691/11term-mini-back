"use strict";

const { execute } = require("./../config/db");

class TagRepository {
  async create(tagNames, connection) {
    const query = "INSERT INTO tags(name) VALUES ?;";

    const values = tagNames.map((tagName) => [tagName]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }

  async findTagById(id) {
    const query = "SELECT * from tags WHERE id = ?;";

    const [rows] = await execute(query, [id]);
    return rows || null;
  }

  async findTagByNames(tags, connection) {
    const query = "SELECT * from tags WHERE name IN (?);";

    const [rows] = await connection.query(query, [tags]);
    return rows || null;
  }
}

module.exports = TagRepository;
