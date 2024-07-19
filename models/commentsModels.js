const { response } = require("../app");
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

function deleteCommentModel (comment_id) {
  return db
  .query(
    `DELETE FROM comments WHERE comment_id = $1`, [comment_id]
  )
  .then(({rows}) => {
    return rows[0];
  })
}
function updateTheVotesModel (comment_id, inc_votes) {
  
  let queryStr = `UPDATE comments 
  SET votes = votes+ $2
  WHERE comment_id = $1 
  RETURNING *;`
  
  return db
  .query(queryStr, [comment_id, inc_votes])
  .then(({rows}) => {
    return rows;
  })
}


module.exports = { selectComments, postCommentModel, deleteCommentModel, updateTheVotesModel };

