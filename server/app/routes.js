/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var webAppPath = '../../client/app';
var BASE_PATH = '/api/v1';
var controller = require('./default');


module.exports = function (app) {

    function errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500);
        res.render('error', { error: err });
    }

    app.use(errorHandler);

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
        controller.findUserByEmail(req, function (data) {
            res.json(data);
        });
    });
    
    //create a new user
    app.post(BASE_PATH + '/user/create', function (req, res) {
        controller.createUser(req, function (data) {
            res.json(data);
        });


    });

    //user login
    app.post(BASE_PATH + '/user/login', function (req, res) {
       controller.loginUser(req, function (err, data, message) {
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

    app.delete(BASE_PATH + '/user/remove', function (req, res) {
       controller.removeUser(req, function (data) {
          res.json(data);
       });
       
    });


    module.exports = app;
};
