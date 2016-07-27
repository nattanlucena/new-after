var Reservation = require('./model');
var User = require('../User/model');
var Motel = require('../Motel/model');
var ErrorHandler = require('../Utils/ErrorHandler');


var create = function (req, res) {

    User.findOne({email: req.user.email}, function (err, user) {

        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        //Usuário localizado
        if (user) {

            //Procura o motel
            Motel.findOne({uniqueID: req.motel.uniqueID}).populate('rooms.room').exec(function (err, motel) {

                if (err) {
                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                    return;
                }

                //Motel localizado
                if (motel) {

                    //filtra o quarto a ser reservado passado como parâmetro na lista de quartos do Motel
                    var room = motel.rooms.filter(function (item) {
                        return item.room.name === "Studio";
                    });

                    //localizou o quarto
                    if (room.length > 0) {

                        var reservation = new Reservation({
                            user: user._id,
                            motel: motel._id,
                            room: room[0].room._id
                        });
                        var _id = String(reservation._id);
                        reservation.code = (room[0].room.name.substr(0, 3) + _id.substr(_id.length-5,_id.length)).toUpperCase();

                        //Salva a reserva
                        Reservation(reservation).save(function (err, data) {
                            if (err) {
                                res.status(500).json(ErrorHandler.getErrorMessage(err));
                                return;
                            }
                            var userReservation = {
                                reservation: data._id,
                                createdAt: new Date(data.createdAt)
                            };
                            user.reservations.push(userReservation);
                            user.save(function (err) {
                                if (err) {
                                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                                    return;
                                }
                            });
                            var message = {
                                type: true,
                                message: 'Success!',
                                data: data
                            };
                            res.json(message);
                        });


                    } else {
                        //User successfully created
                        var message = {
                            type: false,
                            message: 'Room not found!'
                        };
                        res.json(message);
                    }
                } else {
                    //User successfully created
                    var message = {
                        type: false,
                        message: 'Motel not found!'
                    };
                    res.json(message);
                }

            });
        } else {
            var message = {
                type: false,
                message: 'User not found!'
            };
            res.json(message);
        }

    });


};

module.exports = {
    create: create
};