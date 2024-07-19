const express = require("express")
const {deleteComment, updateTheVotes} = require("../controllers")
const router = express.Router()


router
.delete('/:comment_id', deleteComment)
.patch("/:comment_id", updateTheVotes)


module.exports = router;
