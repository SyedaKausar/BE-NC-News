const express = require("express");
const { getTopics, getArticle } = require("./controllers/topics.controllers");
const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticle);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.sendStatus(500);
});

module.exports = app;
//article not found - 
//if statement - custom error handling
//400 psql error 