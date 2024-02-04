const express = require("express");
const commentControllers = require("../controllers/commentController");

const auth = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.use(auth);

routes.get(
  "/comment/:roomId/:queryId/:commentId",
  commentControllers.getCommentById
);

routes.get("/comment/:roomId/:queryId", commentControllers.getComments);

routes.post("/comment/:roomId/:queryId", commentControllers.postComment);

routes.delete(
  "/comment/:roomId/:queryId/:commentId",
  commentControllers.deleteCommetById
);

routes.put(
  "/comment/:roomId/:queryId/:commentId",
  commentControllers.updateCommentById
);

routes.put("/like-comment/:commentId", commentControllers.likeCommentById);

module.exports = routes;
