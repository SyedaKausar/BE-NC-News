const db = require("../db/connection.js");
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
