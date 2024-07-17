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
   
    return result.rows;
  });
}

function postCommentModel(body, author, article_id ) {
  
  return db
  .query(`INSERT INTO comments 
  (body, author, article_id, created_at, votes) 
  VALUES ($1, $2, $3, NOW(), 0) 
  RETURNING *`, 
   [body, author, article_id]
   )
  .then((result) => {
  
    return result.rows[0]; 
  }).catch((error) => {
    next(error)
  });
}

module.exports = { selectComments, postCommentModel };

