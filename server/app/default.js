/**
 * Created by nattanlucena on 19/07/16.
 */

var UserController = require('../modules/User/controller');

var createUser = function (req, res) {
  UserController.create(req.body, res);
};

module.exports = {
    createUser : createUser
};
