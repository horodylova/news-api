const { getAllArticles } = require('./articlesControllers');
const { getTopics } = require('./topicsControllers');
const { getArticleById } = require("./articlesControllers")

module.exports = {
  getAllArticles,
  getTopics, 
  getArticleById
};