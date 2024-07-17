const { getAllArticles } = require('./articlesControllers');
const { getTopics } = require('./topicsControllers');
const { getArticleById } = require("./articlesControllers")
const { getComments } = require("./commentsControllers")
const {postComment } = require('./commentsControllers')
 

module.exports = {
  getAllArticles,
  getTopics, 
  getArticleById,
  getComments, 
  postComment
};