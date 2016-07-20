/**
 * Created by nattanlucena on 19/07/16.
 */

var Motel = require('./model');
var Manager = require('../Manager/model');

var create = function (req, res) {

    Motel.findOne({name: req.name}, function (err, data) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        if (!data) {
            Motel(req).save(function (err, data) {
                //Update manager's motel document inserting the motel id
                Manager.findOneAndUpdate(
                    {email: 'nattanelucena@gmail.com'},
                    {$addToSet :{motels: data._id} },
                    {new: true},
                    function (err, item) {
                        if (err) {
                            var err = new Error(err);
                            throw err;
                        }
                        //return the manager updated document
                        res(item);
                });
            });
        } else {
            var message = {
                message: 'Motel already created!'
            };
            res(message);
        }
    });
};

module.exports = {
    create: create
};