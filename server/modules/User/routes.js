/**
 * Created by nattanlucena on 19/10/16.
 */
var user = require('./controller');
var auth = require('../Authentication/controller');

var API_VERSION = '/api/v1';

/**
 * Set User Module routes
 *
 * @param {Object} app
 */
function setUserRoutes(app) {

    //get all users
    app.route(API_VERSION + '/users/getAll').get(auth.isAuthenticated, user.getAll);
    //app.get(API_VERSION + '/users/getAll', auth.isAuthenticated, user.getAll);
    
    //get an user by email
    app.get(API_VERSION + '/users/:email', user.findByEmail);

    //get all reservations
    app.get(API_VERSION + '/users/:email/reservations/',  user.getReservations);

    //get all closed reservations
    app.get(API_VERSION + '/users/closedReservations', user.getClosedReservations);

    //get all cancelled reservations
    app.get(API_VERSION + '/users/cancelledReservations', user.getClosedReservations);

    //create a new user
    app.post(API_VERSION + '/users/create', user.create);

    //user login
    app.post(API_VERSION + '/users/login', user.login);

    //update email
    app.put(API_VERSION + '/users/update/email', user.updateEmail);

    //update password
    app.put(API_VERSION + '/users/update/password', user.updatePassword);

    //delete an user
    app.delete(API_VERSION + '/users/remove',  user.remove);

}

module.exports = setUserRoutes;