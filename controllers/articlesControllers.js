const { selectAllArticles, fetchArticleById } = require('../models/articlesModels')


function getAllArticles(request, response, next) {
    selectAllArticles()
    .then((articles) => {
        response.status(200)
        .send({articles})
    }).catch(next)
}

function getArticleById (request, response, next) {
    const {article_id} = request.params;
    if(Number.isInteger) {
        fetchArticleById(article_id)
    .then((article) => {
        response.status(200).send({article})
    }).catch(next)
    }
    else{
     return res.status(400).send({ msg: 'Bad request' });

    }
}

module.exports = { getAllArticles , getArticleById}; 