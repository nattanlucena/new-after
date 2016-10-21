/**
 * Created by nattanlucena on 20/10/16.
 */
//TODO: integrar com o redis

var jwt = require('jsonwebtoken');
var config = require('../../config/config');
var user = require('../User/model');


/**
 * Extract the token from the header Authorization.
 *
 * @method extractTokenFromHeader
 * @param {Object} headers The request headers
 * @returns {String} the token
 * @private
 */
function extractTokenFromHeader(headers) {
    "use strict";
    if (headers == null) throw new Error('Header is null');
    if (headers.authorization == null) throw new Error('Authorization header is null');
    if (!headers.hasOwnProperty('authorization')) throw new Error('Authorization header is undefined');

    var authorization = headers.authorization;
    var authArr = authorization.split(' ');

    if (authArr.length !== 2) throw new Error('Authorization header value is not of length 2');

    //get token
    var token = authArr[1];

    //verify token
    try {
        jwt.verify(token, config.token.secret);
    }catch (err) {
        throw new Error(err);
    }
    return token;
}


/**
 * Create a new JWT token
 *
 * @method createToken
 * @param {Object}   payload An additional information that we can pass with token e.g. {user: 2, admin: true}
 * @param {Function} cb      Callback function
 * @returns {Function} callback function `callback(null, token)` if successfully created
 */
function createToken(payload, callback) {
    "use strict";
    var ttl = config.token.expiration;

    //verify payload
    if (payload !== null && typeof payload !== 'object') {
        return callback(new Error('Payload is not an object'));
    }

    //verify TTL
    if (ttl !== null && typeof ttl !== 'number') {
        return callback(new Error('TTL is not a valid number'));
    }

    //create a new toke
    var token = jwt.sign(payload, config.token.secret, { expiresIn: config.token.expiration });

    callback(null, token);
}

/**
 * Expires a token
 *
 * @method expireToken
 * @param {Object}   headers The request headers
 * @param {Function} cb      Callback function
 * @returns {Function} callback function `callback(null, true)` if successfully deleted
 */
function expireToken(headers, callback) {
    "use strict";
    try {
        var token = extractTokenFromHeader(headers);

        if (token === null) {
            return callback(new Error('Token is null'));
        }
        user.update({token: undefined}, function (err, count) {
            if (err) return callback(new Error(err));

            return callback(null, true);
        });


    } catch(err) {
        return callback(new Error(err));
    }
}

/**
 * Verify if token is valid.
 *
 * @method verifyToken
 * @param {Object}   headers The request headers
 * @param {Function} cb      Callback function
 * @returns {Function} callback function `callback(null, JSON.parse(userData))` if token exist
 */
function verifyToken(headers, callback) {
    "use strict";
    try {
        var token = extractTokenFromHeader(headers);
        if (token === null) {
            return callback(new Error('Token is null'));
        }

        user.findOne({token: token}, {token: 0, password: 0},function (err, data) {
            if (err) {
                return callback(err);
            }
            console.log(data);
            if (!data) {
                if(!data) {return cb(new Error('Token not found'));};
            }

            return callback(null, data);
        });

    } catch (err) {
        return callback(err);
    }
}

module.exports = {
    createToken: createToken,
    expireToken: expireToken,
    verifyToken: verifyToken
};