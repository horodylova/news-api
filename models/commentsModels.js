const db = require("../db/connection");

function selectComments(article_id) {
  return db.query(
    `SELECT 
      comments.comment_id,
      comments.votes,
      comments.created_at,
      comments.author,
      comments.body,
      comments.article_id
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;`,
    [article_id]
  ).then((result) => {
    // if (result.rows.length === 0) {
    //   return Promise.reject({ status: 404, msg: 'Not Found' });
    // }
    return result.rows;
  });
}

module.exports = { selectComments };
