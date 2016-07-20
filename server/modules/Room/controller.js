/**
 * Created by nattanlucena on 19/07/16.
 */

var Room = require('./model');
var Motel = require('../Motel/model');


/**
 * {
 *  motel: {
 *      _id: ''
 *  }
 * }
 * @param req
 * @param res
 */
var create = function (req, res) {

    Motel.findOne({_id: req.motel._id}, function (err, motel) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        //If motel exists
        if (motel) {

            //Verify if the room exists
            Room.findOne({name: req.room.name, motel: motel._id}, function (err, room) {
                if (err) {
                    var err = new Error(err);
                    throw err;
                }

                if (!room) {
                    //Insere a referência do motel no quarto
                    req.room.motel = motel._id;
                    Room(req.room).save(function (err, data) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }
                        //insere o quarto no motel
                        var insertRoom = {
                            room: data._id,
                            createdAt: Date.now()
                        };
                        motel.rooms.push(insertRoom);
                        motel.save(function (err, motelUpdated) {
                            if (err) {
                                var err = new Error(err);
                                throw err;
                            }

                            res(motelUpdated);
                        });

                    });

                } else {
                    var message = {
                        message: 'Room already created!'
                    };
                    res(message);
                }
            });

        } else {
            var message = {
                message: 'Motel not found!'
            };
            res(message);
        }
    });

};


var remove = function (req, res) {

};


module.exports = {
    create: create,
    remove: remove
};