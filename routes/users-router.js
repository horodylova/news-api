const express = require('express');
const {getUsers, getTheUser} = require("../controllers")

const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getTheUser);

module.exports = router;