"use strict";

class ProductTagService {
  constructor(productTagRepository) {
    this.productTagRepository = productTagRepository;
  }

  async create(productId, tags, connection) {
    return await this.productTagRepository.create(productId, tags, connection);
  }
}

module.exports = ProductTagService;
