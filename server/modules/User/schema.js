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
        name: {
            first: {type: String, required: true},
            last: {type: String, required: false}
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
            trim: true
        },
        password: {
            type: String,
            required: true,
            select: false
        },
        reservations: [{
                type: Schema.Types.ObjectId,
                ref: 'Reservation'
        }]
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

//Valida se o email já está cadastrado no banco para criar um novo usuário ou para a função
//de alteração de email
userSchema.path('email').validate(function (value, done) {
    var self = this;

    if(!self.isModified('email')) {
        return done();
    }

    this.model('User').count({ email: value }, function(err, count) {
        if (err) {
            return done(err);
        }
        // If `count` is greater than zero, "invalidate"
        done(!count);
    });
},'The specified email address is already in use.');


//Define a static comparePassword method for User Schema
userSchema.methods.comparePassword = function (plainText, callback) {
    var self = this;
    bcrypt.compare(plainText, self.password, function (err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

//http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
module.exports = userSchema;