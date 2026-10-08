const express = require('express');
const router = express.Router();
const ArticleControllerClass = require('../controllers/article');
const AuthorControllerClass = require('../controllers/author');

const articleController = new ArticleControllerClass();
const authorController = new AuthorControllerClass();

router.get('/', (req, res) => articleController.getAllArticles(req, res));
router.get('/article/:slug', (req, res) =>
  articleController.getArticleBySlug(req, res),
);
router.get('/author/:id', (req, res) =>
  authorController.getAuthorById(req, res),
);

module.exports = router;
