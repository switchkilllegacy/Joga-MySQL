const AuthorDBModel = require('../models/author');
const ArticleDBModel = require('../models/article');

const authorModel = new AuthorDBModel();
const articleModel = new ArticleDBModel();

class AuthorController {
  async getAuthorById(req, res) {
    try {
      const author = await authorModel.findById(req.params.id);
      if (!author) {
        return res.status(404).json({ error: 'Author not found' });
      }

      const articles = await articleModel.findMany('author_id', author.id);
      return res.status(201).json({ author: { ...author, articles } });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthorController;
