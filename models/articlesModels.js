const db = require("../db/connection")


function selectAllArticles () {
    return db.query(`SELECT * FROM articles`)
    .then((result) => {
        return result.rows
    })
}

function fetchArticleById (article_id) {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        // if(rows.length === 0) {
        //     return Promise.reject({status:404, msg: 'Article does not exist'})
        // }
        return rows[0]
    })
}

module.exports = {selectAllArticles, fetchArticleById}; 