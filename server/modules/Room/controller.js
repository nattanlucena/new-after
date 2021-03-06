/**
 * Created by nattanlucena on 19/07/16.
 */

var Room = require('./model');
var Motel = require('../Motel/model');
var FeedItem = require('../FeedItem/model');
var ErrorHandler = require('../Utils/ErrorHandler');


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

    Motel.findOne({uniqueID: req.motel.uniqueID}, function (err, motel) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        //If motel exists
        if (motel) {

            //Verify if the room exists
            Room.findOne({name: req.room.name, motel: motel._id}, function (err, room) {
                if (err) {
                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                    return;
                }

                if (!room) {
                    //Insere a referência do motel no quarto
                    req.room.motel = motel._id;
                    Room(req.room).save(function (err, data) {
                        if (err) {
                            res.status(500).json(ErrorHandler.getErrorMessage(err));
                            return;
                        }
                        //insere o quarto no motel
                        var insertRoom = {
                            room: data._id,
                            createdAt: Date.now()
                        };
                        motel.rooms.push(insertRoom);
                        motel.save(function (err, motelUpdated) {
                            if (err) {
                                res.status(500).json(ErrorHandler.getErrorMessage(err));
                                return;
                            }

                            res.json(motelUpdated);
                        });

                    });

                } else {
                    var message = {
                        type: false,
                        message: 'Room already created!'
                    };
                    res.json(message);
                }
            });

        } else {
            var message = {
                type: false,
                message: 'Motel not found!'
            };
            res.json(message);
        }
    });

};


var remove = function (req, res) {

};


/**
 * Atualiza o quarto com disponibilidade para que seja mostrado no feed da aplicação pro usuário
 *
 * @param req
 * @param res
 */
var setAvailable = function (req, res) {

    Room.findOne({_id: req._id}, function (err, room) {

        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }
        //se localizou o quarto
        if (room) {
            //Se há quartos disponíveis, seta pra true a disponibilidade
            if (req.numRooms > 0) {
                room.situation.numRooms = req.numRooms;
                room.situation.available = true;
            } else {
                //Caso contrário, não estará disponível e será falso
                room.situation.numRooms = 0;
                room.situation.available = false;
            }
            room.updatedAt = Date.now();

            room.save(function (err, data) {
                if (err) {
                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                    return;
                }
                /*
                //Se estiver disponível, insere o quarto no feed
                if (data.situation.available === true) {
                    //Cria o novo item do feed
                    var feedItem = new FeedItem({
                        name: data.name,
                        status: true,
                        date: data.updatedAt,
                        room: data._id,
                        numRooms: data.numRooms,
                        motel: data.motel
                    });

                    FeedItem(feedItem).save(function (err) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }

                        var message = {
                            message: 'Feed updated!'
                        };
                        res(message);
                    });

                } else {
                 */
                    var message = {
                        type: true,
                        message: 'Room updated!',
                        data: data
                    };
                    res.json(message);
                //}
            });
        } else {
            var message = {
                message: 'Room not found!'
            };
            res.json(message);
        }
    });
};


module.exports = {
    create: create,
    remove: remove,
    setAvailable: setAvailable
};