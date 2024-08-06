const db = require("../db/connection");

function selectAllArticles(sort_by = "created_at", order, topic) {
  let queryStr = `
      SELECT 
          articles.author, 
          articles.title, 
          articles.article_id, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url,
          articles.topic,
          COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
  `;

  const queryParams = [];

  if (topic) {
    queryStr += `WHERE articles.topic = $1 `;
    queryParams.push(topic);
  }

  queryStr += `
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

  if (order === "asc") {
    queryStr += `ASC`;
  } else {
    queryStr += `DESC`;
  }

  return db.query(queryStr, queryParams).then((result) => {
    return result.rows;
  });
}

const fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        articles.topic,
        articles.body, 
        COUNT(comments.body) AS comment_count
      FROM articles
      LEFT JOIN comments 
        ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY 
        articles.author, 
        articles.title, 
        articles.article_id, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url, 
        articles.topic,
        articles.body; 
      `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};


function updateArticleVotes(article_id, inc_votes) {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

function postNewArticleModel(author, title, body, topic, article_img_url) {
  return db.query(
    `INSERT INTO articles 
    (author, title, body, topic, article_img_url, created_at, votes) 
    VALUES ($1, $2, $3, $4, $5, NOW(), 0) 
    RETURNING *`, 
    [author, title, body, topic, article_img_url]
  ).then((result) => {
    return result.rows[0];
  });
}


module.exports = { selectAllArticles, fetchArticleById, updateArticleVotes , postNewArticleModel};
