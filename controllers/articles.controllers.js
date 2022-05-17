const { fetchArticle } = require("./topics.controllers");
exports.getArticle = (req, res) => {
//   const id = parseInt(req.params.article_id);
const {article_id} = req.params
  fetchArticle(article_id).then((article) => {
    res.status(200).send({ article });
  });
};

