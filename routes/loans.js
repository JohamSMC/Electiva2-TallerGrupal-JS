const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const rootDir = require("../util/path");
let books = require("../data/books.json");
let users = require("../data/users.json");
let loans = require("../data/loans.json");

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

  const currentBook = books.find((book) => book.ISBN === req.body.bookList);
  const currentUser = users.find((user) => user.IdNumber === req.body.userList);
  if (
    currentBook &&
    currentUser &&
    currentBook.amountBorrowed + 1 <= currentBook.quantity
  ) {
    currentBook.amountBorrowed += 1;
    currentUser.hasBooksLoan = true;

    const dataBooks = JSON.stringify(books);
    fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);

    const dataUsers = JSON.stringify(users);
    fs.writeFileSync(path.join(rootDir, "data", "users.json"), dataUsers);

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
  const currentUser = users.find((user) => user.IdNumber === req.body.IdNumber);
  if (!currentUser) {
    const currentBook = books.find((book) => book.ISBN === req.body.bookList);
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
  res.render("bookLoans", {
    pageTitle: "Lista Libros",
    books: books,
    users: users,
    resultLoanBook: resultLoanBook,
  });
});

// /loansList => GET
router.get("/loansList", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
  loans = JSON.parse(loans);

  loans.forEach((loan) => {
    const currentBook = books.find((book) => book.ISBN === loan.ISBN);
    const currentUser = users.find((user) => user.IdNumber === loan.IdNumber);
    loan.title = currentBook.title;
    loan.name = currentUser.name;
  });

  res.render("loansList", {
    pageTitle: "Lista de Prestamos",
    loans: loans,
  });
});

// /returnBook => GET
router.get("/returnBook", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
  loans = JSON.parse(loans);

  loans.forEach((loan) => {
    const currentBook = books.find((book) => book.ISBN === loan.ISBN);
    const currentUser = users.find((user) => user.IdNumber === loan.IdNumber);
    loan.title = currentBook.title;
    loan.name = currentUser.name;
  });

  books.forEach((book) => {
    if (book.amountBorrowed >= 1) {
      book.hasLoan = true;
    } else {
      book.hasLoan = false;
    }
  });

  res.render("returnBook", {
    pageTitle: "Devolver Libro",
    loans: loans,
    users: users,
    books: books,
    resultReturnBook: null,
  });
});

// /returnBook => POST
router.post("/returnBook", (req, res, next) => {
  books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
  books = JSON.parse(books);
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
  loans = JSON.parse(loans);

  let resultReturnBook;

  loans.forEach((loan) => {
    const currentBook = books.find((book) => book.ISBN === loan.ISBN);
    const currentUser = users.find((user) => user.IdNumber === loan.IdNumber);
    loan.title = currentBook.title;
    loan.name = currentUser.name;
  });

  books.forEach((book) => {
    if (book.amountBorrowed >= 1) {
      book.hasLoan = true;
    } else {
      book.hasLoan = false;
    }
  });
  const currentLoan = loans.find(
    (loan) =>
      loan.ISBN === req.body.bookISBN && loan.IdNumber === req.body.userIdNumber
  );
  if (currentLoan) {
    // Cambiar el atributo return a true del loan
    currentLoan.return = true;
    const dataLoans = JSON.stringify(loans);
    fs.writeFileSync(path.join(rootDir, "data", "loans.json"), dataLoans);
    loans = fs.readFileSync(path.join(rootDir, "data", "loans.json"));
    loans = JSON.parse(loans);
    if (
      !loans.find(
        (loan) =>
          loan.IdNumber === req.body.userIdNumber && loan.return === false
      )
    ) {
      const currentUser = users.find(
        (user) => user.IdNumber === req.body.userIdNumber
      );
      currentUser.hasBooksLoan = false;
      const dataUsers = JSON.stringify(users);
      fs.writeFileSync(path.join(rootDir, "data", "users.json"), dataUsers);
    }
    // Disminuir en uno el número de libros prestado
    const currentBook = books.find((book) => book.ISBN === req.body.bookISBN);
    currentBook.amountBorrowed -= 1;
    const dataBooks = JSON.stringify(books);
    fs.writeFileSync(path.join(rootDir, "data", "books.json"), dataBooks);
    books = fs.readFileSync(path.join(rootDir, "data", "books.json"));
    books = JSON.parse(books);

    resultReturnBook = "successful";
  } else {
    resultReturnBook = "incorrect";
  }

  res.render("returnBook", {
    pageTitle: "Devolver Libro",
    loans: loans,
    users: users,
    books: books,
    resultReturnBook: resultReturnBook,
  });
});

exports.routes = router;
