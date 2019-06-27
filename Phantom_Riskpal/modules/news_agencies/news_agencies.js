var userObj = require('./../../schema/users.js'); // include user schema file
var clientObj= require('./../../schema/clients.js');  //Clients schema 
var userTable= require('./../../schema/usertables.js');
var countryObj = require('./../../schema/country.js'); // include country schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country risk schema file
var sectorObj = require('./../../schema/sector.js'); // include sector schema file
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');
var async = require('async');
var departmentObj = require('./../../schema/department.js'); // include department schema file
var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
var constant = require('../../config/constants');
var parseNumber = require('libphonenumber-js').parse;
var countryCode = require('libphonenumber-js').getPhoneCode;
var createError = require('http-errors');
var { searchByFields } = require('./../../helper/general.helper');

/* @function : getAllCountries
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To get all country.
 */
exports.getAllCountries = function (req, res, next) {
    const sortBy =  {name: 1};
    countryObj.find({}).sort(sortBy).lean().exec( function (err, countryData) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': countryData
            });
        }
    })
}

// exports.getDepartmentList = function(req, res, next) {
//         departmentObj.find({is_deleted: false, client_admin_id:req.parems.client_id status: 'Active' }, function(err, departArr) {
//                 if (err) {
//                     res.json({
//                         'error': err,
//                         'code': config.error,
//                         'message': 'Something went wrong please try again!'
//                     });
//                 } else {
//                     res.json({
//                         'code': config.success,
//                         'data': departArr,
//                     });
//             }
//       })
// }

exports.getDepartmentList = function (req, res, next) {
    console.log("req.params.ids", req.body.ids)
    if (req.body.ids.length > 0) {
        departmentObj.find({
            client_admin_id: {
                $in: req.body.ids
            },
            is_deleted: false
        }, function (err, departArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                console.log("ids", departArr)
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': departArr,
                });
            }
        })
    }
}

/* @function : saveNewsAgency
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To create news agency.
 */
var ObjectID = require('mongodb').ObjectID;
exports.saveNewClient = function (req, res, next) {

    if (req.body) {
       
        clientObj.findOne({
            company_name: req.body.company_name,
            is_deleted: false,

        }, function (err, rpstaff) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (rpstaff) {
                res.json({
                    'error': 'Company Name already exist',
                    'code': config.error,
                    'message': 'Company Name already exist'
                });
            } else {
                    
                    var clientData = new clientObj({

                        company_name: req.body.company_name,
                        country: req.body.country,
                        type_of_client: req.body.type_of_client,
                        no_of_traveller_account: req.body.no_of_traveller_account,
                        no_of_approving_manager_account: req.body.no_of_approving_manager_account,
                        no_of_client_admin_account: req.body.no_of_client_admin_account,
                        no_of_co_admin_account: req.body.no_of_co_admin_account,
                        // email:req.body.email,
                        // mobile_number: req.body.mobile_number,
                        // sector_name: JSON.parse(req.body.sector).sectorName,
                        sector_id: req.body.sector,
                        status: "Active",

                     
                });
                clientData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Client added successfully'
                        });
                    }
                })
            }
        })
    }
   
   
}

/* @function : saveNewRPstaff
 *  @author  : Siroi 
 *  @created  : 12 March 2018
 *  @modified :
 *  @purpose  : To create news rpstaff.
 */

exports.saveNewRPstaff = function (req, res, next) {

   
    

    if (req.body) {
        userTable.findOne({
            email: req.body.email,
            is_deleted: false,
        }, function (err, rpstaff) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (rpstaff) {
                res.json({
                    'error': 'RPstaff email already exist',
                    'code': config.error,
                    'message': 'RPstaff email already exist'
                });
            } else {
                var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
               
                var number = pnumber;
                var code = parseNumber(number);
                console.log("country_code", code)
                var phone = code.phone
                var phoneCode = countryCode(code.country);
                authy.register_user(req.body.email, phone, phoneCode, function (err, regRes) {
                    var text = req.body.email + " " + "email is not allowed."
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': text
                        });
                    } else {


                    var key = 'salt_from_the_user_document';
                    var cipher = crypto.createCipher('aes-256-cbc', key);
                    cipher.update(req.body.password, 'utf8', 'base64');
                    var encryptedPassword = cipher.final('base64');
                    var rpstaffData = new userTable({

                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    email:req.body.email,
                    mobile_number:number,
                    authyID: regRes.user.id,
                    password:encryptedPassword,
                    super_admin:true,
                    status:"Active"

                     
                });
                rpstaffData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'RPstaff added successfully.'
                        });
                    }
                })

            }
        });
            }
        })
    }
    
   
   
}



/* @function : getAllNewsAgencies
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To get all news agency.
 */
exports.getAllNewsAgencies = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false
    }
    if (req.body.keyword)
        // query['$or'] = [{ ceo_name: { $regex: req.body.keyword, $options: "$i" } }, { company_name: { $regex: req.body.keyword, $options: "$i" } }, { email: { $regex: req.body.keyword, $options: "$i" } }];
        query.company_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
    clientObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('department')
        .populate('sector_id')
        .exec(function (err, data) {
            if (data) {
                clientObj.count(query, function (err, count) {
                    res.json({
                        'code': config.success,
                        'data': data,
                        'count': count
                    });
                })
            } else {
                next(createError(config.serverError, err));
            }
        });
}


/* @function : getAllRPstaff
 *  @author  : Siroi 
 *  @created  : 14-Mar-18
 *  @modified :
 *  @purpose  : To get all rpstaff details.
 */
exports.getAllRPstaff = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        super_admin: true
    }
    let skipSearch = 0;
    let limitSearch = 0;
    if (req.body.keyword) {
        skipSearch = skip;
        limitSearch = limit;
        limit = 0;
        skip = 0;
        // query['$or'] = [{ firstname: { $regex: req.body.keyword, $options: "$i" } },
        // { lastname: { $regex: req.body.keyword, $options: "$i" } },
        // { email: { $regex: req.body.keyword, $options: "$i" } }];
    }
    userTable.find(query, '-authyID -duoVerified -random_email_token -hashcode -verified -password -passport_details -passport_data')
    .sort(sortby)
    .limit(limit)
    .skip(skip)
   
        .exec(function (err, data) {
            console.log('dsfaadsf', data, '---', err);
            if (data) {
                const searchResult = searchByFields(data, req.body.keyword, ["email", "firstname", "lastname"]);
                if (req.body.keyword) {
                    const lim = limitSearch + skipSearch;
                    const sliced = searchResult.slice(skipSearch, lim);
                    res.json({
                        'code': config.success,
                        'data': sliced,
                        'count': searchResult.length
                    });
                } else {
                    userTable.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    });
                }
            } else {
                next(createError(config.serverError, err));
            }
        });
}


/* @function : deleteNewsAgency
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To delete news agency.
 */
exports.deleteNewsAgency = function (req, res, next) {
    if (req.params.news_agency_id) {
        clientObj.update({
            _id: req.params.news_agency_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Client deleted successfully'
                });
            }
        })
    }
}


/* @function : deleteRpstaff
 *  @author  : Siroi 
 *  @created  : 30-Mar-18
 *  @modified :
 *  @purpose  : To deleteRpstaff
 */
exports.deleteRpstaff = function (req, res, next) {
    if (req.params.news_agency_id) {
        userTable.update({
            _id: req.params.news_agency_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));

            } else {
                res.json({
                    'code': config.success,
                    'message': 'RPstaff deleted successfully'
                });
            }
        })
    }
}

/* @function : changeNewsAgencyStatus
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To change news agency status.
 */
exports.changeNewsAgencyStatus = function (req, res, next) {
    if (req.body) {
        clientObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                status: req.body.status
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'News agency status updated successfully'
                });
            }
        })
    }
}



/* @function : changeStatusrpsatff
 *  @author  : siroi 
 *  @created  : 30-Mar-18
 *  @modified :
 *  @purpose  : To change rpstaff status.
 */
exports.changeStatusrpsatff = function (req, res, next) {
    if (req.body) {
        userTable.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                status: req.body.status
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'RPstaff status updated successfully'
                });
            }
        })
    }
}

/* @function : getNewsAgencyDetails
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To get news agency details.
 */
exports.getNewsAgencyDetails = function (req, res, next) {
    if (req.params.news_agency_id) {
        clientObj.findOne({
                _id: req.params.news_agency_id,
                is_deleted: false
            })
            .exec(function (err, news_agency) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    clientObj.find({
                            _id: {
                                $in: req.params.news_agency_id
                            },
                            is_deleted: false
                        })
                        .exec(function (err, news_agencys) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'success',
                                    'data': news_agency,
                                    "agency": news_agencys
                                });
                            }
                        })

                }
            })
    }
}

/* @function : updateNewsAgency
 *  @author  : MadhuriK 
 *  @created  : 19-May-17
 *  @modified :
 *  @purpose  : To update news agency details.
 */

exports.updateNewsAgency = function (req, res, next) {
    console.log("updateNewsAgency", req.body.admindata)
    if (req.body) {
       
            var user = {
                company_name: req.body.company_name,
                // department: item.department,
               // email: item.email,
                type_of_client: req.body.type_of_client,
                no_of_approving_manager_account: req.body.no_of_approving_manager_account,
                no_of_co_admin_account: req.body.no_of_co_admin_account,
                no_of_traveller_account: req.body.no_of_traveller_account,
                no_of_client_admin_account: req.body.no_of_client_admin_account,
                country: req.body.country,
                // firstname: item.firstname,
                // lastname: item.lastname,
                // first_login: false,
                // zip_code: item.zip_code,
                // address: item.address,
              //  mobile_number: number,
                // sector_name: sectorName,
                sector_id: req.body.sector
            }
            console.log('user', user);
            clientObj.update({
                _id: req.body._id
            }, user, {
                upsert: true
            }, function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    console.log('DOne');
                    res.json({
                        'code': config.success,
                        'message': 'News agency details updated successfully'
                    });
                }
            });
    }
}







/* @function : countryRiskLevel
 *  @author  : MadhuriK 
 *  @created  : 22-May-17
 *  @modified :
 *  @purpose  : To get all country risk level of a news agency.
 */
exports.countryRiskLevel = function (req, res, next) {
    if (req.params.news_agency_id) {
        countryObj.find({}, function (err, country) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                countryRiskObj.find({
                    client_admin_id: req.params.news_agency_id
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

}



/* @function : saveCountrySpecificInfo
 *  @author  : MadhuriK 
 *  @created  : 22-May-17
 *  @modified :
 *  @purpose  : To save country specific information for news agency.
 */
exports.saveCountrySpecificInfo = function (req, res, next) {
    if (req.body) {
        countryRiskObj.findOne({
            country_id: req.body._id,
            client_admin_id: req.body.client_admin_id
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
                            'message': 'country specific information updated for the news agency successfully'
                        });
                    }
                })

            } else {
                var country_risk = {
                    country_id: req.body._id,
                    specific_info: req.body.specific_info,
                    client_admin_id: req.body.client_admin_id,
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
                            'message': 'country specific information added for the news agency successfully'
                        });
                    }
                })
            }
        })

    }

}



/* @function : saveCountryColor
 *  @author  : MadhuriK 
 *  @created  : 22-May-17
 *  @modified :
 *  @purpose  : To save county color for news agency.
 */
exports.saveCountryColor = function (req, res, next) {
    if (req.body) {
        countryRiskObj.findOne({
            country_id: req.body._id,
            client_admin_id: req.body.client_admin_id
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
                            'message': 'country color updated for the news agency successfully'
                        });
                    }
                })

            } else {
                var country_risk = {
                    country_id: req.body._id,
                    specific_info: "",
                    client_admin_id: req.body.client_admin_id,
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
                            'message': 'country color added for the news agency successfully'
                        });
                    }
                })
            }
        })

    }
}



/* @function : countryRiskLevelForAllAgencies
 *  @author  : MadhuriK 
 *  @created  : 24-May-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.countryRiskLevelForAllAgencies = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': country
            });
        }
    })
}



/* @function : saveCountryColorForAllNewsAgency
 *  @author  : MadhuriK 
 *  @created  : 24-May-17
 *  @modified :
 *  @purpose  : To save color code for country for all news agencies.
 */
exports.saveCountryColorForAllNewsAgency = function (req, res, next) {
    if (req.body) {
        countryObj.update({
            _id: req.body._id
        }, {
            $set: {
                color: req.body.color,
                checked: req.body.checked
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                clientObj.find({
                    is_deleted: false,
                    admin: true
                }, function (err, users) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        countryRiskObj.find({
                            country_id: req.body._id
                        }, function (err, country_risk) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                // var clientAdminArr = [], clientIdArr = [];
                                // users.forEach(function (user) {
                                //     country_risk.forEach(function (countryRisk) {
                                //         if (user._id.equals(countryRisk.client_admin_id) && req.body._id == countryRisk.country_id) {
                                //             clientAdminArr.push(countryRisk.client_admin_id.toString());
                                //             clientIdArr.push(countryRisk.client_admin_id);
                                //         }

                                //     })

                                // })           
                                // if (clientIdArr.length > 0) {
                                //     countryRiskObj.update({ client_admin_id: { $in: clientIdArr }, country_id: req.body._id }, { $set: { color: req.body.color, checked: req.body.checked } },
                                //         { multi: true }, function (err, update) {
                                //             if (err) {
                                //                 res.json({
                                //                     'error': err,
                                //                     'code': config.error,
                                //                     'message': 'Something went wrong please try again!'
                                //                 });
                                //             } 
                                //         })
                                // }
                                // var countryRiskArr = [];
                                // users.forEach(function (user) {
                                //     if (clientAdminArr.indexOf(user._id.toString()) == -1) {
                                //         countryRiskArr.push({
                                //             client_admin_id: user._id,
                                //             country_id: req.body._id,
                                //             specific_info: "",
                                //             name: req.body.name,
                                //             code: req.body.code,
                                //             color: req.body.color,
                                //             checked: req.body.checked
                                //         })
                                //     }
                                // })
                                // if (countryRiskArr.length > 0) {
                                //     countryRiskObj.create(countryRiskArr, function (err) {
                                //         if (err) {
                                //             res.json({
                                //                 'error': err,
                                //                 'code': config.error,
                                //                 'message': 'Something went wrong please try again!'
                                //             });
                                //         } 
                                //     })
                                // }
                                var clientAdminArr = [],
                                    clientIdArr = [];
                                async.series({
                                    clientadmin: function (callback) {
                                        users.forEach(function (user) {
                                            country_risk.forEach(function (countryRisk) {
                                                if (user._id.equals(countryRisk.client_admin_id) && req.body._id == countryRisk.country_id) {
                                                    clientAdminArr.push(countryRisk.client_admin_id.toString());
                                                    clientIdArr.push(countryRisk.client_admin_id);
                                                }
                                            })
                                        })
                                        if (clientIdArr.length > 0) {
                                            callback(null, clientIdArr);
                                        } else {
                                            callback(null, []);
                                        }
                                    },
                                    countryRiskUpdate: function (callback) {
                                        countryRiskObj.update({
                                            client_admin_id: {
                                                $in: clientIdArr
                                            },
                                            country_id: req.body._id
                                        }, {
                                            $set: {
                                                color: req.body.color,
                                                checked: req.body.checked
                                            }
                                        }, {
                                            multi: true
                                        }, function (err, update) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, update);
                                            }
                                        })
                                    },
                                    countryRiskAdd: function (callback) {
                                        var countryRiskArr = [];
                                        users.forEach(function (user) {
                                            if (clientAdminArr.indexOf(user._id.toString()) == -1) {
                                                countryRiskArr.push({
                                                    client_admin_id: user._id,
                                                    country_id: req.body._id,
                                                    specific_info: "",
                                                    name: req.body.name,
                                                    code: req.body.code,
                                                    color: req.body.color,
                                                    checked: req.body.checked
                                                })
                                            }
                                        })
                                        if (countryRiskArr.length > 0) {
                                            countryRiskObj.create(countryRiskArr, function (err) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    callback(null, []);
                                                }
                                            })
                                        } else {
                                            callback(null, []);
                                        }
                                    },
                                }, function (err, result) {
                                    if (err == null) {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Country color code successfully updated for all the agencies '
                                        });
                                    } else {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    }
}


/* @function : countrySpecificInfoForAllAgency
 *  @author  : MadhuriK 
 *  @created  : 25-May-17
 *  @modified :
 *  @purpose  : To save country specific information for all news agencies.
 */
exports.countrySpecificInfoForAllAgency = function (req, res, next) {
    if (req.body) {
        countryObj.update({
            _id: req.body._id
        }, {
            $set: {
                specific_info: req.body.specific_info
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                clientObj.find({
                    is_deleted: false,
                    admin: true
                }, function (err, users) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        countryRiskObj.find({
                            country_id: req.body._id
                        }, function (err, country_risk) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                var clientAdminArr = [],
                                    clientIdArr = [];
                                async.series({
                                    clientadmin: function (callback) {
                                        users.forEach(function (user) {
                                            country_risk.forEach(function (countryRisk) {
                                                if (user._id.equals(countryRisk.client_admin_id) && req.body._id == countryRisk.country_id) {
                                                    clientAdminArr.push(countryRisk.client_admin_id.toString());
                                                    clientIdArr.push(countryRisk.client_admin_id);
                                                }
                                            })
                                        })
                                        if (clientIdArr.length > 0) {
                                            callback(null, clientIdArr);
                                        } else {
                                            callback(null, []);
                                        }
                                    },
                                    countryRiskUpdate: function (callback) {
                                        countryRiskObj.update({
                                            client_admin_id: {
                                                $in: clientIdArr
                                            },
                                            country_id: req.body._id
                                        }, {
                                            $set: {
                                                specific_info: req.body.specific_info
                                            }
                                        }, {
                                            multi: true
                                        }, function (err, update) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                callback(null, update);
                                            }
                                        })
                                    },
                                    countryRiskAdd: function (callback) {
                                        var countryRiskArr = [];
                                        users.forEach(function (user) {
                                            if (clientAdminArr.indexOf(user._id.toString()) == -1) {
                                                countryRiskArr.push({
                                                    client_admin_id: user._id,
                                                    country_id: req.body._id,
                                                    specific_info: req.body.specific_info,
                                                    name: req.body.name,
                                                    code: req.body.code,
                                                    color: "",
                                                })
                                            }
                                        })
                                        if (countryRiskArr.length > 0) {
                                            countryRiskObj.create(countryRiskArr, function (err) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    callback(null, []);
                                                }
                                            })
                                        } else {
                                            callback(null, []);
                                        }
                                    },
                                }, function (err, result) {
                                    if (err == null) {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Country specific info updated successfully for all the agencies '
                                        });
                                    } else {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }
                        })
                    }
                })
            }
        })
    }
}


/* @function : getAllSectors
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To get all sectors for news agency(client)
 */
exports.getAllSectors = function (req, res, next) {
    if(req.user.super_admin == true){
    sectorObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, sectors) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': sectors
            });
        }
    })
}else{
console.log('ffffff', req.user);
    clientObj.find({
        _id:req.user.client_id,
        is_deleted:false

    }).exec(function(err,client){
        
        sectorObj.find({
            _id:client[0].sector_id,
            is_deleted: false,
            status: "Active",
            

        }, function (err, sectors) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': sectors
                });
            }
        })


    })
    
    
}
}

exports.loginAsClient = function (req, res, next) {
    if (req.body) {
        var body = req.body;
        var email = body.email;
        var password = body.password;
        var jwtToken = null;
        clientObj.findOne({
            email: email,
            password: password,
            is_deleted: false,
            status: 'Active',
            admin: true,
            $or: [{
                "client_admin_id": {
                    $exists: true,
                    $ne: null
                }
            }, {
                "client_admin_id": {
                    $exists: false
                }
            }]
        }, function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Invalid email or password'
                });
            } else {
                var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                var params = {
                    id: user._id
                }
                var text = "";
                var activation = "";
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                for (var i = 0; i < 6; i++) {
                    activation += possible.charAt(Math.floor(Math.random() * possible.length));
                }
                jwtToken = jwt.sign(params, config.secret, {
                    expiresIn: expirationDuration
                });
                if (jwtToken) {
                    user.duoToken = jwtToken;
                    user.duoVerified = true;
                    user.save(function (err, result) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            user.duoToken = 'Bearer ' + jwtToken;
                            res.json({
                                'code': config.success,
                                'data': user,
                                'message': 'Login Successfull'
                            });
                        }
                    });
                } else {
                    res.json({
                        'code': config.error,
                        'err': 'Invalid token'
                    });
                }
            }
        });
    }
}