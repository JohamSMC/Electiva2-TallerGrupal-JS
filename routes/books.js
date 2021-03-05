const path = require("path");
const express = require("express");
const fs = require("fs");

const rootDir = require("../util/path");
const router = express.Router();
let books = require("../data/books.json");

// / => GET
router.get("/", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  // console.log(books);

  res.render("books", {
    pageTitle: "Lista Libros",
    books: books,
    resultAddBook : null
  });
});

// /add-book => POST
router.post("/add-book", (req, res, next) => {
  const currentBook = books.find(
    (book) => book.ISBN.toLowerCase() === req.body.ISBN.toLowerCase()
  );
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

exports.routes = router;
exports.books = books;
