/**
 * Created by nattanlucena on 20/10/16.
 */
'use strict';

/**
 * Module dependencies.
 */
var path = require('path');
var passport = require('passport');
var User = require('../User/model');
var config = require('../../config/config');
var pathUtils = require('../Utils/PathUtils');


module.exports = function(app) {
    // Initialize strategies
    pathUtils.getGlobbedPaths(path.join(__dirname, './Strategies/*.js')).forEach(function(strategy) {
        console.log(strategy);
        require(path.resolve(strategy))(User, config);
    });

    // Add passport's middleware
    app.use(passport.initialize());
};