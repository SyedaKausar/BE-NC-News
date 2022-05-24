const db = require("../db/connection.js");
const fs = require("fs/promises");

exports.fetchArticle = (id) => {
  const queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id`;
  return db.query(queryStr, [id]).then(({ rows }) => {
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
exports.fetchAllArticles = (sort_by = "created_at", order = "DESC", topic) => {
  return db
    .query(`SELECT slug FROM topics GROUP BY slug`)
    .then((result) => {
      const topicArray = result.rows.map(function (element) {
        return element.slug;
      });

      const validSortBy = [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
      ];

      let queryStr = `SELECT articles.*, COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id  
      
     `;
      if (topic) {
        if (topicArray.includes(topic)) {
          queryStr += ` WHERE articles.topic = '${topic}'`;
        } else {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      }
      // } else {
      //   queryStr += ` GROUP BY articles.article_id`;
      // }
      let orderStr = "DESC";
      if (order === "asc") {
        orderStr = "ASC";
      }
      queryStr += ` GROUP BY articles.article_id`;

      if (sort_by) {
        if (validSortBy.includes(sort_by)) {
          queryStr += ` ORDER BY ${sort_by} ${orderStr}`;
        } else {
          return Promise.reject({ status: 400, msg: "bad request" });
        }
      }

      return db.query(queryStr);
    })
    .then((body) => {
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
exports.removeCommentById = (id) => {
  return db
    .query(`SELECT comment_id FROM comments`)
    .then((result) => {
      let queryStr = "DELETE FROM comments WHERE comment_id = $1";
      const idArray = result.rows.map(function (element) {
        return element.comment_id;
      });

      if (idArray.includes(id)) {
        return Promise.reject({ status: 404, msg: "not found" });
      }

      return db.query(queryStr, [id]);
    })
    .then((result) => {
      return result.rows[0];
    });
};
exports.fetchAPIs = () => {
  return fs.readFile("./endpoints.json", "utf-8").then((endpoints) => {
    const apiEndpoints = JSON.parse(endpoints);
    return apiEndpoints;
  });
};
