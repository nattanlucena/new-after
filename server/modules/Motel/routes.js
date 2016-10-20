/**
 * Created by nattanlucena on 19/10/16.
 */

var motel = require('./controller');

var API_VERSION = '/api/v1';

/**
 * Set Motel Module routes
 *
 * @param {Object} app
 */
function setMotelRoutes(app) {
    "use strict";
    //create a new motel
    app.post(API_VERSION + '/motel/create', motel.create);
    //remove a motel
    app.delete(API_VERSION + '/motel/remove', motel.remove);
    //get rooms from a motel
    app.get(API_VERSION + '/motel/rooms', motel.getRooms);
}

module.exports = setMotelRoutes;