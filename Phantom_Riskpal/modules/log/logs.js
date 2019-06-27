var config = require('../../config/jwt_secret.js'); // config 
var logObj = require('./../../schema/log.js');




/* @function : getAllLogs
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To list all the logs.
 */
exports.getAllLogs = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        // client_admin_id: req.user.id
         companyId: req.user.companyID
    }
    if (req.body.keyword)
        query['$or'] = [{
            name: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            email: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            role: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            threat_level: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];

    logObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('approving_manager')
        .populate('traveller')
        .exec(function (err, data) {
            if (data) {
                logObj.count(query, function (err, count) {
                    res.json({
                        'code': config.success,
                        'data': data,
                        'count': count
                    });
                })
            } else {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            }
        });
}