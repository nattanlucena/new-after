/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var path = require('path');
var rootPath = path.normalize(__dirname + '/../..');
var BASE_PATH = '/api/v1';
var webAppPath = '/client/app';
var webAppPublicPath = '/client/public';

//controllers
var UserController = require('../modules/User/controller');
var MotelController = require('../modules/Motel/controller');
var ManagerController = require('../modules/Manager/controller');
var RoomController = require('../modules/Room/controller');
var ReservationController = require('../modules/Reservation/controller');
var FeedItemController = require('../modules/FeedItem/controller');

module.exports = function (app) {

    function errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', { error: err });
    }

    app.use(errorHandler);


    // =========================================================================
    // DEFAULT =================================================================
    // =========================================================================
    
    // Use static
    app.use('/public', express.static(rootPath + webAppPublicPath));
    app.use('/libs', express.static(rootPath + '/libs'));
    app.use('/app', express.static(rootPath + webAppPath));

    app.get('/', function (req, res) {
        res.sendFile('site-index.html', {root: rootPath + '/client'});
    });

    app.get(BASE_PATH, function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Server On');
    });

    app.get('/client/*', function (req, res) {
        res.redirect('/');
    });



    // =========================================================================
    // USER ROUTES =============================================================
    // =========================================================================


    //get an user by email
    app.get(BASE_PATH + '/users/:email', UserController.findByEmail);
    //get all reservations
    app.get(BASE_PATH + '/users/:email/reservations/',  UserController.getReservations);
    //get all closed reservations
    app.get(BASE_PATH + '/users/closedReservations', UserController.getClosedReservations);
    //get all cancelled reservations
    app.get(BASE_PATH + '/users/cancelledReservations', UserController.getClosedReservations);
    //create a new user
    app.post(BASE_PATH + '/users/create', UserController.create);
    //user login
    app.post(BASE_PATH + '/users/login', UserController.login);
    //update email
    app.put(BASE_PATH + '/users/update/email', UserController.updateEmail);
    //update password
    app.put(BASE_PATH + '/users/update/password', UserController.updatePassword);
    //delete an user
    app.delete(BASE_PATH + '/users/remove',  UserController.remove);


    // =========================================================================
    // MOTEL ROUTES ============================================================
    // =========================================================================

    //create a new motel
    app.post(BASE_PATH + '/motel/create', MotelController.create);
    //remove a motel
    app.delete(BASE_PATH + '/motel/remove', MotelController.remove);
    //get rooms from a motel
    app.get(BASE_PATH + '/motel/rooms', MotelController.getRooms);


    // =========================================================================
    // MANAGER ROUTES ==========================================================
    // =========================================================================

    //create a new manager account
    app.post(BASE_PATH + '/managers/create', ManagerController.create);
    //delete a motel account
    app.delete(BASE_PATH + '/managers/remove', ManagerController.remove);
    //update a manager account
    app.put(BASE_PATH + '/managers/update/account', ManagerController.update);
    //update a manager account
    app.post(BASE_PATH + '/managers/login', ManagerController.login);
    //update manager email address
    app.put(BASE_PATH + '/managers/update/email', ManagerController.updateEmail);
    //update manager password
    app.put(BASE_PATH + '/managers/update/password', ManagerController.updatePassword);
    //get all manager's motel
    app.get(BASE_PATH + '/managers/motels', ManagerController.manageMotels);

    
    // =========================================================================
    // ROOM ROUTES =============================================================
    // =========================================================================

    //create a new room
    app.post(BASE_PATH + '/room/create', RoomController.create);
    //create a new room
    app.post(BASE_PATH + '/room/setAvailable', RoomController.setAvailable);


    // =========================================================================
    // RESERVATION ROUTES ======================================================
    // =========================================================================

    //create a new room
    app.post(BASE_PATH + '/reservation/create', ReservationController.create);

    
    // =========================================================================
    // FEED ROUTES =============================================================
    // =========================================================================

    //create a new room
    app.get(BASE_PATH + '/feed/list', FeedItemController.feedList);


    module.exports = app;
};
