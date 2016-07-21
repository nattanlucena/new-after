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


var managerSchema = new Schema({
        name: String, 
        status: Boolean,
        date: Date,
        motel: {type: Schema.Types.ObjectId, ref: 'Motel'},
        room: {type: Schema.Types.ObjectId, ref: 'Room'},
        numRooms: Number
    },
    {collection: 'feeditem'});



module.exports = managerSchema;