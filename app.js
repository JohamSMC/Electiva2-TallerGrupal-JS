const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "views");

const books = require("./routes/books");
const users = require("./routes/users");
const loans = require("./routes/loans");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", books.routes);
// app.use("/", users.routes);
// app.use("/", loans.routes);

app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "La pagina NO EXISTE" });
});

app.listen(PORT, () => {
  console.log(
    `La aplicación esta corriendo en la siguiente url\nhttp://localhost:${PORT}\n`
  );
});
