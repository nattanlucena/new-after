/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var path = require('path');
var webAppPath = '/client/app';
var BASE_PATH = '/api/v1';
var webAppPublicPath = webAppPath + '/public';
var rootPath = path.normalize(__dirname + '/../..');

//controllers
var UserController = require('../modules/User/controller');
var MotelController = require('../modules/Motel/controller');
var ManagerController = require('../modules/Manager/controller');


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

    app.get('/', function (req, res) {
        res.sendFile('index.html', {root: rootPath + webAppPath});
    });

    app.get(BASE_PATH, function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Server On');
    });

    app.get('/*', function (req, res) {
        res.redirect('/');
    });




    // =========================================================================
    // USER ROUTES =============================================================
    // =========================================================================

    //get an user by email
    app.get(BASE_PATH + '/user/findByEmail', function (req, res) {
        UserController.findByEmail(req.query, function (data) {
            res.json(data);
        });
    });
    
    //create a new user
    app.post(BASE_PATH + '/user/create', function (req, res) {
        UserController.create(req.body, function (data) {
            res.json(data);
        });
    });

    //user login
    app.post(BASE_PATH + '/user/login', function (req, res) {
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
        UserController.remove(req.query, function (data) {
          res.json(data);
       });
    });


    // =========================================================================
    // MOTEL ROUTES ============================================================
    // =========================================================================

    //create a new motel account
    app.post(BASE_PATH + '/motel/create', function (req, res) {
        MotelController.create(req.body, function (data) {
            res.json(data);
        });
    });

    // =========================================================================
    // MANAGER ROUTES ==========================================================
    // =========================================================================

    //create a new motel account
    app.post(BASE_PATH + '/manager/create', function (req, res) {
        ManagerController.create(req.body, function (data) {
            res.json(data);
        });
    });

    module.exports = app;
};
