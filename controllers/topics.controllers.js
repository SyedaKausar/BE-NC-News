const { fetchTopics, fetchArticle } = require("../models/topics.models");

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
exports.getArticle = (req, res) => {
  const id = parseInt(req.params.article_id);
 
  fetchArticle(id).then((article) => {
    res.status(200).send({ article });
  });
};
