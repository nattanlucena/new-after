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

var RoomSchema = require('../Room/schema');

//###################
//TODO: finalizar schema do motel
var motelSchema = new Schema({
        name: String,
        address: {type: String, required: true, index: { unique: true } },
        rooms: [RoomSchema]
    },
    {collection: 'motel'});

module.exports = motelSchema;