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
            res.status(500);
            res.json(handleError(err));
        }

        res.json(list);
    });
};

/**
 * Error handler
 * @param err
 * @returns {{type: boolean, data: *}}
 */
function handleError(err) {
    return {
        type: false,
        data: err
    };
}

module.exports = {
    feedList: feedList
};