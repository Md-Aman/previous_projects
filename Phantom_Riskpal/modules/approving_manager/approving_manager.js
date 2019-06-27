var approvingManagerObj = require('./../../schema/approving_manager.js'); // include approving manager schema file
var userObj = require('./../../schema/users.js'); // include user schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country_risk schema file
var newsRaObj = require('./../../schema/news_ra.js'); // include newsra schema file
var newsRaAnswerObj = require('./../../schema/news_ra_answer.js'); // include newsRaAnswer schema file
var logObj = require('./../../schema/log.js');
var medicalObj = require('./../../schema/medical_info.js');
var config = require('../../config/jwt_secret.js'); // config 
var jwt = require('jsonwebtoken');
// var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');
var _ = require('underscore');
var moment = require("moment");
var async = require('async');
var NodeGeocoder = require('node-geocoder');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var departmentObj = require('./../../schema/department.js'); // include department schema file
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var communicationObj = require('./../../schema/communication.js'); // include communication schema file
var contingencyObj = require('./../../schema/contingency.js'); // include contingency schema file
var csv = require("fast-csv");
var fs = require('fs-extra');
var json2csv = require('json2csv');
var multer = require('multer');
var AWS = require('../../config/aws.js');
var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
var parseNumber = require('libphonenumber-js').parse;
var mailer = require('../../config/mailer.js');
var constant = require('../../config/constants');
var countryCode = require('libphonenumber-js').getPhoneCode;
var createError = require('http-errors');
var envConfig = require('../../config/config');

var options = {
    provider: 'google',

    // Optional depending on the providers 
    httpAdapter: 'https', // Default 
    apiKey: 'AIzaSyAFypHcoiFlsqohYuijy5pxCSihaJWqTRI', // for Mapquest, OpenCage, Google Premier 
    formatter: null // 'gpx', 'string', ... 
};
var userTable = require('./../../schema/usertables.js');
var usergroupObj = require('./../../schema/roles.js'); // include roles schema 
var clientObj = require('./../../schema/clients.js');
var geocoder = NodeGeocoder(options);
var path = require('path');
var emailHelper = require('./../../helper/email.helper');
var template = require('./../../helper/template');
/* @function : addApprovingManager
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To add the approving manager.
 */

exports.addApprovingManager = function (req, res, next) {
    if (req.body) {
        var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
        req.body.client_admin_id = req.user.id;
        req.body.companyId = req.user.companyID;
        var finalResponse = {};
        finalResponse.isExist = false;
        async.waterfall([
            function (callback) {
                approvingManagerObj.findOne({
                    email: req.body.email,
                    is_deleted: false
                })
                    .exec(function (err1, manager) {
                        if (err1) {
                            callback(err1, null);
                        } else if (manager) {
                            finalResponse.isExist = false;
                            callback(manager, null);
                        } else {
                            callback(null, finalResponse)
                        }
                    })
            },
            function (finalResponse, callback) {
                userObj.findOne({
                    email: req.body.email,
                    is_deleted: false,
                    admin: false
                }, function (err2, traveller) {
                    if (err2) {
                        callback(err2, null);
                    } else if (traveller) {
                        finalResponse.isExist = false;
                        callback(traveller, null);
                    } else {
                        callback(null, finalResponse)
                    }
                })
            },
            function (finalResponse, callback) {
                if (finalResponse.isExist) {
                    callback(true, null);
                } else {
                    var number = pnumber;
                    var code = parseNumber(number);
                    var phone = code.phone
                    var phoneCode = countryCode(code.country);
                    authy.register_user(req.body.email, phone, phoneCode, function (err3, regRes) {
                        var test1 = 'email :-' + " " + req.body.email + " " + ' is not allowed ';
                        if (err3) {
                            callback(test1, null);
                        } else {
                            req.body.mobile_number = pnumber;
                            req.body.authyID = regRes.user.id;
                            var randomPassword = config.randomToken(10);
                            var key = 'salt_from_the_user_document';
                            var cipher = crypto.createCipher('aes-256-cbc', key);
                            cipher.update(randomPassword, 'utf8', 'base64');
                            var encryptedPassword = cipher.final('base64');
                            req.body.password = encryptedPassword;
                            req.body.first_login = true;
                            req.body.passport_data = [{
                                passport_number: "",
                                nationality: ""
                            }];
                            var approving_manager = new approvingManagerObj(req.body);
                            approving_manager.save(function (err4, data) {
                                if (err4) {
                                    callback(err4, null);
                                } else {
                                    req.body.admin = false;
                                    req.body.status = 'Active';
                                    var user_approving_manager = new userObj(req.body);
                                    user_approving_manager.save(function (err5, userData) {
                                        if (err5) {
                                            callback(err5, null);
                                        } else {
                                            var baseUrl = envConfig.host;
                                            var userMailData = {
                                                firstname: req.body.firstname,
                                                usertype: 'approving Manager',
                                                baseUrl: baseUrl,
                                                email: req.body.email,
                                                password: randomPassword,
                                                createdby: req.body.fullname
                                            };
                                            mailer.sendMail(req.body.email, constant.emailKeyword.NewRiskPalAccount, userMailData, function (err, resp) {
                                                if (err6) {
                                                    callback(err6, null);
                                                } else {
                                                    callback(null, 'Approving manager added successfully');
                                                }
                                            });
                                            // var smtpTransport = nodemailer.createTransport({
                                            //     service: config.service,
                                            //     auth: {
                                            //         user: config.username,
                                            //         pass: config.password
                                            //     }
                                            // });
                                            // var mailOptions = {
                                            //     from: 'noreply.riskpal@gmail.com',
                                            //     to: req.body.email,
                                            //     subject: 'Account created by organization admin',
                                            //     html: 'Hello Approving Manager, ' + req.body.firstname + '<br><br> \n\
                                            //    \n\ your account has been created by organization admin, please check the below credentials \n\
                                            //    <br><br> Email :' + req.body.email + '<br>\n\
                                            //    Password :' + randomPassword + '\n\
                                            //   </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                            // };
                                            // smtpTransport.sendMail(mailOptions, function(err6, result) {
                                            //     if (err6) {
                                            //         callback(err6, null);
                                            //     } else {
                                            //         callback(null, 'Approving manager added successfully');
                                            //     }
                                            // });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },
        ],
            function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': data
                    })
                }
            });
    }
}

/* @function : listApprovingManager
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To list the approving manager.
 */
exports.listApprovingManager = function (req, res, next) {
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
            firstname: {
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

    approvingManagerObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('country')
        .populate('department')
        .exec(function (err, data) {
            if (data) {
                approvingManagerObj.count(query, function (err, count) {
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




/* @function : changeApprovingManagerStatus
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To change approving manager status.
 */
exports.changeApprovingManagerStatus = function (req, res, next) {
    if (req.body) {
        approvingManagerObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
                $set: {
                    status: req.body.status
                }
            }, function (err, changeStatus) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Approving manager status updated successfully'
                    });
                }
            })
    }
}


/* @function : deleteApprovingManager
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To delete approving manager.
 */
exports.deleteApprovingManager = function (req, res, next) {
    if (req.params.approving_manager_id) {
        approvingManagerObj.update({
            _id: req.params.approving_manager_id,
            is_deleted: false
        }, {
                $set: {
                    is_deleted: true
                }
            }, function (err, update) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'approving manager deleted successfully'
                    });
                }
            })
    }

}



/* @function : getApprovalManagerDetails
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To get details of approving manager.
 */
exports.getApprovalManagerDetails = function (req, res, next) {
    if (req.params.approving_manager_id) {
        approvingManagerObj.findOne({
            _id: req.params.approving_manager_id,
            is_deleted: false
        }, function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': approving_manager,
                });
            }
        })
    }
}


/* @function : updateApprovingManager
 *  @author  : MadhuriK 
 *  @created  : 13-Apr-17
 *  @modified :
 *  @purpose  : To update approving manager.
 */
exports.updateApprovingManager = function (req, res, next) {
    if (req.body) {
        var approving_manager_id = req.body.id;
        delete req.body.id;
        approvingManagerObj.find({
            is_deleted: false,
            email: req.body.email,
            _id: {
                $ne: approving_manager_id
            }
        }, function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (approving_manager.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;

                var approving_manager = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    mobile_number: number,
                    department: req.body.department,
                    first_login: false,
                    // project: req.body.project,
                    // reportsTo: req.body.reportsTo,
                    approval_status: req.body.approval_status,
                    threat_level_amber: req.body.threat_level_amber,
                    threat_level_green: req.body.threat_level_green,
                    threat_level_red: req.body.threat_level_red,
                }
                approvingManagerObj.update({
                    _id: approving_manager_id,
                    is_deleted: false
                }, {
                        $set: approving_manager
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Approving manager updated successfully'
                            });

                        }
                    })
            }
        })
    }

}


/* @function : approvingManagerLogin
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  : To login approving manger.
 */

exports.approvingManagerLogin = function (req, res, next) {
    if (req.body) {
        var body = req.body;
        var email = body.email;
        var password = body.password;
        var jwtToken = null;
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        approvingManagerObj.findOne({
            email: email,
            password: encryptedPassword,
            is_deleted: false,
            status: 'Active'
        }, function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'message': 'Invalid email or password'
                });
            } else {
                user.save(function (err, result) {
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
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  : To check approving manager login.
 */
exports.checkLogin = function (req, res, next) {
    if (req.headers["authorization"]) {
        var bearer = req.headers["authorization"].split(' ');
        var bearerToken = bearer[1];
        jwt.verify(bearerToken, config.secret, function (err, decoded) {
            req.approving_manager = decoded;
            if (err) {
                next(createError(config.serverError, err));
            } else {
                if (bearer.length == 2) {
                    approvingManagerObj.findOne({
                        duoToken: bearer[1],
                        is_deleted: false,
                        status: 'Active',
                    }, function (err, approving_manager) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else if (!approving_manager) {
                            res.json({
                                'code': config.error,
                                'err': 'Authentication failed',
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Authenticated approving manager',
                                'data': approving_manager
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


/* @function : approvingManagerLogout
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  : To logout approving manager.
 */
exports.approvingManagerLogout = function (req, res, next) {
    if (req.headers.authorization) {
        var parts = req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : "";
        if (parts.length == 2) {
            approvingManagerObj.findOne({
                _id: req.approving_manager.id,
                duoToken: parts[1],
                duoVerified: true,
            }, function (err, approving_manager) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (approving_manager) {
                    approving_manager.duoToken = '';
                    approving_manager.duoVerified = false;
                    approving_manager.save(function (err, data) {
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


/* @function : approvingManagerForgetPass
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To send forget password link to approving manager.
 */
exports.approvingManagerForgetPass = function (req, res, next) {
    if (req.body.email) {
        approvingManagerObj.findOne({
            email: req.body.email,
            is_deleted: false,
            status: 'Active'
        }, function (err, approving_manager) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });next(createError(config.serverError, err));
            } else if (!approving_manager) {
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
                    html: 'Dear, ' + approving_manager.firstname + '<br><br> \n\
                            Please click on the below link to reset your password: <br><br> \n\ \n\
                            <p><a target="_blank" href="' + config.baseUrl + '/approving_manager/#/reset-password/' + approving_manager._id + '">Click Here</a>\n\
                            </p><br><br>Thanks,<br>  RiskPal Team' // html body
                };
                smtpTransport.sendMail(mailOptions, function (err) {
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


/* @function : approvingManagerResetPass
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To reset password by approving manager.
 */
exports.approvingManagerResetPass = function (req, res, next) {
    if (req.body) {
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        approvingManagerObj.update({
            _id: req.body.userId,
            is_deleted: false,
            status: "Active"
        }, {
                $set: {
                    password: encryptedPassword
                }
            }, function (err) {
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


/* @function : getAlltravellers
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To reset password by approving manager.
 */
exports.getAlltravellers = function (req, res, next) {
    if (req.body) {
        approvingManagerObj.findOne({
            _id: req.approving_manager.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, approver) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                var limit = req.body.count ? req.body.count : 10;
                var sortby = req.body.sortby ? req.body.sortby : {};
                var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
                var query = {
                    is_deleted: false,
                    admin: false,
                    companyId: approver.client_admin_id.companyId,
                    department: { $in: approver.department }
                }
                if (req.body.keyword)
                    query['$or'] = [{
                        firstname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    },
                    {
                        lastname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    },
                    {
                        firstname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    },
                    {
                        email: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    },
                    {
                        gender: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    },
                    {
                        nationality: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }
                    ];
                userObj.find(query)
                    .sort(sortby)
                    .limit(limit)
                    .skip(skip)
                    .exec(function (err, data) {
                        if (data) {
                            userObj.count(query, function (err, count) {
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
        })

    }

}

/* @function : deleteTraveller
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To delete traveller.
 */
exports.deleteTraveller = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.update({
            _id: req.params.traveller_id,
            is_deleted: false,
            admin: false
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
                        'message': 'Traveller deleted successfully'
                    });
                }
            })
    }
}

/* @function : changetravellerStatus
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To change traveller status.
 */
exports.changetravellerStatus = function (req, res, next) {
    if (req.body) {
        userObj.update({
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
                        'message': 'traveller status updated successfully'
                    });
                }
            })
    }
}


/* @function : addTraveller
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
 *  @modified :
 *  @purpose  :To add traveller.
 */

exports.addTraveller = function (req, res, next) {
    var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = pnumber;
                var code = parseNumber(number);
                console.log("country_code", code)
                var phone = code.phone
                var phoneCode = countryCode(code.country);
                authy.register_user(req.body.email, phone, phoneCode, function (err, regRes) {
                    console.log("err", err)
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': 'Email' + ' ' + err.errors.email
                        });
                    } else {
                        approvingManagerObj.findOne({ _id: req.approving_manager.id, is_deleted: false })
                            .populate('client_admin_id')
                            .exec(function (err, approving_manager) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    console.log("regRes", regRes)
                                    var key = 'salt_from_the_user_document';
                                    var cipher = crypto.createCipher('aes-256-cbc', key);
                                    var randomPassword = config.randomToken(8);
                                    cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                                    var encryptedPassword = cipher.final('base64');
                                    var user = new userObj({
                                        firstname: req.body.firstname,
                                        lastname: req.body.lastname,
                                        email: req.body.email,
                                        password: encryptedPassword,
                                        approving_manager_id: req.approving_manager.id,
                                        mobile_number: pnumber,
                                        department: req.body.clientDepartment,
                                        admin: false,
                                        authyID: regRes.user.id,
                                        first_login: true,
                                        duoToken: "",
                                        status: 'Active',
                                        client_admin_id: approving_manager.client_admin_id,
                                        companyId: approving_manager.client_admin_id.companyId,
                                        passport_data: [{
                                            passport_number: "",
                                            nationality: ""
                                        }]
                                    });
                                    user.save(function (err, user) {
                                        if (err) {
                                            next(createError(config.serverError, err));
                                        } else {
                                            var baseUrl = envConfig.host;
                                            var userMailData = {
                                                firstname: req.body.firstname,
                                                usertype: 'Traveller',
                                                baseUrl: baseUrl,
                                                email: req.body.email,
                                                password: randomPassword,
                                                createdby: req.body.fullname
                                            };
                                            mailer.sendMail(req.body.email, constant.emailKeyword.NewRiskPalAccount, userMailData, function (err, resp) {
                                                if (err) {
                                                    next(createError(config.serverError, err));
                                                } else {
                                                    res.json({
                                                        'code': config.success,
                                                        'message': 'Traveller added successfully'
                                                    });
                                                }
                                            });
                                            //         var smtpTransport = nodemailer.createTransport({
                                            //             service: config.service,
                                            //             auth: {
                                            //                 user: config.username,
                                            //                 pass: config.password
                                            //             }
                                            //         });
                                            //         var mailOptions = {
                                            //             from: 'noreply.riskpal@gmail.com',
                                            //             to: req.body.email,
                                            //             subject: 'successfully registration',
                                            //             html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                                            // \n\ your account has been created by approving manager, please check the below credentials \n\
                                            // <br><br> Email :' + req.body.email + '<br>\n\
                                            // Password :' + randomPassword + '\n\
                                            // </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                            //         };
                                            //         smtpTransport.sendMail(mailOptions, function(err) {
                                            //             if (err) {
                                            //                 res.json({
                                            //                     'code': config.error,
                                            //                     'err': err
                                            //                 });
                                            //             } else {
                                            //                 res.json({
                                            //                     'code': config.success,
                                            //                     'message': 'Traveller added successfully'
                                            //                 });
                                            //             }
                                            //         });
                                        }
                                    });
                                }
                            })
                    }
                });
            }
        });
    }

}

/* @function : getTravellerDetails
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To get traveller details.
 */
exports.getTravellerDetails = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.findOne({
            _id: req.params.traveller_id,
            is_deleted: false,
            admin: false
        }, function (err, traveller) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': traveller
                });
            }
        })
    }
}



/* @function : updateTraveller
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To update traveller details.
 */
exports.updateTraveller = function (req, res, next) {
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false,
            _id: {
                $ne: req.body._id
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
                var user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobile_number: number,
                    first_login: false,
                    department: req.body.clientDepartment,
                    email: req.body.email
                }
                userObj.update({
                    _id: req.body._id,
                    is_deleted: false,
                    admin: false
                }, {
                        $set: user
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'traveller updated successfully'
                            });
                        }
                    })

            }
        });
    }
}


/* @function : updateTraveller
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To update traveller details.
 */
exports.getAllpendingnewsRa = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        approvingManager: req.user.id,
        is_submitted: true
    }
    // var $country = 'country';
    if (req.body.keyword)
    {
        // query['$or'] = [{ project_code_name: { $regex: req.body.keyword, $options: "$i" } }, { department: { $regex: req.body.keyword, $options: "$i" } }];
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
        // var $country = {
        //     path: 'country',
        //     match: { name: { $regex: req.body.keyword, $options: "$i" }}
        // }
    }
        
    newsRaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('travellerTeamArr')
        .populate('traveller_id')
        .populate('types_of_ra_id')
        .populate('department')
        .populate('approvingManager')
        .populate('country')
        .exec(function (err, data) {
            if (data) {
                newsRaObj.count(query, function (err, count) {
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
/* @function : updateTraveller
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To update traveller details.
 */
exports.getAllclientnewsRa = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};

    var super_admin = req.body.super_admin;
    console.log(super_admin);
    if (req.body.super_admin == true) {

        var client_id = "";
        var query = {
            is_deleted: false,
            //  approvingManager: req.approving_manager.id,
            is_submitted: true,
            // client_id:client_id
        }

    } else {



        client_id = req.body.client_id
        query = {
            is_deleted: false,
            //  approvingManager: req.approving_manager.id,
            is_submitted: true,
            client_id: client_id
        }


    }

    if (req.body.keyword)
        // query['$or'] = [{ project_code_name: { $regex: req.body.keyword, $options: "$i" } }, { department: { $regex: req.body.keyword, $options: "$i" } }];
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
    newsRaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('travellerTeamArr')
        .populate('traveller_id')
        .populate('types_of_ra_id')
        .populate('department')
        .populate('approvingManager')
        .populate('country')
        .exec(function (err, data) {
            if (data) {
                newsRaObj.count(query, function (err, count) {
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



/* @function : approveNewsRa
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To approve news ra.
 */
exports.approveNewsRa = function (req, res, next) {
    if (req.body) {
        newsRaObj.findOneAndUpdate({
            _id: req.body.news_ra_id,
            is_deleted: false
        }, {
                $set: {
                    is_approve: true,
                    description_of_action: req.body.description_of_action
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate({
                path: 'approvingManager',
                match: {
                    _id: req.approving_manager.id
                }
            })
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    newsRa.departArr = [];
                    newsRa.department.forEach(function (dept) {
                        newsRa.departArr.push(dept.department);
                    })

                    if (newsRa.traveller_id) {
                        var smtpTransport = nodemailer.createTransport({
                            service: config.service,
                            auth: {
                                user: config.username,
                                pass: config.password
                            }
                        });
                        var mailOptions = {
                            from: config.username,
                            to: newsRa.traveller_id.email,
                            subject: 'Ra Approval',
                            html: 'Dear, ' + newsRa.traveller_id.firstname + '<br><br> \n\
                            \n\ your News ra has been approved by approving manager, Please find the below details of RA <br><br><br> Project Name:-  ' + newsRa.project_name +
                                // '<br><br> Department:-  ' + newsRa.departArr.toString() +
                                // '<br><br> Date of RA:-  ' + newsRa.date_of_ra +
                                '<br><br> Approving Manager:-  ' + newsRa.approvingManager[0].name + '\n\'<br><br> Comment by approving manager:-  ' + req.body.description_of_action + '\n\
                            </p><br><br>Thanks,<br>  RiskPal Team' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Ra of a traveller approved successfully'
                                });
                            }
                        });
                    }

                }
            })
    }
}

//old getNewsRadetails
/* @function : getNewsRadetails
 *  @author  : MadhuriK 
 *  @created  : 08-May-17
 *  @modified :
 *  @purpose  :To get news ra details.
 */
// exports.getNewsRadetails = function (req, res) {
//     if (req.params.news_ra_id) {
//         newsRaObj.findOne({ _id: req.params.news_ra_id, is_deleted: false })
//             .populate('traveller_id')
//             .populate('department')
//             .exec(
//             function (err, newsRa) {
//                 if (err) {
//                     res.json({
//                         'error': err,
//                         'code': config.error,
//                         'message': 'Something went wrong please try again!'
//                     });
//                 } else {
//                     newsRaAnswerObj.find({ news_ra_id: req.params.news_ra_id, is_deleted: false }, function (err, questionnaire) {
//                         if (err) {
//                             res.json({
//                                 'error': err,
//                                 'code': config.error,
//                                 'message': 'Something went wrong please try again!'
//                             });
//                         } else {
//                             res.json({
//                                 'code': config.success,
//                                 'message': 'success',
//                                 'data': newsRa,
//                                 'questionnaire': questionnaire
//                             });
//                         }
//                     })

//                 }
//             })
//     }
// }

// new getNewsRadetails 
/* @function : getNewsRadetails
 *  @author  : hemant 
 *  @created  : 22-sep-17
 *  @modified :
 *  @purpose  :To get news ra details.
 */
exports.getNewsRadetails = function (req, res, next) {
    if (req.params.news_ra_id) {
        newsRaObj.findOne({
            _id: req.params.news_ra_id,
            is_deleted: false
        })
            .populate('traveller_id')
            .populate('department')
            .populate('approvingManager')
            .populate('travellerTeamArr')
            .populate('types_of_ra_id')
            .populate('author_id')
            .populate('country')
            .exec(
                function (err, newsRa) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else if (newsRa) {
                        async.waterfall([
                            function (callback) {
                                newsRaAnswerObj.find({
                                    news_ra_id: req.params.news_ra_id,
                                    is_deleted: false
                                })
                                    .populate('category_id')
                                    .exec(function (err, questionnaire) {
                                        if (err) {
                                            callback(err, []);
                                        } else {
                                            callback(null, questionnaire);
                                        }
                                    })
                            },
                            function (questionnaire, callback) {
                                supplierObj.find({
                                    news_ra_id: req.params.news_ra_id,
                                    is_deleted: false
                                }, function (err, supplierData) {
                                    if (err) {
                                        callback(err, [], []);
                                    } else {
                                        callback(null, questionnaire, supplierData);
                                    }
                                })
                            },
                            function (questionnaire, supplierData, callback) {
                                communicationObj.find({
                                    news_ra_id: req.params.news_ra_id,
                                    is_deleted: false
                                }, function (err, communicationData) {
                                    if (err) {
                                        callback(err, [], [], []);
                                    } else {
                                        callback(null, questionnaire, supplierData, communicationData);
                                    }
                                })
                            },
                            function (questionnaire, supplierData, communicationData, callback) {
                                contingencyObj.find({
                                    news_ra_id: req.params.news_ra_id,
                                    is_deleted: false
                                }, function (err, contingencyData) {
                                    if (err) {
                                        callback(err, [], [], [], []);
                                    } else {
                                        callback(null, questionnaire, supplierData, communicationData, contingencyData);
                                    }
                                })
                            },
                            function (questionnaire, supplierData, communicationData, contingencyData, callback) {
                                departmentObj.find({
                                    _id: { $in: newsRa.traveller_id.department },
                                    is_deleted: false
                                }, function (err, departmentData) {
                                    if (err) {
                                        callback(err, [], [], [], [], []);
                                    } else {
                                        callback(null, questionnaire, supplierData, communicationData, contingencyData, departmentData);
                                    }
                                })
                            }
                        ], function (err, questionnaire, supplierData, communicationData, contingencyData, departmentData) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'questionnaire': questionnaire,
                                    'data': newsRa,
                                    'supplierData': supplierData,
                                    'communicationData': communicationData,
                                    'contingencyData': contingencyData,
                                    'departmentData': departmentData

                                })
                            }
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'data': newsRa,
                        });
                    }
                })
    }
}

/* @function : viewTravellerMedicalInfo
 *  @author  : MadhuriK 
 *  @created  : 11-May-17
 *  @modified :
 *  @purpose  :To view traveller's medical info.
 */

exports.viewTravellerMedicalInfo = function (req, res, next) {
    if (req.body) {
        userTable.findOne({
            _id: req.approving_manager.id
        }).populate('client_id').exec(function (err, approving_manager) {
            var logs = {
                approving_manager: req.approving_manager.id,
                traveller: req.body.travellerId,
                view_medical_info: req.body.terms_and_conditions,
                view_date: Date.now(),
                //companyId: approving_manager.client_id.companyId,
                client_id: approving_manager.client_id._id
            }
            var logsData = new logObj(logs);
            logsData.save(function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    userTable.findOne({
                        _id: req.body.travellerId,
                        is_deleted: false
                    }).exec(function (err, travelUser) {
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
                                from: 'noreply.riskpal@gmail.com',
                                to: approving_manager.client_id.email,
                                subject: 'Medical Information View',
                                html: 'Dear, ' + approving_manager.client_id.firstname + ' \n\ ' + approving_manager.client_id.lastname + '<br><br> \n\
                                \n\ Your approving manager' + ' \n\ ' + approving_manager.firstname + ' \n\ ' + 'requests for travellers medical information.' + '\n\
                                </p><br><br>Thanks,<br>  RiskPal Team'
                            };
                            console.log("mailOptions", mailOptions)
                            smtpTransport.sendMail(mailOptions, function (err, data) {
                                console.log("data", data)
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    var medical_data = {
                                        approving_manager: req.approving_manager.id,
                                        traveller: req.body.travellerId,
                                        view_medical_info: req.body.terms_and_conditions,
                                        request_date: Date.now(),
                                        reject_request: false,
                                        accept_request: false,
                                        client_id: approving_manager.client_id._id,
                                        //companyId: approving_manager.client_admin_id.companyId
                                    }
                                    medicalObj.update({
                                        approving_manager: req.approving_manager.id,
                                        traveller: req.body.travellerId
                                    }, medical_data, {
                                            upsert: true
                                        }, function (err, data) {
                                            if (err) {
                                                next(createError(config.serverError, err));
                                            } else {
                                                var data = {
                                                    "approving_manager": req.approving_manager.id,
                                                    "status": 2
                                                }
                                                var Medical_request_by_approving_manager = [{
                                                    "approving_manager": req.approving_manager.id,
                                                    "status": 2
                                                }]
                                                async.forEach(travelUser.Medical_request_by_approving_manager, function (appdata, callback) {
                                                    if (appdata.approving_manager == undefined || null) {
                                                        userTable.update({
                                                            _id: req.body.travellerId
                                                        }, {
                                                                $set: {
                                                                    Medical_request_by_approving_manager: Medical_request_by_approving_manager
                                                                }
                                                            }, {
                                                                upsert: true
                                                            }, function (err, data) {
                                                                if (err) {
                                                                    callback(err)
                                                                } else {
                                                                    callback()
                                                                }

                                                            })
                                                    }
                                                    if (appdata.approving_manager != undefined || null) {
                                                        userObj.update({
                                                            _id: req.body.travellerId
                                                        }, {
                                                                $push: {
                                                                    Medical_request_by_approving_manager: data
                                                                }
                                                            }, {
                                                                upsert: true
                                                            }, function (err, data) {
                                                                if (err) {
                                                                    callback(err)
                                                                } else {
                                                                    callback()
                                                                }
                                                            })
                                                    }

                                                }, function (err) {
                                                    if (err) {
                                                        next(createError(config.serverError, err));
                                                    } else {
                                                        res.json({
                                                            'code': config.success,
                                                            'data': data,
                                                            'message': 'Your Request Has been sent to the Client Super Admin successfully.',
                                                        });
                                                    }
                                                })

                                            }

                                        })
                                }

                            })
                        }
                    })
                }
            });
        });
    }
}
/* @function : getTravellerInfo
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  :To get traveller's info.
 */
exports.getTravellerInfo = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.findOne({
            _id: req.params.traveller_id,
            is_deleted: false,
            admin: false
        }, function (err, traveller) {
            if (traveller) {
                logObj.findOne({
                    approving_manager: req.approving_manager.id,
                    traveller: req.params.traveller_id,
                    view_medical_info: true,
                    is_deleted: false
                }, function (err, log) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else if (log) {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'data': traveller,
                            'log': log
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'data': traveller,
                            'log': []
                        });
                    }
                })

            } else {
                next(createError(config.serverError, err));
            }
        })
    }
}



/* @function : rejectRa
 *  @author  : MadhuriK 
 *  @created  : 12-Jun-17
 *  @modified :
 *  @purpose  :To reject news ra.
 */
exports.rejectRa = function (req, res, next) {
    if (req.body) {
        newsRaObj.findOneAndUpdate({
            _id: req.body.news_ra_id,
            is_deleted: false
        }, {
                $set: {
                    is_reject: true,
                    description_of_action: req.body.description_of_action
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate({
                path: 'approvingManager',
                match: {
                    _id: req.approving_manager.id
                }
            })
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (newsRa.traveller_id) {
                        newsRa.departArr = [];
                        newsRa.department.forEach(function (dept) {
                            newsRa.departArr.push(dept.department);
                        })

                        var smtpTransport = nodemailer.createTransport({
                            service: config.service,
                            auth: {
                                user: config.username,
                                pass: config.password
                            }
                        });
                        var mailOptions = {
                            from: 'noreply.riskpal@gmail.com',
                            to: newsRa.traveller_id.email,
                            subject: 'Ra rejection',
                            html: 'Dear, ' + newsRa.traveller_id.firstname + '<br><br> \n\
                    \n\ your Ra has been rejected by approving manager, Please find the below details of RA <br><br><br> Project Name:-  ' + newsRa.project_name +
                                '<br><br> Department:-  ' + newsRa.departArr.toString() +
                                '<br><br> Date of RA:-  ' + newsRa.date_of_ra +
                                '<br><br> Approving Manager:-  ' + newsRa.approvingManager[0].firstname + '\n\'<br><br> Comment by approving manager:-  ' + newsRa.description_of_action + '\n\
                    </p><br><br>Thanks,<br>  RiskPal Team' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Ra of a traveller has been rejected'
                                });
                            }
                        });
                    }

                }
            })
    }
}

/* @function : rejectRa
 *  @author  : MadhuriK 
 *  @created  : 12-Jun-17
 *  @modified :
 *  @purpose  :To request travellers medical information.
 */
exports.travellerMedicalInformation = function (req, res, next) {
    console.log(req.body)
}

/* @function : wantMoreInfoRa
 *  @author  : MadhuriK 
 *  @created  : 12-Jun-17
 *  @modified :
 *  @purpose  :To want more info of news ra.
 */
exports.wantMoreInfoRa = function (req, res, next) {
    if (req.body) {
        newsRaObj.findOneAndUpdate({
            _id: req.body.news_ra_id,
            is_deleted: false
        }, {
                $set: {
                    is_more_info: true,
                    description_of_action: req.body.description_of_action
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate('approvingManager')
            .exec(function (err, newsRa) {
                if (err) {
                    
                    next(createError(config.serverError, err));
                } else {
                    if (newsRa.traveller_id) {
                        newsRa.departArr = [];
                        newsRa.department.forEach(function (dept) {
                            newsRa.departArr.push(dept.department);
                        })

                        var smtpTransport = nodemailer.createTransport({
                            service: config.service,
                            auth: {
                                user: config.username,
                                pass: config.password
                            }
                        });
                        var mailOptions = {
                            from: 'noreply.riskpal@gmail.com',
                            to: newsRa.traveller_id.email,
                            subject: 'Risk Assessment: Additional information request',
                            html: 'Dear, ' + newsRa.traveller_id.firstname + '<br><br> \n\
                               \n\ Your approving manager (auto-populate name from their profile) has requested additional information for risk assessment' + '<br>' + newsRa.approvingManager[0].firstname + '<br>' + 'and has attached the following message:' +
                                '\n\ :-  ' + newsRa.description_of_action + '\n\
                                 </p><br><br>To review this and amend the risk assessment, please login to RiskPal' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Request send to Author'
                                });
                            }
                        });
                    }

                }
            })
    }
}





/* @function : getDepartmentList
 *  @author  : MadhuriK 
 *  @created  : 23-Aug-17
 *  @modified :
 *  @purpose  :To get all department list
 */
exports.getDepartmentList = function (req, res, next) {
    if (req.user.id) {
        departmentObj.find({
            is_deleted: false,
            status: "Active",
            // client_admin_id: req.user.id
            companyId: req.user.companyID
        }, function (err, departArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': departArr
                })
            }
        })
    }
}



/* @function : getDepartmentList
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  :To get approving manager list
 */
exports.getApprovingManagers = function (req, res, next) {
    if (req.approving_manager.id) {
        userTable.findOne({
            _id: req.approving_manager.id,
            is_deleted: false,
            status: "Active"
        }, function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (approving_manager) {
                // _id: { $ne: req.approving_manager.id },
                userTable.find({
                    client_id: approving_manager.client_id,
                    is_deleted: false,
                    status: "Active"
                }, function (err, approvingManagerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approvingManagerArr
                        })
                    }
                })
            }
        })
    }
}



/* @function : getTravellers
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  :To get traveller list
 */
// _id: { $ne: req.params.traveller_id },

exports.getTravellers = function (req, res, next) {
    console.log("get travellers")
    if (req.approving_manager.id && req.params.traveller_id) {
        userTable.findOne({
            _id: req.approving_manager.id,
            is_deleted: false,
            status: "Active"
        }).populate('client_id').exec(function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (approving_manager.client_id) {
                userObj.find({
                    // client_admin_id: approving_manager.client_admin_id,
                    // companyId: approving_manager.client_admin_id.companyId,
                    super_admin: false,
                    is_deleted: false,
                    status: "Active"
                }, function (err, travellerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': travellerArr
                        })
                    }
                })
            }
        })
    }
}


exports.sendEmailToOtherManager = function(req, data, otherManagers, templateName) {
    var baseUrl = envConfig.host;
    if ( Array.isArray(otherManagers) ) {
        return new Promise( async(resolve, reject) => {
        var arrayCompleted = [];
        if ( otherManagers.length > 0 ) {
            console.log('itemotherManagersmmmm', otherManagers);
            for(const item of otherManagers) {
            //    req.body.matrix.map(item => {
               console.log('itemmmmm', item);
                // return  new Promise( async (resolve, reject) => {
                    var repalceData = {
                        userName: item.firstname, 
                        urlText: config.emailTemplate.urlText, 
                        url: baseUrl,
                        raName: data.raName,
                        authorName: data.authorName,
                        comment: data.comment,
                        approvingManagerName: data.approvingManagerName
                    };
                    try {
                        const body  = await template.getBodyData(templateName, repalceData);
                        const email = await emailHelper.sendEmailNodeMailer(item.email,
                             body.subject, body.html, data.attachments).catch(e => {
                                console.log('eeeee in sendmeial node mailer', e);
                            }); 
                             console.log("email after success", email);
                            //  resolve(email);
                             arrayCompleted.push({error: false, email});
                        
                    } catch (e) {
                        console.log('eeeeeee--', e);
                        arrayCompleted.push({error: true, errorMessage: e});
                        // reject(e);
                    }
                // });
            
                
            };
            console.log('otherManagers.length', otherManagers.length);
            console.log('arrayCompleted.length', arrayCompleted.length);
            if ( otherManagers.length == arrayCompleted.length ) {
                console.log('resolved');
                resolve("sucess");
            } else {
                console.log('eerror rr');
                reject("Error while processing Email.");
            }
        } else {
            resolve("sucess");
        }

        }).catch(e=> console.log('in promise', e));
       
    }
}

/* @function : approveRaByManager
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  :To approve ra by approving manager
 */
exports.approveRaByManager = function (req, res, next) {
    var baseUrl = envConfig.host;
    var emailRALinkList = baseUrl + config.emailRALinkList;
    // if shared with others managers
    if (req.body && req.user.id && req.body.approving_manager_ids.length > 0) {

        if (req.body.adescription_of_action == " " || typeof req.body.adescription_of_action == "undefined") {
            req.body.adescription_of_action = " ";
        }

        if (req.body.description_of_action == " " || typeof req.body.description_of_action == "undefined") {
            req.body.description_of_action = " ";
        }

        newsRaObj.findOne({
            _id: req.body._id,
            is_deleted: false
        })
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                }
                var sub = 'Risk Assessment Approved';
                if (newsRa) {
                   
                    var approvingManager = newsRa.approvingManager.concat(req.body.approving_manager_ids);
                    newsRaObj.findOneAndUpdate({
                        _id: req.body._id,
                        is_deleted: false
                    }, {
                            $set: {
                                is_approve: true,
                                adescription_of_action: req.body.description_of_action,
                                approvingManager: approvingManager
                            },
                            $push: {
                                approvedBy: req.user.id
                            }
                        }, {
                            upsert: true,
                            new: true
                        })
                        .populate('traveller_id')
                        .populate('approvingManager')
                        .populate('travellerTeamArr')
                        .populate('author_id')

                        .exec(async function (err, newsRa) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                // console.log("newsRa>>>", newsRa)
                                if (newsRa.traveller_id) {
                                    newsRa.departArr = [];
                                    newsRa.department.forEach(function (dept) {
                                        newsRa.departArr.push(dept.department);
                                    })

                                    newsRa.currentAppmanager = [];
                                    newsRa.otherApprovingManager = [];
                                    newsRa.otherSharedWithApprovingManager = [];
                                    console.log('approvingManager', newsRa.approvingManager);
                                    newsRa.approvingManager.forEach(function (appmanage) {
                                        if (appmanage._id == req.user.id) {
                                            newsRa.currentAppmanager.push(appmanage)
                                        } else {
                                            console.log('finddddd', newsRa.otherApprovingManager.find( item => item._id === appmanage._id ));
                                            if ( !newsRa.otherApprovingManager.find( item => item._id == appmanage._id ) ) {
                                                
                                                    newsRa.otherApprovingManager.push({ 
                                                        _id: appmanage._id, 
                                                        email: appmanage.email,
                                                        firstname: appmanage.firstname 
                                                    });
                                                
                                                
                                            }

                                            if ( !newsRa.otherSharedWithApprovingManager.find( item => item._id == appmanage._id ) ) {
                                                // if coming form share with popup
                                                console.log('req.body.shared_with', req.body.shared_with);
                                                
                                                if ( req.body.shared_with && req.body.shared_with.find( item => item._id == appmanage._id )) {
                                                    newsRa.otherSharedWithApprovingManager.push({ 
                                                        _id: appmanage._id, 
                                                        email: appmanage.email,
                                                        firstname: appmanage.firstname 
                                                    });
                                                } 
                                                
                                            }
                                            
                                           
                                        }

                                    });
                                    
                                    var filePath = './clientPortal/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                                    var fName = filePath.split("pdf/");
                                    var attachments = [{
                                        filename: fName[1],
                                        path: path.join(__dirname, '../../', "clientPortal/pdf/" + newsRa._id + "_traveller_newsRA.pdf"),
                                        contentType: 'application/pdf'
                                    }];

                                    // send email to other managers en10
                                    var authorName = newsRa.traveller_id.firstname;
                                    // if (newsRa.authorcheck == 1) {
                                    //     authorName = newsRa.author_id.firstname;
                                    // }
                                    var otherEmailData = {
                                        authorName: authorName, 
                                        urlText: config.emailTemplate.urlText, 
                                        url: baseUrl,
                                        raName: newsRa.project_name,
                                        attachments: attachments,
                                        comment: '',
                                        approvingManagerName: ''
                                    };
                                    console.log("ffffffff other manager", newsRa.otherApprovingManager );
                                    
                                    if ( newsRa.otherApprovingManager ) {
                                        var otherApprovingManager = newsRa.otherApprovingManager;
                                        if ( Array.isArray(newsRa.otherSharedWithApprovingManager) ) {
                                            otherApprovingManager = newsRa.otherApprovingManager.filter(item => !newsRa.otherSharedWithApprovingManager.find(tor => tor._id == item._id))
                                        }
                                        if ( otherApprovingManager.length > 0) {
                                            const otherEmails = await exports.sendEmailToOtherManager(req, 
                                                otherEmailData, otherApprovingManager,
                                                config.emailTemplate.earlierManagerNotification).catch(e => {
                                                    console.log('eeeee5', e);
                                                });;
                                        }
                                        
                                        
                                    }
                                    
                                    // console.log('doneeeessssss', newsRa.currentAppmanager);
                                    // console.log('doneeee', newsRa.approvingManager);

                                    //Send mail to author if this RA created by Author
                                    
                                    if (newsRa.authorcheck == 1) {
                                         //send email to user author about approved (en8)
                                        
                                       
                                        var repalceData = {
                                            userName: newsRa.author_id.firstname, 
                                            urlText: config.emailTemplate.urlText, 
                                            url: emailRALinkList,
                                            raName: newsRa.project_name,
                                            approvingManagerName: newsRa.currentAppmanager[0].firstname,
                                        };
                                        try {
                                            const body  = await template.getBodyData(config.emailTemplate.shareRAWithTravellerAuthor, repalceData);
                                            const email = await emailHelper.sendEmailNodeMailer(newsRa.author_id.email,
                                                 body.subject, body.html, attachments).catch(e => {
                                                    console.log('eeeee3', e);
                                                });; 
                                            
                                        } catch (e) {
                                            res.json({
                                                'code': config.error,
                                                'err': e,
                                                'message': 'email failed1'
                                            });
                                        }
                                            

                                    }
                                    //send email to traveller (en8)
                                    var repalceData = {
                                        userName: newsRa.traveller_id.firstname, 
                                        urlText: config.emailTemplate.urlText, 
                                        url: emailRALinkList,
                                        raName: newsRa.project_name,
                                        approvingManagerName: newsRa.currentAppmanager[0].firstname,
                                    };
                                    
                                        const body  = await template.getBodyData(config.emailTemplate.shareRAWithTravellerAuthor, repalceData);
                                        const email = await emailHelper.sendEmailNodeMailer(newsRa.traveller_id.email,
                                             body.subject, body.html, attachments).catch(e => {
                                                console.log('eeeee', e);
                                            });; 
                                        if (!email) {
                                            res.json({
                                                'code': config.error,
                                                'err': err,
                                                'message': 'email failed2'
                                            });
                                        } else {
                                            if ( req.body.shared_with ) { // just for checking if sharing or not 
                                                var baseUrl = envConfig.host;
                                                var url = baseUrl + config.emailRALinkPending;

                                                // sendin to shared user (en14)
                                                var repalceData = {
                                                    urlText: config.emailTemplate.urlText, 
                                                    url: url,
                                                    comment: req.body.description_of_action,
                                                    raName: newsRa.project_name,
                                                    approvingManagerName: newsRa.currentAppmanager[0].firstname,
                                                    attachments
                                                };
                                                
                                                    // const body  = await template.getBodyData(
                                                        // config.emailTemplate.shareRAWithApprovingManager, repalceData);
                                                   

                                                try {
                                                    console.log('hhhhaf', newsRa.otherSharedWithApprovingManager);
                                                    
                                                      // en 18 (en14ii)      
                                                    const otherEmails1 = await exports.sendEmailToOtherManager(req, 
                                                        repalceData, newsRa.otherSharedWithApprovingManager,
                                                            config.emailTemplate.approvedShareRAWithApprovingManager)
                                                            .catch(e => {
                                                                console.log('eeeee', e);
                                                            });
                                                            console.log('length approvedsharerawithapp', otherEmails1);
                                                } catch (err) {
                                                    next(createError(config.serverError, err));
                                                } 
                                            }
                                            
                                            //Other attached travellers send mail option 
                                            // exclude shared with managers
                                            var travellerTeamArr = newsRa.travellerTeamArr;
                                            if ( Array.isArray(newsRa.otherSharedWithApprovingManager) && Array.isArray(newsRa.travellerTeamArr) ) {
                                                travellerTeamArr = newsRa.travellerTeamArr.filter(item => !newsRa.otherSharedWithApprovingManager.find(tor => tor._id == item._id))
                                            }
                                            userTable.find({
                                                _id: {
                                                    $in: travellerTeamArr
                                                },
                                                super_admin: false
                                            }, function (err, travellerArr) {
                                                if (err) {
                                                    next(createError(config.serverError, err));
                                                } else {
                                                    console.log('length traveller', travellerArr);
                                                    if ( travellerArr.length > 0 ) {
                                                        async.each(travellerArr, async function (que, callback) {

                                                            var baseUrl = envConfig.host;
                                                            var url = baseUrl + config.emailRALinkPending;
                                                            var repalceData = {
                                                                userName:  que.firstname , 
                                                                urlText: config.emailTemplate.urlText, 
                                                                url: url,
                                                                raName: newsRa.project_name,
                                                                authorName: newsRa.traveller_id.firstname,
                                                            };
                                                            
                                                                const body  = await template.getBodyData(config.emailTemplate.toOtherTravellerAfterApproved, repalceData);
                                                               
            
                                                            try {
                                                                const email = await emailHelper.sendEmailNodeMailer(que.email,
                                                                    body.subject, body.html, attachments).catch(e => {
                                                                        console.log('eeeee2', e);
                                                                    });
                        
                                                                    console.log('length traveller email', email);
                                                            } catch (err) {
                                                                next(createError(config.serverError, err));
                                                            } 
                                                            
    
                                                        }, function (err) {
                                                            if (err) {
                                                                next(createError(config.serverError, err));
                                                            }
                                                        });
                                                    }
                                                    
                                                }
                                            });
                                            console.log('length successs');
                                            res.json({
                                                'code': config.success,
                                                'message': 'Ra of a traveller approved successfully'
                                            });
                                        }
                               
                                }
                          }
                        })
                }
            })
    } else if (req.body && req.user.id) {
        if (req.body.description_of_action == " " || typeof req.body.description_of_action == "undefined") {
            req.body.description_of_action = " ";
        }
        newsRaObj.findOneAndUpdate({
            _id: req.body._id,
            is_deleted: false
        }, {
                $set: {
                    is_approve: true,
                    description_of_action: req.body.description_of_action
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate('approvingManager')
            .populate('travellerTeamArr')
            .populate('author_id')
            .exec(async function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (newsRa.traveller_id) {
                        newsRa.departArr = [];
                        newsRa.department.forEach(function (dept) {
                            newsRa.departArr.push(dept.department);
                        })
                        newsRa.currentAppmanager = [];
                        newsRa.otherApprovingManager = [];
                        newsRa.otherSharedWithApprovingManager = [];
                        newsRa.approvingManager.forEach(function (appmanage) {
                            if (appmanage._id == req.user.id) {
                                newsRa.currentAppmanager.push(appmanage)
                            } else {
                                console.log('finddddd', newsRa.otherApprovingManager.find( item => item._id === appmanage._id ));
                                if ( !newsRa.otherApprovingManager.find( item => item._id == appmanage._id ) ) {
                                    
                                        newsRa.otherApprovingManager.push({ 
                                            _id: appmanage._id, 
                                            email: appmanage.email,
                                            firstname: appmanage.firstname 
                                        });
                                    
                                    
                                }

                                if ( !newsRa.otherSharedWithApprovingManager.find( item => item._id === appmanage._id ) ) {
                                    // if coming form share with popup
                                    console.log('req.body.shared_with', req.body.shared_with);
                                    
                                    if ( req.body.shared_with && req.body.shared_with.find( item => item._id == appmanage._id )) {
                                        newsRa.otherSharedWithApprovingManager.push({ 
                                            _id: appmanage._id, 
                                            email: appmanage.email,
                                            firstname: appmanage.firstname 
                                        });
                                    } 
                                    
                                }
                                
                                
                            }

                        });
                        console.log("5555555555", newsRa.otherApprovingManager);
                        
                       
                        // console.log('doneeee', newsRa.approvingManager);
                        var baseUrl = envConfig.host;

                        var filePath = './clientPortal/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                        var fName = filePath.split("pdf/");
                        var attachments = [{
                            filename: fName[1],
                            path: path.join(__dirname, '../../', "clientPortal/pdf/" + newsRa._id + "_traveller_newsRA.pdf"),
                            contentType: 'application/pdf'
                        }];

                        // send email to other managers en10
                        var authorName = newsRa.traveller_id.firstname;
                        // if (newsRa.authorcheck == 1) {
                        //     authorName = newsRa.author_id.firstname;
                        // }
                        var otherEmailData = {
                            authorName: authorName,  
                            urlText: config.emailTemplate.urlText, 
                            url: baseUrl,
                            raName: newsRa.project_name,
                            attachments: attachments,
                            comment: '',
                            approvingManagerName: ''
                        };
                        if ( newsRa.otherApprovingManager ) {
                            const otherEmails = await exports.sendEmailToOtherManager(req, 
                                otherEmailData, newsRa.otherApprovingManager,
                                config.emailTemplate.earlierManagerNotification);
                            
                        }
                        //Send mail to author if this RA created by Author

                        if (newsRa.authorcheck == 1) {
                             //send email to user
                            
                            
                            var repalceData = {
                                userName: newsRa.author_id.firstname, 
                                urlText: config.emailTemplate.urlText, 
                                url: emailRALinkList,
                                comment: req.body.description_of_action,
                                raName: newsRa.project_name,
                                approvingManager: newsRa.currentAppmanager[0].firstname,
                            };
                            try {
                                const body  = await template.getBodyData(config.emailTemplate.approvedByManager, repalceData);
                                const email = await emailHelper.sendEmailNodeMailer(newsRa.author_id.email,
                                     body.subject, body.html, attachments); 
                                }
                                catch (e) {
                                    res.json({
                                        'code': config.error,
                                        'err': err,
                                        'message': 'email failed6'
                                    });
                                }
                                   
                            }
                           
                        }


                        //send email to user
                       
                        var repalceData = {
                            userName: newsRa.traveller_id.firstname, 
                            urlText: config.emailTemplate.urlText, 
                            url: emailRALinkList,
                            comment: req.body.description_of_action,
                            raName: newsRa.project_name,
                            approvingManager: newsRa.currentAppmanager[0].firstname,
                        };
                        try {
                            const body  = await template.getBodyData(config.emailTemplate.approvedByManager, repalceData);
                            const email = await emailHelper.sendEmailNodeMailer(newsRa.traveller_id.email,
                                 body.subject, body.html, attachments); 
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {


                                //Other attached travellers send mail option 

                                userTable.find({
                                    _id: {
                                        $in: newsRa.travellerTeamArr
                                    },
                                    super_admin: false
                                }, function (err, travellerArr) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {

                                        async.each(travellerArr, async function (que, callback) {
                                            var baseUrl = envConfig.host;
                                            var url = baseUrl + config.emailRALinkPending;
                                            var repalceData = {
                                                userName:  que.firstname , 
                                                urlText: config.emailTemplate.urlText, 
                                                url: url,
                                                raName: newsRa.project_name,
                                                authorName: newsRa.traveller_id.firstname,
                                            };
                                            
                                                const body  = await template.getBodyData(config.emailTemplate.toOtherTravellerAfterApproved, repalceData);
                                               

                                            try {
                                                const email = await emailHelper.sendEmailNodeMailer(que.email,
                                                    body.subject, body.html, attachments); 
                                            } catch (err) {
                                                next(createError(config.serverError, err));
                                            } 


                                        }, function (err) {
                                            if (err) {
                                                next(createError(config.serverError, err));
                                            }
                                        });

                                        res.json({
                                            'code': config.success,
                                            'message': 'Ra of a traveller approved successfully'
                                        });
                                    }
                                })
                            }
                        } catch (e) {
                            res.json({
                                'code': config.error,
                                'err': e,
                                'message': 'email failed7'
                            });
                        }

                    }
                }
            )
    }
}


/* @function : forwardToManager
 *  @author  : Siroi 
 *  @created  : 25-June-18
 *  @modified :
 *  @purpose  :To forward RA to approving managers
 */
exports.forwardToManager = function (req, res, next) {

    if (req.body.description_of_action_forward == " " || typeof req.body.description_of_action_forward == "undefined") {
        req.body.description_of_action_forward = " ";
    }

    if (req.body && req.user.id && req.body.otherapprovingManagerArr) {
        newsRaObj.findOne({
            _id: req.body._id,
            is_deleted: false
        })
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                }
                if (newsRa) {
                    var approvingManager = newsRa.approvingManager.concat(req.body.otherapprovingManagerArr);



                    //   console.log("falsefalsefalsefalse")
                    newsRaObj.findOneAndUpdate({
                        _id: req.body._id,
                        is_deleted: false
                    }, {
                            $set: {

                                approvingManager: approvingManager
                            }
                        }, {
                            upsert: true
                        })
                        .populate('approvingManager')
                        .populate('traveller_id')
                        .populate('author_id')
                        .exec(function (err, newsRa) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {

                                newsRa.currentAppmanager = [];
                                newsRa.approvingManager.forEach(function (appmanage) {

                                    if (appmanage._id == req.user.id) {
                                        newsRa.currentAppmanager.push(appmanage)
                                    }

                                })


                                userTable.findOne({
                                    _id: req.body.otherapprovingManagerArr,
                                    is_deleted: false
                                })
                                    .exec(async function (err, newsRaData) {
                                        if (err) {
                                            next(createError(config.serverError, err));
                                        } else if (newsRaData) {
                                            var baseUrl = envConfig.host;
                                            var filePath = './clientPortal/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                                            var fName = filePath.split("pdf/");
                                            var attachments = [{
                                                filename: fName[1],
                                                path: path.join(__dirname, '../../', "clientPortal/pdf/" + newsRa._id + "_traveller_newsRA.pdf"),
                                                contentType: 'application/pdf'
                                            }];
                                            var baseUrl = envConfig.host;
                                            var url = baseUrl + config.emailRALinkPending;
                                            var repalceData = {
                                                userName:  newsRaData.firstname , 
                                                urlText: config.emailTemplate.urlText, 
                                                url: url,
                                                comment: req.body.description_of_action_forward,
                                                raName: newsRa.project_name,
                                                approvingManagerName: newsRa.currentAppmanager[0].firstname + ' ' + newsRa.currentAppmanager[0].lastname,
                                            };
                                            
                                                const body  = await template.getBodyData(config.emailTemplate.forwardToOtherApprovingManager, repalceData);
                                               

                                            try {
                                                const email = await emailHelper.sendEmailNodeMailer(newsRaData.email,
                                                    body.subject, body.html, attachments); 
                                                    if ( email ) {
        
                                                    var baseUrl =envConfig.host;
                                                    var url = baseUrl + config.emailRALinkPending;
                                                    
                                                    var repalceData = {
                                                        userName:  newsRa.currentAppmanager[0].firstname , 
                                                        urlText: config.emailTemplate.urlText, 
                                                        url: url,
                                                        raName: newsRa.project_name,
                                                        travelerName: newsRaData.firstname
                                                    };
                                                    
                                                        const body1  = await template.getBodyData(config.emailTemplate.confirmationToForwardToOtherApprovingManager, repalceData);
                                                        
        
                                                    try {
                                                        const email = await emailHelper.sendEmailNodeMailer(newsRa.approvingManager[0].email,
                                                            body1.subject, body1.html); 
                                                    } catch (err) {
                                                        next(createError(config.serverError, err));
                                                    } 

                                                 if(newsRa.authorcheck == 1) {

                                                    var baseUrl = envConfig.host;
                                                    var url = baseUrl + config.emailRALinkPending;
                                                    var repalceData = {
                                                        userName:  newsRa.author_id.firstname , 
                                                        urlText: config.emailTemplate.urlText, 
                                                        url: url,
                                                        raName: newsRa.project_name,
                                                        approvingManagerName: newsRaData.firstname
                                                    };
                                                    
                                                    const body2  = await template.getBodyData(config.emailTemplate.forwardChangeForTraveller, repalceData);
                                                        
        
                                                    try {
                                                        const email = await emailHelper.sendEmailNodeMailer(newsRa.author_id.email,
                                                            body2.subject, body2.html); 
                                                        if ( email ) {
                
                                                        }
                                                    } catch (err) {
                                                        next(createError(config.serverError, err));
                                                    } 


                                                 }


                                                 var baseUrl = envConfig.host;
                                                    var url = baseUrl + config.emailRALinkPending;
                                                    
                                                    var repalceData = {
                                                        userName:  newsRa.traveller_id.firstname , 
                                                        urlText: config.emailTemplate.urlText, 
                                                        url: url,
                                                        raName: newsRa.project_name,
                                                        approvingManagerName: newsRaData.firstname
                                                    };
                                                    
                                                    const body3  = await template.getBodyData(config.emailTemplate.forwardChangeForTraveller, repalceData);
                                                        
        
                                                    try {
                                                        const email = await emailHelper.sendEmailNodeMailer(newsRa.traveller_id.email,
                                                            body3.subject, body3.html); 
                                                        if ( email ) {
                                                            // newsRa.currentAppmanager = [];
                                                            // newsRa.approvingManager.forEach(function (appmanage) {

                                                            //     if (appmanage._id == req.user.id) {
                                                            //         newsRa.currentAppmanager.push(appmanage)
                                                            //     }

                                                            // })

                                                            res.json({
                                                                'code': config.success,
                                                                'message': 'Successfully RA forward to Approving Manager'
                                                            });
                                                        }
                                                    } catch (err) {
                                                        next(createError(config.serverError, err));
                                                    } 
                                                }
                                            } catch (err) {
                                                next(createError(config.serverError, err));
                                            } 


                                        }
                                    })

                            }
                        })
                }
            })
    }
}




/* @function : rejectRaByManager
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  :To reject ra by approving manager
 */
exports.rejectRaByManager = function (req, res, next) {
    var currentDate = new Date(moment().format());
    if (req.body) {
        newsRaObj.findOneAndUpdate({
            _id: req.body._id,
            is_deleted: false
        }, {
                $set: {
                    is_reject: true,
                    description_of_action: req.body.description_of_action,
                    rejectDate: currentDate
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate({
                path: 'approvingManager',
                match: {
                    _id: req.approving_manager.id
                }
            })
            .exec(async function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (newsRa.traveller_id) {
                        newsRa.departArr = [];
                        newsRa.department.forEach(function (dept) {
                            newsRa.departArr.push(dept.department);
                        })

                      
                        var baseUrl = envConfig.host;
                        var url = baseUrl + config.emailRALinkPending;
                        var firstParagraph = `your Risk assessment for <span class="_bold">${newsRa.project_name}</span>
                             has been rejected by ${newsRa.approvingManager[0].firstname}, Please find the below details of RA. <br> 
                            `;
                        var secondParagraph = `Comment by approving manager: ${newsRa.description_of_action}`;
                        var html = template.raTemplate.replace('{{name}}', newsRa.traveller_id.firstname);
                        html = html.replace('{{firstParagraph}}', firstParagraph);
                        html = html.replace('{{secondParagraph}}', secondParagraph);
                        html = html.replace('{{urlText}}', 'View Risk Assement');
                        html = html.replace('{{url}}', url);
                        try {
                            const email = await emailHelper.sendEmailNodeMailer(newsRa.traveller_id.email, 
                                    'Risk Assessment Rejection', html, ''); // to approving manager
                            if ( email ) {
                                res.json({
                                    'code': config.success,
                                    'message': 'Ra of a traveller has been rejected'
                                });
                            }
                        } catch (err) {
                            next(createError(config.serverError, err));
                        }
                    }

                }
            })
    }
}



/* @function : moreInfoRaByManager
 *  @author  : MadhuriK 
 *  @created  : 25-Aug-17
 *  @modified :
 *  @purpose  :To request more info about ra by approving manager
 */
exports.moreInfoRaByManager = function (req, res, next) {
    if (req.body) {
        console.log("req.body.approvingManager", req.user.id);
        newsRaObj.findOneAndUpdate({
            _id: req.body._id,
            is_deleted: false
        }, {
                $set: {
                    is_more_info: true,
                    is_modified: true,
                    description_of_action: req.body.description_of_action
                }
            }, {
                new: true
            })
            .populate('traveller_id')
            .populate('author_id')
            .populate({
                path: 'approvingManager',
                match: {
                    _id: req.user.id
                }
            })
            .exec(async function (err, newsRa) {
                var baseUrl = envConfig.host;
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (newsRa.traveller_id) {
                        newsRa.departArr = [];
                        newsRa.department.forEach(function (dept) {
                            newsRa.departArr.push(dept.department);
                        })
                        newsRa.currentAppmanager = [];
                        newsRa.approvingManager.forEach(function (appmanage) {

                            if (appmanage._id == req.user.id) {
                                newsRa.currentAppmanager.push(appmanage)
                            }

                        })

                        

                       if(newsRa.authorcheck == 1) {
                       
                        var url = baseUrl + config.emailRALinkList;
                        
                        var repalceData = {
                            userName:  newsRa.author_id.firstname , 
                            urlText: config.emailTemplate.urlText, 
                            url: url,
                            raName: newsRa.project_name,
                            comment: newsRa.description_of_action,
                            approvingManagerName: newsRa.currentAppmanager[0].firstname
                        };
                        
                        const body  = await template.getBodyData(config.emailTemplate.requestForMoreInfo, repalceData);
                            

                        try {
                            const email = await emailHelper.sendEmailNodeMailer(newsRa.author_id.email,
                                body.subject, body.html); 
                        } catch (err) {
                            next(createError(config.serverError, err));
                        }

                       }
                      
                       var url = baseUrl + config.emailRALinkList;
                       
                    
                        var repalceData = {
                            userName:  newsRa.traveller_id.firstname , 
                            urlText: config.emailTemplate.urlText, 
                            url: url,
                            raName: newsRa.project_name,
                            comment: newsRa.description_of_action,
                            approvingManagerName: newsRa.currentAppmanager[0].firstname
                        };
                        
                        const body  = await template.getBodyData(config.emailTemplate.requestForMoreInfo, repalceData);
                            

                        try {
                            const email = await emailHelper.sendEmailNodeMailer(newsRa.traveller_id.email,
                                body.subject, body.html); 
                           if ( email ) {
                            res.json({
                                'code': config.success,
                                'message': 'Request send to Author'
                            });
                           }
                       } catch (err) {
                        next(createError(config.serverError, err));
                       }
                    }

                }
            })
    }
}




exports.importApprovingmanager = function (req, res, next) {
    var outputJSON = "";
    var saveData = {};
    var dataArray = [];
    var destinationFolder = './clientPortal/uploads/usercsv';
    fs.ensureDir(destinationFolder, function (err) {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destinationFolder);
            },
            filename: function (req, file, cb) {
                var str = file.originalname;
                cb(null, Date.now() + "." + str.split(".")[str.split(".").length - 1]);
            }
        })
        var upload = multer({
            storage: storage
        }).single('file');
        upload(req, res, function (err1) {
            if (err1) {
                callback(err1);
            } else {
                console.log("req.file", req.file)
                if (req.file && req.file !== undefined) {
                    var stream = fs.createReadStream(req.file.path);
                    var file = req.file.filename;

                    var filename = Date.now() + ".csv";
                    csv.fromStream(stream, {
                        headers: true
                    })
                        .validate(function (data, next) {
                            next(null, data);
                        })
                        .on("data", function (data) {
                            dataArray.push(data);
                        })
                        .on("end", function () {
                            var saveVariantData = [];
                            var values = [];
                            async.forEach(dataArray, function (data, callback) {
                                if (data.firstname != '' && data.lastname != '' && data.email != '' && data.mobile_number != '' && data.role != '') {
                                    userTable.findOne({
                                        email: data.email,
                                        is_deleted: false
                                    }, function (err, userInfo) {
                                        if (err) {
                                            callback(err, null);
                                        } else if (userInfo) {
                                            console.log('exist')
                                            var txt = data.email + " already exist";
                                            callback(txt, null);
                                        } else {
                                            var pnumber = data.mobile.charAt(0) == '+' ? data.mobile : '+' + data.mobile;
                                            var number = pnumber;
                                            var code = parseNumber(number);
                                            var phone = code.phone
                                            var phoneCode = countryCode(code.country);
                                            console.log("data.email", data.email)
                                            console.log("phone", phone)
                                            console.log("phoneCode", phoneCode)
                                            authy.register_user(data.email, phone, phoneCode, function (err3, regRes) {
                                                var test1 = data.email + " " + 'email is not allowed ';
                                                if (err3) {
                                                    callback(test1, null);
                                                } else {



                                                    clientObj.findOne({
                                                        company_name: data.client,
                                                        is_deleted: false


                                                    }, function (errclient, client) {
                                                        var created_by = client.company_name;
                                                        var clienterror = "Client does not exist ";
                                                        if (errclient) {
                                                            callback(clienterror, null);

                                                        } else if (client) {
                                                            var client_id = client._id;
                                                            console.log("clie" + client_id);
                                                            usergroupObj.findOne({
                                                                group_name: data.usergroup,
                                                                is_deleted: false


                                                            }, function (errusergroup, usergroup) {
                                                                var usergrouperr = "Usergroup does not exist ";
                                                                if (errusergroup) {
                                                                    callback(usergrouperr, null);

                                                                } else if (usergroup) {
                                                                    var usergroup_id = usergroup._id;

                                                                    var randomPassword = config.randomToken(10);
                                                                    var key = 'salt_from_the_user_document';
                                                                    var cipher = crypto.createCipher('aes-256-cbc', key);
                                                                    cipher.update(randomPassword, 'utf8', 'base64');
                                                                    var encryptedPassword = cipher.final('base64');
                                                                    var cipher_hash = crypto.createCipher('aes-256-cbc', key);

                                                                    cipher_hash.update(data.email, 'utf8', 'base64'); // genrate random password
                                                                    var hashcode = cipher_hash.final('base64');
                                                                    data.duoToken = "";
                                                                    data.is_deleted = false;
                                                                    data.verified = false;
                                                                    data.super_admin = false;
                                                                    data.authyID = regRes.user.id;
                                                                    data.status = 'Inactive';
                                                                    data.firstname = data.firstname;
                                                                    data.lastname = data.lastname;
                                                                    data.passport_data = [{
                                                                        passport_number: "",
                                                                        nationality: ""
                                                                    }];
                                                                    data.mobile_number = pnumber;
                                                                    data.client_id = client_id;
                                                                    data.roleId = usergroup_id;
                                                                    data.hashcode = hashcode;

                                                                    data.password = encryptedPassword;
                                                                    userTable(data).save(function (err2, result1) {
                                                                        if (err2) {
                                                                            callback(err);
                                                                        } else {

                                                                            var baseUrl = envConfig.host + '/#/activate-account/' + hashcode;

                                                                            var smtpTransport = nodemailer.createTransport({
                                                                                service: config.service,
                                                                                auth: {
                                                                                    user: config.username,
                                                                                    pass: config.password
                                                                                }
                                                                            });
                                                                            var mailOptions = {
                                                                                from: config.username,
                                                                                to: data.email,
                                                                                subject: 'New Riskpal account',
                                                                                html: 'Hello ' + data.firstname + '<br><br> \n\
                                                                                            \n\ You have been setup by ('+ created_by + ') with Riskpal account \n\
                                                                                            <br><br> Your username is  :' + data.email + '<br>\n\
                                                                                            <br><br>To activate your account and create a new password, <a href="'+ baseUrl + '">Click here</a><br>\n\
                                                                                           </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                                                            };
                                                                            smtpTransport.sendMail(mailOptions, function (err, result) {
                                                                                if (err) {
                                                                                    next(createError(config.serverError, err));
                                                                                } else {
                                                                                    res.json({
                                                                                        'code': config.success,
                                                                                        'message': 'User imported successfully'
                                                                                    });
                                                                                }
                                                                            });
                                                                        }




                                                                    })



                                                                }

                                                            });



                                                        }

                                                    });





                                                }

                                            })

                                        }
                                    });

                                } else {
                                    var txt = 'Invalid fields in csv file'
                                    callback(txt, null);
                                }
                            }, function (err) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    res.json({
                                        'code': config.success,
                                        'message': 'file Uploaded successfully'
                                    });
                                }
                            })
                        })
                }
            }

        });
    })
}


exports.getAllCountry = function (req, res, next) {
    approvingManagerObj.findOne({
        _id: req.approving_manager.id,
        is_deleted: false
    }, function (err, approvingManage) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            countryRiskObj.find({
                country_id: req.params.country_id,
                // client_admin_id: approvingManage.client_admin_id
                companyId: approvingManage.client_admin_id.companyId
            }, function (err, country_risk) {
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

/* @function : getTravellerInfo
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  :To get traveller's info.
 */
exports.getMedicalInfoByRequest = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.findOne({
            _id: req.params.traveller_id,
            is_deleted: false,
            admin: false
        }, function (err, traveller) {
            if (traveller) {
                medicalObj.findOne({
                    approving_manager: req.approving_manager.id,
                    traveller: req.params.traveller_id
                }, function (err, medical) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else if (medical) {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'data': traveller,
                            'medical': medical
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'data': traveller,
                            'medical': []
                        });
                    }
                })
            } else {
                next(createError(config.serverError, err));
            }
        })
    }
}
exports.verifyOtp = function (req, res, next) {
    if (req.body) {
        approvingManagerObj.findOne({
            _id: req.body.Id,
            is_deleted: false,
            otp: req.body.otp
        }, function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!approving_manager) {
                res.json({
                    'code': config.error,
                    'message': 'Otp is not Correct'
                });
            } else {
                var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                var params = {
                    id: approving_manager._id,
                }
                var jwtToken = jwt.sign(params, config.secret, {
                    expiresIn: expirationDuration
                });
                if (jwtToken) {
                    approving_manager.duoToken = jwtToken;
                    approving_manager.duoVerified = true;
                    approving_manager.save(function (err, result) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            approving_manager.duoToken = 'Bearer ' + jwtToken;
                            res.json({
                                'code': config.success,
                                'data': approving_manager,
                                'message': 'login successfully'
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
    }
}

var uuid = '';
exports.createonetouch = function (req, res, next) {
    approvingManagerObj.findOne({
        email: req.body.email,
        is_deleted: false
    }).exec(function (err, user) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            var user_payload = {
                'message': 'Login requested for a Riskpal  account'
            };
            authy.send_approval_request(user.authyID, user_payload, {}, null, function (oneTouchErr, oneTouchRes) {
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

exports.checkonetouchstatus = function (req, res, next) {
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
    authy.check_approval_status(uuid, function (err, response) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            if (response.approval_request.status === "approved") {
                approvingManagerObj.findOne({
                    email: req.body.email,
                    is_deleted: false
                }).exec(function (err, user) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                        }
                        var jwtToken = jwt.sign(params, config.secret, {
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
                                        'token': response,
                                        'data': user,
                                        'status': 'approved',
                                        'message': 'login successfully'
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

exports.requestPhoneVerification = function (req, res, next) {
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
        authy.phones().verification_start(phone_number, country_code, info, function (err, response) {
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

exports.verifyPhoneToken = function (req, res, next) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;

    if (phone_number && country_code && token) {

        authy.phones().verification_check(phone_number, country_code, token, function (err, response) {
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
        next(createError(config.serverError, 'Please enter all required fields.'));
    }
};

exports.verify = function (req, res, next) {
    console.log("token", req.body)
    approvingManagerObj.findOne({
        email: req.body.email,
        is_deleted: false
    }).exec(function (err, user) {
        if (err) {
            res.json({
                'code': config.error,
                'err': 'user not found'
            });
        } else {
            authy.verify(user.authyID, req.body.smstoken, function (err, tokenRes) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    console.log("Verify Token Response: ", tokenRes);
                    if (tokenRes.success) {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                        }
                        var jwtToken = jwt.sign(params, config.secret, {
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
                                        'message': 'login successfully'
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

exports.voice = function (req, res, next) {
    approvingManagerObj.findOne({
        email: req.body.email,
        is_deleted: false
    }).exec(function (err, user) {
        console.log("Send SMS");
        if (err) {
            next(createError(config.serverError, err));
        } else {
            /**
             * If the user has the Authy app installed, it'll send a text
             * to open the Authy app to the TOTP token for this particular app.
             *
             * Passing force: true forces an voice call to be made
             */
            authy.request_call(user.authyID, true, function (err, callRes) {
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

exports.sms = function (req, res, next) {
    console.log("req.body.email", req.body.email)
    approvingManagerObj.findOne({
        email: req.body.email,
        is_deleted: false
    }).exec(function (err, user) {
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
            authy.request_sms(user.authyID, true, function (err, smsRes) {
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

exports.getTravellerMapData = function (req, res, next) {
    // var currentDate = moment.utc().format('YYYY-MM-DD');
    var currentDate = Date.now();
    newsRaObj.find({
        is_deleted: false
    })
        .populate('traveller_id')
        .exec(function (err, ras) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (ras.length > 0) {

                async.waterfall([
                    function (callback) {
                        approvingManagerObj.findOne({
                            _id: req.approving_manager.id,
                            is_deleted: false
                        })
                            .populate('client_admin_id')
                            .exec(function (err, app) {
                                if (err) {
                                    callback(err, []);
                                } else {
                                    callback(null, app);
                                }
                            })
                    },
                    function (app, callback) {
                        var raArr = _.filter(ras, function (raObj) {
                            if (raObj.traveller_id) {
                                return raObj.traveller_id.client_admin_id.equals(app.client_admin_id.companyId)
                            }
                        });
                        callback(null, raArr);
                    },
                    function (raArr, callback) {
                        var dataArr = [];
                        raArr.forEach(function (raData) {
                            if (raData.startdate) {
                                if ((currentDate > raData.startdate) && (raData.enddate > currentDate)) {
                                    dataArr.push(raData);
                                }
                            }
                        })
                        callback(null, dataArr);
                    },
                    function (dataArr, callback) {
                        var countryArr = [];
                        var arr = [];
                        dataArr.forEach(function (raObj) {
                            raObj.country.forEach(function (countryObj) {
                                if (countryArr.indexOf(countryObj.name) == -1) {
                                    countryArr.push(countryObj.name);
                                }
                                arr.push(countryObj.name);
                            })
                        })
                        callback(null, arr);

                    },
                    function (arr, callback) {
                        if (arr.length > 0) {
                            var locationArr = [];
                            arr.forEach(function (countryName) {
                                geocoder.geocode(countryName, function (err, res) {
                                    if (res.length > 0) {
                                        locationArr.push({
                                            lat: res[0].latitude,
                                            lng: res[0].longitude
                                        })
                                        if (locationArr.length == arr.length) {
                                            callback(null, locationArr)
                                        }
                                    }
                                });
                            })
                        } else {
                            callback(null, [])
                        }

                    }
                ], function (err, result) {
                    res.json({
                        'code': config.success,
                        'data': result
                    })
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': ras
                })
            }
        })
}



// exports.getTravellerMapData = function(req, res, next) {
//     // var currentDate = moment.utc().format('YYYY-MM-DD');
//     var currentDate = Date.now();
//     var tname = '';
//     newsRaObj.find({ is_deleted: false })
//         .populate('traveller_id')
//         .exec(function(err, ras) {
//             if (err) {
//                 res.json({
//                     'error': err,
//                     'code': config.error,
//                     'message': 'Something went wrong please try again!'
//                 });
//             } else if (ras.length > 0) {
//                 async.waterfall([
//                         function(callback) {
//                             approvingManagerObj.findOne({ _id: req.approving_manager.id, is_deleted: false })
//                                 .exec(function(err, app) {
//                                     if (err) {
//                                         callback(err, []);
//                                     } else {
//                                         callback(null, app);
//                                     }
//                                 })
//                         },
//                         function(app, callback) {
//                             var raArr = _.filter(ras, function(raObj) {
//                                 if (raObj.traveller_id) {
//                                     return raObj.traveller_id.client_admin_id.equals(app.client_admin_id)
//                                 }
//                             });
//                             callback(null, raArr);
//                         },
//                         function(raArr, callback) {
//                             var dataArr = [];
//                             raArr.forEach(function(raData) {
//                                 if (raData.startdate) {
//                                     if ((currentDate > raData.startdate) && (raData.enddate > currentDate)) {
//                                         dataArr.push(raData);
//                                     }
//                                 }
//                             })
//                             callback(null, dataArr);
//                         },
//                         function(dataArr, callback) {
//                             console.log("dataArr", dataArr)
//                             var countryArr = [];
//                             var arr = [];
//                             var tempObj = {};
//                             dataArr.forEach(function(raObj, index) {
//                                 tempObj = {};
//                                 tempObj.tname = raObj.traveller_id.firstname;
//                                 raObj.country.forEach(function(countryObj) {
//                                     if (countryArr.indexOf(countryObj.name) == -1) {
//                                         countryArr.push(countryObj.name);
//                                     }
//                                 })
//                                 tempObj.countryName = countryArr;
//                                 arr.push(tempObj)
//                             })
//                             callback(null, arr);
//                         },
//                         function(arr, callback) {
//                             console.log("arr", arr)
//                             if (arr.length > 0) {
//                                 var locationArr = [];
//                                 var name = tname;
//                                 arr.forEach(function(countryName) {
//                                     console.log("countryName", countryName.countryName)
//                                     countryName.countryName.forEach(function(name) {
//                                         console.log("name", name)
//                                         geocoder.geocode(name, function(err, res) {
//                                             if (res.length > 0) {
//                                                 locationArr.push({
//                                                     lat: res[0].latitude,
//                                                     lng: res[0].longitude,
//                                                     name: countryName.tname
//                                                 })
//                                                 if (locationArr.length == countryName.countryName.length) {
//                                                     callback(null, locationArr)
//                                                 }
//                                             }
//                                         });
//                                     })

//                                 })
//                             } else {
//                                 callback(null, [])
//                             }

//                         }
//                     ],
//                     function(err, result, name) {
//                         res.json({
//                             'code': config.success,
//                             'data': result
//                         })
//                     });
//             } else {
//                 res.json({
//                     'code': config.success,
//                     'data': ras
//                 })
//             }
//         })
// }

/* @function : getAllDepartmentOfClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get all department list of client super admin 
 */
exports.getClientDepartment = function (req, res, next) {
    approvingManagerObj.findOne({
        _id: req.approving_manager.id,
        is_deleted: false
    })
        .populate('client_admin_id')
        .exec(function (err, app) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                departmentObj.find({
                    // client_admin_id: app.client_admin_id,
                    companyId: app.client_admin_id.companyId,
                    is_deleted: false,
                    status: "Active"
                }, function (err, departmentArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': departmentArr,
                        });
                    }
                })
            }
        })

}


/* @function : Update RA from approving managers login 
 *  @author  : Siroi 
 *  @created  : 2-Aug-18
 *  @modified :
 *  @purpose  :To update RA details from Approving managers login 
 */
exports.updateEditRa = function (req, res, next) {
    if (req.body) {
        console.log("req.body.approvingManager", req.approving_manager.id)
        newsRaObj.findOneAndUpdate({
            _id: req.body._id,
            is_deleted: false
        }, {
                $set:
                    req.body

            }, {
                new: true
            })
            .populate('traveller_id')
            .populate({
                path: 'approvingManager',
                match: {
                    _id: req.approving_manager.id
                }
            })
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    //     if (newsRa.traveller_id) {
                    //         newsRa.departArr = [];
                    //         newsRa.department.forEach(function(dept) {
                    //             newsRa.departArr.push(dept.department);
                    //         })

                    //         var smtpTransport = nodemailer.createTransport({
                    //             service: config.service,
                    //             auth: {
                    //                 user: config.username,
                    //                 pass: config.password
                    //             }
                    //         });
                    //         var mailOptions = {
                    //             from: 'noreply.riskpal@gmail.com',
                    //             to: newsRa.traveller_id.email,
                    //             subject: 'Additional information request',
                    //             html: 'Dear, ' + newsRa.traveller_id.firstname + '<br><br> \n\
                    //                 \n\ Your approving manager has requested additional information for risk assessment' + '<br>' + newsRa.project_name + 'and has attached the following message' +
                    //                 // '<br><br> Department:-  ' + newsRa.departArr.toString() +
                    //                 // '<br><br> Date of RA:-  ' + newsRa.date_of_ra +
                    //                 // '<br><br> Approving Manager:-  ' + req.body.approvingManager[0].name + 
                    //                 // '<br><br> RA Details :- ' + req.body.ra_details +
                    //                 // '<br><br> Question Section :-  ' + req.body.question +
                    //                 // '<br><br> Supplier Details :- ' + req.body.supplier_details +
                    //                 // '<br><br> Communication Details:- ' + req.body.communication_details +
                    //                 // '<br><br> Contingency Details :- ' + req.body.contingency_details +
                    //                 // '<br><br> Other Information :- ' + req.body.other_info +
                    //                 '\n\'<br><br>:-  ' + req.body.description_of_action + '\n\
                    //                 </p><br><br>To review this and amend the risk assessment, please login to RiskPal' // html body
                    //         };
                    //         smtpTransport.sendMail(mailOptions, function(err) {
                    //             if (err) {
                    //                 res.json({
                    //                     'code': config.error,
                    //                     'err': err
                    //                 });
                    //             } else {
                    //                 res.json({
                    //                     'code': config.success,
                    //                     'message': 'Ra of a traveller has been rejected'
                    //                 });
                    //             }
                    //         });
                    //     }

                    // }

                    res.json({
                        'code': config.success,
                        'message': 'RA updated successfully!'
                    });
                }
            })
    }
}


