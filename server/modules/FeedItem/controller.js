/**
 * Created by nattanlucena on 19/07/16.
 */

var FeedItem = require('./model');


/**
 * 
 * @param res
 */
var feedList = function (res) {

    //Retorna a lista de quartos disponíveis
    FeedItem.find({status: true}).populate('room motel').exec(function (err, list) {
        if (err) {
            var err = new Error(err);
            throw err;
        }

        res(list);
    });
};

module.exports = {
    feedList: feedList
};