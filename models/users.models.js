const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT users.username FROM users").then((result) => {
    return result.rows;
  });
};
