const path = require("path");
const express = require("express");
const fs = require("fs");

const rootDir = require("../util/path");
const router = express.Router();
let books = require("../data/books.json");
let users = require("../data/users.json");
let loans = require("../data/loans.json");

// / => GET
router.get(["/", "/index"], (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  // console.log(books);

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

// /loan-book => GET
router.get("/loan-book", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);

  res.render("bookLoans", {
    pageTitle: "Lista Libros",
    books: books,
    users: users,
    resultLoanBook: null,
  });
});

// /loan-book-oldUser => POST
router.post("/loan-book-oldUser", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
  loans = JSON.parse(loans);

  let resultLoanBook;
  console.log("---------------------------------");
  console.log(req.body);
  console.log("---------------------------------");
  console.log("-------------------------- Usuario Antiguo");

  const currentBook = books.find((book) => book.ISBN === req.body.bookList);
  const currentUser = users.find((user) => user.IdNumber === req.body.userList);
  console.log(currentBook);
  console.log(currentUser);
  if (
    currentBook &&
    currentUser &&
    currentBook.amountBorrowed + 1 <= currentBook.quantity
  ) {
    currentBook.amountBorrowed += 1;
    currentUser.hasBooksLoan = true;

    const dataBooks = JSON.stringify(books);
    fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);

    //* Crear nuevo préstamo
    loans.push({
      IdNumber: req.body.userList,
      ISBN: req.body.bookList,
      loanDate: req.body.loanDate,
      returnDate: req.body.returnDate,
      return: false,
    });

    const dataLoans = JSON.stringify(loans);
    //* Escribir en data el nuevo préstamo
    fs.writeFileSync(path.join(rootDir, "data", "loans.json"), dataLoans);
    resultLoanBook = "successful";
  } else {
    resultLoanBook = "incorrect";
  }
  console.log(resultLoanBook);
  res.render("bookLoans", {
    pageTitle: "Lista Libros",
    books: books,
    users: users,
    resultLoanBook: resultLoanBook,
  });
});

// /loan-book-newUser => POST
router.post("/loan-book-newUser", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
  loans = JSON.parse(loans);

  let resultLoanBook;
  console.log("---------------------------------");
  console.log(req.body);
  console.log("---------------------------------");
  console.log("-------------------------- Usuario Nuevo");
  const currentUser = users.find((user) => user.IdNumber === req.body.IdNumber);
  if (!currentUser) {
    const currentBook = books.find((book) => book.ISBN === req.body.bookList);
    console.log(currentBook);
    if (currentBook && currentBook.amountBorrowed + 1 <= currentBook.quantity) {
      currentBook.amountBorrowed += 1;
      const dataBooks = JSON.stringify(books);
      fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);

      //* Crear nuevo Usuario
      users.push({
        IdNumber: req.body.IdNumber,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        hasBooksLoan: true,
      });
      //* Escribir en data el nuevo usuario
      const dataUsers = JSON.stringify(users);
      fs.writeFileSync(path.join(rootDir, "data", "users.json"), dataUsers);

      //* Crear nuevo préstamo
      loans.push({
        IdNumber: req.body.IdNumber,
        ISBN: req.body.bookList,
        loanDate: req.body.loanDate,
        returnDate: req.body.returnDate,
        return: false,
      });
      //* Escribir en data el nuevo préstamo
      const dataLoans = JSON.stringify(loans);
      fs.writeFileSync(path.join(rootDir, "data", "loans.json"), dataLoans);

      resultLoanBook = "successful";
    } else {
      resultLoanBook = "incorrect";
    }
  } else {
    resultLoanBook = "incorrect";
  }

  console.log(resultLoanBook);

  res.render("bookLoans", {
    pageTitle: "Lista Libros",
    books: books,
    users: users,
    resultLoanBook: resultLoanBook,
  });
});

exports.routes = router;
exports.books = books;
