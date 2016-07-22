/**
 * Created by nattanlucena on 19/07/16.
 */

var Manager = require('./model');
var Motel = require('../Motel/model');

/**
 * Verify if a manager already exists. Case false, create a new manager. Case true, return
 *  a message in callback
 *
 * @param {Object} req
 * @param {String} req.name
 * @param {String} req.email
 * @param {String} req.sex
 * @param {String} req.phone
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, data)
 */
var create = function (req, res) {
    "use strict";
    Manager.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'Manager account already created!'
            };
            res(message);
        } else {
            req.name = {
                first: req.firstName,
                last: req.lastName
            };
            Manager(req).save(function (err, data) {
                if (err) {
                    if (err.name === 'ValidationError') {
                        var message = {
                            message: 'Verify required fields!'
                        };
                        res(message);
                    }
                    var err = new Error(err);
                    throw err;
                }
                //Manaeger successfully created
                var message = {
                    message: 'The manager account was created successfully!'
                };
                res(message);
            });
        }
    });
};


var remove = function (req, res) {
    "use strict";
    Manager.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        //Gerente não localizado
        if (data === null) {
            var message = {
                message: 'Manager not found!'
            };
            res(message);
        } else {
            //Filtra os motéis referenciados no registro do gerente
            var motelsIdsArr = data.motels.map(function (motel) {
                var id = {
                    _id: motel.motel
                };
                return id;
            });

            var message = {
                message: 'The manager account was removed successfully!'
            };
            if (motelsIdsArr.length > 0) {
                //Procura os motéis a partir de seu ID
                Motel.find({$and: motelsIdsArr}, function (err, data) {
                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }
                    //Atualiza cada motel removendo a referência do gerente removido
                    data.forEach(function (motel) {
                        motel.createdBy = undefined;
                        motel.save(function (err) {
                            if (err) {
                                var err = new Error(err);
                                throw err;
                            }
                        });
                    });

                    res(message);
                });
            } else {
                res(message);
            }
        }
    });
};

var manageMotels = function (req, res) {
    Manager.findOne({email: 'nattanelucena@gmail.com'}).populate('motels.motel').exec(function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        if (data) {
            res(data.motels);
        } else {
            res([]);
        }

    });
};

module.exports = {
    create: create,
    remove: remove,
    manageMotels: manageMotels
};