/**
 * Created by nattanlucena on 20/10/16.
 */

var reservation = require('./controller');

var API_VERSION = '/api/v1';

/**
 * Set Reservation Module routes
 *
 * @param {Object} app
 */
function setReservationRoutes(app) {
    "use strict";
    //create a new room
    app.post(API_VERSION + '/reservation/create', reservation.create);

}

module.exports = setReservationRoutes;