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
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
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
exports.fetchAllArticles = () => {
  let queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id  
  GROUP BY articles.article_id
  ORDER BY created_at DESC`;
  return db.query(queryStr).then((body) => {
    return body.rows;
  });
};
exports.fetchCommentsByArticleId = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows.length) {
        return [];
      }
      return rows;
    });
};
exports.postCommentsByArticleIdmodel = (id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
VALUES ($1, $2, $3)
RETURNING *`,
      [body, username, id]
    )
    .then(({ rows }) => {
      
      return rows[0];
    });
};
