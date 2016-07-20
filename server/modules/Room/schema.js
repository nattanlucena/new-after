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
        roomNumber: Number,
        defaultPrice: Number,
        quantity: Number
    },
    {collection: 'room'});

module.exports = roomSchema;