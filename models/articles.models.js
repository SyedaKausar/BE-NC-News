const db = require("../db/connection.js");
exports.fetchArticle = (id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [id])
    .then(({ rows }) => {
      if (!rows.length) {
        console.log("hello");
        return Promise.reject({ status: 404, msg: "not found" });
      }
      //console.log(rows[0]);
      return rows[0];
    });
};
