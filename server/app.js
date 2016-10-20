/**
 * Created by nattanlucena on 19/07/16.
 */

var app = require('./config/express').init();
var http = require('http').Server(app);

var SERVER_PORT = process.env.port || 3000;

// Start server
http.listen(SERVER_PORT, function () {
    'use strict';
    console.log('Server is listening on port %d', SERVER_PORT);
});