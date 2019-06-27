var userObj = require('./../../schema/users.js'); // include user schema file
var approvingManagerObj = require('./../../schema/approving_manager.js'); // include approving_manager schema file
var countryObj = require('./../../schema/country.js'); // to include country file
var currencyObj = require('./../../schema/currency.js'); // to include currency file
var categoryObj = require('./../../schema/category.js'); // to include category file
var proofOfLifeObj = require('./../../schema/proof_of_life.js'); // to include proof_of_life file
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // to include type_of_ra file
var RaObj = require('./../../schema/news_ra.js'); // to include news_ra file
var newsRaAnsObj = require('./../../schema/news_ra_answer.js'); // to include news_ra_answer file
var QuesObj = require('./../../schema/questionnaire.js'); // to include questionnaire file
var supplierObj = require('./../../schema/supplier.js'); // to include supplier file
var communicationObj = require('./../../schema/communication.js'); // to include communication file
var contingencyObj = require('./../../schema/contingency.js'); // to include contingency file
var departmentObj = require('./../../schema/department.js'); // to include department file
var emailTemplateObj = require('./../../schema/EmailTemplates.js'); // to include department file
var config = require('../../config/jwt_secret.js'); // config 
var jwt = require('jsonwebtoken');
var async = require('async');
var crypto = require('crypto');
var jsrender = require('node-jsrender');
var htmlToPdf = require('html-to-pdf');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var createError = require('http-errors');
/* @function : getAllcoAdmins
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To list all the users.
 */

exports.getAllEmailTemplate = function (req, res, next) {
    console.log("req.body", req.body);
    var limit = req.body.count ? req.body.count : 10;
    var sortby =  { unique_keyword: 'asc'} // req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false
    }
    if (req.body.keyword)
        query['$or'] = [{
            unique_keyword: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            title: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            subject: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        },{
            description: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];

    emailTemplateObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            console.log("data", data);
            if (data) {
                emailTemplateObj.count(query, function (err, count) {
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


/* @function : getApprovingMangers
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get all approving managers.
 */
exports.getEmailTemplateDetail = function (req, res, next) {
    console.log("req.params.email_template_id", req.params.email_template_id);
    if (req.params.email_template_id) {
        emailTemplateObj.findOne({
            _id: req.params.email_template_id,
            is_deleted: false
        }, function (err, emailTemplateData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                console.log("emailTemplateData", emailTemplateData);
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': emailTemplateData
                });
            }
        })
    }
}



/* @function : changeDepartmentStatus
 *  @author  : MadhuriK 
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To update department details.
 */
exports.updateEmailTemplateaaa = function (req, res, next) {
    if (req.body) {
        emailTemplateObj.find({
            department_name: req.body.department_name,
            is_deleted: false,
            _id: {
                $ne: req.body._id
            }
        }, function (err, department) {
            if (department.length > 0) {
                next(createError(config.serverError, err));
            } else {
                var department_id = req.body._id;
                var department = {
                    department_name: req.body.department_name,
                    intermediate_approving_manager: req.body.intermediate_approving_manager,
                    alternative_final_approving_manager: req.body.alternative_final_approving_manager,
                    final_approving_manager: req.body.final_approving_manager
                }

                departmentObj.update({
                    _id: department_id,
                    is_deleted: false
                }, {
                    $set: department
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'department updated successfully'
                        });
                    }
                })
            }
        })

    }

}

exports.saveEmailTemplate = function (req, res, next) {
    var body = req.body;
    console.log("body", body);
    if (!body) {
        res.json({
            'code': 402,
            'message': 'No data avaiable'
        });
    } else {
        var emailTemplateData = new emailTemplateObj(body);
        emailTemplateData.save(function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Email template added successfully'
                });
            }
        })

        // emailTemplateObj.findOne({
        //     _id: body._id
        // }).exec(function (err, emailTemplate) {
        //     if (err) {
        //         res.json({
        //             'code': 402,
        //             'message': 'EmailTemplate data not found'
        //         })
        //     } else {
        //         emailTemplate.title = body.title;
        //         emailTemplate.subject = body.subject;
        //         emailTemplate.description = body.description;
        //         emailTemplate.save(function (err, appointmentData) {
        //             if (err) {
        //                 res.json({
        //                     'code': config.httpUnauthorize,
        //                     'message': 'Unable to save user'
        //                 });
        //             } else {
        //                 res.json({
        //                     'code': 200,
        //                     'message': 'Email Template updated successfully'
        //                 })
        //             }
        //         });
        //     }
        // });
    }
}
exports.updateEmailTemplate = function (req, res, next) {
    console.log("req", req.body);
    var body = req.body;
    console.log("body", body);
    if (!req.body.title || !req.body.subject || !req.body.description) {
        res.json({
            'code': 402,
            'message': 'Required fields are missing'
        });
    } else {
        emailTemplateObj.findOne({
            _id: body._id
        }).exec(function (err, emailTemplate) {
            if (err) {
                res.json({
                    'code': 402,
                    'message': 'EmailTemplate data not found'
                })
            } else {
                emailTemplate.title = body.title;
                emailTemplate.subject = body.subject;
                emailTemplate.description = body.description;
                emailTemplate.save(function (err, appointmentData) {
                    if (err) {
                        res.json({
                            'code': config.httpUnauthorize,
                            'message': 'Unable to save user'
                        });
                    } else {
                        res.json({
                            'code': 200,
                            'message': 'Email Template updated successfully'
                        })
                    }
                });
            }
        });
    }
}

/* @function : addTraveller
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To add the users.
 */
exports.addTraveller = function (req, res, next) {
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
                var key = 'salt_from_the_user_document';
                var cipher = crypto.createCipher('aes-256-cbc', key);
                var randomPassword = config.randomToken(8);
                cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                var encryptedPassword = cipher.final('base64');
                //create a user object
                var user = new userObj({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: encryptedPassword,
                    admin: false,
                    duoToken: "",
                    status: 'Active',
                    client_admin_id: req.user.id
                });
                user.save(function (err, user) {
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
                            to: req.body.email,
                            subject: 'successfully registration',
                            html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                    \n\ your account has been created by organization admin, please check the below credentials \n\
                    <br><br> Email :' + req.body.email + '<br>\n\
                    Password :' + randomPassword + '\n\
                    </p><br><br>Thanks,<br>  RiskPal Team' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Traveller added successfully'
                                });
                            }
                        });

                    }
                });
            }
        });
    }

}


/* @function : addCoAdmin
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To add the co admin.
 */
exports.addCoAdmin = function (req, res, next) {
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
                var key = 'salt_from_the_user_document';
                var cipher = crypto.createCipher('aes-256-cbc', key);
                var randomPassword = config.randomToken(8);
                cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                var encryptedPassword = cipher.final('base64');
                //create a user object
                var user = new userObj({
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    password: encryptedPassword,
                    admin: true,
                    duoToken: "",
                    status: 'Active',
                    client_admin_id: req.user.id
                });
                user.save(function (err, user) {
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
                            to: req.body.email,
                            subject: 'successfully registration',
                            html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                    \n\ your account has been created by organization admin, please check the below credentials \n\
                    <br><br> Email :' + req.body.email + '<br>\n\
                    Password :' + randomPassword + '\n\
                    </p><br><br>Thanks,<br>  RiskPal Team' // html body
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Co admin added successfully'
                                });
                            }
                        });

                    }
                });
            }
        });
    }
}

/* @function : deleteUser
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To delete the users.
 */
exports.deleteUser = function (req, res, next) {
    if (req.params.userId) {
        userObj.update({
            _id: req.params.userId,
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
                    'message': 'User deleted successfully'
                });
            }
        })
    }

}



/* @function : changeUserStatus
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To change the users status.
 */
exports.changeUserStatus = function (req, res, next) {
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
                    'message': 'user status updated successfully'
                });
            }
        })
    }

}



/* @function : getUserDetails
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To get the users detials.
 */
exports.getUserDetails = function (req, res, next) {
    if (req.params.userId) {
        userObj.findOne({
            _id: req.params.userId,
            is_deleted: false
        }, function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': user,
                    'message': 'user detials'
                });
            }
        })
    }

}



/* @function : updateCoAdmin
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To update the co-admin detials.
 */
exports.updateCoAdmin = function (req, res, next) {
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false,
            _id: {
                $ne: req.body.id
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                }
                userObj.update({
                    _id: req.body.id,
                    is_deleted: false
                }, {
                    $set: user
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'basic admin detials updated successfully'
                        });
                    }
                })

            }
        });
    }
}


/* @function : updateTraveller
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To update the traveller detials.
 */
exports.updateTraveller = function (req, res, next) {
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false,
            _id: {
                $ne: req.body.id
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                }
                userObj.update({
                    _id: req.body.id,
                    is_deleted: false
                }, {
                    $set: user
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'traveller detials updated successfully'
                        });
                    }
                })

            }
        });
    }
}


/* @function : listUser
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To list all the Traveller.
 */
exports.getAlltravellers = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        admin: false,
        client_admin_id: req.user.id
    }
    if (req.body.keyword)
        query['$or'] = [{
            firstname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            lastname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            email: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];

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



/* @function : getTravellerList
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To list all the Traveller.
 */
exports.getTravellerList = function (req, res, next) {
    if (req.body && req.user) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                var limit = req.body.count ? req.body.count : 10;
                var sortby = req.body.sortby ? req.body.sortby : {};
                var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
                var query = {
                    is_deleted: false,
                    admin: false,
                    client_admin_id: basic_admin.client_admin_id
                }
                if (req.body.keyword)
                    query['$or'] = [{
                        firstname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }, {
                        lastname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }, {
                        email: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }];

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



/* @function : getAllCountryList
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all country list.
 */
exports.getAllCountryList = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));

        } else {
            res.json({
                'code': config.success,
                'data': country,
                'message': 'success'
            });
        }
    })
}



/* @function : getTravellerData
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get traveller data.
 */
exports.getTravellerData = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.findOne({
            _id: req.params.traveller_id,
            is_deleted: false
        }, function (err, travellerData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': travellerData,
                    'message': 'success'
                });
            }
        })
    }
}


/* @function : getProofOfLifeQue
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get proof of life questions.
 */
exports.getProofOfLifeQue = function (req, res, next) {
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                proofOfLifeObj.find({
                    client_admin_id: basic_admin.client_admin_id,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, proofOfLife) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': proofOfLife,
                            'message': 'success'
                        });
                    }

                })
            }
        })
    }

}


/* @function : updateTravellerDetails
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To update traveller profile.
 */
exports.updateTravellerDetails = function (req, res, next) {
    if (req.body) {
        var traveller_id = req.body.traveller_id;
        delete req.body.traveller_id;

        userObj.update({
            _id: traveller_id,
            is_deleted: false
        }, {
            $set: req.body
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Traveller profile updated successfully'
                });
            }
        })

    }
}


/* @function : getAllRa
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getAllRa = function (req, res, next) {
    userObj.findOne({
        _id: req.user.id
    }).populate('client_admin_id').exec(function (err, basic_admin) {
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {};
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            status: "Active",
            is_created_compleletely: true,
            $or: [{
                client_id: basic_admin.client_admin_id._id
            }, {
                sector_id: basic_admin.client_admin_id.sector_id
            }]
        }
        if (req.body.keyword)
            query.ra_name = {
                $regex: req.body.keyword,
                $options: "$i"
            };

        typeOfRaObj.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .exec(function (err, data) {
                if (data) {
                    typeOfRaObj.count(query, function (err, count) {
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
    });
}



/* @function : getAllRaOfThisType
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all ra of a traveller for particular type of ra.
 */
exports.getAllRaOfThisType = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        traveller_id: req.body.traveller_id,
        types_of_ra_id: req.body.typeOfRa_id
    }
    if (req.body.keyword)
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };

    RaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('department')
        .exec(function (err, data) {
            if (data) {
                RaObj.count(query, function (err, count) {
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



/* @function : getTravellers
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get all traveller.
 */
exports.getTravellers = function (req, res, next) {
    if (req.user.id && req.params.traveller_id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                userObj.find({
                    client_admin_id: basic_admin.client_admin_id,
                    admin: false,
                    is_deleted: false,
                    status: 'Active',
                    _id: {
                        $ne: req.params.traveller_id
                    }
                }, function (err, travellerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': travellerArr,
                            'message': 'success'
                        });
                    }
                })

            }
        })
    }

}


/* @function : getApprovingMangers
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get all approving managers.
 */
exports.getApprovingMangers = function (req, res, next) {
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                approvingManagerObj.find({
                    client_admin_id: basic_admin.client_admin_id,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, approvingManagerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approvingManagerArr,
                            'message': 'success'
                        });
                    }
                })
            }
        })
    }
}


/* @function : addNewsRa
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To add ra by basic admin on behalf of traveller.
 */
exports.addNewsRa = function (req, res, next) {
    if (req.body) {
        userObj.findOne({
            _id: req.body.traveller_id,
            is_deleted: false
        }, function (err, traveller) {
            var raArr = new RaObj(req.body);
            raArr.addedBy = req.user.id
            raArr.client_admin_id = traveller.client_admin_id;
            raArr.save(function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    var departArr = [],
                        countryArr = [];
                    data.department.forEach(function (depart) {
                        departArr.push(depart.department);
                    })

                    data.country.forEach(function (country) {
                        countryArr.push(country.name);
                    })

                    userObj.find({
                        _id: {
                            $in: data.travellerTeamArr
                        },
                        admin: false
                    }, {
                        email: 1
                    }, function (err, travellerArr) {
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
                                to: travellerArr,
                                from: 'noreply.riskpal@gmail.com',
                                subject: 'Ra created by approving manager on behalf of' + traveller.firstname + " " + traveller.lastname,
                                html: 'Hello traveller Ra has been created by approving manager on behalf of ' + traveller.firstname + " " + traveller.lastname + ', Please find the below Ra details <br> <br>  Project Name :-' + data.project_name + '<br>' + 'Date Of RA :- ' + data.date_of_ra + '<br>' + 'Department :-' + departArr.toString() + '<br> Country :-' + countryArr.toString() + '\n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    res.json({
                                        'code': config.success,
                                        'message': "News RA details added successfully",
                                        'data': data
                                    });
                                }
                            });
                        }
                    })
                }

            })
        })

    }

}


/* @function : getRaDetails
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get ra details
 */
exports.getRaDetails = function (req, res, next) {
    if (req.params.ra_id) {
        RaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': "success",
                    'data': raData
                });
            }
        })
    }
}



/* @function : updateNewsRa
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To update ra details
 */
exports.updateNewsRa = function (req, res, next) {
    if (req.body) {
        userObj.findOne({
            _id: req.body.traveller_id,
            is_deleted: false
        }, function (err, traveller) {
            var raData = {
                addedBy: req.user.id, // basic admin
                date_of_ra: req.body.date_of_ra,
                project_name: req.body.project_name,
                description_of_task: req.body.description_of_task,
                itinearyArr: req.body.itinearyArr,
                approvingManager: req.body.approvingManager,
                country: req.body.country,
                travellerTeamArr: req.body.travellerTeamArr,
                department: req.body.department
            }
            RaObj.findOneAndUpdate({
                _id: req.body._id
            }, {
                $set: raData
            }, function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    var departArr = [],
                        countryArr = [];
                    data.department.forEach(function (depart) {
                        departArr.push(depart.department);
                    })

                    data.country.forEach(function (country) {
                        countryArr.push(country.name);
                    })

                    userObj.find({
                        _id: {
                            $in: data.travellerTeamArr
                        },
                        admin: false
                    }, {
                        email: 1
                    }, function (err, travellerArr) {
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
                                to: travellerArr,
                                from: 'noreply.riskpal@gmail.com',
                                subject: 'Ra updated by basic admin on behalf of ' + traveller.firstname + " " + traveller.lastname,
                                html: 'Hello traveller Ra has been updated by basic admin on behalf of ' + traveller.firstname + " " + traveller.lastname + ', Please find the below Ra details <br> <br>  Project Name :-' + data.project_name + '<br>' + 'Date Of RA :- ' + data.date_of_ra + '<br>' + 'Department :-' + departArr.toString() + '<br> Country :-' + countryArr.toString() + '\n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    res.json({
                                        'code': config.success,
                                        'message': 'news ra updated successfully'
                                    });
                                }
                            });
                        }
                    })
                }

            })

        })
    }
}



/* @function : getAllCategoryList
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get categories for a ra
 */
exports.getAllCategoryList = function (req, res, next) {
    if (req.params.type_of_ra_id && req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                categoryObj.find({
                    client_admin_id: basic_admin.client_admin_id,
                    types_of_ra_id: req.params.type_of_ra_id,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, categories) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': categories,
                            'message': 'success'
                        })
                    }
                })
            }
        })
    }
}


/* @function : getRaStatus
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get ra status (submit or not)
 */
exports.getRaStatus = function (req, res, next) {
    if (req.params.ra_id) {
        RaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': raData
                })
            }
        })

    }
}



/* @function : getRaAns
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get ra's category questions answers
 */
exports.getRaAns = function (req, res, next) {
    // if (req.params.ra_id && req.params.category_id) {

    //     var ra_id = req.params.ra_id;
    //     var category_id = req.params.category_id;

    //     newsRaAnsObj.find({ news_ra_id: ra_id, category_id: category_id, is_deleted: false }, function (err, raAnsData) {
    //         if (err) {
    //             res.json({
    //                 'error': err,
    //                 'code': config.error,
    //                 'message': 'Something went wrong please try again!'
    //             });
    //         } else {

    //             res.json({
    //                 'code': config.success,
    //                 'data': raAnsData,
    //                 'message': 'success',
    //             });

    //         }
    //     })
    // }

    if (req.params.types_of_ra_id && req.params.newsRa_id) {
        newsRaAnsObj.find({
            news_ra_id: req.params.newsRa_id,
            is_deleted: false
        }, function (err, newsRa) {
            if (err) {
                next(createError(config.serverError, err));
            } else {

                res.json({
                    'code': config.success,
                    'data': newsRa,
                    'message': 'success',
                });

            }
        })
    }
}



/* @function : getCategoryQuestions
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get questions of category
 */
exports.getCategoryQuestions = function (req, res, next) {
    if (req.params.types_of_ra_id) {
        QuesObj.find({
            assigned_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            status: 'Active'
        }, function (err, questions) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questions,
                    'message': 'success',
                });
            }

        })
    }
}



/* @function : addquestionDataRa
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add answers of category questions
 */
exports.addquestionDataRa = function (req, res, next) {
    var news_ra_id = req.body[0].ra_id;
    var category_id = req.body[0].category_id;
    var traveller_id = req.body[0].traveller_id;
    delete req.body[0].ra_id;
    delete req.body[0].category_id;
    delete req.body[0].traveller_id;
    var quesArr = [];

    req.body.forEach(function (que) {
        quesArr.push({
            traveller_id: traveller_id,
            news_ra_id: news_ra_id,
            questionnaire_id: que.questionnaire_id ? que.questionnaire_id : que._id,
            question: que.question,
            best_practice_advice: que.best_practice_advice,
            category_id: category_id,
            ticked: que.ticked ? que.ticked : false,
            specific_mitigation: que.specific_mitigation ? que.specific_mitigation : ""
        });
    })
    newsRaAnsObj.find({
        news_ra_id: news_ra_id,
        category_id: category_id,
        is_deleted: false,
        traveller_id: traveller_id
    }, function (err, newsRaAns) {
        if (err) {
            next(createError(config.serverError, err));

        } else if (newsRaAns.length > 0) {
            async.each(quesArr, function (que, callback) {
                newsRaAnsObj.update({
                    news_ra_id: news_ra_id,
                    category_id: category_id,
                    is_deleted: false,
                    traveller_id: traveller_id,
                    questionnaire_id: que.questionnaire_id
                }, {
                    $set: {
                        specific_mitigation: que.specific_mitigation,
                        ticked: que.ticked
                    }
                }, function (err, success) {
                    callback();
                })
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Fill specific mitigation for this category questionnaire are done successfully',
                    });
                }
            });

        } else {
            async.each(quesArr, function (que, fn) {
                var news_ra_ans = new newsRaAnsObj(que);
                news_ra_ans.save(function (err, success) {
                    fn();
                })
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Fill specific mitigation for this category questionnaire are done successfully',
                    });
                }
            });
        }
    })
}


/* @function : getAllCurrencies
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get all currencies
 */
exports.getAllCurrencies = function (req, res, next) {
    currencyObj.find({}, function (err, currencies) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': currencies
            })
        }
    })
}


/* @function : addRaSupplier
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add ra supplier by basic admin on behalf of traveller
 */
exports.addRaSupplier = function (req, res, next) {
    if (req.body) {
        supplierObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, supplierData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (supplierData) {
                var supplierArr = {
                    supplier_name: req.body.supplier_name,
                    // rating_with_star: req.body.rating_with_star,
                    service_provided: req.body.service_provided,
                    sourced_by: req.body.sourced_by,
                    contact: req.body.contact,
                    cost: req.body.cost,
                    currency: req.body.currency,
                    city: req.body.city,
                    country: req.body.country,
                    rate: req.body.rate,
                    // rate: req.body.rate.replace(/'/g, ''),
                    description: req.body.description

                }
                supplierObj.update({
                    _id: supplierData._id,
                    is_deleted: false
                }, {
                    $set: supplierArr
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'supplier for news ra updated successfully'
                        });
                    }
                })
            } else {
                var supplierData = new supplierObj(req.body);
                supplierData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'supplier for news ra added successfully'
                        });
                    }
                })
            }
        })
    }
}



/* @function : getSupplierData
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get supplier details
 */
exports.getSupplierData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        supplierObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id
        }, function (err, supplier) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplier,
                    'message': 'success'
                })
            }
        })

    }
}


/* @function : addNewsRaCommunication
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add news ra communication form.
 */
exports.addNewsRaCommunication = function (req, res, next) {
    if (req.body) {
        communicationObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (communicationData) {
                var communicationArr = {
                    call_in_schedule: req.body.call_in_schedule,
                    emergency_contact: req.body.emergency_contact,
                    details_of_team: req.body.details_of_team,
                    want_your_poc: req.body.want_your_poc,
                    reminder_before_checkIn: req.body.reminder_before_checkIn,
                    detail_an_overdue_procedure: req.body.detail_an_overdue_procedure
                }
                communicationObj.update({
                    _id: communicationData._id,
                    is_deleted: false
                }, {
                    $set: communicationArr
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'communication for news ra updated successfully'
                        });
                    }
                })
            } else {
                var communicationData = new communicationObj(req.body);
                communicationData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'communication for news ra added successfully'
                        });
                    }
                })
            }
        })
    }
}


/* @function : getCommunicationData
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get news ra communication form.
 */
exports.getCommunicationData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        communicationObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id,
            is_deleted: false
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'data': communicationData,
                    'code': config.success,
                    'message': 'success'
                });
            }
        })
    }
}



/* @function : addNewsRaContingencies
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To add contingency data.
 */
exports.addNewsRaContingencies = function (req, res, next) {
    if (req.body) {
        contingencyObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (contingencyData) {
                var contingencyArr = {
                    medical_provision: req.body.medical_provision,
                    method_of_evacuation: req.body.method_of_evacuation,
                    detail_nearest_hospital: req.body.detail_nearest_hospital,
                    medevac_company: req.body.medevac_company,
                    sat_phone_number: req.body.sat_phone_number,
                    tracker_id: req.body.tracker_id,
                    first_aid_kit: req.body.first_aid_kit,
                    personal_protective_equipment: req.body.personal_protective_equipment

                }
                contingencyObj.update({
                    _id: contingencyData._id,
                    is_deleted: false
                }, {
                    $set: contingencyArr
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'contingency for ra updated successfully'
                        });
                    }
                })
            } else {
                var contingencyData = new contingencyObj(req.body);
                contingencyData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'contingency for ra added successfully'
                        });
                    }
                })
            }
        })
    }

}


/* @function : getContingencyData
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To get news ra contingency form.
 */
exports.getContingencyData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        contingencyObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id,
            is_deleted: false
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'data': contingencyData,
                    'code': config.success,
                    'message': 'success'
                });
            }
        })
    }
}


/* @function : addAnyOtherInfo
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To add any other relevant with news ra.
 */
exports.addAnyOtherInfo = function (req, res, next) {
    if (req.body) {
        RaObj.update({
            _id: req.body.news_ra_id
        }, {
            $set: {
                relevant_info: req.body.relevant_info
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Information relevant to news ra updated successfully'
                });
            }
        })
    }

}

/* @function : getNewsRaDetails
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To get details of news ra.
 */
exports.getNewsRaDetails = function (req, res, next) {
    if (req.params.newsRa_id) {
        RaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false
        }, function (err, newsRa) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': newsRa,
                });
            }
        })
    }

}


/* @function : submitRAToManager
 *  @author  : MadhuriK 
 *  @created  : 27-Apr-17
 *  @modified :
 *  @purpose  : To submit rews ra to approving manager.
 */
exports.submitRAToManager = function (req, res, next) {
    var news_ra_id = req.params.newsRa_id;
    var types_of_ra_id = req.params.types_of_ra_id;
    var traveller_id = req.params.traveller_id;
    categoryObj.find({
        is_mandatory: true,
        is_deleted: false,
        status: 'Active',
        types_of_ra_id: types_of_ra_id
    }, {
        _id: 1
    }, function (err, categories) {
        var catArr = [];
        categories.forEach(function (cat) {
            catArr.push(cat._id);
        })
        newsRaAnsObj.find({
            news_ra_id: news_ra_id,
            traveller_id: traveller_id,
            is_deleted: false,
            category_id: {
                $in: catArr
            }
        }, function (err, quesArr) {
            if (quesArr.length == 0 && categories.length > 0) {
                next(createError(config.serverError, err));
            } else {
                createPdf(req, news_ra_id, function (newsRa, path1, approvingManager, fileData) {
                    // add code here
                    if (fileData) {
                        var smtpTransport = nodemailer.createTransport({
                            service: config.service,
                            auth: {
                                user: config.username,
                                pass: config.password
                            }
                        });
                        var mailOptions = {
                            to: approvingManager,
                            from: 'noreply.riskpal@gmail.com',
                            subject: 'News RA details',
                            html: 'Hello Approving Manager Please find the attachment, \n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                            attachments: [{
                                'filename': path1,
                                'content': fileData
                            }]
                        };
                        smtpTransport.sendMail(mailOptions, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                RaObj.update({
                                    _id: news_ra_id,
                                    traveller_id: traveller_id,
                                    is_deleted: false
                                }, {
                                    $set: {
                                        is_submitted: true
                                    }
                                }, function (err) {
                                    if (err) {
                                        res.json({
                                            'code': config.error,
                                            'message': 'Error in submition'
                                        });
                                    } else {

                                        res.json({
                                            'data': newsRa,
                                            'code': config.success,
                                            'message': 'successfully submited'
                                        });
                                    }
                                })
                            }
                        });
                    }
                    // add brackets 

                })
            }
        })
    })

}


/* @function : createPdf
 *  @author  : MadhuriK 
 *  @created  : 11-Jun-17
 *  @modified :
 *  @purpose  : To callback function for creating pdf.
 */
function createPdf(req, news_ra_id, callback) {
    var traveller_id = req.params.traveller_id;
    userObj.findOne({
        _id: traveller_id,
        is_deleted: false
    }, function (err, traveller) {
        if (traveller) {
            RaObj.findOne({
                    _id: news_ra_id,
                    traveller_id: traveller_id,
                    is_deleted: false
                }).populate('travellerTeamArr')
                .populate('approvingManager')
                .exec(
                    function (err, newsRa) {
                        if (newsRa) {
                            var countryArr = [];
                            var travellerTeamArr = [];
                            var approvingManager = [];
                            var departmentArr = [];
                            newsRa.country.forEach(function (countryName) {
                                countryArr.push(countryName.name);
                            })

                            newsRa.travellerTeamArr.forEach(function (team) {
                                travellerTeamArr.push(team.firstname);
                            })

                            newsRa.approvingManager.forEach(function (manager) {
                                approvingManager.push(manager.email);
                            })

                            newsRa.department.forEach(function (departmentName) {
                                departmentArr.push(departmentName.department);
                            })

                            newsRaAnsObj.find({
                                    news_ra_id: news_ra_id,
                                    traveller_id: traveller_id,
                                    is_deleted: false
                                })
                                .populate('category_id')
                                .exec(function (err, news_ra_ans) {
                                    var path = '../riskpal-client/pdf/form.html';
                                    jsrender.loadFile('#myTemplate', path, function (err, template) {

                                        if (!err) {
                                            var fields = {
                                                firstname: traveller.firstname,
                                                lastname: traveller.lastname,
                                                my_email: traveller.email,
                                                dob: traveller.dob ? traveller.dob.toISOString().substring(0, 10) : null,
                                                gender: traveller.gender ? traveller.gender : null,
                                                mobile_number: traveller.mobile_number ? traveller.mobile_number : null,
                                                nationality: traveller.nationality ? traveller.nationality : null,
                                                passport_number: traveller.passport_details ? traveller.passport_details.passport_number : null,
                                                full_name: traveller.passport_details ? traveller.passport_details.emergency_contact.full_name : null,
                                                mobile_number: traveller.passport_details ? traveller.passport_details.emergency_contact.mobile_number : null,
                                                email: traveller.passport_details ? traveller.passport_details.emergency_contact.email : null,
                                                relationship_to_you: traveller.passport_details ? traveller.passport_details.emergency_contact.relationship_to_you : null,
                                                alternative_full_name: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_full_name : null,
                                                alternative_mobile_number: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_mobile_number : null,
                                                alternative_email: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_email : null,
                                                alternative_relationship_to_you: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_relationship_to_you : null,
                                                notes_for_approving_manager: traveller.notes_for_approving_manager ? traveller.notes_for_approving_manager : null,
                                                project_name: newsRa.project_name ? newsRa.project_name : null,
                                                project_code: newsRa.project_code ? newsRa.project_code : null,
                                                department: departmentArr ? departmentArr.toString() : null,
                                                date_of_ra: newsRa.date_of_ra ? newsRa.date_of_ra.toISOString().substring(0, 10) : null,
                                                description_of_task: newsRa.description_of_task ? newsRa.description_of_task : null,
                                                country: countryArr ? countryArr.toString() : null,
                                                travellerTeamArr: travellerTeamArr ? travellerTeamArr.toString() : null
                                            }
                                        }
                                        var testfield = "";
                                        news_ra_ans.forEach(function (ans) {

                                            testfield += "<div style='left:254.47px;' class='cls_021'>" + "<b style='font-size=14px;'>Question</b> " + ans.question +

                                                "</div>" +
                                                "<div class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'>Best Practice </b>" + ans.best_practice_advice + "</div>" +
                                                "<div  class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'>Specific Mitigation </b>" + ans.specific_mitigation + "</div>" +
                                                // "<div class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'> Category </b>" + ans.category_id.categoryName + "</div>"
                                                +
                                                "<br><br><br><br>";

                                        })
                                        fields.testfield = testfield;
                                        var final_html = jsrender.render['#myTemplate'](fields);
                                        var path1 = '../riskpal-client/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                                        htmlToPdf.convertHTMLString(final_html, path1, function (err, success) {
                                            fs.readFile(path1, function (err, fileData) {
                                                if (fileData) {
                                                    callback(newsRa, path1, approvingManager, fileData);
                                                }
                                            })
                                        })

                                    })
                                })
                        }
                    })
        }

    })

}


/* @function : getDepartments
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get department list.
 */
exports.getDepartments = function (req, res, next) {
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id
        }, function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                if (basic_admin.client_admin_id) {
                    departmentObj.find({
                        client_admin_id: basic_admin.client_admin_id,
                        is_deleted: false,
                        status: "Active"
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
        })
    }
}



/* @function : getTypesOfRaDetails
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get types of ra details .
 */
exports.getTypesOfRaDetails = function (req, res, next) {
    if (req.params.type_of_ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.type_of_ra_id
        }, function (err, typeOfRaData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': typeOfRaData
                })
            }
        })
    }
}