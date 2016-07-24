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
        uniqueID: String,
        code: String,
        name: String,
        description: String,
        address: {
            street: String,
            number: Number,
            city: String,
            state: String,
            cep: String
        },
        rooms: [{room: {type: Schema.Types.ObjectId, ref: 'Room' }}],
        createdBy:  {type: Schema.Types.ObjectId, ref: 'Manager'},
        createdAt: { type: Date, default: Date.now }
    },
    {collection: 'motel'});

motelSchema.index({uniqueID:1}, {unique:true, sparse: 1});

var autoPopulateManager = function (next) {
    this.populate('createdBy');
    next();
};

motelSchema.pre('findOne', autoPopulateManager);
motelSchema.pre('find', autoPopulateManager);

module.exports = motelSchema;