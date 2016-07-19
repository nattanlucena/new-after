/**
 * Created by nattanlucena on 19/07/16.
 */

var UserController = require('../modules/User/controller');

// =========================================================================
// USER CONTROLLER =========================================================
// =========================================================================
var createUser = function (req, res) {
  UserController.create(req.body, res);
};

var loginUser = function (req, res) {
  UserController.login(req.body, res);
};

var removeUser = function (req, res) {
    UserController.remove(req.query, res);
};

var findUserByEmail = function (req, res) {
    UserController.findByEmail(req.query, res);
};

module.exports = {
    createUser : createUser,
    loginUser: loginUser,
    removeUser: removeUser,
    findUserByEmail: findUserByEmail
};
