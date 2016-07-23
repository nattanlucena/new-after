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


/**
 *  Remove o gerente e atualiza os registros de cada motel gerenciado pelo gerente removido
 * @param req
 * @param res
 */
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

/**
 * Atualiza o registro de um determinado gerente
 * @param req
 * @param res
 */
var update = function (req, res) {
    var query = {email: req.email};
    var update = {};
    var options = {new: true};

    /**
     * Monta a query
     */
    if (req.hasOwnProperty('name')) {
        console.log(typeof req.name);
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
            var err = new Error(err);
            throw err;
        }

        if (data) {
            console.log(data);
            var message = {
                message: 'Manager updated!'
            };
            res(message);
        } else {
            var message = {
                message: 'Manager not found!'
            };
            res(message);
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

    Manager.findOne({email: req.email}, function (err, manager) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (manager) {

            Manager.findOne({email: req.newEmail}, function (err, emailExists) {

                if (err) {
                    var err = new Error(err);
                    throw err;
                }

                if (emailExists) {
                    var message = {
                        message: 'Email address already in use!'
                    };
                    res(message);
                }

                manager.email = req.newEmail;
                manager.save(function (err) {

                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }

                    var message = {
                        message: 'Email address updated!'
                    };
                    res(message);

                });
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
    //Procura o registro baseado no email e retorna a senha para a verificação
    Manager.findOne({email: req.email}, 'password',function (err, manager) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (manager) {
            //compara a senha antiga enviada pelo gerente, é a mesma cadastrada no banco
            manager.comparePassword(req.oldPassword, manager.password, function (err, isMatch) {
                if (err) {
                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }
                }

                //Caso a comparação seja verdadeira, atualiza a senha e salva a alteração no banco
                if (isMatch) {
                    manager.password = req.newPassword;
                    manager.save(function (err) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }
                        var message = {
                            message: 'Password updated!'
                        };
                        res(message);
                    });
                } else {
                    //Caso a comparação retorne false, envia mensagem de erro à view
                    var message = {
                        message: 'Password don\'t macth!'
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
 * Retorna uma lista de todos os Motéis atrelados a conta do gerente
 * @param req
 * @param res
 */
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
    update: update,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    remove: remove,
    manageMotels: manageMotels
};