const express = require("express");
const {
  handleCustomErrors,
  handlePSQLerrors,
  handleInternalServerErrors,
} = require("./controllers/errors.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticle,
  patchArticleById,
  getAllArticles,
} = require("./controllers/articles.controllers.js");
const { getUsers } = require("./controllers/users.controllers");
const {
  getCommentsByArticleId,
} = require("./controllers/articles.controllers");
const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);
app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use(handlePSQLerrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
