const path = require("path");
const express = require("express");
const router = express.Router();

const rootDir = require("../util/path");
let users = require("../data/users.json");

router.get("/users", (req, res, next) => {
  res.render("users", {
    pageTitle: "Usuarios",
    users: users,
  });
});

exports.routes = router;
