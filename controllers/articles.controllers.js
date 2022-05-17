const { fetchArticle } = require("../models/articles.models");
exports.getArticle = (req, res, next) => {
  //   const id = parseInt(req.params.article_id);
  const { article_id } = req.params;
  fetchArticle(article_id)
    .then((article) => {
      console.log(article);
      res.status(200).send({ article });
    })
    .catch(next);
};
