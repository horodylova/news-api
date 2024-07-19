const db = require("../db/connection")

function getUsersModel() {
    return db.query(`SELECT username, name, avatar_url FROM users`)
      .then((result) => {
        return result.rows;
      });
  }

  function getTheUserModel(username) {
    return db
    .query(`SELECT users.username, users.avatar_url, users.name FROM users WHERE users.username=$1`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows;
    });
  }
  
  module.exports = { getUsersModel , getTheUserModel};