/**
 * Created by nattanlucena on 19/07/16.
 */

/**
 * Room mongoose model creation
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var schema = require('./schema');
var schemaName = 'Room';

module.exports = mongoose.model(schemaName, schema);