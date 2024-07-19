const express = require("express")
const {deleteComment} = require("../controllers")
const router = express.Router()


router.delete('/:comment_id', deleteComment);

module.exports = router;
