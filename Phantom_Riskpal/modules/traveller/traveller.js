var userObj = require('./../../schema/users.js'); // include user schema file
var countryObj = require('./../../schema/country.js'); // include country schema file
var currencyObj = require('./../../schema/currency.js'); // include currency schema file
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var raObj = require('./../../schema/news_ra.js'); // include news_ra schema file
var riskAssociatedCategoryObj = require('./../../schema/risk_associated_category.js'); // include risk_associated_category schema file
var countryThreatMatrixObj = require('./../../schema/country_threat_matrix.js'); // include country_threat_matrix schema file
var countryThirdPartyMatrixObj = require('./../../schema/country_matrix'); // from itravel.com
var countryRiskObj = require('./../../schema/country_risk.js'); // include country_risk schema file
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt_secret.js');
var countryMatrixHelper = require('../../helper/country-matrix.helper');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var moment = require('moment');
var multer = require('multer');
var createError = require('http-errors');
var authObj = require('./../../helper/auth.helper');

var storage = multer.diskStorage({
    destination: function(req, files, callback) {
        callback(null, './clientPortal/uploads');
    },
    filename: function(req, files, callback) {
        callback(null, Date.now() + '_' + files.originalname);
    }
});
var upload = multer({
    storage: storage
}).any();
var _ = require('underscore');
var async = require('async');
var mongoose = require('mongoose');
var json2csv = require('json2csv');
var fs = require('fs');

var countryMatrix = require('./../../helper/country-matrix.helper.js');
var pd = require('pretty-data').pd;

var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
var userTable= require('./../../schema/usertables.js'); //user table update 

const exporter = require('highcharts-export-server');
const borderRadius = require('highcharts-border-radius');
var { encryptUserFields } = require('./../../helper/general.helper');

// borderRadius(exporter);

/* @function : travellerRegister
 *  @author  : MadhuriK 
 *  @created  : 31-Mar-17
 *  @modified :
 *  @purpose  : To traveller registration.
 */
exports.travellerRegister = function(req, res, next) {
    if (req.body) {
        userObj.find({
            email: { $regex: new RegExp("^" + req.body.email.toLowerCase(), "i") },
            is_deleted: false
        }, function(err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var key = 'salt_from_the_user_document';
                var cipher = crypto.createCipher('aes-256-cbc', key);
                cipher.update(req.body.password, 'utf8', 'base64');
                var encryptedPassword = cipher.final('base64');
                //create a user object
                var number = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
                var user = new userObj({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: encryptedPassword,
                    admin: false,
                    duoToken: "",
                    passport_data: [{
                        passport_number: "",
                        nationality: ""
                    }],
                    mobile_number: number
                });
                user.save(function(err, user) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        var smtpTransport = nodemailer.createTransport({
                            service: config.service,
                            auth: {
                                user: config.username,
                                pass: config.password
                            }
                        });
                        var mailOptions = {
                            to: req.body.email,
                            from: 'noreply.riskpal@gmail.com',
                            subject: 'successfully registration',
                            html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                            Please click on the below link to activate your account: <br><br> \n\ \n\
                            <p><a target="_blank" href="' + config.baseUrl + '/traveller/#/activate-account/' + user._id + '">Click Here</a>\n\
                            </p><br><br>Thanks,<br>  RiskPal Team' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function(err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'You have been registered successfully Please check your email and activate your account'
                                });
                            }
                        });
                    }
                });
            }
        });
    }
}


/* @function : travellerActiveAccount
 *  @author  : MadhuriK 
 *  @created  : 31-Mar-17
 *  @modified :
 *  @purpose  : To active admin account.
 */
exports.travellerActiveAccount = function(req, res, next) {
    var key = 'salt_from_the_user_document';
    var cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.update(req.body.password, 'utf8', 'base64');
    var encryptedPassword = cipher.final('base64');
    if (req.body) {
        userObj.findOneAndUpdate({
            _id: req.body.travellerId,
            status: 'Inactive',
            password: encryptedPassword,
            is_deleted: false
        }, {
            $set: {
                status: 'Active'
            }
        }, function(err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Either you have entered wrong password or you have already activated your account'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Traveller account activated successfully'
                });
            }
        })

    }
}


/* @function : travellerLogin
 *  @author  : MadhuriK 
 *  @created  : 31-Mar-17
 *  @modified :
 *  @purpose  : To traveller login.
 */


exports.travellerLogin = function(req, res, next) {
    if (req.body) {
        var body = req.body;
        var email = body.email;
        var password = body.password;
        var jwtToken = null;
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        userObj.findOne({
            email: { $regex: new RegExp("^" + req.body.email.toLowerCase(), "i") },
            password: encryptedPassword,
            is_deleted: false,
            status: 'Active',
            admin: false
        }, function(err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'message': 'Invalid email or password'
                });
            } else {
                user.save(function(err, result) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': '2 factor varifiacation initialized!'
                        });
                    }
                });
            }
        });
    }
}

/* @function : checkLogin
 *  @author  : MadhuriK 
 *  @created  : 17-Apr-17
 *  @modified :
 *  @purpose  : To check traveller login.
 */
exports.checkLogin = function(req, res, next) {
    if (req.headers["authorization"]) {
        var bearer = req.headers["authorization"].split(' ');
        var bearerToken = bearer[1];
        jwt.verify(bearerToken, config.secret, function(err, decoded) {
            req.user = decoded;
            if (err) {
                res.json({
                    'code': config.error,
                    
                    'message': 'Your Session Expired, Please login Again.'
                });
            } else {
                if (bearer.length == 2) {
                    userObj.findOne({
                        duoToken: bearer[1],
                        is_deleted: false,
                        status: 'Active',
                        admin: false
                    }, function(err, user) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else if (!user) {
                            res.json({
                                'code': config.error,
                                'err': 'Authentication failed',
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Authenticated',
                                'data': user
                            });
                        }
                    });
                } else {
                    res.json({
                        'code': config.error,
                        'err': 'Authentication failed'
                    });
                }

            }
        });
    } else {
        res.json({
            'code': config.error,
            'err': 'Authentication failed'
        });
    }
}


/* @function : travellerLogout
 *  @author  : MadhuriK 
 *  @created  : 17-Apr-17
 *  @modified :
 *  @purpose  : To logout traveller login.
 */
exports.travellerLogout = function(req, res, next) {
    if (req.headers.authorization) {
        var parts = req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : "";
        if (parts.length == 2) {
            userObj.findOne({
                _id: req.traveller.id,
                duoToken: parts[1],
                duoVerified: true,
                admin: false
            }, function(err, user) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (user) {
                    user.duoToken = '';
                    user.duoVerified = false;
                    user.save(function(err, data) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Logout successfully'
                            });
                        }
                    });
                } else {
                    res.json({
                        'code': config.error,
                        'err': 'Authentication failed'
                    });
                }
            });
        } else {
            res.json({
                'code': config.error,
                'err': 'Authentication failed'
            });
        }
    } else {
        res.json({
            'code': config.error,
            'err': 'Authentication failed'
        });
    }
}


/* @function : travellerForgetPass
 *  @author  : MadhuriK 
 *  @created  : 25-Apr-17
 *  @modified :
 *  @purpose  : To traveller forget password.
 */
exports.travellerForgetPass = function(req, res, next) {
    if (req.body.email) {
        userObj.findOne({
            email: { $regex: new RegExp("^" + req.body.email.toLowerCase(), "i") },
            is_deleted: false,
            admin: false
        }, function(err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Email does not exist'
                });
            } else {
                var smtpTransport = nodemailer.createTransport({
                    service: config.service,
                    auth: {
                        user: config.username,
                        pass: config.password
                    }
                });
                var mailOptions = {
                    to: req.body.email,
                    from: 'noreply.riskpal@gmail.com',
                    subject: 'Forget Password',
                    html: 'Hello, ' + user.firstname + '<br><br> \n\
                            Please click on the below link to reset your password: <br><br> \n\ \n\
                            <p><a target="_blank" href="' + config.baseUrl + '/traveller/#/reset-password/' + user._id + '">Click Here</a>\n\
                            </p><br><br>Thanks,<br>  RiskPal Team' // html body
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Reset password link sent to your email please check'
                        });
                    }
                });
            }
        })
    }
}


/* @function : travellerResetPass
 *  @author  : MadhuriK 
 *  @created  : 25-Apr-17
 *  @modified :
 *  @purpose  : To traveller reset password.
 */
exports.travellerResetPass = function(req, res, next) {
    if (req.body) {
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        userObj.update({
            _id: req.body.userId,
            is_deleted: false,
            admin: false
        }, {
            $set: {
                password: encryptedPassword
            }
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Password reset successfully'
                });
            }
        })
    }
}


// for supplier


/* @function : getAllCountries
 *  @author  : MadhuriK 
 *  @created  : 02-Jun-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.getAllCountries = function(req, res, next) {
    countryObj.find({}, function(err, countries) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': countries
            });
        }
    })
}

/* @function : getAllCurrencies
 *  @author  : MadhuriK 
 *  @created  : 02-Jun-17
 *  @modified :
 *  @purpose  : To get all currencies.
 */
exports.getAllCurrencies = function(req, res, next) {
    currencyObj.find({}, function(err, currency) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': currency
            });
        }
    })
}


/* @function : uploadAttachment
 *  @author  : MadhuriK 
 *  @created  : 02-Jun-17
 *  @modified :
 *  @purpose  : To upload attachment of supplier.
 */
exports.uploadAttachment = function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        } else if (req.file !== undefined) {
            var filePath = req.file.path.split("/");
            var dbPath = '/' + filePath[1] + '/' + filePath[2];
            res.json({
                status: "Sucess",
                data: dbPath
            });
        } else {
            return res.end("Error uploading file.");
        }
    });
}


/* @function : addSupplier
 *  @author  : MadhuriK 
 *  @created  : 02-Jun-17
 *  @modified :
 *  @purpose  : To add supplier.
 */
exports.addSupplier = function(req, res, next) {
    if (req.body) {
        userObj.findOne({
            _id: req.traveller.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function(err, traveller) {
            req.body.traveller_id = req.traveller.id;
            // req.body.rate = req.body.rate.replace(/'/g, '');
            req.body.rate = req.body.rate ? req.body.rate.replace(/'/g, '') : "";
            var supplier = new supplierObj(req.body);
            supplier.client_admin_id = traveller.client_admin_id;
            supplier.companyId = traveller.client_admin_id.companyId;
            supplier.save(function(err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'supplier added successfully'
                    });
                }
            })
        })

    }

}


/* @function : getAllSupplier
 *  @author  : MadhuriK 
 *  @created  : 10-Apr-17
 *  @modified :
 *  @purpose  : To add get all supplier.
 */
exports.getAllSupplier = function(req, res, next) {
    userObj.findOne({
        _id: req.traveller.id
    }).populate('client_admin_id').exec(function(err, traveller) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {};
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        // var query = { is_deleted: false, $or: [{ client_admin_id: traveller.client_admin_id }, { traveller_id: req.traveller.id }] }
        var query = {
            is_deleted: false,
            // client_admin_id: traveller.client_admin_id
            companyId: traveller.client_admin_id.companyId
        }
        if (req.body.keyword)
            query['$or'] = [{
                supplier_name: {
                    $regex: req.body.keyword,
                    $options: "$i"
                }
            }, {
                country: {
                    $regex: req.body.keyword,
                    $options: "$i"
                }
            }, {
                service_provided: {
                    $regex: req.body.keyword,
                    $options: "$i"
                }
            }, {
                rate: {
                    $regex: req.body.keyword,
                    $options: "$i"
                }
            }];

        supplierObj.find(query)
            .populate('department')
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .exec(function(err, data) {
                if (data) {
                    // for sorting by rating_with_star by default
                    // if (Object.keys(sortby) == 'rating_with_star') {
                    // if (sortby[Object.keys(sortby)] == 'asc') {
                    //     user = _.sortBy(data, function (obj) {
                    //         obj.rating_with_star = obj.rating_with_star == undefined ? '0' : obj.rating_with_star;
                    //         return Number(obj.rating_with_star);
                    //     });
                    //     data = user;
                    // } else {
                    //     user = _.sortBy(data, function (obj) {
                    //         obj.rating_with_star = obj.rating_with_star == undefined ? '0' : obj.rating_with_star;
                    //         return Number(obj.rating_with_star);
                    //     });
                    //     data = user.reverse();
                    // }
                    //   }
                    supplierObj.count(query, function(err, count) {
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
    })
}


/* @function : deleteSupplier
 *  @author  : MadhuriK 
 *  @created  : 10-Apr-17
 *  @modified :
 *  @purpose  : To delete supplier.
 */
exports.deleteSupplier = function(req, res, next) {
    if (req.params.supplier_id) {
        supplierObj.update({
            _id: req.params.supplier_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'supplier deleted successfully'
                });
            }
        })
    }

}


/* @function : getSupplierDetails
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
 *  @modified :
 *  @purpose  : To get details of supplier.
 */
exports.getSupplierDetails = function(req, res, next) {
    var supplier_id = req.params.supplier_id;
    if (supplier_id) {
        supplierObj.findOne({
            _id: supplier_id,
            is_deleted: false
        }, function(err, supplier) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplier,
                });
            }
        })
    }
}


/* @function : updateSupplier
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
 *  @modified :
 *  @purpose  : To update supplier.
 */
exports.updateSupplier = function(req, res, next) {
    if (req.body._id) {
        var supplier_id = req.body._id;
        delete req.body._id;
        var supplier = {
            supplier_name: req.body.supplier_name,
            service_provided: req.body.service_provided,
            sourced_by: req.body.sourced_by,
            contact: req.body.contact,
            rating_with_star: req.body.rating_with_star,
            cost: req.body.cost,
            currency: req.body.currency,
            city: req.body.city,
            country: req.body.country,
            rate: req.body.rate.replace(/'/g, ''),
            description: req.body.description
        }
        supplierObj.update({
            _id: supplier_id,
            is_deleted: false
        }, {
            $set: supplier
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'supplier updated successfully'
                });

            }
        })

    }

}


// country page


/* @function : getCountryList
 *  @author  : MadhuriK 
 *  @created  : 12-Jun-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.getCountryList = function(req, res, next) {
    // countryObj.find({}, function(err, data) {
    //     if (data) {
    //         res.json({
    //             'code': config.success,
    //             'data': data,
    //         });
    //     } else {
    //         res.json({
    //             'error': err,
    //             'code': config.error,
    //             'message': 'Something went wrong please try again!'
    //         });
    //     }
    // })
   ;
    var query = {}
    
    countryObj.find({})
       .sort('name')
        
        .exec(function (err, data) {
            if (data) {
                countryObj.count(query, function (err, count) {
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




/* @function : getCategoriesList
 *  @author  : MadhuriK 
 *  @created  : 13-Jun-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getCategoriesList = function(req, res, next) {

    var query={

        is_deleted: false,
        status:"Active"

        
    }
    var sort = { position: 1 };

    riskAssociatedCategoryObj.find(query)
    .sort(sort)
    .exec( function(err, categories) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': categories,
            });
        }
    })
}



/* @function : getCountryThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 13-Jun-17
 *  @modified :
 *  @purpose  : To get country threat matrix.
 */
function getCountryThreatMatrixPromise(item) {
    return new Promise (function ( resolve, reject ) {
        countryThreatMatrixObj.find({
            countryname: item.country_id.name
        }).populate('category_id').exec( function(err, threatMatrix) {
            if ( err ) {
                reject( err );
            }
            resolve(threatMatrix);
        });
    })
    
}
exports.getCountryThreatMatrix = function(req, res, next) {
    var countryArray = req.body.country;
    var realTimeDataFromLiveApi = req.body.realTimeDataFromLiveApi;

    // console.log('countrymatrix array1', realTimeDataFromLiveApi);
    // for risk assessment page we have to call real time api else from database
    if ( realTimeDataFromLiveApi && typeof realTimeDataFromLiveApi != 'undefined' ) {
        // call country matrix api then saved/update database
        countryMatrixHelper.getCountryThreatMatrixRealTime(countryArray, function (err, data ) {
            var realTimeError;
            if (err) {
                realTimeError = err;
            }
            getMatrixFromDatabaseTable(countryArray, function(err, data) {
                if (err) {
                    // res.json({
                    //     'error': err,
                    //     'code': config.error,
                    //     'realTimeError': realTimeError,
                    //     'message': 'Something went wrong please try again!'
                    // });
                    next(createError(config.serverError, err));
                }
                res.json({
                    'code': config.success,
                    'realTimeError': realTimeError,
                    'countryObj': data,
                    
                });
            });
        });
    } else {
        getMatrixFromDatabaseTable(countryArray, function(err, data) {
            if (err) {
                next(createError(config.serverError, err));
            }
            res.json({
                'code': config.success,
                'countryObj': data,
                
            });
        });
    }
    
}

exports.generateGraph = function (req, res, next) {
    var countryArray = req.body.country;
    var realTimeDataFromLiveApi = req.body.realTimeDataFromLiveApi;
    console.log("countryArray :", countryArray);
    getMatrixFromDatabaseTable(countryArray, async function (err, countryData) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            //Export settings
            var category = [];
            var graphData = [];
            var graphs = [];
            var height = 0;

            var colors = ['#FF0000', '#FFFF00', '#008000'];
            for(const country of countryData) {
                if (country.threatMatrix.length < 7){
                    height = 190;
                } else if(country.threatMatrix.length < 12 && country.threatMatrix.length > 7) {
                    height = 290;
                } else {
                    height = 0;
                }
                country.threatMatrix.forEach(function (item) {
                    category.push(item.category_name);
                    if (item.country_risk === 'High') {
                        graphData.push({ y: 150, color: colors[0] });
                    } else if (item.country_risk === 'Medium') {
                        graphData.push({ y: 100, color: colors[1] });
                    } else if (item.country_risk === 'Low') {
                        graphData.push({ y: 50, color: colors[2] });
                    } else {
                        graphData.push({ y: 50, color: colors[2] });
                    }
                });
                var graph = await exportGraph(category, graphData, height);
                graphs.push(graph);
                if (graphs.length == countryData.length) {
                    res.json({
                        'code': config.success,
                        'message': 'Array data should come',
                        'data': graphs,
                        'length': countryData.length,
                        'country': countryData
                    });
                } else {
                    category = [];
                    graphData = [];
                }
            }
        }
    });
}

var exportGraph = function(category, graphData, height) {
    return new Promise( function (resolve, reject) {
        exporter.initPool();
        var count = 0;
         return exporter.export(graphSettings(category, graphData, height), function (err, res1) {
            console.log("res1 :",  res1);
            if ( err ){
                reject(err);
            }
            exporter.killPool();
           resolve('data:image/png;base64,'+res1.data);
        });
    })
}

var graphSettings = function(category, graphData, height){
    return {
        type: 'png',
        options: {
            title: {
                text: 'Country Risk Overview'
            },
            xAxis: {
                categories: category
            },
            credits: {
                enabled: false
            },
            legend: {
                enabled: false
            },
            yAxis: {
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                title: false,
                labels: {
                    enabled: false
                }
            },
            chart: {
                height: height
              },
            plotOptions: {
                series: {
                    pointPadding: 0,
                    pointWidth: 15,
                    // pointPadding: 5
                },
            },
            series: [
                {
                    type: 'bar',
                    data: graphData,
                    borderRadiusBottomRight: 10,
                    borderRadiusTopRight: 10
                }
            ]
        }
    };
}


function getMatrixFromDatabaseTable(countryArray, cb) {
    countryThirdPartyMatrixObj.find({country_id: countryArray}).populate('country_id')
    .exec( async function(err, countryMatrix) {
        if (err) {
            cb(err, null);
        }
        if ( countryMatrix.length > 0 ) {
            var arr = [];
            for ( const [index, item] of countryMatrix.entries() ) {
                var threatmatrix = await getCountryThreatMatrixPromise(item);
                arr.push({
                    _id: item._id,
                    country_id: item.country_id,
                    code: item.code,
                    security: item.security,
                    description: item.description,
                    threatMatrix: threatmatrix});
                countryMatrix[index].threatMatrix = threatmatrix;
            }
           
               cb(null, arr);
            
        }
    });
}
/* @function : getCountryThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get how many times country visited by traveller.
 */
exports.getCountriesVisited = function(req, res, next) {
    if (req.traveller.id) {
        raObj.find({
            traveller_id: req.traveller.id,
            is_deleted: false
        }, function(err, raData) {
            // var countryArr = [];
            // raData.forEach(function (ra) {
            //     ra.country.forEach(function (raCountry) {
            //         if (countryArr.indexOf(raCountry.name) == -1) {
            //             countryArr.push(raCountry.name);
            //         }
            //     })
            // })
            // var countArr = [];

            // var arr = [];

            // raData.forEach(function (ra) {
            //     ra.country.forEach(function (raCountry) {
            //         arr.push(raCountry);
            //     })
            // })

            // countryArr.forEach(function (countryName) {
            //     var count = 0;
            //     arr.forEach(function (country) {
            //         if (countryName == country.name) {
            //             count++;
            //         }
            //     })
            //     countArr.push(count);
            // })


            async.waterfall([
                function(callback) {
                    var countryArr = [];
                    raData.forEach(function(ra) {
                        ra.country.forEach(function(raCountry) {
                            if (countryArr.indexOf(raCountry.name) == -1) {
                                countryArr.push(raCountry.name);
                            }
                        })
                    })
                    callback(null, countryArr);
                },
                function(countryArr, callback) {
                    var arr = [];

                    raData.forEach(function(ra) {
                        ra.country.forEach(function(raCountry) {
                            arr.push(raCountry);
                        })
                    })
                    callback(null, countryArr, arr);
                },
                function(countryArr, arr, callback) {
                    var countArr = [];
                    countryArr.forEach(function(countryName) {
                        var count = 0;
                        arr.forEach(function(country) {
                            if (countryName == country.name) {
                                count++;
                            }
                        })
                        countArr.push(count);
                    })
                    callback(null, countryArr, countArr);
                }
            ], function(err, result, result1) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': result1,
                        'label': result
                    })
                }
            });
        })
    }

}


/* @function : getTripsByYear
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get yearly trips of a traveller
 */
exports.getTripsByYear = function(req, res, next) {
    if (req.traveller.id) {
        raObj.aggregate([{
                $match: {
                    traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                    is_deleted: false,
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function(err, result) {

            var tripArr = [];
            var yearArr = [];
            result.forEach(function(data) {
                tripArr.push(data.count);
                yearArr.push(data._id.year);
            })

            if (tripArr.length > 0 && yearArr.length > 0) {
                res.json({
                    'code': config.success,
                    'data': tripArr,
                    'label': yearArr
                })
            } else {
                res.json({
                    'code': config.success,
                    'data': tripArr,
                    'label': yearArr
                })
            }

        })
    }
}


/* @function : getTripsByMonth
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get monthly trips of a traveller
 */
exports.getTripsByMonth = function(req, res, next) {
    if (req.traveller.id) {
        raObj.aggregate([{
                $match: {
                    traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                    is_deleted: false,
                }
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    count: {
                        $sum: 1
                    }
                }
            }
        ], function(err, result) {
            console.log("result>>>>>>month", result)
            var tripArr = [];
            var monthArr = [];
            var monthNames = [
                "", "January", "February", "March",
                "April", "May", "June",
                "July", "August", "September",
                "October", "November", "December"
            ];
            result.forEach(function(data) {
                tripArr.push(data.count);
                monthArr.push(monthNames[data._id.month]);
            })
            if (tripArr.length > 0 && monthArr.length > 0) {
                res.json({
                    'code': config.success,
                    'data': tripArr,
                    'label': monthArr
                })
            } else {
                res.json({
                    'code': config.success,
                    'data': tripArr,
                    'label': monthArr
                })
            }

        })
    }
}


/* @function : getTodaysTrips
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get todays trips of a traveller
 */
exports.getTodaysTrips = function(req, res, next) {
    var currentDate = new Date();
    var today = moment().format("YYYY-MM-DD");
    raObj.aggregate([{
            $match: {
                traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                is_deleted: false,
            }
        },
        {
            $group: {
                _id: {
                    year: {
                        $year: "$createdAt"
                    },
                    month: {
                        $month: "$createdAt"
                    },
                    day: {
                        $dayOfMonth: "$createdAt"
                    }
                },
                count: {
                    $sum: 1
                }
            }
        }
    ], function(err, result) {
        console.log("result", result)
        var countArr = [];
        var labelArr = [];
        labelArr.push(today);
        if (err) {
            next(createError(config.serverError, err));
        }
        if (result.length > 0) {
            result.forEach(function(raResult) {
                if ((raResult._id.year == currentDate.getFullYear()) && (raResult._id.month == currentDate.getMonth() + 1) && (raResult._id.day == currentDate.getDate())) {
                    countArr.push(raResult.count);
                }
            })
        }
        if (labelArr.length > 0 && countArr.length > 0) {
            res.json({
                'code': config.success,
                'data': countArr,
                'label': labelArr
            })
        } else {
            res.json({
                'code': config.success,
                'data': countArr,
                'label': labelArr
            })
        }
    })
}



/* @function : getNoOfTrips
 *  @author  : MadhuriK 
 *  @created  : 27-Jun-17
 *  @modified :
 *  @purpose  : To get country visited by traveller with red amber green rating.
 */
exports.getNoOfTrips = function(req, res, next) {
    if (req.traveller.id) {
        raObj.find({
                traveller_id: req.traveller.id,
                is_deleted: false
            }).populate('traveller_id')
            .exec(function(err, raArr) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (raArr.length > 0) {
                        var countryArr = [];
                        var arr = [];
                        raArr.forEach(function(raObj) {
                            raObj.country.forEach(function(countryObj) {
                                if (countryArr.indexOf(countryObj.name) == -1) {
                                    countryArr.push(countryObj.name);
                                }
                                arr.push(countryObj.name);
                            })
                        })
                        countryRiskObj.find({
                            // client_admin_id: raArr[0].traveller_id.client_admin_id
                            companyId: raArr[0].traveller_id.client_admin_id.companyId
                        }, function(err, countryRiskLevel) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                countryObj.find({
                                    name: {
                                        $in: countryArr
                                    }
                                }, function(err, countryData) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        var arrMerge = [];
                                        countryData.forEach(function(countryObj) {
                                            var flag = "";
                                            countryRiskLevel.forEach(function(countryRiskLevelObj) {
                                                if (countryRiskLevelObj.name == countryObj.name) {
                                                    arrMerge.push(countryRiskLevelObj);
                                                    flag = "if";
                                                } else if (flag == "") {
                                                    flag = "else";
                                                }
                                            })
                                            if (flag == "else") {
                                                arrMerge.push(countryObj);
                                            }

                                        })
                                        var labelArr = ['Red', 'Amber', 'Green']
                                        var countArr = [];
                                        var count = 0,
                                            count1 = 0,
                                            count2 = 0,
                                            count3 = 0;
                                        arr.forEach(function(countryName) {
                                            arrMerge.forEach(function(countryData) {
                                                if (countryName == countryData.name && countryData.color == "'red'") {
                                                    count++;
                                                } else if (countryName == countryData.name && countryData.color == "'amber'") {
                                                    count1++;
                                                } else if (countryName == countryData.name && countryData.color == "'green'") {
                                                    count2++;
                                                } else if (countryName == countryData.name && countryData.color == undefined) {
                                                    count2++;
                                                }
                                            })

                                        })
                                        countArr.push(count);
                                        countArr.push(count1);
                                        countArr.push(count2);
                                        if (labelArr.length > 0 && countArr.length > 0) {
                                            res.json({
                                                'code': config.success,
                                                'data': countArr,
                                                'label': labelArr
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        res.json({
                            'code': config.success,
                            'data': [],
                            'label': []
                        })
                    }
                }
            })
    }
}



/* @function : downloadCountriesVisitedReport
 *  @author  : MadhuriK 
 *  @created  : 03-July-17
 *  @modified :
 *  @purpose  : To get download countries visited by traveller
 */
exports.downloadCountriesVisitedReport = function(req, res, next) {
    raObj.find({
        traveller_id: req.traveller.id,
        is_deleted: false
    }, function(err, raData) {
        async.waterfall([
            function(callback) {
                var countryArr = [];
                raData.forEach(function(ra) {
                    ra.country.forEach(function(raCountry) {
                        if (countryArr.indexOf(raCountry.name) == -1) {
                            countryArr.push(raCountry.name);
                        }
                    })
                })
                callback(null, countryArr);
            },
            function(countryArr, callback) {
                var arr = [];

                raData.forEach(function(ra) {
                    ra.country.forEach(function(raCountry) {
                        arr.push(raCountry);
                    })
                })
                callback(null, countryArr, arr);
            },
            function(countryArr, arr, callback) {
                var countArr = [];
                countryArr.forEach(function(countryName) {
                    var count = 0;
                    arr.forEach(function(country) {
                        if (countryName == country.name) {
                            count++;
                        }
                    })
                    countArr.push(count);
                })
                callback(null, countryArr, countArr);
            }
        ], function(err, result, result1) {
            var data = [];
            result.forEach(function(resData, $index) {
                data.push({
                    country: resData,
                    number_of_time_visit: result1[$index]
                })
            })
            if (data) {
                json2csv({
                    data: data,
                    fields: ['country', 'number_of_time_visit'],
                    fieldNames: ['Country Name', 'Number of time visit']
                }, function(err, csv) {
                    if (err) {
                        throw err;
                    } else {
                        var path = './riskpal-client/uploads/traveller_countries_visited_report.csv';
                        fs.writeFile(path, csv, function(err) {
                            if (err) {
                                throw err;
                            } else {
                                res.download(path);
                            }
                        })
                    }
                })
            }
        });
    })
}



/* @function : downloadgetNoOfTripsReport
 *  @author  : MadhuriK 
 *  @created  : 03-July-17
 *  @modified :
 *  @purpose  : To get download report for no of trips of traveller in red amber green zone.
 */
exports.downloadNoOfTripsReport = function(req, res, next) {
    if (req.traveller.id) {
        raObj.find({
                traveller_id: req.traveller.id,
                is_deleted: false
            })
            .populate('traveller_id')
            .exec(function(err, raArr) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    var countryArr = [];
                    var arr = [];

                    raArr.forEach(function(raObj) {
                        raObj.country.forEach(function(countryObj) {
                            if (countryArr.indexOf(countryObj.name) == -1) {
                                countryArr.push(countryObj.name);
                            }
                            arr.push(countryObj.name);
                        })
                    })

                    countryRiskObj.find({
                        // client_admin_id: raArr[0].traveller_id.client_admin_id
                        companyId: raArr[0].traveller_id.client_admin_id.companyId
                    }, function(err, countryRiskLevel) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            countryObj.find({
                                name: {
                                    $in: countryArr
                                }
                            }, function(err, countryData) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    var arrMerge = [];
                                    countryData.forEach(function(countryObj) {
                                        var flag = "";
                                        countryRiskLevel.forEach(function(countryRiskLevelObj) {
                                            if (countryRiskLevelObj.name == countryObj.name) {
                                                arrMerge.push(countryRiskLevelObj);
                                                flag = "if";
                                            } else if (flag == "") {
                                                flag = "else";
                                            }
                                        })

                                        if (flag == "else") {
                                            arrMerge.push(countryObj);
                                        }

                                    })
                                    var labelArr = ['Red', 'Amber', 'Green']
                                    var countArr = [];
                                    var count = 0,
                                        count1 = 0,
                                        count2 = 0,
                                        count3 = 0;
                                    arr.forEach(function(countryName) {
                                        arrMerge.forEach(function(countryData) {
                                            if (countryName == countryData.name && countryData.color == "'red'") {
                                                count++;
                                            } else if (countryName == countryData.name && countryData.color == "'amber'") {
                                                count1++;
                                            } else if (countryName == countryData.name && countryData.color == "'green'") {
                                                count2++;
                                            } else if (countryName == countryData.name && countryData.color == undefined) {
                                                count2++;
                                            }
                                        })

                                    })
                                    countArr.push(count);
                                    countArr.push(count1);
                                    countArr.push(count2);
                                    if (labelArr.length > 0 && countArr.length > 0) {

                                        var data = [];
                                        labelArr.forEach(function(rate, $index) {
                                            data.push({
                                                rate: rate,
                                                no_of_trip: countArr[$index]
                                            })
                                        })
                                        if (data) {
                                            json2csv({
                                                data: data,
                                                fields: ['rate', 'no_of_trip'],
                                                fieldNames: ['Rate', 'Number Of Trips']
                                            }, function(err, csv) {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    var path = './riskpal-client/uploads/traveller_trip_report_under_red_amber_green_zone.csv';
                                                    fs.writeFile(path, csv, function(err) {
                                                        if (err) {
                                                            throw err;
                                                        } else {
                                                            res.download(path);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            })
    }
}



/* @function : downloadTripsReport
 *  @author  : MadhuriK 
 *  @created  : 03-July-17
 *  @modified :
 *  @purpose  : To get download report for no of trips of traveller by yearly monthly and daily basis.
 */
exports.downloadTripsReport = function(req, res, next) {
    if (req.traveller.id) {
        async.waterfall([
            function(callback) {
                raObj.aggregate([{
                        $match: {
                            traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                            is_deleted: false,
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: "$createdAt"
                                }
                            },
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ], function(err, result) {

                    var dataArr = [];
                    result.forEach(function(data) {
                        dataArr.push({
                            count: data.count,
                            duration: data._id.year
                        });
                    })
                    if (dataArr.length > 0) {
                        callback(null, dataArr);
                    }

                })
            },
            function(dataArr, callback) {
                raObj.aggregate([{
                        $match: {
                            traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                            is_deleted: false,
                        }
                    },
                    {
                        $group: {
                            _id: {
                                month: {
                                    $month: "$createdAt"
                                }
                            },
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ], function(err, result) {

                    var monthNames = [
                        "", "January", "February", "March",
                        "April", "May", "June",
                        "July", "August", "September",
                        "October", "November", "December"
                    ];
                    result.forEach(function(data) {
                        dataArr.push({
                            count: data.count,
                            duration: monthNames[data._id.month]
                        })

                    })
                    if (dataArr.length > 0) {

                        callback(null, dataArr);
                    }

                })
            },
            function(dataArr, callback) {
                var currentDate = new Date();
                var today = moment().format("YYYY-MM-DD");
                raObj.aggregate([{
                        $match: {
                            traveller_id: mongoose.Types.ObjectId(req.traveller.id),
                            is_deleted: false,
                        }
                    },
                    {
                        $group: {
                            _id: {
                                year: {
                                    $year: "$createdAt"
                                },
                                month: {
                                    $month: "$createdAt"
                                },
                                day: {
                                    $dayOfMonth: "$createdAt"
                                }
                            },
                            count: {
                                $sum: 1
                            }
                        }
                    }
                ], function(err, result) {
                    if (result.length > 0) {
                        result.forEach(function(raResult) {
                            if ((raResult._id.year == currentDate.getFullYear()) && (raResult._id.month == currentDate.getMonth() + 1) && (raResult._id.day == currentDate.getDate())) {
                                dataArr.push({
                                    count: raResult.count,
                                    duration: today
                                })
                            }
                        })
                    }
                    if (dataArr.length > 0) {
                        callback(null, dataArr);
                    }
                })
            },

        ], function(err, result) {
            if (result) {
                json2csv({
                    data: result,
                    fields: ['duration', 'count'],
                    fieldNames: ['Duration', 'Number Of Trips']
                }, function(err, csv) {
                    if (err) {
                        throw err;
                    } else {
                        var path = './riskpal-client/uploads/traveller_trip_report_yearly_monthly_weekly_daily.csv';
                        fs.writeFile(path, csv, function(err) {
                            if (err) {
                                throw err;
                            } else {
                                res.download(path);
                            }
                        })
                    }
                })
            }
        });

    }
}

exports.getAllCountry = function(req, res, next) {
    userObj.findOne({
        _id: req.traveller.id,
        is_deleted: false
    }).populate('client_admin_id').exec(function(err, traveller) {
        if (err) {
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong'
            });
        } else {
            countryRiskObj.find({
                country_id: req.params.country_id,
                // client_admin_id: traveller.client_admin_id
                companyId: traveller.client_admin_id.companyId
            }, function(err, country_risk) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'country_risk': country_risk
                    });
                }
            })
        }
    })
}

/* @function : attach_supporting_docs
 *  @author  : MadhuriK 
 *  @created  : 16-Aug-17
 *  @modified :
 *  @purpose  : To upload multiple supporting docs with Ra.
 */



exports.attach_supporting_docs = function(req, res, next) {
    let pathArr = [];
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.", err);
        } else if (req.files !== undefined) {
            console.log("req.files", req.files)
            req.files.forEach(function(file) {
                var filePath = file.path.split("/");
                console.log("Test")
                console.log(filePath)
                var dbPath = '/' + filePath[1] + '/' + filePath[2];
                pathArr.push(dbPath);
            })
            res.json({
                status: "Sucess",
                data: pathArr
            });
        } else {
            return res.end("Error uploading file.");
        }
    });
}

var uuid = '';
exports.createonetouch = function(req, res, next) {
    const email = req.body.email;
    const encryptedFields = encryptUserFields(email);
    userTable.findOne({
        email: { $regex: new RegExp("^" + encryptedFields.email, "i") },
        is_deleted: false
    }).exec(function(err, user) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            var user_payload = {
                'message': 'Login requested for a Riskpal  account'
            };
            authy.send_approval_request(user.authyID, user_payload, {}, null, function(oneTouchErr, oneTouchRes) {
                if (oneTouchErr) {
                    res.json({
                        'err': 'Problem creating OneTouch request!',
                        'code': config.error
                    });
                } else {
                    uuid = oneTouchRes.approval_request.uuid;
                    res.json({
                        'code': config.success,
                        'data': oneTouchRes,
                        'message': 'OneTouch verification initialized!'
                    });
                }
            });
        }
    });
};

exports.checkonetouchstatus = function(req, res, next) {
    var options = {
        url: "https://api.authy.com/onetouch/json/approval_requests/" + uuid,
        form: {
            "api_key": config.API_KEY
        },
        headers: {},
        qs: {
            "api_key": config.API_KEY
        },
        json: true,
        jar: false,
        strictSSL: true
    };
    authy.check_approval_status(uuid, function(err, response) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            const email = req.body.email;
            const searchEncryptedFields = new userTable({email});
            searchEncryptedFields.encryptFieldsSync();
            if (response.approval_request.status === "approved") {
                userTable.findOne({
                    email: { $regex: new RegExp("^" + searchEncryptedFields.email, "i") },
                    is_deleted: false
                }, '-hashcode -password -first_login -authyID')
                .populate('roleId')
                .exec(function(err, user) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                            client_id:user.client_id,
                            super_admin: user.super_admin,
                            is_deleted: user.is_deleted,
                            verified: user.verified,
                            status: user.status,  
                        }
                       let jwtToken = jwt.sign(params, config.secret, {
                            expiresIn: expirationDuration
                        });
                        if (jwtToken) {
                            user.duoToken = jwtToken;
                            user.duoVerified = true;
                            user.save(function(err, result) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    // user.duoToken = 'Bearer ' + jwtToken;
                                    const resp = {};
                                    resp.duoToken = 'Bearer ' + jwtToken;
                                    console.log('user', user);
                                    authObj.saveSession(req, params, user);
                                    res.json({
                                        'code': config.success,
                                        // 'token': response,
                                        'data': resp,
                                        'status': 'approved',
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
                })
            } else if (response.approval_request.status === "pending") {
                res.json({
                    'status': 'pending',
                    'err': 'Please approve onetouch request!',
                    'code': config.error
                });
            } else {
                res.json({
                    'status': 'denied',
                    'err': 'onetouch request denied!',
                    'code': config.error
                });
            }
        }
    });
};

exports.requestPhoneVerification = function(req, res, next) {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;
    var via = req.body.via;
    console.log("body: ", req.body);
    var info = {
        via: 'sms',
        locale: 'es',
        custom_message: 'Here is your custom message {{code}}',
        custom_code: '0051243'
    };
    if (phone_number && country_code && via) {
        authy.phones().verification_start(phone_number, country_code, info, function(err, response) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                console.log('Success register phone API call: ', response);
                res.status(200).json(response);
            }
        });
    } else {
        console.log('Failed in register phone API call', req.body);
        res.status(500).json({
            error: "Missing fields"
        });
    }

};

exports.verifyPhoneToken = function(req, res, next) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;

    if (phone_number && country_code && token) {

        authy.phones().verification_check(phone_number, country_code, token, function(err, response) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                console.log('Confirm phone success confirming code: ', response);
                if (response.success) {
                    req.session.ph_verified = true;
                }
                res.status(200).json(err);
            }
        });
    } else {
        console.log('Failed in confirm phone request : ', req.body);
        res.status(500).json({
            error: "Missing fields"
        });
    }
};

exports.verifyOtp = function(req, res, next) {
    if (req.body) {
        userTable.findOne({
            _id: req.body.Id,
            is_deleted: false,
         
        }, function(err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                authy.sendSMS(req.body.authy, function(returnData) {
                    if (returnData.status == 200) {
                        console.log("returnData", returnData)
                        clientkey.verifyToken({
                            authyId: 1484367,
                            token: returnData.message
                        }, function(err, res) {
                            console.log("res", res)
                            if (err) {
                                console.log("err", err)
                                next(createError(config.serverError, err));
                            } else {
                                var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                                var params = {
                                    id: user._id,
                                    client_id:user.client_id,
                                    super_admin: user.super_admin,
                                    is_deleted: user.is_deleted,
                                    verified: user.verified,
                                    status: user.status,  
                                }
                                let jwtToken = jwt.sign(params, config.secret, {
                                    expiresIn: expirationDuration
                                });
                                if (jwtToken) {
                                    user.duoToken = jwtToken;
                                    user.duoVerified = true;
                                    user.save(function(err, result) {
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
                    } else {
                        res.json({
                            'code': config.error,
                            'err': 'Something went wrong while sending sms'
                        });
                    }
                });
            }
        })
    }
}

exports.verify = function(req, res, next) {
    const email = req.body.email;
    const encryptedFields = encryptUserFields(email);
    console.log("token", req.body)
    userTable.findOne({
        email: { $regex: new RegExp("^" + encryptedFields.email, "i") },
        is_deleted: false,
    }, '-hashcode -password -first_login')
    .populate('roleId')
    .exec(function(err, user) {
        if (err) {
            res.json({
                'code': config.error,
                'err': 'user not found'
            });
        } else {
            authy.verify(user.authyID, req.body.smstoken, function(err, tokenRes) {
                if (err) {
                    console.log('errrr', err);
                    res.json({
                        'code': config.error,
                        'err': 'Something went wrong please try again'
                    });
                } else {
                    console.log("Verify Token Response: ", tokenRes);
                    if (tokenRes.success) {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                            client_id:user.client_id,
                            super_admin: user.super_admin,
                            is_deleted: user.is_deleted,
                            verified: user.verified,
                            status: user.status,  
                        }
                        let jwtToken = jwt.sign(params, config.secret, {
                            expiresIn: expirationDuration
                        });
                        if (jwtToken) {
                            user.duoToken = jwtToken;
                            user.duoVerified = true;
                            user.save(function(err, result) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    // user.duoToken = 'Bearer ' + jwtToken;
                                    const resp = {};
                                    resp.duoToken = 'Bearer ' + jwtToken;
                                    // save data to session
                                    console.log('user', user);
                                    authObj.saveSession(req, params, user);
                                    res.json({
                                        'code': config.success,
                                        'data': resp,
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
                }
            });
        }
    });
};

exports.voice = function(req, res, next) {
    const email = req.body.email;
    const encryptedFields = encryptUserFields(email);
    userTable.findOne({
        email: { $regex: new RegExp("^" + encryptedFields.email, "i") },
        is_deleted: false,
       
    }).exec(function(err, user) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            console.log("user.authyID", user.authyID)
            /**
             * If the user has the Authy app installed, it'll send a text
             * to open the Authy app to the TOTP token for this particular app.
             *
             * Passing force: true forces an voice call to be made
             */
            authy.request_call(user.authyID, true, function(err, callRes) {
                console.log("callRes", callRes)
                if (err) {
                    res.json({
                        'code': config.error,
                        'err': 'Problem making Voice Call'
                    });
                } else {
                    console.log("requestCall response: ", callRes);
                    res.json({
                        'code': config.success,
                        'data': callRes,
                        'message': 'Phone call initialized'
                    });
                }
            });
        }
    });
};

exports.sms = function(req, res, next) {
    console.log("req.body.email", req.body.email)
    const email = req.body.email;
    const encryptedFields = encryptUserFields(email);
    userTable.findOne({
        email: { $regex: new RegExp("^" + encryptedFields.email, "i") },
        is_deleted: false,
       
    }).exec(function(err, user) {
        console.log("Send SMS");
        if (err) {
            next(createError(config.serverError, err));

        } else {
            /**
             * If the user has the Authy app installed, it'll send a text
             * to open the Authy app to the TOTP token for this particular app.
             *
             * Passing force: true forces an SMS send.
             */
            authy.request_sms(user.authyID, true, function(err, smsRes) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': smsRes,
                        'message': 'SMS token sent successfully!'
                    });
                }
            });
        }
    });
};