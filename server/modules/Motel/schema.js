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
        //https://docs.mongodb.com/manual/indexes/#Indexes-SparseIndexes
        name: { type: String, required: true, unique: true, sparse: true },
        address: {
            street: String,
            city: String,
            state: String,
            cep: String
        },
        rooms: [RoomSchema],
        createdBy: {
            manager: {type: Schema.Types.ObjectId, ref: 'Manager' },
            createdAt: { type: Date, default: Date.now }
        }
    },
    {collection: 'motel'});

module.exports = motelSchema;