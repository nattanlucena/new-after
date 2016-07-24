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


var feedItemSchema = new Schema({
        name: String, 
        status: {
                type: String,
                enum: ['Open', 'Closed'],
                default: 'Open'
        },
        date: Date,
        motel: {type: Schema.Types.ObjectId, ref: 'Motel'},
        //room: {type: Schema.Types.ObjectId, ref: 'Room'},
        numRooms: Number
    },
    {collection: 'feeditem'});

//Cria uma função para auto-popular um motel nas consultas de find e findOne
var autoPopulateMotel = function (next) {
        this.populate('motel');
        next();
};

feedItemSchema.pre('findOne', autoPopulateMotel);
feedItemSchema.pre('find', autoPopulateMotel);

module.exports = feedItemSchema;