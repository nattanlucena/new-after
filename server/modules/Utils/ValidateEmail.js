/**
 * Created by nattanlucena on 25/07/16.
 */

var validateEmail = function (email) {
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

module.exports = {
    validateEmail: validateEmail
};