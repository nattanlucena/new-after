/**
 * Created by nattanlucena on 19/07/16.
 */

/**
 * User mongodb schema
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var MAX_LOGIN_ATTEMPTS = 5;
var LOCK_TIME = 2 * 60 * 60 * 1000;


//###################
var userSchema = new Schema({
        name: String,
        email: {type: String, required: true, index: { unique: true } },
        password: {type: String, required: true},
        //store how many consecutive failures
        loginAttempts: { type: Number, required: true, default: 0 },
        //store a timestamp indicating when we may stop ignoring login attempts.
        lockUntil: { type: Number }
    },
    {collection: 'user'});


//Define a trigger for user password pre save
userSchema.pre('save', function (next) {
   var _this = this;

    if(!_this.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        "use strict";
        bcrypt.hash(_this.password, salt, function (err, hash) {
           if (err) {
               return next();
           }
            _this.password = hash;
            next();
        });
    });
});

//Define a static comparePassword method for User Schema
userSchema.methods.comparePassword = function (plainText, userPassword, callback) {
  bcrypt.compare(plainText, userPassword, function (err, data) {
      if (err) {
          callback(err);
      } else {
          callback(null, data);
      }
  });
};


/*
//http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose

 userSchema.virtual('isLocked').get(function () {
 return !!(this.lockUntil && this.lockUntil > Date.now());
 });


userSchema.methods.incLoginAttempts = function (callback) {
    "use strict";

    // if we have a previous lock that has expired, restart at 1
    if(this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: {loginAttempts: 1},
            $unset: {lockUntil: 1}
        }, callback);
    }

    var updates = {$inc: {loginAttempts: 1}};

    if( this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = {lockUntil: Date.now() + LOCK_TIME};
    }

    return this.update(updates, callback);
};

var reasons = userSchema.statics.failedLogin = {
    NOT_FOUNT: 0,
    PASSWORD_INCORRECT: 1,
    MAX_ATTEMPS: 2
};

//http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
userSchema.statics.getAuthenticated = function (email, password, callback) {

    this.findOne({email: email}, function (err, data) {
        if (err) {
            return callback(err);
        }

        // make sure the user exists
        if (!data){
           return callback(null, null, reasons.NOT_FOUNT);
        }
        // check if the account is currently locked
        if (data.isLocked) {
            // just increment login attempts if account is already locked
            return data.incLoginAttempts(function (err) {
                if (err) {
                    callback(err);
                }
                return callback(null, null, reasons.MAX_ATTEMPS);
            });
        }

        // test for a matching password
        data.comparePassword(password, function (err, isMatch) {
            if (err){
                return callback(err);
            }

            // check if the password was a match
            if (isMatch) {
                if (!user.loginAttempts && !user.lockUntil) {
                    return callback(null, data);
                }

                // reset attempts and lock info
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function(err) {
                    if (err) return cb(err);
                    return cb(null, user);
                });
            }
            // password is incorrect, so increment login attempts before responding
            user.incLoginAttempts(function (err) {
                if (err) {
                    callback(err);
                }
                return callback(null, null, reasons.PASSWORD_INCORRECT);
                
            });
        });
    });
};

*/
module.exports = userSchema;