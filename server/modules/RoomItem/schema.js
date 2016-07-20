/**
 * Created by nattanlucena on 19/07/16.
 */

/**
 * Room mongodb schema
 *
 * @type {*|exports|module.exports}
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//###################
var roomSchema = new Schema({
        name: String
    },
    {collection: 'roomitem'});

module.exports = roomSchema;