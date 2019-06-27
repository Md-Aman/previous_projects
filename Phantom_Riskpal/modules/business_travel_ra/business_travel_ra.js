var config = require('../../config/jwt_secret.js'); // config 
var countryObj = require('./../../schema/country.js'); // include country schema file
var bizTravelCatObj = require('./../../schema/biz_travel_category.js'); // include country schema file



/* @function : getCountriesName
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.getCountriesName = function (req, res) {
    countryObj.find({}, function (err, countries) {
        if (err) {
            res.json({
                'error': err,
                'code': config.error,
                'message': 'Something went wrong please try again!'
            });
        } else {
            res.json({
                'code': config.success,
                'data': countries
            })
        }
    })

}


/* @function : addBizTravelCategory
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To add categories for business travel ra.
 */
exports.addBizTravelCategory = function (req, res) {
    if (req.body) {
        var bizCatData = new bizTravelCatObj(req.body);
        bizCatData.save(function (err) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Business travel ra category added successfully'
                });
            }
        })
    }
}


exports.getAllBizCategories = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false
    }
    if (req.body.category_name)
        query.categoryName = {
            $regex: req.body.category_name,
            $options: "$i"
        };

    bizTravelCatObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                bizTravelCatObj.count(query, function (err, count) {
                    // clientAdminCatObj.find({ client_admin_id: req.user.id, is_deleted: false }, function (err, client_admin_cat) {
                    if (err) {
                        res.json({
                            'error': err,
                            'code': config.error,
                            'message': 'Something went wrong please try again!'
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count,
                            // 'clientAdminCat': client_admin_cat
                        });
                    }
                    // })

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