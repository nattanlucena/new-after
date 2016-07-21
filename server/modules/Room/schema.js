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
//TODO: finalizar schema do quarto
var roomSchema = new Schema({
        name: String,
        description: String,
        type: String,
        price: Number,
        quantity: Number,
        rate: Number,
        //room situation: available or not
        available: {type: Boolean, default: false},
        motel: {type: Schema.Types.ObjectId, refs: 'Motel'},
        items: [{
            item: {type: Schema.Types.ObjectId, refs: 'RoomItem'},
            createdAt: {type: Date, default: Date.now()}
        }],
        createdAt: {type: Date, default: Date.now()},
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {collection: 'room'});

module.exports = roomSchema;