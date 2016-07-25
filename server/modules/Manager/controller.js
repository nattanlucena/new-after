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
    var req = req.body;

    "use strict";
    Manager.findOne({email: req.email}, function (err, data) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (data !== null) {
            var message = {
                type: false,
                message: 'Manager account already created!'
            };
            res.json(message);
        } else {
            req.name = {
                first: req.name.first,
                last: req.name.last
            };
            Manager(req).save(function (err, data) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }
                //Manaeger successfully created
                var message = {
                    type: true,
                    message: 'The manager account was created successfully!',
                    data: data
                };
                res.json(message);
            });
        }
    });
};


/**
 *  Remove o gerente e atualiza os registros de cada motel gerenciado pelo gerente removido
 * @param req
 * @param res
 */
var remove = function (req, res) {
    var req = req.body;

    "use strict";
    Manager.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        //Gerente não localizado
        if (data === null) {
            var message = {
                type: false,
                message: 'Manager not found!'
            };
            res.json(message);
        } else {
            //Filtra os motéis referenciados no registro do gerente
            var motelsIdsArr = data.motels.map(function (motel) {
                var id = {
                    _id: motel.motel
                };
                return id;
            });

            var message = {
                type: true,
                message: 'The manager account was removed successfully!'
            };
            if (motelsIdsArr.length > 0) {
                //Procura os motéis a partir de seu ID
                Motel.find({$and: motelsIdsArr}, function (err, data) {
                    if (err) {
                        res.status(500);
                        res.json(handleError(err));
                    }
                    //Atualiza cada motel removendo a referência do gerente removido
                    data.forEach(function (motel) {
                        motel.createdBy = undefined;
                        motel.save(function (err) {
                            if (err) {
                                res.status(500);
                                res.json(handleError(err));
                            }
                        });
                    });

                    res.json(message);
                });
            } else {
                res.json(message);
            }
        }
    });
};

/**
 * Atualiza o registro de um determinado gerente
 * @param req
 * @param res
 */
var update = function (req, res) {
    var req = req.body;
    var query = {email: req.email};
    var update = {};
    var options = {new: true};

    /**
     * Monta a query
     */
    if (req.hasOwnProperty('name')) {
        var name = {
            first: req.name.hasOwnProperty('first') ? req.name.first : undefined ,
            last: req.name.hasOwnProperty('last') ? req.name.last : undefined
        };
        update.name = name;
    }

    if (req.hasOwnProperty('sex')) {
        update.sex = req.sex;
    }

    if (req.hasOwnProperty('phone')) {
        update.phone = req.phone;
    }

    Manager.findOneAndUpdate(query, update, options, function (err, data) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (data) {
            var message = {
                type: true,
                message: 'Manager updated!'
            };
            res.json(message);
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
 * ##########################
 * Example:
 *      req: {
 *          email: 'oldEmail',
 *          newEmail: 'newEmail'
 *      }
 * ##########################
 * @param req
 * @param res
 */
var updateEmail = function (req, res) {
    var req = req.body;

    Manager.findOne({email: req.email}, function (err, manager) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (manager) {

            Manager.findOne({email: req.newEmail}, function (err, emailExists) {

                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }

                if (emailExists) {
                    var message = {
                        type: false,
                        message: 'Email address already in use!'
                    };
                    res.json(message);
                }

                manager.email = req.newEmail;
                manager.save(function (err) {

                    if (err) {
                        res.status(500);
                        res.json(handleError(err));
                    }

                    var message = {
                        type: true,
                        message: 'Email address updated!'
                    };
                    res.json(message);

                });
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
 * ##########################
 * Example:
 *      req: {
 *          email: 'email'
 *          oldPassword: 'oldPassword',
 *          newPassword: 'newPassword'
 *      }
 *  ##########################
 * @param req
 * @param res
 */
var updatePassword = function (req, res) {
    var req = req.body;

    //Procura o registro baseado no email e retorna a senha para a verificação
    Manager.findOne({email: req.email}, 'password',function (err, manager) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (manager) {
            //compara a senha antiga enviada pelo gerente, é a mesma cadastrada no banco
            manager.comparePassword(req.oldPassword, manager.password, function (err, isMatch) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }

                //Caso a comparação seja verdadeira, atualiza a senha e salva a alteração no banco
                if (isMatch) {
                    manager.password = req.newPassword;
                    manager.save(function (err) {
                        if (err) {
                            res.status(500);
                            res.json(handleError(err));
                        }
                        var message = {
                            type: true,
                            message: 'Password updated!'
                        };
                        res.json(message);
                    });
                } else {
                    //Caso a comparação retorne false, envia mensagem de erro à view
                    var message = {
                        type: false,
                        message: 'Password don\'t macth!'
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
 * Retorna uma lista de todos os Motéis atrelados a conta do gerente
 * @param req
 * @param res
 */
var manageMotels = function (req, res) {
    var req = req.query;

    /*
    Manager.findOne({email: req.email}, function (err, manager) {
        console.log(manager);
        Manager.find({_id: {$in: manager.motels}}, function (err, data) {
           console.log(data);
        });
    });
     */

    Manager.findOne({email: req.email}).populate('motels').exec(function (err, data) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }
        if (data) {
            res.json(data.motels);
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
    update: update,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    remove: remove,
    manageMotels: manageMotels
};