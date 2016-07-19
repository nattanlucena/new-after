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


//###################
var userSchema = new Schema({
        name: {type: String, required: true, index: { unique: true } },
        email: {type: String, required: true},
        password: {type: String, required: true}
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
userSchema.methods.comparePassword = function (plainText, callback) {
  bcrypt.compare(plainText, this.password, function (err, data) {
      if (err) {
          return callback(err);
      }
      callback(null, data);
  })
};

module.exports = userSchema;