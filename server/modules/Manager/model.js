/**
 * Created by nattanlucena on 19/07/16.
 */

/**
 * Motel Manager mongoose model creation
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var schema = require('./schema');
var schemaName = 'Manager';

module.exports = mongoose.model(schemaName, schema);