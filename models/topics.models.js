const db = require("../db/connection.js");
exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};
exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return rows[0];
    });
};
