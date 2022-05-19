const {
  fetchArticle,
  fetchArticleByIdToPatch,
  fetchAllArticles,
  fetchCommentsByArticleId,
  postCommentsByArticleIdmodel,
} = require("../models/articles.models");
exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByIdToPatch(article_id, req.body.inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.getAllArticles = (req, res, next) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};
exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.postCommentsByArticleIdcontroller = (req, res, next) => {
  const { article_id } = req.params;

  postCommentsByArticleIdmodel(article_id, req.body.username, req.body.body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
