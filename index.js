// application packages
const express = require('express');
const app = express();

const path = require('path');
// add template engine
const hbs = require('express-handlebars');
// setup template engine directory and files extensions
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine(
  'hbs',
  hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
  }),
);
// setup static public directory
app.use(express.static('public'));

const mysql = require('mysql2');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// create database connection
var con = mysql.createConnection({
  host: 'localhost',
  user: 'dbuser',
  password: 'qwerty',
  database: 'joga_mysql',
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected to Joga_MySQL database');
});

// show all articles - index page
app.get('/', (req, res) => {
  let query = 'SELECT * FROM article';
  let articles = [];
  con.query(query, (err, result) => {
    if (err) throw err;
    articles = result;
    console.log(articles);
    res.render('index', {
      articles: articles,
    });
  });
});

// show article by this slug
app.get('/article/:slug', (req, res) => {
  let query = `SELECT article.*, author.name AS author_name
  FROM article
  INNER JOIN author ON article.author_id = author.id
  WHERE slug =?`;

  con.query(query, [req.params.slug], (err, result) => {
    if (err) throw err;

    // edastame result massiivi otse res.render funktsioonile
    res.render('article', {
      article: result,
    });
  });
});

// show articles by author
app.get('/author/:id', (req, res) => {
  const authorId = req.params.id;

  const authorQuery = 'SELECT * FROM author WHERE id = ?';

  con.query(authorQuery, [authorId], (err, authorResult) => {
    if (err) throw err;

    if (authorResult.length === 0) {
      return res.status(404).send('Author not found');
    }

    const articlesQuery = 'SELECT * FROM article WHERE author_id = ?';

    con.query(articlesQuery, [authorId], (err, articlesResult) => {
      if (err) throw err;

      res.render('index', {
        articles: articlesResult,
        authorName: authorResult[0].name,
      });
    });
  });
});

// app start point
app.listen(3003, () => {
  console.log('App is started at http://localhost:3003');
});
