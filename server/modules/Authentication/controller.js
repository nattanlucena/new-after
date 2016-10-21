/**
 * Created by nattanlucena on 20/10/16.
 */

var passport = require('passport');
var token = require('./token.controller');
var User = require('../User/model');
var ErrorHandler = require('../Utils/ErrorHandler');

/**
 * Signin with email after passport authentication.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 *
 * @returns {Object} the new created JWT token
 */
var signin = function (req, res, next) {
    "use strict";
    passport.authenticate('local', function (err, user, info) {
       var error = err || info;
        if (error) {
            return res.status(401).send(err);
        }
        user.password = undefined;
        user.salt = undefined;

        token.createToken(user, function (res, err, token) {
            if (err) {
                return res.status(400).send(err);
            }

            user.token = token;
            user.update({token: token}, function (err, count) {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(201).json({token: token});
            });
        }.bind(null, res));

    })(req, res, next);
};

/**
 * Signout user and expire token.
 *
 * @param {Object} req
 * @param {Object} res
 */
var signout = function (req, res) {
    "use strict";
    token.expireToken(req.headers, function (err, success) {
        if (error) {
            return res.status(401).send(err);
        }

        if (success) {
            delete req.user;
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    });

};

/**
 * Create new user and login user in.
 *
 * @param {Object} req
 * @param {Object} res
 */
var signup = function (req, res) {
    "use strict";

    var email = req.body.email;
    var password = req.body.password;

    if (email == '' || password == '') {
        return res.sendStatus(400);
    }

    var user = new User(req.body);
    user.provider = 'local';
    user.save(function(err, user) {
        if (err) {
            return res.status(400).send(ErrorHandler.getErrorMessage(err));
        } else {
            token.createToken(user, function (res, err, token) {

                if (err) {
                    return res.status(400).send(err);
                }
                user.token = token;
                user.update({token: token}, function (err, count) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.status(201).json({token: token});
                });

            }.bind(null, res));
        }
    });

};

/**
 * Verify if the user is authenticated
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
function isAuthenticated(req, res, next) {
    token.verifyToken(req.headers, function (next, err, data) {
        if (err) {
            return res.status(400).send(err);
        }
        req.user = data;

        next()
    }.bind(null, next));
};

module.exports = {
    signin: signin,
    signout: signout,
    signup: signup,
    isAuthenticated: isAuthenticated
};