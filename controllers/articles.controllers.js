const {
  fetchArticle,
  fetchArticleByIdToPatch,
  fetchAllArticles,
  fetchCommentsByArticleId,
  postCommentsByArticleIdmodel,
  removeCommentById,
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
  const { sort_by, order, topic } = req.query;
  fetchAllArticles(sort_by, order, topic)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
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
  const { username, body } = req.body;

  postCommentsByArticleIdmodel(article_id, username, body)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
exports.deleteCommentById = (req, res, next) => {
  const { article_id } = req.params;

  removeCommentById(article_id).then((comment) => {
    res.status(204).send({ comment });
  });
};
