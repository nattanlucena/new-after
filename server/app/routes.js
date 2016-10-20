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
    // MANAGER ROUTES ==========================================================
    // =========================================================================

    
    
    // =========================================================================
    // ROOM ROUTES =============================================================
    // =========================================================================
    

    // =========================================================================
    // RESERVATION ROUTES ======================================================
    // =========================================================================

    
    
    // =========================================================================
    // FEED ROUTES =============================================================
    // =========================================================================

    


    module.exports = app;
};
