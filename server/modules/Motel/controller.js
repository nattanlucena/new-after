/**
 * Created by nattanlucena on 19/07/16.
 */

var Motel = require('./model');
var Manager = require('../Manager/model');

/*
    req: {
        motel: {},
        manager: {}
    }
 */
var create = function (req, res) {

    Manager.findOne({email: req.manager.email}, function (err, manager) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (manager) {
            //Encontra o hotel atrelado ao gerente
            Motel.findOne({name: req.motel.name, createdBy: {manager: manager._id}}, function (err, data) {
                if (err) {
                    var err = new Error(err);
                    throw err;
                }

                if (!data) {
                    var motel = req.motel;
                    var createdBy = {
                        manager: manager._id,
                        createdAt: Date.now()
                    };
                    motel.createdBy = createdBy;
                    Motel(motel).save(function (err, data) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }
                        //Update manager's motel document inserting the motel id
                        var motel = {
                            motel: data._id,
                            createdAt: Date.now()
                        };
                        manager.motels.push(motel);
                        manager.save(function (err, updated) {
                            if (err) {
                                var err = new Error(err);
                                throw err;
                            }
                            //return the manager updated document
                            res(updated);
                        });
                    });

                } else {
                    var message = {
                        message: 'Motel already created!'
                    };
                    res(message);
                }

            });
        } else {
            var message = {
                message: 'Manager not found!'
            };
            res(message);
        }
    });
};


/**
    Remove a motel and update his manager document, removing the motel reference 
    from motels array in manager collection
 req: {
 motel: {},
 manager: {}
 }
 */
var remove = function (req, res) {
    Manager.findOne({email: req.manager.email}, function (err, manager) {
        "use strict";
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (manager) {
            Motel.findOneAndRemove({_id: req.motel._id}, function (err, data) {
                if (err) {
                    var err = new Error(err);
                    throw err;
                }
                if (data) {
                    manager.motels.forEach(function (item) {
                       if (String(item.motel) === req.motel._id) {
                           //remove the motel from manager's motels array
                           var idx = manager.motels.indexOf(item);
                           if (idx > -1) {
                               manager.motels.splice(idx, 1);
                               manager.save(function (err, updated) {
                                   if (err) {
                                       var err = new Error(err);
                                       throw err;
                                   }
                                   //return the manager updated document
                                   res(updated);
                               });
                           }
                       }
                    });
                } else {
                    var message = {
                        message: "Motel not found!"
                    };
                    res(message);
                }
            });
        } else {
            var message = {
                message: "Manager not found!"
            };
            res(message);
        }

    });

};

module.exports = {
    create: create,
    remove: remove
};