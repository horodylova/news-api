const {selectTopics} = require("../models/topicsModels");

function getTopics (request, response, next) {
    selectTopics()
    .then((topics) => {
        response.status(200)
        .send({topics})
    }).catch((error) => {
        next(error)
    })
}

module.exports = { getTopics }