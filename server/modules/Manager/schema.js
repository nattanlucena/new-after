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
var SALT_WORK_FACTOR = 10;


var MotelSchema = require('../Motel/schema');

//###################
//TODO: finalizar schema do motel
var managerSchema = new Schema({
        name: {
            first: {type: String, required: true},
            last: {type: String, required: false}
        },
        sex: {type: String, required: true},
        phone: String,
        email: {type: String, required: true, index: { unique: true } },
        password: {type: String, required: true, select: false },
        motels: [{
            motel: { type: Schema.Types.ObjectId, ref: 'Motel'}
        }]
    },
    {collection: 'manager'});


//Define a trigger for Manager password pre save
managerSchema.pre('save', function (next) {
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

//Define a static comparePassword method for Manager Schema
managerSchema.methods.comparePassword = function (plainText, userPassword, callback) {
    bcrypt.compare(plainText, userPassword, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

module.exports = managerSchema;