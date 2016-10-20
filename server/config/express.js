/**
 * Created by nattanlucena on 19/10/16.
 */
'use strict';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');
var mongoose = require('mongoose');

var pathUtils = require('../modules/Utils/PathUtils');
var rootPath = path.normalize(__dirname + '/../..');
var BASE_PATH = '/api/v1';
var webAppPath = '/client/app';
var webAppPublicPath = '/client/public';
var database = require('../config/db');


/**
 * Initialize application middleware.
 *
 * @method initMiddleware
 * @param {Object} app The express application
 * @private
 */
function initMiddleware(app) {
    app.set('showStackError', true);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(methodOverride());
    app.use(cors());
}


/**
 * Configure CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests.
 *
 * @method initCrossDomain
 * @param {Object} app The express application
 * @private
 */
function initCrossDomain(app) {
    // setup CORS
    app.use(cors());
    app.use(function(req, res, next) {
        // Website you wish to allow to connect
        res.set('Access-Control-Allow-Origin', '*');
        // Request methods you wish to allow
        res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
        // Request headers you wish to allow
        res.set('Access-Control-Allow-Headers', 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token');

        // Pass to next layer of middleware
        next();
    });
}


/**
 * Configure client routes to manager's dashboard
 *
 * @method initClientRoutes
 * @param {Object} app - Express application
 * @private
 */
function initClientRoutes(app) {
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
}


/**
 * Configure server routes
 *
 * @method initRoutes
 * @param {Object} app - Express application
 * @private
 */
function initRoutes(app) {
    // Globbing routing files
    pathUtils.getGlobbedPaths(path.join(__dirname, '../modules/**/routes.js')).forEach(function (routePath) {
        require(path.resolve(routePath))(app);
    });
}


/**
 * Configure error handling.
 *
 * @method initErrorRoutes
 * @param {Object} app The express application
 * @private
 */
function initErrorRoutes(app) {
    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid,
    // you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        //logger.error('Internal error(%d): %s', res.statusCode, err.stack);

        // Redirect to error page
        res.sendStatus(500);
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        // Redirect to not found page
        res.sendStatus(404);
    });
}

/**
 * Initi Database connection
 *
 * @method initDB
 * @private
 */
function initDB() {

    mongoose.connect(database.uri);

    // when successfully connected
    mongoose.connection.on('connected', function () {
        //logger.info('Mongoose connected to ' + config.mongodb.dbURI);
    });

    // if the connection throws an error
    mongoose.connection.on('error', function (err) {
        //logger.error('Mongoose connection error: ' + err);
    });

    // when the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        //logger.info('Mongoose disconnected');
    });

    // if the Node process ends, close the Mongoose connection
    process.on('SIGINT', function() {
        mongoose.connection.close(function () {
            //logger.info('Mongoose disconnected through app termination');
            process.exit(0);
        });
    });
}

/**
 * Initialize express application
 *
 * @method init
 * @returns {Object} express app object
 */
function init() {

    // Initialize express app
    var app = express();

    // Initialize Express middleware
    initMiddleware(app);

    // Initialize CORS
    initCrossDomain(app);

    // Initialize client routes
    initClientRoutes(app);

    // Initialize server routes
    initRoutes(app);

    // Initialize error routes
    initErrorRoutes(app);

    // Initialize database
    initDB();

    return app;
}

module.exports.init = init;