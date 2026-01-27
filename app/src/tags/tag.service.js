"use strict";

const CustomError = require("./../utils/customError");

class TagService {
  constructor(tagRepository) {
    this.tagRepository = tagRepository;
  }

  async createOrFindTags(allTags, connection) {
    const existingTags = await this.tagRepository.findTagsByNames(allTags, connection);
    const existingTagsName = existingTags.map((tag) => tag.name);

    const newTags = allTags.filter((tag) => !existingTagsName.includes(tag));

    if (newTags.length > 0) {
      const insertedTags = await this.tagRepository.create(newTags, connection);

      if (!insertedTags || newTags.length !== insertedTags.affectedRows) {
        throw new CustomError("상품 태그 생성 실패");
      }
    }

    const tags = await this.tagRepository.findTagsByNames(allTags, connection);

    if (!tags || tags.length !== allTags.length) {
      throw new CustomError("상품 태그 생성 실패");
    }

    return tags.map((tag) => tag.id);
  }

  async findTagsByIds(tags) {
    return await this.tagRepository.findTagsByIds(tags);
  }

  async findTagsByNames(tags, connection) {
    return await this.tagRepository.findTagsByNames(tags, connection);
  }
}

module.exports = TagService;
