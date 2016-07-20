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
var schemaName = 'RoomItem';

module.exports = mongoose.model(schemaName, schema);