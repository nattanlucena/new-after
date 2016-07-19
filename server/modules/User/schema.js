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

module.exports = userSchema;