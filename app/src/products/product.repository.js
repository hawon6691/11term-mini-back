"use strict";

const CustomError = require("../utils/customError");
const { execute } = require("./../config/db");

const QUERY = {
  FIND_ALL_PRODUCTS_QUERY: `SELECT p.id AS product_id, p.title, p.price, p.created_at, p.is_shipping_cost, p.sale_status, i.image_url
    FROM products p 
    LEFT JOIN product_images i ON i.product_id = p.id AND i.is_thumbnail = 1 
    WHERE deleted_at IS NULL`,
  CURSOR_QUERY: "AND (p.created_at < ? OR (p.created_at = ? AND p.id < ?))",
  LIMIT_QUERY: "LIMIT ?",
};

const ORDER_BY_QUERY = {
  accuracy: "",
  popular: "ORDER BY p.view_cnt DESC, p.id DESC",
  latest: "ORDER BY p.created_at DESC, p.id DESC",
  price_desc: "ORDER BY p.price DESC, p.id DESC",
  price_asc: "ORDER BY p.price ASC, p.id ASC",
};

class ProductRepository {
  async create(productInfo, connection) {
    const query = `INSERT INTO
      products(user_id, title, description, product_condition, price, is_shipping_cost, shipping_cost, is_direct_deal, direct_deal_location, category_id) 
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    const [rows] = await connection.query(query, [
      productInfo.userId,
      productInfo.title,
      productInfo.description,
      productInfo.productCondition,
      productInfo.price,
      productInfo.isShippingCost,
      productInfo.shippingCost || null,
      productInfo.isDirectDeal,
      productInfo.directDealLocation,
      productInfo.categoryId,
    ]);

    return rows || null;
  }

  async saveProductImage(productId, images, connection) {
    const query = "INSERT INTO product_images(product_id, image_url, is_thumbnail) VALUES ?;";

    const values = images.map((img, index) => [productId, img, index === 0]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }

  async deleteProductImage(productId, connection) {
    const query = "DELETE FROM product_images WHERE product_id = ?;";

    const [rows] = await connection.query(query, [productId]);

    return rows || null;
  }

  async findProductImages(productId) {
    const query = "SELECT * FROM product_images WHERE product_id = ?;";

    const rows = await execute(query, [productId]);

    return rows || [];
  }

  async findAllProducts(limit, cursor, cursorId, orderby) {
    const params = [];
    let query = QUERY.FIND_ALL_PRODUCTS_QUERY;

    if (cursor && cursorId) {
      query += ` ${QUERY.CURSOR_QUERY}`;

      params.push(cursor, cursor, cursorId);
    }

    query += ` ${ORDER_BY_QUERY[orderby]} ${QUERY.LIMIT_QUERY}`;
    params.push(limit);

    const rows = await execute(query, params);

    return {
      products: rows,
      nextCursor: rows.length
        ? { cursor: rows[rows.length - 1].createdAt, cursorId: rows[rows.length - 1].productId }
        : null,
    };
  }

  async findProductById(productId) {
    const query = `SELECT * FROM products WHERE deleted_at IS NULL AND id = ?;`;

    const [rows] = await execute(query, [productId]);

    return rows || null;
  }

  async findProductById(productId) {
    const query = `SELECT * FROM products WHERE deleted_at IS NULL AND id = ?;`;
    const rows = await execute(query, [productId]);
    return rows?.[0] || null;
  }

  async findProducts(userId, searchType, value, limit, cursor, cursorId, orderby) {
    const params = [];
    let query = QUERY.FIND_ALL_PRODUCTS_QUERY;

    if (userId) {
      query += ` AND p.user_id = ?`;
      params.push(userId);
    } else {
      const keywords = value.trim().split(" ").filter(Boolean);

      if (keywords.length === 0) {
        return { products: [], nextCursor: null };
      }

      if (searchType === "tag") {
        const placeholders = keywords.map(() => "?").join(", ");

        query = `
        SELECT
          p.id AS product_id,
          p.title,
          p.price,
          p.created_at,
          p.is_shipping_cost,
          p.sale_status,
          i.image_url,
          tm.tag_score
        FROM products p
        LEFT JOIN product_images i ON i.product_id = p.id AND i.is_thumbnail = 1
        JOIN (
          SELECT
            pt.product_id,
            COUNT(DISTINCT t.name) AS tag_score
          FROM product_tags pt
          JOIN tags t ON t.id = pt.tag_id
          WHERE t.name IN (${placeholders})
          GROUP BY pt.product_id
        ) tm ON tm.product_id = p.id
        WHERE p.deleted_at IS NULL
      `;

        params.push(...keywords);
      } else {
        for (const keyword of keywords) {
          query += ` AND p.title LIKE ?`;
          params.push(`%${keyword}%`);
        }
      }
    }

    if (cursor && cursorId) {
      query += ` ${QUERY.CURSOR_QUERY}`;
      params.push(cursor, cursor, cursorId);
    }

    if (orderby === "accuracy") {
      if (searchType === "tag") {
        query += ` ORDER BY tm.tag_score DESC, p.created_at DESC, p.id DESC ${QUERY.LIMIT_QUERY}`;
      } else {
        const keywords = value.trim().split(" ").filter(Boolean);
        const scoreExpr = keywords.map(() => `(p.title LIKE ?)`).join(" + ");
        query += ` ORDER BY (${scoreExpr}) DESC, p.created_at DESC, p.id DESC ${QUERY.LIMIT_QUERY}`;
        params.push(...keywords.map((k) => `%${k}%`));
      }
    } else {
      query += ` ${ORDER_BY_QUERY[orderby]} ${QUERY.LIMIT_QUERY}`;
    }

    params.push(limit);

    const rows = await execute(query, params);

    return {
      products: rows,
      nextCursor: rows.length
        ? { cursor: rows[rows.length - 1].createdAt, cursorId: rows[rows.length - 1].productId }
        : null,
    };
  }

  async editProduct(productId, setClause, values, connection) {
    const query = `UPDATE products SET ${setClause} WHERE id = ?;`;

    const [rows] = await connection.query(query, [...values, productId]);

    return rows || null;
  }

  async deleteProduct(productId) {
    const query = "UPDATE products SET deleted_at = now() WHERE id = ?;";

    const rows = await execute(query, [productId]);

    return rows || null;
  }

  async editProductStatus(productId, status) {
    const query = "UPDATE products SET sale_status = ? WHERE id = ?;";

    const rows = await execute(query, [status, productId]);

    return rows || null;
  }

  async increaseViewCount(productId) {
    const query = "UPDATE products SET view_cnt = view_cnt + 1 WHERE id = ?;";

    const rows = await execute(query, [productId]);

    return rows || null;
  }
}

module.exports = ProductRepository;
