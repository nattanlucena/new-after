/**
 * Created by nattanlucena on 19/07/16.
 */

var Manager = require('./model');

/**
 * Verify if a manager already exists. Case false, create a new manager. Case true, return
 *  a message in callback
 *
 * @param {Object} req
 * @param {Function} res - Callback : res(err, data)
 */
var create = function (req, res) {
    "use strict";
    Manager.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'Manager already created!'
            };
            res(message);
        } else {
            Manager(req).save(function (err, data) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        var message = {
                            message: 'Verify required fields!'
                        };
                        res(message);
                    }
                    var err = new Error(err);
                    throw err;
                }
                //User successfully created
                var message = {
                    message: 'The manager was created successfully!'
                };
                res(message);
            });
        }
    });
};

module.exports = {
    create: create
};