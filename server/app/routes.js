/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var webAppPath = '../../client/app';
var BASE_PATH = '/api/v1';

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

    app.get('/client', function (req, res) {
        res.sendFile('index.html', {root: webAppPath});
    });

    app.get(BASE_PATH, function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Server On');
    });

    app.get('/', function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Server On');
    });



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

    //create a new motel account
    app.post(BASE_PATH + '/motel/create', function (req, res) {
        "use strict";
        MotelController.create(req.body, function (data) {
            res.json(data);
        });
    });

    app.delete(BASE_PATH + '/motel/remove', function (req, res) {
        "use strict";
       MotelController.remove(req.body, function (data) {
           res.json(data);
       });
    });

    app.get(BASE_PATH + '/motel/rooms', function (req, res) {
        "use strict";
        MotelController.getRooms(req.query, function (data) {
            res.json(data);
        });
    });

    // =========================================================================
    // MANAGER ROUTES ==========================================================
    // =========================================================================

    //create a new motel account
    app.post(BASE_PATH + '/manager/create', function (req, res) {
        "use strict";
        ManagerController.create(req.body, function (data) {
            res.json(data);
        });
    });

    app.delete(BASE_PATH + '/manager/remove', function (req, res) {
        "use strict";
        ManagerController.remove(req.body, function (data) {
           res.json(data);
        });
    });

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
