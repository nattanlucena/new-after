/**
 * Created by nattanlucena on 20/10/16.
 */

var feed = require('./controller');

var API_VERSION = require('../../config/config').API_VERSION;


/**
 * Set Feed Module routes
 *
 * @param {Object} app
 */
function setFeedRoutes(app) {
    'use strict';
    //create a new room
    app.get(API_VERSION + '/feed/list', feed.feedList);
}

module.exports = setFeedRoutes;