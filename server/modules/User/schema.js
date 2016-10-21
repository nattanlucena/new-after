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

var authTypes = ['github', 'twitter', 'facebook', 'google'];

//###################
var userSchema = new Schema({
        name: {
            type: String,
            required: true
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
            select: true
        },
        reservations: [{
                type: Schema.Types.ObjectId,
                ref: 'Reservation'
        }],
        token: {
            type: String
        },
        salt: {
            type: String
        },
        provider: {
            type: String,
            required: 'Provider is required'
        },
        updated: {
            type: Date
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {collection: 'user'});

/**
 * Validations
 */

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

//Validate empty email
userSchema.path('email').validate(function(email) {
        // if you are authenticating by any of the oauth strategies, don't validate
        if (authTypes.indexOf(this.provider) !== -1) return true;
        return email.length;
    }, 'Email cannot be blank');

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

//Return an user find by token
userSchema.methods.getUserByToken = function (token, callback) {
    "use strict";
    return this.model('User').find({token: token}, callback);
};

//http://devsmash.com/blog/implementing-max-login-attempts-with-mongoose
module.exports = userSchema;