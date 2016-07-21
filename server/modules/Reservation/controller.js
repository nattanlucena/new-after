var Reservation = require('./model');
var User = require('../User/model');
var Motel = require('../Motel/model');

var create = function (req, res) {

    User.findOne({email: req.user.email}, function (err, user) {

        if (err) {
            var err = new Error(err);
            throw err;
        }

        //Usuário localizado
        if (user) {

            //Procura o motel
            Motel.findOne({uniqueID: req.motel.uniqueID}).populate('rooms.room').exec(function (err, motel) {

                if (err) {
                    var err = new Error(err);
                    throw err;
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
                                var err = new Error(err);
                                throw err;
                            }
                            var userReservation = {
                                reservation: data._id,
                                createdAt: new Date(data.createdAt)
                            };
                            user.reservations.push(userReservation);
                            user.save(function (err) {
                                if (err) {
                                    var err = new Error(err);
                                    throw err;
                                }
                            });
                            res(data);
                        });


                    } else {
                        //User successfully created
                        var message = {
                            message: 'Room not found!'
                        };
                        res(message);
                    }
                } else {
                    //User successfully created
                    var message = {
                        message: 'Motel not found!'
                    };
                    res(message);
                }

            });
        } else {
            var message = {
                message: 'User not found!'
            };
            res(message);
        }

    });


};

module.exports = {
    create: create
};