const { getUsersModel } = require("../models/usersModels.js")

function getUsers(request, response, next) {
    getUsersModel()
      .then((users) => {
        response.status(200).send({ users });
      })
      .catch((error) => {
        next(error);
      });
  }

module.exports = { getUsers }