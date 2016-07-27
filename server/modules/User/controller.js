/**
 * Created by nattanlucena on 19/07/16.
 */
'user strict';
var User = require('./model');
var B = require('bluebird');
var ErrorHandler = require('../Utils/ErrorHandler');


/**
 * Verifica se um usuário existe. Caso não exista, cria um novo usuário com os dados
 * passados na requisição e retorna uma mensagem de sucesso. Caso exista, retorna uma mensagem de usuário existente
 *
 * @param {Object} req
 * @param {String} req.name
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, data)
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var create = function (req, res) {
    var req = req.body;
    //Cria um novo usuário
    var user = new User({
        name: {
            first: req.name.first,
            last: req.name.last
        },
        email: req.email,
        password: req.password
    });

    User(req).save(function (err, data) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }
        //User successfully created
        var message = {
            type: true,
            message: 'The user account was created successfully',
            data: data
        };
        res.json(message);
    });
};


/**
 *  Get an user by email
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var findByEmail = function (req, res) {
    var req = req.params;

    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (data !== null) {
            var result = {
                name: data.name,
                email: data.email
            };
            var message = {
                type: true,
                message: 'Success',
                data: result
            };
            res.json(message);
        } else {
            var message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        }

    });
};

/**
 *  Strategy for login
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {String} req.password
 * @param {Function} res - Callback : res(err, isMatch, message)
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem ou com o registro do login
 */

var login = function (req, res) {
    var req = req.body;
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        var message;
        if (!data) {
            message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        } else {
            data.comparePassword(req.password, function (err, data) {
               if (data) {
                   message = {
                       type: true,
                       message: 'Success',
                       data: data
                   };
                   res.json(message);
               } else {
                   message = {
                       type: false,
                       message: 'Incorrect password'
                   };
                   res.json(message);
               }
            });
        }
    });
};


/**
 * ##########################
 * Example:
 *      req: {
 *          userEmail: 'email'
 *          new: 'newEmail'
 *      }
 * ##########################
 * @param {String} req.userEmail
 * @param {String} req.newEmail
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var updateEmail = function (req, res) {
    var userEmail = req.body.userEmail;
    var newEmail = req.body.newEmail;

    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: userEmail}, function (err, user) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (user) {
            //Atualiza o usuário com o novo email
            user.email = newEmail;
            user.save(function (err) {
                if (err) {
                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                    return;
                }
                var message = {
                    type: true,
                    message: 'Email address updated'
                };
                res.json(message);

            });
        } else {
            var message = {
                type: false,
                message: 'User not found'
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
 *
 * @param {String} req.email
 * @param {String} req.oldPassword
 * @param {String} req.newPassword
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var updatePassword = function (req, res) {
    var email = req.body.email;
    var password = {
        old: req.body.oldPassword,
        new: req.body.newPassword
    };

    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: email},function (err, user) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (user) {
            //compara a senha antiga enviada pelo usuário, é a mesma cadastrada no banco
            user.comparePassword(password.old, function (err, isMatch) {
                if (err) {
                    res.status(500).json(ErrorHandler.getErrorMessage(err));
                    return;
                }

                //Caso a comparação seja verdadeira, atualiza a senha e salva a alteração no banco
                if (isMatch) {
                    user.password = password.new;
                    user.save(function (err) {
                        if (err) {
                            res.status(500).json(ErrorHandler.getErrorMessage(err));
                            return;
                        }
                        var message = {
                            type: true,
                            message: 'Password updated'
                        };
                        res.json(message);
                    });
                } else {
                    //Caso a comparação retorne false, envia mensagem de erro à view
                    var message = {
                        type: false,
                        message: 'Password don\'t macth'
                    };
                    res.json(message);
                }
            });

        } else {
            var message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        }
    });
};



/**
 *  Remove a user account
 *
 * @param {Object} req
 * @param {String} req.email
 * @param {Function} res - Callback
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var remove = function (req, res) {
    var userEmail = req.body.email;

    User.findOneAndRemove({email: req.userEmail}, function (err, user) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }
        var message;
        if (user) {
            message = {
                type: true,
                message: 'The user account was removed successfully',
                data: user
            };

        } else {
            message = {
                type: false,
                message: 'User not found'
            };
        }

        res.json(message);
    });

};


/**
 * Retorna todas as reservas de um determinado usuário
 *
 * @param {String} req.email
 * @param {Function} res - Callback response
 *
 * @returns {Object|Array} - Retorna no callback um objeto com a respectiva mensagem ou um array com
 *                          as reservas do usuário
 */
var getReservations = function (req, res) {
    var req = req.params;

    User.findOne({email: req.email}).populate('reservations').exec(function (err, data) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (data) {
            var message = {
                type: true,
                message: 'Success',
                data: data.reservations
            };
            res.json(message);

        } else {
            message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        }
    });
};

/**
 *  Retorna todas as reservas fechadas de um determinado usuário
 *
 * @param {String} req.email
 * @param {Function} res - Callback response
 *
 * @returns {Object|Array} - Retorna no callback um objeto com a respectiva mensagem ou um array com
 *                          as reservas fechadas do usuário
 */
var getClosedReservations = function (req, res) {
    var req = req.params;

    User.findOne({email: req.email}).populate('reservations').exec(function (err, user) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (user) {
            var result = user.reservations.filter(function (item) {
                return item.status === "Closed";
            });

            if (result.length > 0) {
                res.json(result[0]);
            }
            res.json(result);

        } else {
            message = {
                message: 'User not found'
            };
            res.json(message);
        }
    });
};


/**
 * Retorna todas as reservas canceladas de um determinado usuário
 *
 * @param {String} req.email
 * @param {Function} res - Callback response
 *
 * @returns {Object|Array} - Retorna no callback um objeto com a respectiva mensagem ou um array com
 *                          as reservas canceladas do usuário
 */
var getCancelledReservations = function (req, res) {

    User.findOne({email: req.email}).populate('reservations').exec(function (err, user) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        if (user) {
            var result = user.reservations.filter(function (item) {
               return item.status === "Cancelled";
            });

            if (result.length > 0) {
                res.json(result[0]);
            }
            var message = {
                type: true,
                message: "Success",
                data: result
            };
            res.json(message);
        } else {
            message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        }
    });
};


module.exports = {
    create : create,
    login: login,
    findByEmail: findByEmail,
    remove: remove,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    getReservations: getReservations,
    getClosedReservations: getClosedReservations,
    getCancelledReservations: getCancelledReservations
};