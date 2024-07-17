const { getAllArticles } = require('./articlesControllers');
const { getTopics } = require('./topicsControllers');
const { getArticleById } = require("./articlesControllers")
const { getComments } = require("./commentsControllers")
const {postComment } = require('./commentsControllers')
const { patchArticle } = require("./articlesControllers")
const {deleteComment} = require("./commentsControllers")
const { getUsers } = require("./usersControllers")

module.exports = {
  getAllArticles,
  getTopics, 
  getArticleById,
  getComments, 
  postComment,
  patchArticle,
  deleteComment, 
  getUsers
};