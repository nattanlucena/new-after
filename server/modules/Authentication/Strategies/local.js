/**
 * Created by nattanlucena on 20/10/16.
 */
'use strict';

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/**
 * Authentication local strategy module.
 *
 * @param User
 * @param config
 */
function localStrategy(User, config) {
    passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, callback) {
        User.findOne({ email: email }, function (err, user) {
            if (err) return callback(err);

            if (!user) {
                return callback(null, false, { message: 'The email is not registered.' });
            }
            user.comparePassword(password, function (err, data) {
                if (err) return callback(err);

                //fail
                if (!data) {
                    return callback(null, false, { message: 'The password is not correct.' });
                }
                //success
                return callback(null, user);
            });
        });
    }
    ));
}

module.exports = localStrategy;
