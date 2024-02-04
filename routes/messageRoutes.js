const express = require("express");
const messageControllers = require("../controllers/messageController");

const auth = require("../middlewares/authMiddleware");
const routes = express.Router();

routes.use(auth);
routes.get("/chat/:roomId/:id", messageControllers.getMessageById);
routes.get("/chat/:roomId", messageControllers.getMessages);

routes.post("/chat/:roomId", messageControllers.postMessage);

routes.delete("/chat/:roomId/:id", messageControllers.deleteQuery);

routes.put("/chat/:roomId/:id", messageControllers.updateQuery);

routes.post("/save-post/:id", messageControllers.saveQuery);

routes.delete("/save-post/:id", messageControllers.deleteSavedQuery);

routes.get("/get-save-post/:id", messageControllers.getSavedPosts);

routes.get("/is-post-saved/:id", messageControllers.isQuerySaved);

routes.put("/like-query/:queryId", messageControllers.likeQueryById);

module.exports = routes;
