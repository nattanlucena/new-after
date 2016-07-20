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
        address: {
            street: String,
            number: Number,
            city: String,
            state: String,
            cep: String
        },
        rooms: [{
            room: {type: Schema.Types.ObjectId, ref: 'Room' },
            createdAt: { type: Date, default: Date.now }
        }],
        createdBy: {
            manager: {type: Schema.Types.ObjectId, ref: 'Manager' },
            createdAt: { type: Date, default: Date.now }
        }
    },
    {collection: 'motel'});

motelSchema.index({name:1, createdBy: 1});

module.exports = motelSchema;