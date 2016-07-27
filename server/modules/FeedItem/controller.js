/**
 * Created by nattanlucena on 19/07/16.
 */

var FeedItem = require('./model');


/**
 *
 * @param res
 */
var feedList = function (req, res) {
    
    //Retorna a lista de motéis com quartos disponíveis
    FeedItem.find({status: true}).populate('motel').exec(function (err, items) {
        if (err) {
            res.status(500);
            res.json(handleError(err));
            return;
        }

        res.json(items);
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