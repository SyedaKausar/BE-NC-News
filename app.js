const express = require("express");
const {
  handleCustomErrors,
  handlePSQLerrors,
  handleInternalServerErrors,
} = require("./controllers/errors.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticle } = require("./controllers/articles.controllers.js");
const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});
app.use(handlePSQLerrors);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app;
