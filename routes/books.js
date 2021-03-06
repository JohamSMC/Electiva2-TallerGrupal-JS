const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const rootDir = require("../util/path");
let books = require("../data/books.json");
let users = require("../data/users.json");
let loans = require("../data/loans.json");

// / => GET
router.get(["/", "/index"], (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);

  res.render("books", {
    pageTitle: "Lista Libros",
    books: books,
    resultAddBook: null,
  });
});

// /add-book => POST
router.post("/add-book", (req, res, next) => {
  const currentBook = books.find((book) => book.ISBN === req.body.ISBN);
  let resultAddBook;
  if (currentBook) {
    resultAddBook = "incorrect";
  } else {
    books.push({
      ISBN: req.body.ISBN,
      title: req.body.title,
      author: req.body.author,
      quantity: parseInt(req.body.quantity),
      yearPublication: req.body.yearPublication,
      numberPages: parseInt(req.body.numberPages),
    });
    const dataBooks = JSON.stringify(books);
    fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);
    resultAddBook = "successful";
  }
  res.render("books", {
    pageTitle: "Lista Libros",
    books: books,
    resultAddBook: resultAddBook,
  });
});

// /delete-book => POST
router.post("/delete-book", (req, res, next) => {
  const currentBook = books.find((book) => book.ISBN === req.body.ISBN);
  let resultAddBook;
  if (currentBook.amountBorrowed >= 1) {
    resultAddBook = "incorrect";
  } else {
    const pos = books.indexOf(currentBook);
    books.splice(pos,1);
    const dataBooks = JSON.stringify(books);
    fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);
    resultAddBook = "successful";
  }
  res.render("books", {
    pageTitle: "Lista Libros",
    books: books,
    resultAddBook: resultAddBook,
  });
});

exports.routes = router;
