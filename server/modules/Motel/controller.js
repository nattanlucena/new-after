/**
 * Created by nattanlucena on 19/07/16.
 */

var Motel = require('./model');
var Manager = require('../Manager/model');
var GenerateID = require('../Utils/GenerateID');

/*
    req: {
        motel: {},
        manager: {}
    }
 */
var create = function (req, res) {

    //Localiza o gerente que está logado, pelo email
    Manager.findOne({email: req.manager.email}, function (err, manager) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        //Caso encontre, realiza a verificação se o Motel já está cadastrado
        if (manager) {
            //Procura o Motel pelo nome e pelo cep (só deverá ter um motel para cada cep)
            Motel.findOne({'name': req.motel.name, 'address.cep': req.motel.address.cep}, function (err, data) {
                if (err) {
                    var err = new Error(err);
                    throw err;
                }

                //Caso não encontre Motel cadastrado com os mesmos dados da busca, prossegue com a criação
                if (!data) {
                    var motel = req.motel;
                    //Cria um ID único
                    var uniqueID = GenerateID.generateUUID().generate();
                    var createdBy = {
                        manager: manager._id
                    };
                    motel.uniqueID = uniqueID;
                    //adiciona a referência do manager
                    motel.createdBy = createdBy;
                    //Código do Motel para ser visualizado na view
                    motel.code = uniqueID.substring(0, 8);
                    Motel(motel).save(function (err, data) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }
                        //Atualiza o registro do manager com a referência do hotel e a data de criação
                        var motel = {
                            motel: data._id,
                            createdAt: new Date(data.createdAt)
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
                    //Caso encontre, retorna uma mensagem de Motel já cadastrado
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
    #################
     req: {
        motel: {},
        manager: {}
     }
    ################
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

/**
 * Retorna todos os quartos de um Motel específico, localizado a partir do uniqueID
 *
 * @param req
 * @param res
 */
var getRooms = function (req, res) {
    Motel.findOne({uniqueID: req.uniqueID}).populate('rooms.room').exec(function (err, data) {
        "use strict";
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data) {
            res(data.rooms);
        } else {
            res([]);
        }
    });
};

module.exports = {
    create: create,
    remove: remove,
    getRooms: getRooms
};