"use strict";

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

  async saveProductImage(images, connection) {
    const query = "INSERT INTO product_images(product_id, image_url, is_thumbnail) VALUES ?;";

    const values = images.map((img, index) => [img.productId, img.imageUrl, index === 0]);

    const [rows] = await connection.query(query, [values]);

    return rows || null;
  }
}

module.exports = ProductRepository;
