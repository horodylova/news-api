const { selectAllArticles, fetchArticleById } = require('../models/articlesModels')


function getAllArticles(request, response, next) {
    selectAllArticles()
    .then((articles) => {
        response.status(200)
        .send({articles})
    }).catch((error) => {
        next(error)
    })
}

function getArticleById (request, response, next) {
    const {article_id} = request.params
    fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    }).catch((error)=> {
        next(error)
    })
}

module.exports = { getAllArticles , getArticleById}; 