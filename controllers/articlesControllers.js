const { selectAllArticles, fetchArticleById , updateArticleVotes } = require('../models/articlesModels')


function getAllArticles(request, response, next) {

    
    const {sort_by} = request.query

    const validQueries = ['author', 'title', 'article_id', 'topic', 'created_at', 'votes', 'article_img_url', 'comment_count']

    const sortBy = sort_by || 'created_at';

    if (!validQueries.includes(sortBy)) {
        return next({ status: 400, msg: "Invalid Query" });
    }
    
    selectAllArticles(sort_by)
    .then((articles) => {

        response.status(200)
        .send({articles})
        
    }).catch((error) => {
        next(error)
    })
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
     return response.status(400).send({ msg: 'Bad Request' });

    }
}

function patchArticle(req, res, next) {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
  
    updateArticleVotes(article_id, inc_votes)
      .then((updatedArticle) => {
        if (!updatedArticle) {
          return res.status(404).send({ msg: 'Not Found' });
        }
        res.status(200).send({ article: updatedArticle });
      })
      .catch((error) => {
        next(error);
      });
  }

module.exports = { getAllArticles , getArticleById, patchArticle}; 