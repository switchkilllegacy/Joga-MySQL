const ArticleDBModel = require('../models/article');
const articleModel = new ArticleDBModel();

class arcileController {
  constructor() {
    const articles = [];
  }

  async getAllArticles(req, res) {
    const articles = await articleModel.findAll();
    res.status(201).json({ articles: articles });
  }
}

module.exports = arcileController;
