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
var reservationSchema = new Schema({
        //reservation code
        code: String,
        createdAt: {type: Date, default: Date.now()},
        checkIn: Date,
        checkOut: Date,
        user: {type: Schema.Types.ObjectId, refs: 'User'},
        motel: {type: Schema.Types.ObjectId, refs: 'Motel'},
        room: {type: Schema.Types.ObjectId, refs: 'Room'}
    },
    {collection: 'reservation'});

module.exports = reservationSchema;