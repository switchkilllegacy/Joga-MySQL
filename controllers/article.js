const ArticleDBModel = require('../models/article');
const articleModel = new ArticleDBModel();

class arcileController {
  constructor() {
    const articles = [];
  }

  async getAllArticles(req, res) {
    try {
      const articles = await articleModel.findAll();
      return res.status(201).json({ articles });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getArticleBySlug(req, res) {
    try {
      const article = await articleModel.findOne(req.params.slug);
      return res.status(201).json({ article });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async createNewArticle(req, res) {
    try {
      const newArticle = {
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.image,
        body: req.body.body,
        published: new Date().toISOString().slice(0, 19).replace('T', ' '),
        author_id: req.body.author_id,
      };
      const articleId = await articleModel.create(newArticle);

      return res.status(201).json({
        message: `created article with id ${articleId}`,
        article: { id: articleId, ...newArticle },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async updateArticle(req, res) {
    try {
      const articleId = req.params.id;
      const existingArticle = await articleModel.findById(articleId);
      if (!existingArticle) {
        return res.status(404).json({ error: 'Article not found' });
      }

      const fields = [
        'name',
        'slug',
        'image',
        'body',
        'published',
        'author_id',
      ];
      const updates = Object.fromEntries(
        fields
          .filter((field) => req.body[field] !== undefined)
          .map((field) => [field, req.body[field]]),
      );
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No article fields provided' });
      }

      await articleModel.update(articleId, updates);
      return res.status(200).json({
        message: `updated article with id ${articleId}`,
        article: { ...existingArticle, ...updates },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = arcileController;
