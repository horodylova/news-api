const { selectComments , postCommentModel } = require("../models/commentsModels");
const {checkArticleExists, checkUserExists } = require("../models/checkcategoryExists");

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
function postComment(request, response, next) {
   const { article_id } = request.params;
   const { body, author } = request.body;
 
   checkArticleExists(article_id)
     .then((articleExists) => {
       if (!articleExists) {
         return Promise.reject({ status: 404, msg: 'Not Found' });
       }
       return checkUserExists(author); 
     })
     .then((userExists) => {
       if (!userExists) {
         return Promise.reject({ status: 403, msg: "The client doesn't have permission to perform the action." });
       }
       return postCommentModel(body, author, article_id);
     })
     .then((comment) => {
       response.status(201).send({ comment });
     })
     .catch((error) => {
       next(error);
     });
 }

module.exports = { getComments , postComment };
