/**
 * Created by nattanlucena on 19/07/16.
 */

var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var cors = require('cors');

var app = express();
var http = require('http').Server(app);
var database = require('./config/db');

var SERVER_PORT = process.env.port || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());
app.use(cors());

// routes
require('./app/routes.js')(app);

//Database connection
try {
    //DeprecationWarning: Mongoose: mpromise issue
    mongoose.Promise = global.Promise;
    mongoose.connect(database.url);
} catch (err) {
    throw new Error(err);
}

// Start server
http.listen(SERVER_PORT, function () {
    'use strict';
    console.log('Server is listening on port %d', SERVER_PORT);
});