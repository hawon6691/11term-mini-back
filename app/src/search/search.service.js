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

    let currentRank = 1;
    let prevCount = null;

    return keywords.map((item, index) => {
      if (prevCount !== null && item.search_count !== prevCount) {
        currentRank = index + 1;
      }

      prevCount = item.search_count;

      return {
        rank: currentRank,
        keyword: item.keyword,
        searchCount: item.search_count,
      };
    });
  }
}

module.exports = SearchService;
