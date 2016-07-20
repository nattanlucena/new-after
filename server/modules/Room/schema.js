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
        defaultPrice: Number,
        quantity: Number,
        items: [{
            item: {type: Schema.Types.ObjectId, refs: 'RoomItem'},
            createdAt: {type: Date, default: Date.now()}
        }],
        motel: {type: Schema.Types.ObjectId, refs: 'Motel'},
        rate: Number
    },
    {collection: 'room'});

module.exports = roomSchema;