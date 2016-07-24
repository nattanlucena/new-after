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
        res.sendFile('index.html', {root: rootPath + '/client'});
    });

    app.get(BASE_PATH, function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Server On');
    });
/*
    app.get('/*', function (req, res) {
        res.redirect('/');
    });
    */




    // =========================================================================
    // USER ROUTES =============================================================
    // =========================================================================

    //get an user by email
    app.get(BASE_PATH + '/user/findByEmail', function (req, res) {
        "use strict";
        UserController.findByEmail(req.query, function (data) {
            res.json(data);
        });
    });

    //get all reservations
    app.get(BASE_PATH + '/user/reservations', function (req, res) {
        "use strict";
        UserController.getReservations(req.query, function (data) {
            res.json(data);
        });
    });

    //get all closed reservations
    app.get(BASE_PATH + '/user/closedReservations', function (req, res) {
        "use strict";
        UserController.getClosedReservations(req.query, function (data) {
            res.json(data);
        });
    });

    //get all cancelled reservations
    app.get(BASE_PATH + '/user/cancelledReservations', function (req, res) {
        "use strict";
        UserController.getClosedReservations(req.query, function (data) {
            res.json(data);
        });
    });
    
    //create a new user
    app.post(BASE_PATH + '/user/create', function (req, res) {
        "use strict";
        UserController.create(req.body, function (data) {
            res.json(data);
        });
    });

    //user login
    app.post(BASE_PATH + '/user/login', function (req, res) {
        "use strict";
        UserController.login(req.body, function (err, data, message) {
           if (err) {
               res.json(err);
           }
           //return true if login is correct
           if (data) {
               res.json(data);
           }
           if (message) {
              res.json(message);
           }
       });
    });

    //delete an user
    app.delete(BASE_PATH + '/user/remove', function (req, res) {
        "use strict";
        UserController.remove(req.query, function (data) {
          res.json(data);
       });
    });


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
    app.post(BASE_PATH + '/manager/create', function (req, res) {
        "use strict";
        ManagerController.create(req.body, function (data) {
            res.json(data);
        });
    });

    //delete a motel account
    app.delete(BASE_PATH + '/manager/remove', function (req, res) {
        "use strict";
        ManagerController.remove(req.body, function (data) {
           res.json(data);
        });
    });

    //update a manager account
    app.put(BASE_PATH + '/manager/update/account', function (req, res) {
        "use strict";
        ManagerController.update(req.body, function (data) {
           res.json(data);
        });
    });

    //update manager email address
    app.put(BASE_PATH + '/manager/update/email', function (req, res) {
        "use strict";
        ManagerController.updateEmail(req.body, function (data) {
            res.json(data);
        });
    });

    //update manager password
    app.put(BASE_PATH + '/manager/update/password', function (req, res) {
        "use strict";
        ManagerController.updatePassword(req.body, function (data) {
            res.json(data);
        });
    });

    //get all manager's motel
    app.get(BASE_PATH + '/manager/motels', function (req, res) {
        "use strict";
        ManagerController.manageMotels(req.query, function (data) {
            "use strict";
            res.json(data);
        });
    });

    
    // =========================================================================
    // ROOM ROUTES =============================================================
    // =========================================================================

    //create a new room
    app.post(BASE_PATH + '/room/create', function (req, res) {
        "use strict";
        RoomController.create(req.body, function (data) {
            res.json(data);
        });
    });

    //create a new room
    app.post(BASE_PATH + '/room/setAvailable', function (req, res) {
        "use strict";
        RoomController.setAvailable(req.body, function (data) {
            res.json(data);
        });
    });



    // =========================================================================
    // RESERVATION ROUTES ======================================================
    // =========================================================================

    //create a new room
    app.post(BASE_PATH + '/reservation/create', function (req, res) {
        "use strict";
        ReservationController.create(req.body, function (data) {
            res.json(data);
        });
    });

    // =========================================================================
    // FEED ROUTES =============================================================
    // =========================================================================

    //create a new room
    app.get(BASE_PATH + '/feed/list', function (req, res) {
        "use strict";
        FeedItemController.feedList(function (data) {
            res.json(data);
        });
    });


    module.exports = app;
};
