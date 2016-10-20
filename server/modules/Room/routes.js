/**
 * Created by nattanlucena on 20/10/16.
 */

var room = require('./controller');

var API_VERSION = '/api/v1';

/**
 * Set Room Module routes
 *
 * @param {Object} app
 */
function setRoomRoutes(app) {

    //create a new room
    app.post(API_VERSION + '/room/create', room.create);

    //create a new room
    app.post(API_VERSION + '/room/setAvailable', room.setAvailable);
    
}

module.exports = setRoomRoutes;