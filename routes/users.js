const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();
const books = require('../routes/books')

router.get('/users', (req, res, next) => {
  const users = books.books;
  res.render('users', {
    pageTitle: 'Usuarios',
  });
});

module.exports = router;
