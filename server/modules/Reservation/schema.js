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
        //Confirmed, Cancelled ...
        status: {
            type: String,
            enum: ['Open', 'Cancelled', 'Closed', 'Confirmed'],
            default: 'Open'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: Date,
        occupants: {type: Number, default: 2},
        checkIn: Date,
        checkOut: Date,
        user: {
            type: Schema.Types.ObjectId,
            refs: 'User'
        },
        motel: {
            type: Schema.Types.ObjectId,
            refs: 'Motel'
        },
        room: {
            type: Schema.Types.ObjectId,
            refs: 'Room'
        }
    },
    {collection: 'reservation'});

module.exports = reservationSchema;