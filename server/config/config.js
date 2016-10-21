/**
 * Created by nattanlucena on 20/10/16.
 */

/**
 * Arquivo de configuração geral do app
 *
 */
var moment = require('moment');

var config = {};

config.API_VERSION = '/api/v1';

config.token = {
    secret: 'new-after-hybrid-app',
    expiration: moment().add(365, 'days').valueOf(),
    session: {session: false}
};

module.exports = config;