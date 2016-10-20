/**
 * Created by nattanlucena on 20/10/16.
 */

var manager = require('./controller');

var API_VERSION = '/api/v1';

/**
 * Set Manager Module routes
 *
 * @param {Object} app
 */
function setManagerRoutes(app) {
    //create a new manager account
    app.post(API_VERSION + '/managers/create', manager.create);

    //delete a motel account
    app.delete(API_VERSION + '/managers/remove', manager.remove);

    //update a manager account
    app.put(API_VERSION + '/managers/update/account', manager.update);

    //update a manager account
    app.post(API_VERSION + '/managers/login', manager.login);

    //update manager email address
    app.put(API_VERSION + '/managers/update/email', manager.updateEmail);

    //update manager password
    app.put(API_VERSION + '/managers/update/password', manager.updatePassword);

    //get all manager's motel
    app.get(API_VERSION + '/managers/motels', manager.manageMotels);

}

module.exports = setManagerRoutes;