/**
 * Created by nattanlucena on 19/07/16.
 */

var FeedItem = require('./model');
var ErrorHandler = require('../Utils/ErrorHandler');

/**
 *
 * @param res
 */
var feedList = function (req, res) {
    
    //Retorna a lista de motéis com quartos disponíveis
    FeedItem.find({status: true}).populate('motel').exec(function (err, items) {
        if (err) {
            res.status(500).json(ErrorHandler.getErrorMessage(err));
            return;
        }

        res.json(items);
    });
};


module.exports = {
    feedList: feedList
};