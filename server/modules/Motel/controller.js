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
    var req = req.body;

    //Localiza o gerente que está logado, pelo email
    Manager.findOne({email: req.manager.email}, function (err, manager) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
            return;
        }

        //Caso encontre, realiza a verificação se o Motel já está cadastrado
        if (manager) {

            //Procura o Motel pelo nome e pelo cep (só deverá ter um motel para cada cep)
            Motel.findOne({name: req.motel.name, 'address.cep': req.motel.address.cep}, function (err, data) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                    return;
                }

                //Caso não encontre Motel cadastrado com os mesmos dados da busca, prossegue com a criação
                if (!data) {

                    var motel = req.motel;
                    //Cria um ID único
                    var uniqueID = GenerateID.generateUUID().generate();
                    motel.uniqueID = uniqueID;
                    //adiciona a referência do manager
                    motel.createdBy = manager._id;
                    //Código do Motel para ser visualizado na view
                    motel.code = uniqueID.substring(0, 8);

                    Motel(motel).save(function (err, data) {
                        if (err) {
                            res.status(500);
                            res.json(handleError(err));
                            return;
                        }
                        //Atualiza o registro do manager com a referência do hotel e a data de criação
                        manager.motels.push(data._id);
                        manager.save(function (err, updated) {
                            if (err) {
                                res.status(500);
                                res.json(handleError(err));
                                return;
                            }
                            //return the manager updated document
                            var message = {
                                type: true,
                                message: 'New motel created successfully!',
                                data: updated
                            };
                            res.json(message);
                           //res(updated);
                        });
                    });

                } else {
                    //Caso encontre, retorna uma mensagem de Motel já cadastrado
                    var message = {
                        type: false,
                        message: 'Motel already created!',
                        data: data.name
                    };
                    res.json(message);
                }

            });
        } else {
            var message = {
                type: false,
                message: 'Manager not found!'
            };
            res.json(message);
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
    var req = req.body;

    Manager.findOne({email: req.manager.email}, function (err, manager) {
        "use strict";
        if (err) {
            res.status(500);
            res.json(handleError(err));
            return;
        }

        if (manager) {
            Motel.findOneAndRemove({uniqueID: req.motel.uniqueID}, function (err, removedMotel) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                    return;
                }
                if (data) {
                    manager.motels.forEach(function (motelId) {
                       if (motelId.equals(removedMotel._id)) {
                           //Remove a referência do motel no registro do gerente
                           var idx = manager.motels.indexOf(motelId);
                           if (idx > -1) {
                               manager.motels.splice(idx, 1);
                               manager.save(function (err, updated) {
                                   if (err) {
                                       res.status(500);
                                       res.json(handleError(err));
                                       return;
                                   }

                                   var message = {
                                       type: true,
                                       message: 'The motel was removed!'
                                   };
                                   res.json(message);
                               });
                           }
                       }
                    });
                } else {
                    var message = {
                        type: false,
                        message: "Motel not found!"
                    };
                    res.json(message);
                }
            });
        } else {
            var message = {
                type: false,
                message: "Manager not found!"
            };
            res.json(message);
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
    Motel.findOne({uniqueID: req.uniqueID}, function (err, data) {
        "use strict";
        if (err) {
            res.status(500);
            res.json(handleError(err));
            return;
        }

        if (data) {
            res.json(data.rooms);
        } else {
            res.json([]);
        }
    });
};


/**
 * Error handler
 * @param err
 * @returns {{type: boolean, data: *}}
 */
function handleError(err) {
    return {
        type: false,
        data: err
    };
}

module.exports = {
    create: create,
    remove: remove,
    getRooms: getRooms
};