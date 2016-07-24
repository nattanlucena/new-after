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
        name: String,
        description: String,
        type: String,
        price: Number,
        quantity: Number,
        rate: Number,
        //room situation: available or not
        situation: {
            available: {type: Boolean, default: false},
            //Número de quartos disponíveis
            numRooms: {type: Number, default: 0}
        },
        motel: {
            type: Schema.Types.ObjectId,
            refs: 'Motel'
        },
        items: [String],
        createdAt: {
            type: Date,
            default: Date.now()
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {collection: 'room'});

roomSchema.index({name: 1, motel: 1}, {unique: 1, sparse: 1});

var autoPopulateMotel = function (next) {
    "use strict";
    this.populate('motel');
    next();
};

roomSchema.pre('findOne', autoPopulateMotel);

module.exports = roomSchema;