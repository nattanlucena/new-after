/**
 * Created by nattanlucena on 19/07/16.
 */

/**
 * Motel mongodb schema
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var MotelSchema = require('../Motel/schema');

//###################
//TODO: finalizar schema do motel
var motelManagerSchema = new Schema({
        firstName: String,
        lastName: String,
        phone: String,
        email: {type: String, required: true, index: { unique: true } },
        password: String,
        motels: [MotelSchema]
    },
    {collection: 'motelmanager'});


//Define a trigger for MotelManager password pre save
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

//Define a static comparePassword method for MotelManager Schema
userSchema.methods.comparePassword = function (plainText, userPassword, callback) {
    bcrypt.compare(plainText, userPassword, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

module.exports = motelManagerSchema;