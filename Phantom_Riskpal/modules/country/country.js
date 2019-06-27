var config = require('../../config/jwt_secret.js'); // config 
var countryObj = require('./../../schema/country.js'); // include country schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country risk schema file
var countryThreatMatrixObj = require('./../../schema/country_threat_matrix.js'); // include country risk schema file
var catObj = require('./../../schema/category.js'); // include country schema file
var riskcatObj = require('./../../schema/risk_associated_category'); // include country schema file
var createError = require('http-errors');


/* @function : getAllCountries
 *  @author  : MadhuriK 
 *  @created  : 05-Apr-17
 *  @modified :
 *  @purpose  : To get all country list.
 */
exports.getAllCountries = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            countryRiskObj.find({
                // client_admin_id: req.user.id
                companyId: req.user.companyID
            }, function (err, country_risk) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': country,
                        'country_risk': country_risk
                    });
                }
            })

        }
    })
}

/* @function : getCountryList
 *  @author  : MadhuriK 
 *  @created  : 12-Jun-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.getCountryList = function (req, res, next) {
    countryObj.find({}, function (err, data) {
        if (data) {
            res.json({
                'code': config.success,
                'data': data,
            });
        } else {
            res.json({
                'error': err,
                'code': config.error,
                'message': 'Something went wrong please try again!'
            });
        }
    })
}




/* @function : getCountriesForThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 20-May-17
 *  @modified :
 *  @purpose  : To get all country threat matrix list.
 */
exports.getCountriesForThreatMatrix = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            // common for all clients add by master admin
            countryThreatMatrixObj.find({}, function (err, country_threat_matrix) {

                // countryThreatMatrixObj.find({ client_admin: req.user.id }, function (err, country_threat_matrix) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': country,
                        'country_threat_matrix': country_threat_matrix
                    });
                }
            })

        }
    })
}





/* @function : saveCountrySpecificInfo
 *  @author  : MadhuriK 
 *  @created  : 06-Apr-17
 *  @modified :
 *  @purpose  : To save country specific information.
 */
exports.saveCountrySpecificInfo = function (req, res, next) {
    if (req.body) {
        countryRiskObj.findOne({
            country_id: req.body._id,
            client_admin_id: req.user.id,
            companyId: req.user.companyID
        }, function (err, country_risk) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (country_risk) {
                countryRiskObj.update({
                    _id: country_risk._id
                }, {
                    $set: {
                        specific_info: req.body.specific_info
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country specific information updated successfully'
                        });
                    }
                })

            } else {
                var country_risk = {
                    country_id: req.body._id,
                    specific_info: req.body.specific_info,
                    client_admin_id: req.user.id,
                    companyId: req.user.companyID,
                    name: req.body.name,
                    code: req.body.code,
                    color: "",

                }
                var country_risk_obj = new countryRiskObj(country_risk);
                country_risk_obj.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country specific information added successfully'
                        });
                    }
                })
            }
        })

    }

}



/* @function : saveCountryColor
 *  @author  : MadhuriK 
 *  @created  : 05-Apr-17
 *  @modified :
 *  @purpose  : To save county color.
 */
exports.saveCountryColor = function (req, res, next) {
    console.log("saveCountryColor", req.body)
    if (req.body) {
        countryRiskObj.findOne({
            country_id: req.body.countryId,
            client_admin_id: req.user.id,
            companyId: req.user.companyID
        }, function (err, country_risk) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (country_risk) {
                countryRiskObj.update({
                    _id: country_risk._id
                }, {
                    $set: {
                        color: req.body.color,
                        checked: req.body.checked
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country color updated successfully'
                        });
                    }
                })

            } else {
                var country_risk = {
                    country_id: req.body.countryId,
                    specific_info: "",
                    client_admin_id: req.user.id,
                    companyId: req.user.companyID,
                    name: req.body.name,
                    code: req.body.code,
                    color: req.body.color,
                    checked: req.body.checked

                }
                var country_risk_obj = new countryRiskObj(country_risk);
                country_risk_obj.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country color added successfully'
                        });
                    }
                })
            }
        })

    }
}


/* @function : getAllCategories
 *  @author  : MadhuriK 
 *  @created  : 05-Apr-17
 *  @modified :
 *  @purpose  : To get all Categories.
 */
exports.getAllCategories = function (req, res, next) {
    riskcatObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, category) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': category
            });
        }
    })
}



/* @function : saveCountryThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 30-May-17
 *  @modified :
 *  @purpose  : To save country threat matrix.
 */
exports.saveCountryThreatMatrix = function (req, res, next) {
    console.log("saveCountryThreatMatrix",req.body)
    if (req.body) {
        countryThreatMatrixObj.findOne({
            client_admin: req.user.id,
            countryname: req.body.countryname,
            category_id: req.body.category_id
        }, function (err, country_threat_matrix) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (country_threat_matrix) {
                countryThreatMatrixObj.update({
                    _id: country_threat_matrix._id
                }, {
                    $set: {
                        country_risk: req.body.country_risk
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country threat matrix updated successfully'
                        });
                    }
                })
            } else {
                req.body.client_admin = req.user.id;
                var countryThreatMatrix = new countryThreatMatrixObj(req.body);
                countryThreatMatrix.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'country threat matrix added successfully'
                        });
                    }
                })
            }
        })

    }
}