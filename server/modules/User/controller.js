/**
 * Created by nattanlucena on 19/07/16.
 */
'user strict';
var User = require('./model');
var B = require('bluebird');


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
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (data !== null) {
            var message = {
                type: false,
                message: 'User account already created'
            };
            res.json(message);
        } else {
            User(req).save(function (err, data) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }
                //User successfully created
                var message = {
                    type:false,
                    message: 'The user account was created successfully',
                    data: data
                };
                res.json(message);
            });
        }
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
            res.status(500);
            res.json(handleError(err));
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
            res.status(500);
            res.json(handleError(err));
        }

        var message;
        if (!data) {
            message = {
                type: false,
                message: 'User not found'
            };
            res.json(message);
        } else {
            var user = new User({email: req.email, password: req.password});
            user.comparePassword(req.password, data.password, function (err, data) {
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
 *          email: 'oldEmail',
 *          newEmail: 'newEmail'
 *      }
 * ##########################
 * @param {String} req.email
 * @param {String} req.newEmail
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var updateEmail = function (req, res) {
    var oldEmail = req.params;
    var newEmail = req.query;
    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: oldEmail.email}, function (err, user) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (user) {
            //Verifica se o novo email já está cadastrado na base de dados
            User.findOne({email: newEmail.email}, function (err, emailExists) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }
                //Se o email já estiver cadastrado, retorna mensagem à view
                if (emailExists) {
                    var message = {
                        type: false,
                        message: 'Email address already in use'
                    };
                    res.json(message);
                }

                //Atualiza o usuário com o novo email
                user.email = newEmail.email;
                user.save(function (err) {

                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }

                    var message = {
                        type: true,
                        message: 'Email address updated'
                    };
                    res.json(message);

                });
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
 *  @param {String} req.email
 * @param {String} req.oldPassword
 * @param {String} req.newPassword
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var updatePassword = function (req, res) {
    var email = req.params.email;
    var password = {
        old: req.body.oldPassword,
        new: req.body.newPassword
    };

    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: email}, 'password',function (err, user) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }

        if (user) {
            //compara a senha antiga enviada pelo usuário, é a mesma cadastrada no banco
            user.comparePassword(password.old, user.password, function (err, isMatch) {
                if (err) {
                    res.status(500);
                    res.json(handleError(err));
                }

                //Caso a comparação seja verdadeira, atualiza a senha e salva a alteração no banco
                if (isMatch) {
                    user.password = password.new;
                    user.save(function (err) {
                        if (err) {
                            res.status(500);
                            res.json(handleError(err));
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
    var req = req.body;

    User.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
        }
        var message;
        if (data) {
            message = {
                type: true,
                message: 'The user account was removed successfully',
                data: data
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
            res.status(500);
            res.json(handleError(err));
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
            var err = new Error(err);
            throw err;
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
            res(message);
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
            res.status(500);
            res.json(handleError(err));
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