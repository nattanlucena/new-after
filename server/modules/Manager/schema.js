/**
 * Created by nattanlucena on 19/07/16.
 */
//https://github.com/martinmicunda/ionic-photo-gallery/tree/master/server/src
/**
 * Motel mongodb schema
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var VE = require('../Utils/ValidateEmail');

var authTypes = ['facebook', 'google'];

//###################
var managerSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        sex: {
            type: String,
            required: true
        },
        phone: String,
        email: {
            type: String,
            required: true,
            index: { unique: true },
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: true
        },
        createdAt: { type: Date, default: Date.now },
        motels: [{ type: Schema.Types.ObjectId, ref: 'Motel'}]
    },
    {collection: 'manager'});

/**
 * Valida se a senha está em branco
 */
managerSchema.path('password').validate(function(password) {

    //Valida caso o cadastro seja pelo Facebook ou Gmail
    if (authTypes.indexOf(this.provider) !== -1) return true;

    return password.length;
}, 'Password cannot be blank');


/**
 * Define a trigger for Manager password pre save
 */
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

/**
 * Valida se o email já está cadastrado no banco para criar um novo usuário ou para a função
 * de alteração de email
 */
managerSchema.path('email').validate(function (value, done) {
    var self = this;

    if(!self.isModified('email')) {
        return done();
    }

    this.model('Manager').count({ email: value }, function(err, count) {
        if (err) {
            return done(err);
        }
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
},'The specified email address is already in use.');


/**
 * Define a static comparePassword method for Manager Schema
 * @param {String} plainText - The manager password
 * @param {Function} callback - Callback function
 *
 * @returns {Function} callback function `callback(null, true) if password matched`
 */
managerSchema.methods.comparePassword = function (plainText, callback) {
    var self = this;
    bcrypt.compare(plainText, self.password, function (err, data) {
        callback(err, data);
    });
};

module.exports = managerSchema;