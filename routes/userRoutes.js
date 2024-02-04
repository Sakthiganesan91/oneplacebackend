const express = require("express");
const userControllers = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.use(auth);
routes.get("/get-user/:id", userControllers.findUserById);

routes.post("/add-room/:id", userControllers.joinRoom);

routes.delete("/leave-room/:id/:roomId", userControllers.leaveRoom);

module.exports = routes;
