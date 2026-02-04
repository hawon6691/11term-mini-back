"use strict";

class SearchService {
  constructor(searchRepository) {
    this.searchRepository = searchRepository;
  }

  async saveSearchLog(keyword, userId = null) {
    if (!keyword || keyword.trim() === "") {
      return;
    }
    await this.searchRepository.saveSearchLog(keyword.trim().toLowerCase(), userId);
  }

  async getPopularKeywords(limit = 10) {
    const keywords = await this.searchRepository.getPopularKeywords(limit);

    return keywords.map((item, index) => ({
      rank: index + 1,
      keyword: item.keyword,
      searchCount: item.search_count,
    }));
  }
}

module.exports = SearchService;
