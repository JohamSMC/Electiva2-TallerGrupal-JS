const path = require("path");
const express = require("express");
const fs = require("fs");
const router = express.Router();

const rootDir = require("../util/path");
let users = require("../data/users.json");

// /users => GET
router.get("/users", (req, res, next) => {
  res.render("users", {
    pageTitle: "Eliminar Usuario",
    users: users,
    resultDeleteUser: null,
  });
});

// /users => GET
router.get("/delete-user", (req, res, next) => {
  res.render("userDelete", {
    pageTitle: "Usuarios",
    users: users,
    resultDeleteUser: null,
  });
});

// /delete-user => POST
router.post("/delete-user", (req, res, next) => {
  users = fs.readFileSync(path.join(rootDir, "data", "users.json"));
  users = JSON.parse(users);
  let resultDeleteUser = null;

  const currentUser = users.find((user) => user.IdNumber === req.body.userList);

  if (currentUser && !currentUser.hasBooksLoan) {
    let pos = users.indexOf(currentUser);
    users.splice(pos, 1);
    //* Eliminar el usuario de data users.json
    const dataUsers = JSON.stringify(users);
    fs.writeFileSync(path.join(rootDir, "data", "users.json"), dataUsers);
    resultDeleteUser = "successful";
  } else {
    resultDeleteUser = "incorrect";
  }

  res.render("userDelete", {
    pageTitle: "Eliminar Usuario",
    users: users,
    resultDeleteUser: resultDeleteUser,
  });
});

exports.routes = router;
