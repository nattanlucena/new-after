/**
 * Created by nattanlucena on 20/10/16.
 */

var auth = require('./controller');

var API_VERSION = '/api/v1';

/**
 * Set Authentication Module routes
 *
 * @param app
 */
function setAuthenticationRoutes(app) {
    'use strict';
    app.route(API_VERSION + '/auth/signin').post(auth.signin);
    app.route(API_VERSION + '/auth/signout').get(auth.signout);
    app.route(API_VERSION + '/auth/signup').post(auth.signup);
}

module.exports = setAuthenticationRoutes;