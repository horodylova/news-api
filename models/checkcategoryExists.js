const db = require("../db/connection")

function checkArticleExists(article_id) {
return db 
.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
.then(({rows}) => {
    return rows.length > 0;
})
}

function checkUserExists(author) {
    return db
    .query(`SELECT * FROM users WHERE username = $1`, [author])
    .then(({rows}) => {
        return rows.length > 0;
    })
}

function checkCommentExists(comment_id) {
    return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({rows}) => {
        return rows.length > 0;
    })
}

function checkTopicExists (slug) {
    return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({rows}) => {
        return rows.length > 0;
    })
}

function checkAuthorExists(author) {
    return db.query(`SELECT * FROM users WHERE username = $1`, [author])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: 'Not Found' });
        }
      });
  }

module.exports = {checkArticleExists, checkUserExists, checkCommentExists, checkTopicExists, checkAuthorExists};