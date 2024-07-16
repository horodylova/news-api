const db = require("../db/connection")


function selectAllArticles (sort_by = "created_at") {

    let queryStr = `SELECT 
    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url,
    articles.topic,

    COUNT(comments.body) 

    AS comment_count
    FROM articles

    LEFT JOIN comments 
    ON articles.article_id = comments.article_id

    GROUP BY 

    articles.author, 
    articles.title, 
    articles.article_id, 
    articles.created_at, 
    articles.votes, 
    articles.article_img_url, 
    articles.topic

    ORDER BY ${sort_by} 
    `;

    if(sort_by === "created_at") {
      queryStr += `DESC`;
    }

    return db.query(queryStr)
    .then((result) => {
       
        return result.rows
    })
}


const fetchArticleById = (article_id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
        
          return Promise.reject({ status: 404, msg: 'Not Found' });
        }
        return rows[0];
      });
  };

module.exports = {selectAllArticles, fetchArticleById}; 