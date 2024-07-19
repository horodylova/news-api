const express = require("express")
const {getAllArticles, getArticleById, patchArticle, getComments, postComment} = require("../controllers")
const router = express.Router()

router
.get('/', getAllArticles)
.get('/:article_id', getArticleById)
.get('/:article_id/comments', getComments)
.patch('/:article_id', patchArticle)
.post('/:article_id/comments', postComment)

module.exports = router;