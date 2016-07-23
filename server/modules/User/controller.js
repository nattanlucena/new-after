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
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var message = {
                message: 'User account already created!'
            };
            res(message);
        } else {
            User(req).save(function (err, data) {
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
                //User successfully created
                var message = {
                    message: 'The user account was created successfully!'
                };
                res(message);
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
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data !== null) {
            var result = {
                name: data.name,
                email: data.email
            };

            res(result);
        } else {
            var message = {
                message: 'User not found!'
            };
            res(message);
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
    User.findOne({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        var message;
        if (!data) {
            message = {
                message: 'User not found!'
            };
            res(message);
        } else {
            var user = new User({email: req.email, password: req.password});
            user.comparePassword(req.password, data.password, function (err, data) {
               if (data) {
                   res(null, data);
               } else {
                   message = 'Incorrect password!';
                   res(null, false, message);
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

    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: req.email}, function (err, user) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (user) {
            //Verifica se o novo email já está cadastrado na base de dados
            User.findOne({email: req.newEmail}, function (err, emailExists) {

                if (err) {
                    var err = new Error(err);
                    throw err;
                }
                //Se o email já estiver cadastrado, retorna mensagem à view
                if (emailExists) {
                    var message = {
                        message: 'Email address already in use!'
                    };
                    res(message);
                }

                //Atualiza o usuário com o novo email
                user.email = req.newEmail;
                user.save(function (err) {

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
 *
 *  @param {String} req.email
 * @param {String} req.oldPassword
 * @param {String} req.newPassword
 * @param {Function} res - Callback response
 *
 * @returns {Object} - Retorna no callback um objeto com a respectiva mensagem
 */
var updatePassword = function (req, res) {
    //Procura o registro baseado no email e retorna a senha para a verificação
    User.findOne({email: req.email}, 'password',function (err, user) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (user) {
            //compara a senha antiga enviada pelo usuário, é a mesma cadastrada no banco
            user.comparePassword(req.oldPassword, manager.password, function (err, isMatch) {
                if (err) {
                    if (err) {
                        var err = new Error(err);
                        throw err;
                    }
                }

                //Caso a comparação seja verdadeira, atualiza a senha e salva a alteração no banco
                if (isMatch) {
                    user.password = req.newPassword;
                    user.save(function (err) {
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
                message: 'User not found!'
            };
            res(message);
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

    User.findOneAndRemove({email: req.email}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }
        var message;
        if (data) {
            message = {
                message: 'The user account was removed successfully!'
            };

        } else {
            message = {
                message: 'User not found!'
            };
        }

        res(message);
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

    User.findOne({email: req.email}).populate('reservations.reservation').exec(function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data) {
            res(data.reservations);

        } else {
            message = {
                message: 'User not found!'
            };
            res(message);
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

    User.findOne({email: req.email}).populate('reservations.reservation').exec(function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data) {
            var result = data.reservations.filter(function (item) {
                return item.reservation.status === "Closed";
            });

            if (result.length > 0) {
                res(result[0].reservation);
            }
            res(result);

        } else {
            message = {
                message: 'User not found!'
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

    User.findOne({email: req.email}).populate('reservations.reservation').exec(function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (data) {
            var result = data.reservations.filter(function (item) {
               return item.reservation.status === "Cancelled";
            });

            if (result.length > 0) {
                res(result[0].reservation);
            }
            res(result);
        } else {
            message = {
                message: 'User not found!'
            };
            res(message);
        }
    });
};

module.exports = {
    create : create,
    login: login,
    findByEmail: findByEmail,
    remove: remove,
    getReservations: getReservations,
    getClosedReservations: getClosedReservations,
    getCancelledReservations: getCancelledReservations
};