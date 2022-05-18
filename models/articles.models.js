const db = require("../db/connection.js");
exports.fetchArticle = (id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [id]
    )
    .then(({ rows }) => {
      console.log(rows[0]);
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
  /* SELECT articles.*, COUNT(article_id) 
       FROM articles ON articles.article_id
       LEFT JOIN articles.article_id = comments.article_id
       WHERE article_id = $1
       GROUP BY articles.article_id

   
    */
};
exports.fetchArticleByIdToPatch = (id, incrementVotes) => {
  if (!incrementVotes) {
    return Promise.reject({
      status: 400,
      msg: "bad request, required fields missing",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = $2 + votes  WHERE article_id =$1 RETURNING *",
      [id, incrementVotes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};
