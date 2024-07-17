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

module.exports = {checkArticleExists, checkUserExists};