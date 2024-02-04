const express = require("express");
const authControllers = require("../controllers/authenticationController");
const routes = express.Router();

routes.post("/login", authControllers.login);
routes.post("/signup", authControllers.signup);
routes.post("/find-existing-user", authControllers.findUserByEmail);
routes.post("/verify-token", authControllers.verifyToken);

module.exports = routes;
