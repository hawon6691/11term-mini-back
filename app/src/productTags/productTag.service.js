"use strict";

class ProductTagService {
  constructor(productTagRepository) {
    this.productTagRepository = productTagRepository;
  }

  async create(productId, tags, connection) {
    return await this.productTagRepository.create(productId, tags, connection);
  }

  async findProductTags(productId) {
    return await this.productTagRepository.findProductTags(productId);
  }

  async deleteProductTags(productId, connection) {
    return await this.productTagRepository.deleteProductTags(productId, connection);
  }
}

module.exports = ProductTagService;
