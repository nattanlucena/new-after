/**
 * Created by nattanlucena on 19/07/16.
 */
'user strict';
var User = require('./model');
var B = require('bluebird');


/**
 * Verify if an user already exists. Case false, create a new user. Case true, return
 *  a message in callback
 *
 * @param {String} req.name
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} Callback - res(err, data)
 */
var create = function (req, res) {

    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'User already created!'
            };
            res(message);
        } else {
            User(req).save(function (err, data) {
                if (err) {
                    var err = new Error(err);
                    throw err;
                }
                //User successfully created
                var message = {
                    message: 'The user was successfully created!'
                };
                res(message);
            });
        }

    });

};

module.exports = {
    create : create
};