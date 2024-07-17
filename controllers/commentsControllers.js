const { selectComments } = require("../models/commentsModels");
const checkArticleExists = require("../models/checkArticleExists");

function getComments(request, response, next) {
  const { article_id } = request.params;
 checkArticleExists(article_id)
 .then((articleExists) => {
    if(!articleExists) {
        return Promise.reject({status:404, msg: "Not Found"})
    }
    return selectComments(article_id)
 })
 .then((comments) => {
    response.status(200).send({comments})
 }).catch((error) => {
    next(error)
 })
}

module.exports = { getComments };
