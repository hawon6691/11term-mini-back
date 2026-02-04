"use strict";

class SearchController {
  constructor(searchService) {
    this.searchService = searchService;
  }

  getPopularKeywords = async (req, res, next) => {
    try {
      const keywords = await this.searchService.getPopularKeywords();

      return res.status(200).json({
        data: keywords,
      });
    } catch (error) {
      next(error);
    }
  };

  saveSearchLog = async (req, res, next) => {
    try {
      const { keyword } = req.body;
      const userId = req.user?.id || null;

      await this.searchService.saveSearchLog(keyword, userId);

      return res.status(201).json({
        message: "검색 로그가 저장되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = SearchController;
