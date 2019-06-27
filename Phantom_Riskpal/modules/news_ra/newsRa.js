var config = require('../../config/jwt_secret.js'); // config 
var countryObj = require('./../../schema/country.js'); // include country schema file
var countryRiskObj = require('./../../schema/country_risk.js');
var countryMatrixObj = require('./../../schema/country_matrix');
var userObj = require('./../../schema/users.js'); // include user schema file
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // include user schema file
var currencyObj = require('./../../schema/currency.js'); // include currency schema file
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var approvingManagerObj = require('./../../schema/approving_manager.js'); // include user schema file
var newsRaObj = require('./../../schema/news_ra.js'); // include news_ra schema file
var communicationObj = require('./../../schema/communication.js'); // include communication schema file
var contingencyObj = require('./../../schema/contingency.js'); // include contingency schema file
var categoryObj = require('./../../schema/category.js'); // include country schema file
var questionnaireObj = require('./../../schema/questionnaire.js'); // include country schema file
var newsRaAnsObj = require('./../../schema/news_ra_answer.js'); // include news_ra_answer schema file
var departmentObj = require('./../../schema/department.js'); // include department schema file
var raTimerSetting = require('./../../schema/raTimerSetting.js'); // include department schema file
var _ = require('underscore'); // include underscore
var async = require('async');
var mailer = require('../../config/mailer.js');
var constant = require('../../config/constants');
var jsrender = require('node-jsrender');
var htmlToPdf = require('html-to-pdf');
var phantom = require('phantom');
var fs = require('fs');
var nodemailer = require('nodemailer');
var moment = require("moment");
var smtpTransport = require('nodemailer-smtp-transport');
var CronJob = require('cron').CronJob;
var path = require('path');
var usergroupObj = require('./../../schema/roles.js'); // include roles schema 
var userTable = require('./../../schema/usertables.js'); //user table update 
var clientObj = require('./../../schema/clients.js');  //Clients schema 
var dateFormat = require('dateformat');
var emailHelper = require('./../../helper/email.helper');
var template = require('./../../helper/template');
var now = new Date();
var createError = require('http-errors');
var { deleteObject } = require('./../../helper/general.helper');
const exporter = require('highcharts-export-server');
var envConfig = require('../../config/config');
var rideComplete = new CronJob({
    cronTime: '0 22 * * *',
    onTick: function () {
        try {

        } catch (e) {
            newsRaObj.find({
                is_reject: true
            }).exec(function (err, data) {
                if (err) {
                    console.log("err", err);
                } else {
                    raTimerSetting.find({
                        isDelete: false
                    }).exec(function (err, raTimerdata) {
                        if (err) {
                            console.log("Daya Not Found", err);
                        } else {
                            async.each(data, function (result, callback) {
                                var oneDay = 24 * 60 * 60 * 1000;
                                var currentDate = new Date(moment().format());
                                var rejectDate = result.rejectDate;
                                var diffDays = Math.round(Math.abs((currentDate.getTime() - rejectDate.getTime()) / (oneDay)));
                                try {
                                    if (diffDays >= raTimerdata[0].reject_ra) {
                                        newsRaObj.update({
                                            _id: result._id
                                        }, {
                                                $set: {
                                                    is_deleted: true
                                                }
                                            }, {
                                                multi: true
                                            }, function (err, update) {
                                                console.log("in update")
                                                if (err) {
                                                    console.log("err", err);
                                                } else {
                                                    console.log("updated")
                                                }
                                            })
                                    }
                                } catch (e) {
                                    console.log('error in cron:', e);
                                }
    
                                callback(null);
                            }, function (err) {
    
                            });
                        }
                    });
    
                }
            });
        }
        
    },
    start: false,
    timeZone: ''
});

rideComplete.start();

var uncompleteRA = new CronJob({
    cronTime: '0 22 * * *',
    onTick: function () {
        try {
            newsRaObj.find({
                is_submitted: false
            }).exec(function (err, data) {
                if (err) {
                    console.log("err", err);
                } else {
                    raTimerSetting.find({
                        isDelete: false
                    }).exec(function (err, raTimerdata) {
                        if (err) {
                            console.log("data Not Found", err);
                        } else {
                            async.each(data, function (result, callback) {
                                var oneDay = 24 * 60 * 60 * 1000;
                                var currentDate = new Date(moment().format());
                                var rejectDate = result.createdAt;
                                var diffDays = Math.round(Math.abs((currentDate.getTime() - rejectDate.getTime()) / (oneDay)));
                                try {
                                    if (diffDays >= raTimerdata[0].uncomplete_ra) {
                                        newsRaObj.update({
                                            _id: result._id
                                        }, {
                                                $set: {
                                                    is_deleted: true
                                                }
                                            }, {
                                                multi: true
                                            }, function (err, update) {
                                                if (err) {
                                                    console.log("err", err);
                                                } else {
                                                    console.log("updated")
                                                }
                                            })
                                    }
                                } catch (e) {
                                    console.log('error uncomplete ra:', e);
                                }
                                callback(null);
                            }, function (err) {
    
                            })
                        }
                    })
    
                }
            })
        } catch(e) {
            
        }
    },
    start: false,
    timeZone: ''
});
uncompleteRA.start();

exports.setcron = function (req, res, next) {
    console.log("req.body", req.body)
    var rejectera = req.body.reject_ra ? req.body.reject_ra : 5;
    var uncompletera = req.body.uncomplete_ra ? req.body.uncomplete_ra : 5;
    var situation_log = new raTimerSetting(req.body);
    situation_log.uncomplete_ra = req.body.uncomplete_ra ? req.body.uncomplete_ra : 5;;
    situation_log.reject_ra = req.body.reject_ra ? req.body.reject_ra : 5;
    situation_log.save(function (err, result) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'time updated successfully'
            });
        }
    })
}

exports.updateCron = function (req, res, next) {
    console.log("req.body>>>>>>>>>>>>>>>", req.body)
    var rejectera = req.body.reject_ra ? req.body.reject_ra : 5;
    var uncompletera = req.body.uncomplete_ra ? req.body.uncomplete_ra : 5;
    raTimerSetting.update({
        _id: req.body._id
    }, {
            $set: {
                uncomplete_ra: uncompletera,
                reject_ra: rejectera
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));

            } else {
                res.json({
                    'code': config.success,
                    'message': 'time updated successfully'
                });
            }
        })
}

exports.getTimerSetting = function (req, res, next) {
    raTimerSetting.find({}, function (err, timer) {
        if (err) {
            next(createError(config.serverError, err));

        } else {
            res.json({
                'code': config.success,
                'data': timer,
            });
        }
    })
}

/* @function : getCountries
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To get countries.
 */
exports.getCountries = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));

        } else {
            res.json({
                'code': config.success,
                'data': country,
            });
        }
    })
}

/* @function : getAllTravellers
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To get all travellers.
 */
// userObj.find({ client_admin_id: traveller.client_admin_id, admin: false, is_deleted: false, status: "Active", _id: { $ne: req.traveller.id } }, function (err, travellers) {
exports.getAllTravellers = function (req, res, next) {
    if (req.traveller.id) {
        userObj.findOne({
            _id: req.traveller.id
        }).populate('client_admin_id').exec(function (err, traveller) {
            if (traveller) {
                userObj.find({
                    companyId: traveller.client_admin_id.companyId,
                    admin: false,
                    is_deleted: false,
                    status: "Active"
                }, function (err, travellers) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': travellers,
                        });
                    }
                })
            }
        })
    }
}


/* @function : getAllApprovingManger
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To get all approving managers.
 */
exports.getAllApprovingManger = function (req, res, next) {
    if (req.traveller.id) {
        userObj.findOne({
            _id: req.traveller.id
        }).populate('client_admin_id').exec(function (err, traveller) {
            if (traveller) {
                approvingManagerObj.find({
                    is_deleted: false,
                    status: "Active",
                    // client_admin_id: traveller.client_admin_id
                    companyId: traveller.client_admin_id.companyId
                }, function (err, approving_managers) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approving_managers,
                        });
                    }
                })
            }
        })
    }
}


/* @function : getDeptRelatedUsers
 *  @author  : Siroi 
 *  @created  : 23-May-18
 *  @modified :
 *  @purpose  : To get users based on department.
 */
exports.getDeptRelatedUsers = function (req, res, next) {
    if (req.user) {
        // this traveller id is the author id which is coming from front end
        var traveller_id;
        if(req.body.traveller_id != ''){
            traveller_id = req.body.traveller_id;
        } else {
            traveller_id = req.user.id;
        }
        userTable.findOne({
            _id: traveller_id
        }).exec(function (err, traveller) {
            if (traveller) {
                userTable.find({
                    // _id: { $nin: traveller._id },
                    is_deleted: false,
                    // status: "Active",
                    department: { $in: traveller.department }
                    // client_admin_id: traveller.client_admin_id
                    // companyId: traveller.client_admin_id.companyId
                }, function (err, approving_managers) {
                    //   console.log("Dept"+approving_managers)
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approving_managers,
                        });
                    }
                })
            }
        })
    }
}

/* @function : getDeptRelatedUsers
 *  @author  : Siroi 
 *  @created  : 23-May-18
 *  @modified :
 *  @purpose  : To get users based on department.
 */
exports.getOthertraveller = function (req, res, next) {
    if (req.traveller.id) {
        userTable.findOne({
            _id: req.traveller.id
        }).exec(function (err, traveller) {
            if (traveller) {
                userTable.find({
                    _id: { $nin: [traveller._id, req.params.traveller_id] },

                    is_deleted: false,
                    // status: "Active",
                    department: { $in: traveller.department }
                    // client_admin_id: traveller.client_admin_id
                    // companyId: traveller.client_admin_id.companyId
                }, function (err, approving_managers) {
                    //   console.log("Dept"+approving_managers)
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approving_managers,
                        });
                    }
                })
            }
        })
    }
}

/* @function : getDeptRelatedUsersAprovingmanger
 *  @author  : Siroi 
 *  @created  : 23-May-18
 *  @modified :
 *  @purpose  : To get users based on department and department final approving managesrs.
 */
exports.getDeptRelatedUsersAprovingmanger = function (req, res, next) {
    var types_of_ra_id = req.params.types_of_ra_id;
    console.log(types_of_ra_id)
    if (req.user.id) {
        typeOfRaObj.findOne({
            _id: types_of_ra_id,
            is_deleted: false,

        }).
            populate('client_department')
            .exec(function (err, traveller) {

                if (err) {
                    next(createError(config.serverError, err));
                }
                if (traveller) {
                    userTable.find({
                        // _id:{$nin:traveller._id},
                        is_deleted: false,
                        status: "Active",
                        department: { $in: traveller.client_department },
                        // $or: [{ _id: { $nin: traveller._id } },

                        // ],

                        // client_admin_id: traveller.client_admin_id
                        // companyId: traveller.client_admin_id.companyId
                    }, function (err, approving_managers) {
                        userTable.findOne({
                            is_deleted: false,
                            status: "Active",
                            _id: req.user.id
                        }).select('-password -authyID -hashcode').populate('department')
                            .exec(function (err, travellerDepartment) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    res.json({
                                        'code': config.success,
                                        'data': approving_managers,
                                        'traveller': traveller,
                                        'travellerDepartment': travellerDepartment
                                    });
                                }
                            });
                        //  console.log("Dept"+approving_managers)

                    })
                } else {
                    next(createError(config.serverError, err));
                }
            })
    }
}



/* @function : addNewsRa
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To add news ra of a traveller.
 */
exports.addNewsRa = function (req, res, next) {
    if (req.body && req.user.id) {
        if (req.body.authorcheck == false) {
            req.body.author_id = req.user.id;
            req.body.authorcheck = "1";
            var primarytraveller = req.body.primarytraveller;
        } else {
            // if user travelling by himself
            req.body.authorcheck = "0";
            primarytraveller = req.user.id;
        }
        userTable.findOne({
            _id: primarytraveller,
            is_deleted: false
        }).populate('client_id').exec(function (err, traveller) {
            req.body.traveller_id = primarytraveller;
            var newsRa = new newsRaObj(req.body);
            newsRa.client_id = traveller.client_id;
            // newsRa.companyId = traveller.client_admin_id.companyId;
            newsRa.save(function (err, data) {
                console.log("dsdsds" + data)
                if (err) {
                    next(createError(config.serverError, err));
                } else {

                    var countryArr = [];
                    data.country.forEach(function (country) {
                        countryArr.push(country.name);
                    })
                    userTable.find({
                        _id: {
                            $in: data.travellerTeamArr
                        },
                        super_admin: false
                    }, function (err, travellerArr) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            var Medical_request_by_approving_manager = [{
                                "status": 1
                            }]
                            async.each(travellerArr, function (que, callback) {
                                userTable.update({
                                    _id: {
                                        $in: data.travellerTeamArr
                                    },
                                    super_admin: false
                                }, {
                                        $set: {
                                            Medical_request_by_approving_manager: Medical_request_by_approving_manager
                                        }
                                    }, {
                                        multi: true
                                    },
                                    function (err, success) {
                                        callback();
                                    })
                                console.log("miaill" + que.email)
                                // var smtpTransport = nodemailer.createTransport({
                                //     service: config.service,
                                //     auth: {
                                //         user: config.username,
                                //         pass: config.password
                                //     }
                                // });
                                // var mailOptions = {
                                //     from: config.username,
                                //     to: que.email,
                                //     subject: 'Risk Assessment sent for approval ',
                                //     html: 'Dear traveller' + '<br>' + 'A risk assessment for' + '<br>' + data.project_name + '<br>' + 'has been submitted for approval. <br> <br> If this does not concern you, contact your security department or system administrator.',
                                // };
                                // smtpTransport.sendMail(mailOptions, function (err, result) {
                                //     if (err) {
                                //         res.json({
                                //             'code': config.error,
                                //             'err': err,
                                //             'message': 'email failed'
                                //         });
                                //     } else {
                                //         res.json({
                                //             'code': config.success,
                                //             'message': "News RA details added successfully",
                                //         });
                                //     }
                                // });

                            }, function (err) {
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

/* @function : getAllNewsRa
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To get all news ra's for a particular traveller.
 */
exports.getAllNewsRa = function (req, res, next) {


    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : { createAt: "desc" };
    var keyword = req.body.keyword ? req.body.keyword : '';
    var travellerids = [];
    travellerids.push(req.user.id)
    var query = {
        '$and': []
    };
    query['$and'].push({
        is_deleted: false,
        // traveller_id: req.traveller.id,
        $or: [
            { traveller_id: req.user.id },
            { travellerTeamArr: { $in: travellerids } },
            { author_id: { $in: travellerids } }

        ],
        // types_of_ra_id: req.body.types_of_ra_id
    })
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    if (keyword) {
        var keywordArray = keyword.split(' ')
        let regex = keywordArray.map(function (e) {
            return new RegExp(e, "i");
        });
        query['$and'].push({
            $or: [{
                country_name: {
                    "$in": regex
                }
            }, {
                project_code: {
                    "$in": regex
                }
            }, {
                project_name: {
                    "$in": regex
                }
            }]
        });
    }
    typeOfRaObj.findOne({
        // _id: req.body.types_of_ra_id,
        is_deleted: false
    }, function (err, raName) {
        newsRaObj.find(query)
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            .populate('situation_report')
            .populate('types_of_ra_id')
            .populate('traveller_id')
            .populate('incident_report')
            .populate('situationlog_report')
            .populate('department')
            .populate('approvingManager')
            .populate('author_id')
            .populate('country')
            .exec(function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    newsRaObj.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count,
                            'typeOfRa': raName
                        });
                    })
                }
            });
    });
}


/* @function : getCategories
 *  @author  : MadhuriK 
 *  @created  : 21-Apr-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getCategories = function (req, res, next) {
    if (req.params.types_of_ra_id) {
        categoryObj.find({
            is_deleted: false,
            status: 'Active',
            types_of_ra_id: req.params.types_of_ra_id
        }, function (err, categories) {
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
}



/* @function : getNewsRaDetails
 *  @author  : MadhuriK 
 *  @created  : 21-Apr-17
 *  @modified :
 *  @purpose  : To get details of news ra.
 */
exports.getNewsRaDetails = function (req, res, next) {
    if (req.params.newsRa_id) {

        var query = {
            _id: req.params.newsRa_id,
            is_deleted: false
        }

        newsRaObj.findOne(query)

            .populate('types_of_ra_id')
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': newsRa,
                    });
                }
            });



    }

}


/* @function : updateNewsRa
 *  @author  : MadhuriK 
 *  @created  : 21-Apr-17
 *  @modified :
 *  @purpose  : To update news ra.
 */
exports.updateNewsRa = function (req, res, next) {
    if (req.body.authorcheck == false) {
        req.body.author_id = req.user.id;
        req.body.authorcheck = "1";
        var primarytraveller = req.body.primarytraveller;
    } else {
        // if user travelling by himself
        req.body.authorcheck = "0";
        primarytraveller = req.user.id;
    }
    userTable.findOne({
        _id: primarytraveller,
        is_deleted: false
    }, function (err, traveller) {
        var newsRa_id = req.body._id;
        var newsRa = {
            project_name: req.body.project_name,
            department: req.body.department,
            startdate: req.body.startdate,
            traveller_id: primarytraveller,
            enddate: req.body.enddate,
            itineary_description: req.body.itineary_description,
            description_of_task: req.body.description_of_task,
            approvingManager: req.body.approvingManager,
            country: req.body.country,
            travellerTeamArr: req.body.travellerTeamArr,
            authorcheck:req.body.authorcheck,
            
        }
        if (req.body.authorcheck == false) {
            newsRa.author_id = req.user.author_id;
        }
        newsRaObj.findOneAndUpdate({
            _id: newsRa_id,
            is_deleted: false
        }, {
                $set: newsRa
            }, { new: true }, function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    var departArr = [],
                        countryArr = [];
                    data.department.forEach(function (depart) {
                        departArr.push(depart.department_name);
                    })

                    data.country.forEach(function (country) {
                        countryArr.push(country.name);
                    })
                    userTable.find({
                        _id: {
                            $in: data.travellerTeamArr
                        },
                        super_admin: false
                    }, {
                            email: 1
                        }, function (err, travellerArr) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                var Medical_request_by_approving_manager = [{
                                    "status": 1
                                }]
                                async.each(travellerArr, function (que, callback) {
                                    userTable.update({
                                        _id: {
                                            $in: data.travellerTeamArr
                                        },
                                        admin: false
                                    }, {
                                            $set: {
                                                Medical_request_by_approving_manager: Medical_request_by_approving_manager
                                            }
                                        }, {
                                            multi: true
                                        },
                                        function (err, success) {
                                            callback();
                                        })
                                }, function (err) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': "news ra updated successfully",
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

/* @function : getCategoryQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 21-Apr-17
 *  @modified :
 *  @purpose  : To get questionnaire of a category.
 */
exports.getCategoryQuestionnaire = function (req, res, next) {
    if (req.params.category_id) {
        categoryObj.findOne({
            _id: req.params.category_id,
            is_deleted: false,
            status: 'Active'
        }, function (err, category) {
            questionnaireObj.find({
                category_id: req.params.category_id,
                is_deleted: false,
                status: 'Active'
            })
                .sort({
                    order: 1
                })
                .exec(function (err, questionnaire) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': questionnaire,
                            'category': category
                        });
                    }
                })
        })
    }
}


/* @function : addQuestionnaireRa
 *  @author  : MadhuriK 
 *  @created  : 26-Apr-17
 *  @modified :
 *  @purpose  : To add specific mitigation by traveller at questionnaire of a particular category.
 */
exports.addQuestionnaireRa = function (req, res, next) {
    var news_ra_id = req.body[0].news_ra_id;
    var category_id = req.body[0].category_id;
    delete req.body[0].news_ra_id;
    delete req.body[0].category_id;
    var quesArr = [];

    req.body.forEach(function (que) {
        quesArr.push({
            traveller_id: req.traveller.id,
            news_ra_id: news_ra_id,
            questionnaire_id: que.questionnaire_id ? que.questionnaire_id : que._id,
            question: que.question,
            best_practice_advice: que.best_practice_advice,
            category_id: category_id,
            ticked: que.ticked ? que.ticked : false,
            specific_mitigation: que.specific_mitigation ? que.specific_mitigation : ""
        });
    })
    console.log("1111111111111111111111111111111111111111111111111111");

    newsRaAnsObj.find({
        news_ra_id: news_ra_id,
        category_id: category_id,
        is_deleted: false,
        traveller_id: req.traveller.id
    }, function (err, newsRaAns) {
        if (err) {
            next(createError(config.serverError, err));

        } else if (newsRaAns.length > 0) {
            async.each(quesArr, function (que, callback) {
                var news_ra_ans = new newsRaAnsObj(que);
                newsRaAnsObj.update({
                    news_ra_id: news_ra_id,
                    category_id: category_id,
                    is_deleted: false,
                    traveller_id: req.traveller.id,
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
                    console.log("1111111111111111111111111111111111111111111111111111");
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


/* @function : getNewsRa
 *  @author  : MadhuriK 
 *  @created  : 26-Apr-17
 *  @modified :
 *  @purpose  : To get news ra details.
 */
exports.getNewsRa = function (req, res, next) {
    if (req.params.newsRa_id && req.params.category_id) {
        newsRaAnsObj.find({
            news_ra_id: req.params.newsRa_id,
            category_id: req.params.category_id,
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

/* @function : Generete PDF from manager side while approve and forward 
 *  @author  : Siroi 
 *  @created  : 10-Aug-18
 *  @modified :
 *  @purpose  : Generete PDF
 */
exports.generatePDF = function (req, res, next) {
    var news_ra_id = req.body._id;
    var country_des = req.body.country_des;
    var security = req.body.security;

    var graph = req.body.graph;
    var st_date = req.body.st_date;
    var ed_date = req.body.ed_date;
    // do something

    newsRaObj.findOne({
        _id: news_ra_id,
        is_deleted: false,

    }, function (err, newsradetails) {
        getCountryMatrix(newsradetails, function (err, countryMatrixData) {

            createPdf(req, news_ra_id, countryMatrixData, graph, req.body.approve, function (err, newsRa, path1, approvingManager, fileData) {


                res.json({
                    'code': config.success,
                    'data': newsRa,
                    'message': 'success',
                });



            })
        });
    });





}


/* @function : submitRAToManager
 *  @author  : MadhuriK 
 *  @created  : 27-Apr-17
 *  @modified :
 *  @purpose  : To submit rews ra to approving manager.
 */
exports.submitRAToManager = function (req, res, next) {
    var news_ra_id = req.body.news_ra_id;
    var types_of_ra_id = req.body.types_of_ra_id;
    var country_des = req.body.country_des;
    var security = req.body.security;

    var graph = req.body.graph;
    var st_date = req.body.st_date;
    var ed_date = req.body.ed_date;

    // console.log(graph);
    categoryObj.find({
        is_mandatory: true,
        is_deleted: false,
        status: 'Active',
        types_of_ra_id: types_of_ra_id
    }, {
            _id: 1
        }, function (err, categories) {
            if (err) {
                next(createError(config.serverError, err));
            }
            var catArr = [];
            categories.forEach(function (cat) {
                catArr.push(cat._id);
            })


            newsRaObj.findOne({
                _id: news_ra_id,
                is_deleted: false,

            }, function (err, newsradetails) {
                newsRaAnsObj.find({
                    news_ra_id: news_ra_id,
                    traveller_id: newsradetails.traveller_id,
                    is_deleted: false,
                    category_id: {
                        $in: catArr
                    }
                }, function (err, quesArr) {

                    if (err) {
                        next(createError(config.serverError, err));
                    }
                    if (quesArr.length == 0 && categories.length > 0) {
                        res.json({
                            'error': 'Please fill all the questionnaires of mandatory categories',
                            'code': config.error,
                            'message': 'Please fill all the questionnaires of mandatory categories'
                        });
                    } else {
                        getCountryMatrix(newsradetails, function (err, countryMatrixData) {
                            createPdf(req, news_ra_id, countryMatrixData, graph, false, function (newsRa, path1, approvingManager, fileData) {

                                var fName = path1.split("pdf/");
                                var filePath = path.join(__dirname, '../../', "clientPortal/pdf/" + fName[1]);
                                console.log('****** PDF Creation startted ******');
                                if (fileData) {
                                    var attachments = [{
                                        filename: fName[1],
                                        path: filePath,
                                        contentType: 'application/pdf'
                                    }];
                                    var baseUrl = envConfig.host;
                                    newsRaObj.findOne({
                                        _id: news_ra_id,
                                        is_deleted: false
                                    }).populate('approvingManager')
                                        .populate('travellerTeamArr')
                                        .populate('traveller_id')
                                        .populate('types_of_ra_id')
                                        .populate('author_id')
                                        .exec(async function (err, newsradetails) {
                                            console.log(newsradetails);
                                            var approvingManagerTemplate = config.emailTemplate.approvingManager;
                                            if (newsradetails.is_submitted == true) {
                                                approvingManagerTemplate = config.emailTemplate.approvingManagerResubmitted;
                                            }

                                            if (newsradetails.authorcheck == 1 && newsradetails.author_id._id == req.user.id) {


                                                var submitted_person = newsradetails.author_id.firstname + ' ' + newsradetails.author_id.lastname;;

                                            } else {

                                                submitted_person = newsradetails.traveller_id.firstname + ' ' + newsradetails.traveller_id.lastname;
                                            }

                                            var baseUrl = envConfig.host;
                                            var url = baseUrl + config.emailRALinkPending;
                                            // send to approving manager
                                            var repalceData = {userName: newsradetails.approvingManager[0].firstname, 
                                                urlText: config.emailTemplate.urlText, url: url,
                                                raName: newsradetails.project_name,
                                                travelerName: submitted_person
                                            };
                                            try {
                                                const body  = await template.getBodyData(approvingManagerTemplate, repalceData);
                                                const email = await emailHelper.sendEmailNodeMailer(approvingManager, body.subject, body.html, attachments); // to approving manager
                                                if (email) {
                                                    if (newsradetails.is_submitted == false) {

                                                        if (newsradetails.authorcheck == 1 ) {
                                                            //send email to user (author) en16
                                                           
                                                            var repalceData = {
                                                                userName: newsradetails.author_id.firstname, 
                                                                url: baseUrl,
                                                                raName: newsradetails.project_name,
                                                                approvingManagerName: newsradetails.approvingManager[0].firstname
                                                            };
                                                            const body1  = await template.getBodyData(config.emailTemplate.traveller, repalceData);
                                                            const email1 = await emailHelper.sendEmailNodeMailer( newsradetails.author_id.email, body1.subject, body1.html); 
                                                            console.log('testing email', newsradetails.author_id.email);
                                                            if (!email1) {
                                                                res.json({
                                                                    'code': config.error,
                                                                    'err': err,
                                                                    'message': 'email failed1'
                                                                });
                                                            }
                                                           
                                                            //send email to traveller for on behalf en15
                                                           
                                                            var repalceData = {
                                                                userName: newsradetails.traveller_id.firstname, 
                                                                authorName: newsradetails.author_id.firstname,
                                                                raName: newsradetails.project_name,
                                                                approvingManagerName: newsradetails.approvingManager[0].firstname
                                                            };
                                                      
                                                            const body2  = await template.getBodyData(config.emailTemplate.behalfOfOtherTraveller, repalceData);
                                                            const email2 = await emailHelper.sendEmailNodeMailer( newsradetails.traveller_id.email, body2.subject, body2.html, attachments); // to primary traveller
                                                            
                                                            if (!email2) {
                                                                    res.json({
                                                                        'code': config.error,
                                                                        'err': err,
                                                                        'message': 'email failed2'
                                                                    });
                                                                } else {
                                                                    // res.json({
                                                                    //     'code': config.success,
                                                                    //     'message': "News RA details added successfully",
                                                                    // });
                                                                }
                                                         



                                                        } else {
                                                            //send email to user (traveller - en4)
                                                            
                                                            var repalceData = {
                                                                userName: newsradetails.traveller_id.firstname, 
                                                                url: baseUrl,
                                                                raName: newsradetails.project_name,
                                                                approvingManagerName: newsradetails.approvingManager[0].firstname
                                                            };
                                                      
                                                            const body1  = await template.getBodyData(config.emailTemplate.traveller, repalceData);
                                                            const email1 = await emailHelper.sendEmailNodeMailer( 
                                                                newsradetails.traveller_id.email, body1.subject, body1.html); 
                                                            
                                                            if (!email1) {
                                                                    res.json({
                                                                        'code': config.error,
                                                                        'err': err,
                                                                        'message': 'email failed3'
                                                                    });
                                                                } else {
                                                                    // res.json({
                                                                    //     'code': config.success,
                                                                    //     'message': "News RA details added successfully",
                                                                    // });
                                                                }
                                                        
                                                        }

                                                    } else {

                                                        if (newsradetails.authorcheck == 1 ) {
                                                            //send email to user (author en16)
                                                            
                                                            var repalceData = {
                                                                userName: newsradetails.author_id.firstname, 
                                                                raName: newsradetails.project_name,
                                                                approvingManagerName: newsradetails.approvingManager[0].firstname,
                                                                authorName: submitted_person
                                                            };
                                                      
                                                            const body1  = await template.getBodyData(config.emailTemplate.travellerResubmitted, repalceData);
                                                            const email1 = await emailHelper.sendEmailNodeMailer( 
                                                                newsradetails.author_id.email, body1.subject, body1.html); 
                                                            console.log('ffffffafafafa', newsradetails.author_id.email)
                                                            if (!email1) {
                                                                    res.json({
                                                                        'code': config.error,
                                                                        'err': err,
                                                                        'message': 'email failed4'
                                                                    });
                                                                }
                                                        

                                                        }
                                                        //send email to user

                                                        var repalceData = {
                                                            userName: newsradetails.traveller_id.firstname, 
                                                            raName: newsradetails.project_name,
                                                            approvingManagerName: newsradetails.approvingManager[0].firstname
                                                        };
                                                  
                                                        const body1  = await template.getBodyData(config.emailTemplate.travellerResubmitted, repalceData);
                                                        const email1 = await emailHelper.sendEmailNodeMailer( 
                                                            newsradetails.traveller_id.email, body1.subject, body1.html); 
                                                            console.log('traveller_idtraveller_id', newsradetails.traveller_id.email)
                                                        if (!email1) {
                                                                res.json({
                                                                    'code': config.error,
                                                                    'err': err,
                                                                    'message': 'email failed5'
                                                                });
                                                            } else {
                                                                // res.json({
                                                                //     'code': config.success,
                                                                //     'message': "News RA details added successfully",
                                                                // });
                                                            }

                                                    }



                                                    newsRaObj.update({
                                                        _id: news_ra_id,
                                                        traveller_id: newsradetails.traveller_id,
                                                        is_deleted: false
                                                    }, {
                                                            $set: {
                                                                is_submitted: true,
                                                                is_more_info: false
                                                            }
                                                        }, function (err) {
                                                            if (err) {
                                                                next(createError(config.serverError, err));
                                                            } else {

                                                                newsRaObj.find({
                                                                    _id: news_ra_id,
                                                                    is_deleted: false,

                                                                }).populate('traveller_id').exec(function (err, data) {

                                                                    userTable.find({
                                                                        _id: {
                                                                            $in: data[0].travellerTeamArr
                                                                        },
                                                                        super_admin: false
                                                                    },  function (err, travellerArr) {
                                                                        if (err) {
                                                                            next(createError(config.serverError, err));
                                                                        } else {
                                                                            var Medical_request_by_approving_manager = [{
                                                                                "status": 1
                                                                            }]
                                                                            async.each(travellerArr, async function (que, callback) {
                                                                                // additional approving manager
                                                                                userTable.update({
                                                                                    _id: {
                                                                                        $in: data[0].travellerTeamArr
                                                                                    },
                                                                                    super_admin: false
                                                                                }, {
                                                                                        $set: {
                                                                                            Medical_request_by_approving_manager: Medical_request_by_approving_manager
                                                                                        }
                                                                                    }, {
                                                                                        multi: true
                                                                                    },
                                                                                    function (err, success) {
                                                                                        callback();
                                                                                    })

                                                                                if ( newsradetails.authorcheck == 1 ) {
                                                                                    //send email to traveller for on behalf en17 ( not a primary traveller)
                                                                                    
                                                                                    var repalceData = {
                                                                                        userName: que.firstname + ' ' + que.lastname, 
                                                                                        authorName: newsradetails.author_id.firstname,
                                                                                        raName: data[0].project_name,
                                                                                        approvingManagerName: newsradetails.approvingManager[0].firstname
                                                                                    };
                                                                                    const body2  = await template.getBodyData(config.emailTemplate.behalfOfOtherTravellerAuthorCheck1, repalceData);
                                                                                    const email2 = await emailHelper.sendEmailNodeMailer( que.email, body2.subject, body2.html, attachments); // to primary traveller
                                                                                    console.log("email3333332", email2); // new commit
                                                                                    if (!email2) {
                                                                                            res.json({
                                                                                                'code': config.error,
                                                                                                'err': 'err',
                                                                                                'message': 'email failed6'
                                                                                            });
                                                                                        } else {
                                                                                            // res.json({
                                                                                            //     'code': config.success,
                                                                                            //     'message': "News RA details added successfully",
                                                                                            // });
                                                                                            return;
                                                                                            // callback();
                                                                                        }
                                                                                

                                                                                } else {

                                                                                    //send email to other traveller of their inclusion
                                                                                    var repalceData = {
                                                                                        userName: que.firstname, 
                                                                                        authorName: data[0].traveller_id.firstname,
                                                                                        raName: data[0].project_name,
                                                                                        approvingManagerName: newsradetails.approvingManager[0].firstname
                                                                                    };
                                                                                    console.log("que.emai11l", que.email);
                                                                                    try {
                                                                                        const body2  = await template.getBodyData(config.emailTemplate.otherTraveller, repalceData);
                                                                                        console.log('body2', body2);
                                                                                        const email2 = await emailHelper.sendEmailNodeMailer( que.email, body2.subject, body2.html, attachments); // to primary traveller
                                                                                        console.log("email3333332", email2);
                                                                                        if (!email2) {
                                                                                            res.json({
                                                                                                'code': config.error,
                                                                                                'err': err,
                                                                                                'message': 'email failed7'
                                                                                            });
                                                                                        } else {
                                                                                            res.json({
                                                                                                'code': config.success,
                                                                                                'message': "News RA details added successfully",
                                                                                            });
                                                                                            return;
                                                                                        }
                                                                                    } catch (e) {

                                                                                    }
                                                                                    
                                                                                
                                                                                
                                                                            }

                                                                        }, function (err) {
                                                                            if (err) {
                                                                                next(createError(config.serverError, err));
                                                                            } else {

                                                                                res.json({
                                                                                    'data': newsRa,
                                                                                    'code': config.success,
                                                                                    'message': 'News RA details added successfully.'
                                                                                });

                                                                            }
                                                                        });
                                                                        }
                                                                    })

                                                                })

                                                            }
                                                        })

                                                }
                                            } catch (err) {
                                                console.log("errors :", err)
                                                next(createError(config.serverError, err));
                                            }
                                        });
                                }
                            })

                        });

                    }
                })
            })
        });
}

function getCountryMatrix(country, cb) {
    countryMatrixObj.find({
        country_id: { $in: country.country }
    }).populate("country_id").exec(function (err, countryMatrix) {
        if (err) {
            cb(err, []);
        }
        cb(null, countryMatrix);
    });
}
/* @function : getNewsRaStatus
 *  @author  : MadhuriK 
 *  @created  : 04-May-17
 *  @modified :
 *  @purpose  : To check news ra submit status.
 */
exports.getNewsRaStatus = function (req, res, next) {
    if (req.params.newsRa_id) {
        newsRaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false,
            traveller_id: req.traveller.id
        }, function (err, newsRa) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'data': newsRa,
                    'code': config.success,
                    'message': 'success'
                });
            }
        })
    }
}


/* @function : deleteNewsRa
 *  @author  : MadhuriK 
 *  @created  : 15-May-17
 *  @modified :
 *  @purpose  : To delete news ra.
 */
exports.deleteNewsRa = function (req, res, next) {
    if (req.params.newsRa_id) {
        newsRaObj.update({
            _id: req.params.newsRa_id,
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
                        'message': 'News ra deleted successfully'
                    });
                }
            })
    }
}


/* @function : copyNewsRa
 *  @author  : MadhuriK 
 *  @created  : 06-May-17
 *  @modified :
 *  @purpose  : To copy news ra.
 */
exports.copyNewsRa = function (req, res, next) {
    if (req.body && req.traveller.id) {
        userObj.findOne({
            _id: req.traveller.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, traveller) {
            var newsRa = {
                project_name: req.body.project_name,
                project_code: req.body.project_code,
                department: req.body.department,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                itineary_description: req.body.itineary_description,
                description_of_task: req.body.description_of_task,
                approvingManager: req.body.approvingManager,
                country: req.body.country,
                travellerTeamArr: req.body.travellerTeamArr,
                traveller_id: req.traveller.id,
                types_of_ra_id: req.body.types_of_ra_id,
                country_name: req.body.country_name,
                client_admin_id: traveller.client_admin_id,
                companyId: traveller.client_admin_id.companyId
            }

            var news_ra = new newsRaObj(newsRa);
            news_ra.save(function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Copy of news ra done successfully'
                    });
                }

            })

        })

    }

}

/* @function : addNewsRaCommunication
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add news ra communication form.
 */
exports.addNewsRaCommunication = function (req, res, next) {
    if (req.body) {
        req.body.client_id = req.user.client_id;
        newsRaObj.findOne({
            _id: req.body[0].news_ra_id,
            is_deleted: false,
        }, function (err, newsradetails) {
            communicationObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.body[0].news_ra_id,
                is_deleted: false,
                types_of_ra_id: req.body.types_of_ra_id
            }, function (err, communicationData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    // req.body[0].traveller_id=req.traveller.id;
                    // req.body[1].traveller_id=req.traveller.id;
                    req.body.forEach(function (raCommunication) {
                        raCommunication.traveller_id = newsradetails.traveller_id;
                        if (raCommunication._id) {
                            delete (raCommunication._id);
                            delete (raCommunication.updatedAt);
                            delete (raCommunication.createdAt);
                        }

                    })
                    communicationObj.create(req.body, function (err) {
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
        })
    }
}


/* @function : updateNewsRaCommunication
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add news ra communication form.
 */
exports.updateNewsRaCommunication = function (req, res, next) {
    if (req.body) {
        req.body.client_id = req.user.client_id;
        newsRaObj.findOne({
            _id: req.body.news_ra_id,
            is_deleted: false,
        }, function (err, newsradetails) {
            communicationObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.body.news_ra_id,
                is_deleted: false,
                types_of_ra_id: req.body.types_of_ra_id
            }, function (err, communicationData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (communicationData) {
                    var communicationArr = {
                        call_intime: req.body.call_intime,
                        no_of_checkin: req.body.no_of_checkin,
                        timezone: req.body.timezone,
                        point_of_contact: req.body.point_of_contact,
                        number: req.body.number,
                        email: req.body.email,
                        emergency_contact: req.body.emergency_contact,
                        details_of_team: req.body.details_of_team,
                        want_your_poc: req.body.want_your_poc,
                        reminder_before_checkIn: req.body.reminder_before_checkIn,
                        detail_an_overdue_procedure: req.body.detail_an_overdue_procedure,
                        incompleteform: req.body.incompleteform
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
                }
            })
        })
    }
}


/* @function : updateNewsRaCommunication from approving managers 
 *  @author  : Siroi 
 *  @created  : 20-Jun-18s
 *  @modified :
 *  @purpose  : To update news ra communication form.
 */
exports.updateNewsRaCommunicationApprovingManager = function (req, res, next) {
    if (req.body) {
        var newquery = {
            _id: req.body._id,
            is_deleted: false,
        }
        communicationObj.findOne(newquery)
            .populate('news_ra_id')
            .exec(function (err, communicationData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (communicationData) {


                    var newquery = {
                        _id: communicationData.news_ra_id.traveller_id,
                        is_deleted: false
                    }
                    userTable.findOne(newquery)
                        .exec(function (err, travellerData) {

                            var detail_an_overdue_procedure = "";

                            if (communicationData.detail_an_overdue_procedure != req.body.detail_an_overdue_procedure) {
                                detail_an_overdue_procedure += "Overdue Procedure:" + communicationData.detail_an_overdue_procedure + "  ===>" + req.body.detail_an_overdue_procedure + "<br>";
                            }

                            if (communicationData.incompleteform != req.body.incompleteform) {
                                detail_an_overdue_procedure += "Incomplte Form :" + communicationData.incompleteform + "  ===>" + req.body.incompleteform + "<br>";
                            }

                            //Customer asked to dont send email so if condition changed
                            if (detail_an_overdue_procedure == "change") {

                                var smtpTransport = nodemailer.createTransport({
                                    service: config.service,
                                    auth: {
                                        user: config.username,
                                        pass: config.password
                                    }
                                });
                                var mailOptions = {
                                    from: config.username,
                                    to: travellerData.email,
                                    subject: 'Approving Manager Updated Communication details in RA',
                                    html: 'Hello ' + travellerData.firstname + '<br><br> \n\
        \n\ Your Approving manager has updated following details under Communication,  \n\
        <br> ' + detail_an_overdue_procedure + '<br>\n\
       </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                };

                                smtpTransport.sendMail(mailOptions, function (err, result) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }

                            var communicationArr = {
                                call_intime: req.body.call_intime,
                                no_of_checkin: req.body.no_of_checkin,
                                timezone: req.body.timezone,
                                point_of_contact: req.body.point_of_contact,
                                number: req.body.number,
                                email: req.body.email,
                                emergency_contact: req.body.emergency_contact,
                                details_of_team: req.body.details_of_team,
                                want_your_poc: req.body.want_your_poc,
                                reminder_before_checkIn: req.body.reminder_before_checkIn,
                                detail_an_overdue_procedure: req.body.detail_an_overdue_procedure,
                                incompleteform: req.body.incompleteform
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
                                            'message': ' Section Updated'
                                        });
                                    }
                                })
                        })
                }
            })
    }
}



/* @function : getCommunicationData
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To get news ra communication form.
 */
exports.getCommunicationData = function (req, res, next) {

    if (req.params.newsRa_id && req.user.id && req.params.types_of_ra_id) {
        newsRaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false,
        }, function (err, newsradetails) {


            communicationObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.params.newsRa_id,
                is_deleted: false,
                // client_id: {
                //     $exists: false
                // }
            }, function (err, communicationData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'data': communicationData,
                        'code': config.success,
                        'message': 'success', communicationData
                    });
                }
            })
        })
    }
}


/* @function : addNewsRaContingencies
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add news ra Contingencies form.
 */
exports.addNewsRaContingencies = function (req, res, next) {
    if (req.body) {
        req.body.client_id = req.user.client_id;
        newsRaObj.findOne({
            _id: req.body[0].news_ra_id,
            is_deleted: false,
        }, function (err, newsradetails) {
            contingencyObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.body[0].news_ra_id,
                is_deleted: false,
                types_of_ra_id: req.body.types_of_ra_id
            }, function (err, contingencyData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    // req.body[0].traveller_id=req.traveller.id;
                    // req.body[1].traveller_id=req.traveller.id;
                    console.log(req.body)
                    req.body.forEach(function (raContingencies) {
                        raContingencies.traveller_id = newsradetails.traveller_id;
                        if (raContingencies._id) {
                            delete (raContingencies._id);
                            delete (raContingencies.updatedAt);
                            delete (raContingencies.createdAt);
                        }
                    })
                    // req.body.traveller_id = req.traveller.id;
                    // var contingencyData = new contingencyObj(req.body);
                    contingencyObj.create(req.body, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'contingency for news ra added successfully'
                            });
                        }
                    })
                }
            })
        })
    }
}


/* @function : updateNewsRaContingencies
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add news ra Contingencies form.
 */
exports.updateNewsRaContingencies = function (req, res, next) {
    if (req.body) {
        req.body.client_id = req.user.client_id;
        newsRaObj.findOne({
            _id: req.body.news_ra_id,
            is_deleted: false,
        }, function (err, newsradetails) {
            contingencyObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.body.news_ra_id,
                is_deleted: false,
                types_of_ra_id: req.body.types_of_ra_id
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
                        personal_protective_equipment: req.body.personal_protective_equipment,
                        incompleteform: req.body.incompleteform,
                        no_of_satellite_phone: req.body.no_of_satellite_phone,
                        no_of_tracker: req.body.no_of_tracker,
                        first_aid_kit_details: req.body.first_aid_kit_details,
                        personal_protective_equipment_details: req.body.personal_protective_equipment_details,
                        embassy_location: req.body.embassy_location,
                        additional_item: req.body.additional_item

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
                                    'message': 'contingency for news ra updated successfully'
                                });
                            }
                        })
                }
            })
        })
    }
}

/* @function : updateNewsRaContigencyApprovingManager from approving managers 
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add news ra Contingencies form.
 */
exports.updateNewsRaContigencyApprovingManager = function (req, res, next) {
    if (req.body) {

        var newquery = {
            _id: req.body._id,
            is_deleted: false,
        }
        contingencyObj.findOne(newquery)
            .populate('news_ra_id')
            .exec(function (err, contingencyData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (contingencyData) {

                    console.log("231")
                    console.log(contingencyData)
                    var newquery = {
                        _id: contingencyData.news_ra_id.traveller_id,
                        is_deleted: false
                    }
                    userTable.findOne(newquery)
                        .exec(function (err, travellerData) {

                            var medical_provision = "";

                            if (req.body.medical_provision != contingencyData.medical_provision) {

                                medical_provision += "Medical Provision:" + contingencyData.medical_provision + "  ===> " + req.body.medical_provision + "<br>";


                            }

                            if (req.body.method_of_evacuation != contingencyData.method_of_evacuation) {

                                medical_provision += "Medical Evacuation :" + contingencyData.method_of_evacuation + "  ===> " + req.body.method_of_evacuation + "<br>";


                            }

                            if (req.body.detail_nearest_hospital != contingencyData.detail_nearest_hospital) {

                                medical_provision += "Nearest Hospital :" + contingencyData.detail_nearest_hospital + "  ===> " + req.body.detail_nearest_hospital + "<br>";


                            }

                            if (req.body.medevac_company != contingencyData.medevac_company) {

                                medical_provision += "Medevac Company :" + contingencyData.medevac_company + "  ===> " + req.body.medevac_company + "<br>";


                            }
                            if (req.body.incompleteform != contingencyData.incompleteform) {

                                medical_provision += "Incomplete Form :" + contingencyData.incompleteform + "  ===> " + req.body.incompleteform + "<br>";


                            }

                            if (req.body.first_aid_kit != contingencyData.first_aid_kit) {

                                medical_provision += "First Aid Kit:" + contingencyData.first_aid_kit + "  ===> " + req.body.first_aid_kit + "<br>";


                            }

                            if (req.body.personal_protective_equipment != contingencyData.personal_protective_equipment) {

                                medical_provision += "Persona Protective:" + contingencyData.personal_protective_equipment + "  ===> " + req.body.personal_protective_equipment + "<br>";


                            }

                            if (req.body.sat_phone_number != contingencyData.sat_phone_number) {

                                medical_provision += "Satelite phone:" + contingencyData.sat_phone_number + "  ===> " + req.body.sat_phone_number + "<br>";


                            }

                            if (req.body.tracker_id != contingencyData.tracker_id) {

                                medical_provision += "Tracker ID:" + contingencyData.tracker_id + "  ===> " + req.body.tracker_id + "<br>";


                            }

                            //customer asked dont send mail so if condition changed 
                            if (medical_provision == "change") {
                                var smtpTransport = nodemailer.createTransport({
                                    service: config.service,
                                    auth: {
                                        user: config.username,
                                        pass: config.password
                                    }
                                });
                                var mailOptions = {
                                    from: config.username,
                                    to: travellerData.email,
                                    subject: 'Approving Manager Updated Contingency details in RA',
                                    html: 'Hello ' + travellerData.firstname + '<br><br> \n\
            \n\ Your Approving manager has updated following details under contingency,  \n\
            <br>' + medical_provision + '<br>\n\
           </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                };
                                smtpTransport.sendMail(mailOptions, function (err, result) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }

                            var contingencyArr = {
                                medical_provision: req.body.medical_provision,
                                method_of_evacuation: req.body.method_of_evacuation,
                                detail_nearest_hospital: req.body.detail_nearest_hospital,
                                medevac_company: req.body.medevac_company,
                                sat_phone_number: req.body.sat_phone_number,
                                tracker_id: req.body.tracker_id,
                                first_aid_kit: req.body.first_aid_kit,
                                personal_protective_equipment: req.body.personal_protective_equipment,
                                incompleteform: req.body.incompleteform,
                                no_of_satellite_phone: req.body.no_of_satellite_phone,
                                no_of_tracker: req.body.no_of_tracker
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
                                            'message': ' Section Updated'
                                        });
                                    }
                                })
                        })
                }
            })
    }
}


/* @function : getContingencyData
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To get news ra contingency form.
 */
exports.getContingencyData = function (req, res, next) {
    if (req.params.newsRa_id && req.user.id && req.params.types_of_ra_id) {
        newsRaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false,
        }, function (err, newsradetails) {

            contingencyObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.params.newsRa_id,
                client_id: {
                    $exists: false
                },
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
        })
    }
}


/* @function : addAnyOtherInfo
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add any other relevant with news ra.
 */
exports.addAnyOtherInfo = function (req, res, next) {

    req.body = JSON.parse(req.body.info);
    if (req.body) {
        newsRaObj.findOne({
            _id: req.body.news_ra_id,
            is_deleted: false
        })
            .exec(function (err, newsRa) {

                // var supporting_docs = newsRa.supporting_docs.concat(req.body.supporting_docs);
                let supporting_docs = newsRa.supporting_docs;
                console.log('supporitng-dex', supporting_docs);
                console.log('req.location-dex', req.location);
                if (req.location) {
                    req.location.forEach(item => {
                        supporting_docs.push(item.Location);
                    });
                    // supporting_docs = req.location[0].Location;
                }
                newsRaObj.update({
                    _id: req.body.news_ra_id
                }, {
                        $set: {
                            relevant_info: req.body.relevant_info,
                            risk_detailed: req.body.risk_detailed,
                            supporting_docs: supporting_docs
                        }
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': `Information relevant to ${newsRa.project_name} updated successfully`
                            });
                        }
                    })

            });
    }

}

/* @function : removeDoc
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : to remove docs
 */
exports.removeDoc = async function (req, res, next) {
    console.log("req.body????", req.body)
    var file_name = req.body.file_name;
    if (req.body) {
     try {
        const deleted = await deleteObject(req, res, next, { name: file_name });
        if ( deleted ) {
            newsRaObj.update({
                _id: req.body.news_ra_id,
                is_deleted: false
            }, {
                    $pull: {
                        "supporting_docs": req.body.file_name
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Document removed successfully!'
                        });
                    }
                });
        } else {
            next(createError(config.serverError, err));
        }
       
     } catch(e) {
        next(createError( config.error, e));
     }
    }
}


/* @function : updateNewsRaSupplier
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add supplier for news ra.
 */
exports.updateNewsRaSupplier = function (req, res, next) {
    console.log(req.body)
    if (req.body) {
        supplierObj.findOne({
            _id: req.body._id,
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
                    // rate: req.body.rate.replace(/'/g, ''),
                    description: req.body.description,
                    incompleteform: req.body.incompleteform,
                    other_service: req.body.other_service,
                    local_contect: req.body.local_contect,
                    local_driver: req.body.local_driver,
                    accomodation: req.body.accomodation,
                    sourcing: req.body.sourcing,
                    more_info: req.body.more_info,
                    who_recommended: req.body.who_recommended
                }
                console.log("supplierArr", supplierArr)
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
            }
        })
    }
}

/* @function : updateNewsRa Details from approving manger 
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To update newsra details 
 */
exports.updateNewsRaApprovingManager = function (req, res, next) {
    console.log(req.body)
    if (req.body) {
        var query = {
            _id: req.body._id,
            is_deleted: false
        }
        newsRaObj.findOne(query)
            .populate('traveller_id')
            .exec(function (err, newsRaData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (newsRaData) {
                    var newquery = {
                        _id: newsRaData.traveller_id,
                        is_deleted: false
                    }
                    userTable.findOne(newquery)
                        .exec(function (err, travellerData) {
                            var project_name = "";

                            if (req.body.project_name != newsRaData.project_name) {

                                project_name += "Project Name :" + newsRaData.project_name + "  ===> " + req.body.project_name + "<br>";


                            }


                            // if (req.body.startdate < newsRaData.startdate || req.body.startdate > newsRaData.startdate ) {

                            //     project_name += "Start Date:"+newsRaData.startdate + "  ===> " + req.body.startdate+"<br>";

                            //     console.log("fdfdfdfd")
                            // } else{
                            //     console.log("no changes")


                            // }

                            // if (req.body.enddate != newsRaData.enddate) {

                            //     var enddate = newsRaData.enddate + "  ===> " + req.body.enddate;


                            // } 
                            if (req.body.description_of_task != newsRaData.description_of_task) {

                                project_name += "Description of Task:" + newsRaData.description_of_task + "  ===> " + req.body.description_of_task + "<br>";


                            }

                            if (req.body.itineary_description != newsRaData.itineary_description) {

                                project_name += "Itineary Description:" + newsRaData.itineary_description + "  ===> " + req.body.itineary_description + "<br>";


                            }


                            if (project_name == "change") {


                                var smtpTransport = nodemailer.createTransport({
                                    service: config.service,
                                    auth: {
                                        user: config.username,
                                        pass: config.password
                                    }
                                });
                                var mailOptions = {
                                    from: config.username,
                                    to: travellerData.email,
                                    subject: 'Approving Manager Updated RA details',
                                    html: 'Hello ' + travellerData.firstname + '<br><br> \n\
                    \n\ Your Approving manager has updated following details under RA,  \n\
                    <br>' + project_name + '<br>\n\
                   </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                };
                                smtpTransport.sendMail(mailOptions, function (err, result) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }
                            var newsRaDataArr = {
                                project_name: req.body.project_name,
                                // rating_with_star: req.body.rating_with_star,
                                startdate: req.body.startdate,
                                enddate: req.body.enddate,
                                description_of_task: req.body.description_of_task,
                                itineary_description: req.body.itineary_description,

                            }
                            newsRaObj.update({
                                _id: newsRaData._id,
                                is_deleted: false
                            }, {
                                    $set: newsRaDataArr
                                }, function (err) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Section Updated'
                                        });
                                    }
                                })

                        })
                }

            })
    }
}

/* @function : updateNewsRaSupplier from approving manger 
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add supplier for news ra.
 */
exports.updateNewsRaSupplierApprovingManager = function (req, res, next) {
    console.log(req.body)
    if (req.body) {
        var query = {
            _id: req.body._id,
            is_deleted: false
        }
        supplierObj.findOne(query)
            .populate('news_ra_id')
            .exec(function (err, supplierData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (supplierData) {
                    var newquery = {
                        _id: supplierData.news_ra_id.traveller_id,
                        is_deleted: false
                    }
                    userTable.findOne(newquery)
                        .exec(function (err, travellerData) {

                            var supplier_name = "";

                            if (req.body.supplier_name != supplierData.supplier_name) {

                                supplier_name += "Supplier Name :" + supplierData.supplier_name + "  ===> " + req.body.supplier_name + "<br>";


                            }
                            if (req.body.country != supplierData.country) {

                                supplier_name += "Country:" + supplierData.country + "  ===> " + req.body.country + "<br>";


                            }

                            if (req.body.cost != supplierData.cost) {

                                supplier_name += "Cost :" + supplierData.cost + "  ===> " + req.body.cost + "<br>";


                            }
                            if (req.body.currency != supplierData.currency) {

                                supplier_name += "Currency :" + supplierData.currency + "  ===> " + req.body.currency + "<br>";


                            }

                            if (req.body.service_provided != supplierData.service_provided) {

                                supplier_name += "Service Provided:" + supplierData.service_provided + "  ===> " + req.body.service_provided + "<br>";


                            }


                            if (req.body.incompleteform != supplierData.incompleteform) {

                                supplier_name += "Incomplete Form:" + supplierData.incompleteform + "  ===> " + req.body.incompleteform + "<br>";


                            }

                            if (req.body.number != supplierData.number) {

                                supplier_name += "Number:" + supplierData.number + " ===> " + req.body.number + "<br>";


                            }

                            if (supplier_name == "change") {

                                var smtpTransport = nodemailer.createTransport({
                                    service: config.service,
                                    auth: {
                                        user: config.username,
                                        pass: config.password
                                    }
                                });
                                var mailOptions = {
                                    from: config.username,
                                    to: travellerData.email,
                                    subject: 'Approving Manager Updated Suppliers details in RA',
                                    html: 'Hello ' + travellerData.firstname + '<br><br> \n\
                    \n\ Your Approving manager has updated following details under supplier,  \n\
                    <br> ' + supplier_name + '<br>\n\
                   </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                };
                                smtpTransport.sendMail(mailOptions, function (err, result) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    }
                                });
                            }
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
                                number: req.body.number,
                                email: req.body.email,
                                // rate: req.body.rate.replace(/'/g, ''),
                                description: req.body.description,
                                incompleteform: req.body.incompleteform,
                                other_service: req.body.other_service,
                                local_contect: req.body.local_contect,
                                local_driver: req.body.local_driver,
                                accomodation: req.body.accomodation,
                                who_recommended: req.body.who_recommended,
                                more_info: req.body.more_info

                            }
                            console.log("supplierArr", supplierArr)
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
                                            'message': ' Section Updated'
                                        });
                                    }
                                })

                        })
                }

            })
    }
}


/* @function : addNewsRaSupplier
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To add supplier for news ra.
 */

exports.addNewsRaSupplier = function (req, res, next) {
    if (req.body) {

        newsRaObj.findOne({
            _id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, newsradetails) {

            supplierObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.body.news_ra_id,
                is_deleted: false
            }, function (err, supplierData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {

                    supplierObj.create(req.body, function (err) {
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
        })
    }
}

/* @function : getSupplierData
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To get news ra supplier data.
 */
exports.getSupplierData = function (req, res, next) {
    if (req.params.newsRa_id && req.traveller.id) {
        newsRaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false
        }, function (err, newsradetails) {


            supplierObj.findOne({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: req.params.newsRa_id,
                client_admin_id: {
                    $exists: false
                },
                is_deleted: false
            }, function (err, supplierObjData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'data': supplierObjData,
                        'code': config.success,
                        'message': 'success'
                    });
                }
            })
        })
    }
}

/* @function : getAllCurrencies
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To get all currencies.
 */
exports.getAllCurrencies = function (req, res, next) {
    currencyObj.find({}, function (err, currencyArr) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': currencyArr,
            });
        }
    })
}

/* @function : getAllTypeOfRa
 *  @author  : MadhuriK 
 *  @created  : 06-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getAllTypeOfRa = function (req, res, next) {
    try {
        userTable.findOne({
            _id: req.user.id
        })
            .populate('client_id')
            .exec(function (err, traveller) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (traveller) {
                    const keyword = req.query.keyword ? req.query.keyword : '';
                    let query = {
                        is_deleted: false,
                        status: 'Active',
                        is_created_compleletely: true,
                        client_id: traveller.client_id ? traveller.client_id._id : false,
                        $or: [
                            { sector_name: traveller.client_id.sector_id },
                            { client_department: { $in: traveller.department } }
                        ]
                    }
                    if (keyword) {
                        var keywordArray = keyword.split(' ')
                        let regex = keywordArray.map(function (e) {
                            return new RegExp(e, "i");
                        });
                        query['$and'] = [{
                            $or: [{
                                ra_name: {
                                    "$in": regex
                                }
                            }]
                        }];
                    }
                    typeOfRaObj.find(query , function (err, typeOfRaArr) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            async.waterfall([
                                function (callback) {
                                    var raArr = _.filter(typeOfRaArr, function (raObj) {
                                        // var type = false;
                                        // var i = 0;
                                        // raObj.client_department.forEach(function(results) {
                                        //     if (results.equals(traveller.department[i])) {
                                        //         type = true;
                                        //         i++;
                                        //     }
                                        // })
                                        // console.log(type)
                                        if ((raObj.created_by_client_admin == true) || (raObj.client_department.length == 0)) {
                                            return (raObj);
                                        }
                                    });
                                    callback(null, raArr);
                                },
                            ], function (err, typeOfRaArr) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    res.json({
                                        'code': config.success,
                                        'data': typeOfRaArr
                                    })
                                }
                            });

                        }
                    })
                }
            })
    } catch (error) {
        next(createError(config.serverError, err));
    }

}



/* @function : createPdf  Approval 
 *  @author  : MadhuriK 
 *  @created  : 11-Jun-17
 *  @modified :
 *  @purpose  : To callback function for creating pdf.
 */
// function createPdf_approval(req, news_ra_id, countryMatrixData, graph, st_date, ed_date, callback) {

//     newsRaObj.findOne({
//         _id: news_ra_id,
//         is_deleted: false
//     })
//         .populate('travellerTeamArr')
//         .populate('approvingManager')
//         .populate('department')
//         .populate('types_of_ra_id')
//         .populate('author_id')

//         .exec(
//             function (err, newsRa) {

//                 if (newsRa) {



//                     async.waterfall([
//                         function (callback) {
//                             newsRaAnsObj.find({
//                                 news_ra_id: news_ra_id,
//                                 is_deleted: false
//                             })
//                                 .populate('category_id')
//                                 .exec(function (err, queData) {
//                                     if (err) {
//                                         callback(err, []);
//                                     } else {
//                                         callback(null, queData);
//                                     }
//                                 })
//                         },
//                         function (queData, callback) {
//                             supplierObj.find({
//                                 news_ra_id: news_ra_id,
//                                 is_deleted: false
//                             }, function (err, supplierData) {
//                                 if (err) {
//                                     callback(err, [], []);
//                                 } else {
//                                     callback(null, queData, supplierData);
//                                 }
//                             })
//                         },
//                         function (queData, supplierData, callback) {
//                             communicationObj.find({
//                                 news_ra_id: news_ra_id,
//                                 is_deleted: false
//                             }, function (err, communicationData) {
//                                 if (err) {
//                                     callback(err, [], [], []);
//                                 } else {
//                                     callback(null, queData, supplierData, communicationData);
//                                 }
//                             })
//                         },
//                         function (queData, supplierData, communicationData, callback) {
//                             contingencyObj.find({
//                                 news_ra_id: news_ra_id,
//                                 is_deleted: false
//                             }, function (err, contingencyData) {
//                                 if (err) {
//                                     callback(err, [], [], [], []);
//                                 } else {
//                                     callback(null, queData, supplierData, communicationData, contingencyData);
//                                 }
//                             })
//                         },
//                         function (queData, supplierData, communicationData, contingencyData, callback) {
//                             countryRiskObj.find({
//                                 country_id: newsRa.country[0]._id
//                             }, function (err, countryColorData) {
//                                 if (err) {
//                                     callback(err, [], [], [], [], []);
//                                 } else {
//                                     callback(null, queData, supplierData, communicationData, contingencyData, countryColorData);
//                                 }
//                             })
//                         },
//                         function (queData, supplierData, communicationData, contingencyData, countryColorData, callback) {
//                             userTable.findOne({
//                                 _id: newsRa.traveller_id,
//                                 is_deleted: false
//                             }).populate('department')
//                                 .exec(
//                                     function (err, traveller) {
//                                         if (err) {
//                                             callback(err, [], [], [], [], []);
//                                         } else {
//                                             callback(null, queData, supplierData, communicationData, contingencyData, countryColorData, traveller);
//                                         }
//                                     })
//                         },
//                         function (queData, supplierData, communicationData, contingencyData, countryColorData, traveller, callback) {
//                             userTable.findOne({
//                                 _id: req.user.id,
//                                 is_deleted: false
//                             }).populate('department')
//                                 .exec(
//                                     function (err, currenttraveller) {
//                                         if (err) {
//                                             callback(err, [], [], [], [], []);
//                                         } else {
//                                             callback(null, queData, supplierData, communicationData, contingencyData, countryColorData, traveller, currenttraveller);
//                                         }
//                                     })
//                         }
//                     ], function (err, queData, supplierData, communicationData, contingencyData, countryColorData, traveller, currenttraveller) {
//                         if (err) {
//                             res.json({
//                                 'error': err,
//                                 'code': config.error,
//                                 'message': 'Something went wrong please try again!'
//                             });
//                         } else {
//                             var supplierArr = [];
//                             supplierData.forEach(function (supplierD) {
//                                 supplierArr.push(supplierD)
//                             })



//                             var countryArr = [];
//                             var travellerTeamArr = [];
//                             var approvingManager = [];
//                             var colorArr = [];
//                             var approvingMname = [];
//                             var departmentArr = [];

//                             var numbers = [];
//                             newsRa.country.forEach(function (countryName) {
//                                 countryArr.push(countryName.name);
//                             })
//                             newsRa.country.forEach(function (countrycolor) {
//                                 colorArr.push(countrycolor.color);
//                             })
//                             if (newsRa.travellerTeamArr != null) {
//                                 newsRa.travellerTeamArr.forEach(function (team) {
//                                     travellerTeamArr.push(team.firstname);

//                                 })
//                             }

//                             newsRa.approvingManager.forEach(function (manager) {
//                                 approvingManager.push(manager.email);
//                             })
//                             newsRa.approvingManager.forEach(function (approvingname) {
//                                 approvingMname.push(approvingname.firstname);
//                             })
//                             traveller.department.forEach(function (departmentName) {
//                                 departmentArr.push(departmentName.department_name);
//                             })
//                             newsRaAnsObj.find({
//                                 news_ra_id: news_ra_id,
//                                 traveller_id: newsRa.traveller_id,
//                                 is_deleted: false
//                             })
//                                 .populate('category_id')
//                                 .exec(function (err, news_ra_ans) {

//                                     var header = '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html lang="en"><head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <title>RISK ASSESSMENT DETAILS</title> <style>.row { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; } .container { position: relative; margin-left: auto; margin-right: auto; padding-right: 15px; padding-left: 15px; } .form-inline .form-group { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; -webkit-flex-flow: row wrap; -ms-flex-flow: row wrap; flex-flow: row wrap; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; margin-bottom: 0; }a, area, button, [role="button"], input, label, select, summary, textarea { -ms-touch-action: manipulation; touch-action: manipulation; } table { border-collapse: collapse; background-color: transparent; } caption { padding-top: 0.75rem; padding-bottom: 0.75rem; color: #636c72; text-align: left; caption-side: bottom; } th { text-align: left; } label { display: inline-block; margin-bottom: .5rem; }';

//                                     var head_end = '</style></head>';
//                                     // var style='<style>html { font-family: sans-serif; line-height: 1.15; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } body { margin: 0; } article, aside, footer, header, nav, section { display: block; } h1 { font-size: 2em; margin: 0.67em 0; } figcaption, figure, main { display: block; } figure { margin: 1em 40px; } hr { -webkit-box-sizing: content-box; box-sizing: content-box; height: 0; overflow: visible; } pre { font-family: monospace, monospace; font-size: 1em; } a { background-color: transparent; -webkit-text-decoration-skip: objects; } a:active, a:hover { outline-width: 0; } abbr[title] { border-bottom: none; text-decoration: underline; text-decoration: underline dotted; } b, strong { font-weight: inherit; } b, strong { font-weight: bolder; } code, kbd, samp { font-family: monospace, monospace; font-size: 1em; } dfn { font-style: italic; } mark { background-color: #ff0; color: #000; } small { font-size: 80%; } sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; } sub { bottom: -0.25em; } sup { top: -0.5em; } audio, video { display: inline-block; } audio:not([controls]) { display: none; height: 0; } img { border-style: none; } svg:not(:root) { overflow: hidden; } button, input, optgroup, select, textarea { font-family: sans-serif; font-size: 100%; line-height: 1.15; margin: 0; } button, input { overflow: visible; } button, select { text-transform: none; } button, html [type="button"], [type="reset"], [type="submit"] { -webkit-appearance: button; } button::-moz-focus-inner, [type="button"]::-moz-focus-inner, [type="reset"]::-moz-focus-inner, [type="submit"]::-moz-focus-inner { border-style: none; padding: 0; } button:-moz-focusring, [type="button"]:-moz-focusring, [type="reset"]:-moz-focusring, [type="submit"]:-moz-focusring { outline: 1px dotted ButtonText; } fieldset { border: 1px solid #c0c0c0; margin: 0 2px; padding: 0.35em 0.625em 0.75em; } legend { -webkit-box-sizing: border-box; box-sizing: border-box; color: inherit; display: table; max-width: 100%; padding: 0; white-space: normal; } progress { display: inline-block; vertical-align: baseline; } textarea { overflow: auto; } [type="checkbox"], [type="radio"] { -webkit-box-sizing: border-box; box-sizing: border-box; padding: 0; } [type="number"]::-webkit-inner-spin-button, [type="number"]::-webkit-outer-spin-button { height: auto; } [type="search"] { -webkit-appearance: textfield; outline-offset: -2px; } [type="search"]::-webkit-search-cancel-button, [type="search"]::-webkit-search-decoration { -webkit-appearance: none; } ::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; } details, menu { display: block; } summary { display: list-item; } canvas { display: inline-block; } template { display: none; } [hidden] { display: none; } @media print { *, *::before, *::after, p::first-letter, div::first-letter, blockquote::first-letter, li::first-letter, p::first-line, div::first-line, blockquote::first-line, li::first-line { text-shadow: none !important; -webkit-box-shadow: none !important; box-shadow: none !important; } a, a:visited { text-decoration: underline; } abbr[title]::after { content: " (" attr(title) ")"; } pre { white-space: pre-wrap !important; } pre, blockquote { border: 1px solid #999; page-break-inside: avoid; } thead { display: table-header-group; } tr, img { page-break-inside: avoid; } p, h2, h3 { orphans: 3; widows: 3; } h2, h3 { page-break-after: avoid; } .navbar { display: none; } .badge { border: 1px solid #000; } .table { border-collapse: collapse !important; } .table td, .table th { background-color: #fff !important; } .table-bordered th, .table-bordered td { border: 1px solid #ddd !important; } } html { -webkit-box-sizing: border-box; box-sizing: border-box; } *, *::before, *::after { -webkit-box-sizing: inherit; box-sizing: inherit; } @-ms-viewport { width: device-width; } html { -ms-overflow-style: scrollbar; -webkit-tap-highlight-color: transparent; } body { font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 1rem; font-weight: normal; line-height: 1.5; color: #292b2c; background-color: #fff; } [tabindex="-1"]:focus { outline: none !important; } h1, h2, h3, h4, h5, h6 { margin-top: 0; margin-bottom: .5rem; } p { margin-top: 0; margin-bottom: 1rem; } abbr[title], abbr[data-original-title] { cursor: help; } address { margin-bottom: 1rem; font-style: normal; line-height: inherit; } ol, ul, dl { margin-top: 0; margin-bottom: 1rem; } ol ol, ul ul, ol ul, ul ol { margin-bottom: 0; } dt { font-weight: bold; } dd { margin-bottom: .5rem; margin-left: 0; } blockquote { margin: 0 0 1rem; } a { color: #0275d8; text-decoration: none; } a:focus, a:hover { color: #014c8c; text-decoration: underline; } a:not([href]):not([tabindex]) { color: inherit; text-decoration: none; } a:not([href]):not([tabindex]):focus, a:not([href]):not([tabindex]):hover { color: inherit; text-decoration: none; } a:not([href]):not([tabindex]):focus { outline: 0; } pre { margin-top: 0; margin-bottom: 1rem; overflow: auto; } figure { margin: 0 0 1rem; } img { vertical-align: middle; } [role="button"] { cursor: pointer; } a, area, button, [role="button"], input, label, select, summary, textarea { -ms-touch-action: manipulation; touch-action: manipulation; } table { border-collapse: collapse; background-color: transparent; } caption { padding-top: 0.75rem; padding-bottom: 0.75rem; color: #636c72; text-align: left; caption-side: bottom; } th { text-align: left; } label { display: inline-block; margin-bottom: .5rem; } button:focus { outline: 1px dotted; outline: 5px auto -webkit-focus-ring-color; } input, button, select, textarea { line-height: inherit; } input[type="radio"]:disabled, input[type="checkbox"]:disabled { cursor: not-allowed; } input[type="date"], input[type="time"], input[type="datetime-local"], input[type="month"] { -webkit-appearance: listbox; } textarea { resize: vertical; } fieldset { min-width: 0; padding: 0; margin: 0; border: 0; } legend { display: block; width: 100%; padding: 0; margin-bottom: .5rem; font-size: 1.5rem; line-height: inherit; } input[type="search"] { -webkit-appearance: none; } output { display: inline-block; } [hidden] { display: none !important; } h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 { margin-bottom: 0.5rem; font-family: inherit; font-weight: 500; line-height: 1.1; color: inherit; } h1, .h1 { font-size: 2.5rem; } h2, .h2 { font-size: 2rem; } h3, .h3 { font-size: 1.75rem; } h4, .h4 { font-size: 1.5rem; } h5, .h5 { font-size: 1.25rem; } h6, .h6 { font-size: 1rem; } .lead { font-size: 1.25rem; font-weight: 300; } .display-1 { font-size: 6rem; font-weight: 300; line-height: 1.1; } .display-2 { font-size: 5.5rem; font-weight: 300; line-height: 1.1; } .display-3 { font-size: 4.5rem; font-weight: 300; line-height: 1.1; } .display-4 { font-size: 3.5rem; font-weight: 300; line-height: 1.1; } hr { margin-top: 1rem; margin-bottom: 1rem; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); } small, .small { font-size: 80%; font-weight: normal; } mark, .mark { padding: 0.2em; background-color: #fcf8e3; } .list-unstyled { padding-left: 0; list-style: none; } .list-inline { padding-left: 0; list-style: none; } .list-inline-item { display: inline-block; } .list-inline-item:not(:last-child) { margin-right: 5px; } .initialism { font-size: 90%; text-transform: uppercase; } .blockquote { padding: 0.5rem 1rem; margin-bottom: 1rem; font-size: 1.25rem; border-left: 0.25rem solid #eceeef; } .blockquote-footer { display: block; font-size: 80%; color: #636c72; } .blockquote-footer::before { content: "\2014 \00A0"; } .blockquote-reverse { padding-right: 1rem; padding-left: 0; text-align: right; border-right: 0.25rem solid #eceeef; border-left: 0; } .blockquote-reverse .blockquote-footer::before { content: ""; } .blockquote-reverse .blockquote-footer::after { content: "\00A0 \2014"; } .img-fluid { max-width: 100%; height: auto; } .img-thumbnail { padding: 0.25rem; background-color: #fff; border: 1px solid #ddd; border-radius: 0.25rem; -webkit-transition: all 0.2s ease-in-out; -o-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; max-width: 100%; height: auto; } .figure { display: inline-block; } .figure-img { margin-bottom: 0.5rem; line-height: 1; } .figure-caption { font-size: 90%; color: #636c72; } code, kbd, pre, samp { font-family: Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; } code { padding: 0.2rem 0.4rem; font-size: 90%; color: #bd4147; background-color: #f7f7f9; border-radius: 0.25rem; } a > code { padding: 0; color: inherit; background-color: inherit; } kbd { padding: 0.2rem 0.4rem; font-size: 90%; color: #fff; background-color: #292b2c; border-radius: 0.2rem; } kbd kbd { padding: 0; font-size: 100%; font-weight: bold; } pre { display: block; margin-top: 0; margin-bottom: 1rem; font-size: 90%; color: #292b2c; } pre code { padding: 0; font-size: inherit; color: inherit; background-color: transparent; border-radius: 0; } .pre-scrollable { max-height: 340px; overflow-y: scroll; } .container { position: relative; margin-left: auto; margin-right: auto; padding-right: 15px; padding-left: 15px; } @media (min-width: 576px) { .container { padding-right: 15px; padding-left: 15px; } } @media (min-width: 768px) { .container { padding-right: 15px; padding-left: 15px; } } @media (min-width: 992px) { .container { padding-right: 15px; padding-left: 15px; } } @media (min-width: 1200px) { .container { padding-right: 15px; padding-left: 15px; } } @media (min-width: 576px) { .container { width: 540px; max-width: 100%; } } @media (min-width: 768px) { .container { width: 720px; max-width: 100%; } } @media (min-width: 992px) { .container { width: 960px; max-width: 100%; } } @media (min-width: 1200px) { .container { width: 1140px; max-width: 100%; } } .container-fluid { position: relative; margin-left: auto; margin-right: auto;';
//                                     //    var style2= 'padding-right: 15px; padding-left: 15px; } @media (min-width: 576px) { .container-fluid { padding-right: 15px; padding-left: 15px; } } @media (min-width: 768px) { .container-fluid { padding-right: 15px; padding-left: 15px; } } @media (min-width: 992px) { .container-fluid { padding-right: 15px; padding-left: 15px; } } @media (min-width: 1200px) { .container-fluid { padding-right: 15px; padding-left: 15px; } } .row { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-flex-wrap: wrap; -ms-flex-wrap: wrap; flex-wrap: wrap; margin-right: -15px; margin-left: -15px; } @media (min-width: 576px) { .row { margin-right: -15px; margin-left: -15px; } } @media (min-width: 768px) { .row { margin-right: -15px; margin-left: -15px; } } @media (min-width: 992px) { .row { margin-right: -15px; margin-left: -15px; } } @media (min-width: 1200px) { .row { margin-right: -15px; margin-left: -15px; } } .no-gutters { margin-right: 0; margin-left: 0; } .no-gutters > .col, .no-gutters > [class*="col-"] { padding-right: 0; padding-left: 0; } .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl { position: relative; width: 100%; min-height: 1px; padding-right: 15px; padding-left: 15px; } @media (min-width: 576px) { .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl { padding-right: 15px; padding-left: 15px; } } @media (min-width: 768px) { .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl { padding-right: 15px; padding-left: 15px; } } @media (min-width: 992px) { .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl { padding-right: 15px; padding-left: 15px; } } @media (min-width: 1200px) { .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl { padding-right: 15px; padding-left: 15px; } } .col { -webkit-flex-basis: 0; -ms-flex-preferred-size: 0; flex-basis: 0; -webkit-box-flex: 1; -webkit-flex-grow: 1; -ms-flex-positive: 1; flex-grow: 1; max-width: 100%; } .col-auto { -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; width: auto; } .col-1 { -webkit-box-flex: 0; -webkit-flex: 0 0 8.333333%; -ms-flex: 0 0 8.333333%; flex: 0 0 8.333333%; max-width: 8.333333%; } .col-2 { -webkit-box-flex: 0; -webkit-flex: 0 0 16.666667%; -ms-flex: 0 0 16.666667%; flex: 0 0 16.666667%; max-width: 16.666667%; } .col-3 { -webkit-box-flex: 0; -webkit-flex: 0 0 25%; -ms-flex: 0 0 25%; flex: 0 0 25%; max-width: 25%; } .col-4 { -webkit-box-flex: 0; -webkit-flex: 0 0 33.333333%; -ms-flex: 0 0 33.333333%; flex: 0 0 33.333333%; max-width: 33.333333%; } .col-5 { -webkit-box-flex: 0; -webkit-flex: 0 0 41.666667%; -ms-flex: 0 0 41.666667%; flex: 0 0 41.666667%; max-width: 41.666667%; } .col-6 { -webkit-box-flex: 0; -webkit-flex: 0 0 50%; -ms-flex: 0 0 50%; flex: 0 0 50%; max-width: 50%; } .col-7 { -webkit-box-flex: 0; -webkit-flex: 0 0 58.333333%; -ms-flex: 0 0 58.333333%; flex: 0 0 58.333333%; max-width: 58.333333%; } .col-8 { -webkit-box-flex: 0; -webkit-flex: 0 0 66.666667%; -ms-flex: 0 0 66.666667%; flex: 0 0 66.666667%; max-width: 66.666667%; } .col-9 { -webkit-box-flex: 0; -webkit-flex: 0 0 75%; -ms-flex: 0 0 75%; flex: 0 0 75%; max-width: 75%; } .col-10 { -webkit-box-flex: 0; -webkit-flex: 0 0 83.333333%; -ms-flex: 0 0 83.333333%; flex: 0 0 83.333333%; max-width: 83.333333%; } .col-11 { -webkit-box-flex: 0; -webkit-flex: 0 0 91.666667%; -ms-flex: 0 0 91.666667%; flex: 0 0 91.666667%; max-width: 91.666667%; } .col-12 { -webkit-box-flex: 0; -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%; } .pull-0 { right: auto; } .pull-1 { right: 8.333333%; } .pull-2 { right: 16.666667%; } .pull-3 { right: 25%; } .pull-4 { right: 33.333333%; } .pull-5 { right: 41.666667%; } .pull-6 { right: 50%; } .pull-7 { right: 58.333333%; } .pull-8 { right: 66.666667%; } .pull-9 { right: 75%; } .pull-10 { right: 83.333333%; } .pull-11 { right: 91.666667%; } .pull-12 { right: 100%; } .push-0 { left: auto; } .push-1 { left: 8.333333%; } .push-2 { left: 16.666667%; } .push-3 { left: 25%; } .push-4 { left: 33.333333%; } .push-5 { left: 41.666667%; } .push-6 { left: 50%; } .push-7 { left: 58.333333%; } .push-8 { left: 66.666667%; } .push-9 { left: 75%; } .push-10 { left: 83.333333%; } .push-11 { left: 91.666667%; } .push-12 { left: 100%; } .offset-1 { margin-left: 8.333333%; } .offset-2 { margin-left: 16.666667%; } .offset-3 { margin-left: 25%; } .offset-4 { margin-left: 33.333333%; } .offset-5 { margin-left: 41.666667%; } .offset-6 { margin-left: 50%; } .offset-7 { margin-left: 58.333333%; } .offset-8 { margin-left: 66.666667%; } .offset-9 { margin-left: 75%; } .offset-10 { margin-left: 83.333333%; } .offset-11 { margin-left: 91.666667%; } @media (min-width: 576px) { .col-sm { -webkit-flex-basis: 0; -ms-flex-preferred-size: 0; flex-basis: 0; -webkit-box-flex: 1; -webkit-flex-grow: 1; -ms-flex-positive: 1; flex-grow: 1; max-width: 100%; } .col-sm-auto { -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; width: auto; } .col-sm-1 { -webkit-box-flex: 0; -webkit-flex: 0 0 8.333333%; -ms-flex: 0 0 8.333333%; flex: 0 0 8.333333%; max-width: 8.333333%; } .col-sm-2 { -webkit-box-flex: 0; -webkit-flex: 0 0 16.666667%; -ms-flex: 0 0 16.666667%; flex: 0 0 16.666667%; max-width: 16.666667%; } .col-sm-3 { -webkit-box-flex: 0; -webkit-flex: 0 0 25%; -ms-flex: 0 0 25%; flex: 0 0 25%; max-width: 25%; } .col-sm-4 { -webkit-box-flex: 0; -webkit-flex: 0 0 33.333333%; -ms-flex: 0 0 33.333333%; flex: 0 0 33.333333%; max-width: 33.333333%; } .col-sm-5 { -webkit-box-flex: 0; -webkit-flex: 0 0 41.666667%; -ms-flex: 0 0 41.666667%; flex: 0 0 41.666667%; max-width: 41.666667%; } .col-sm-6 { -webkit-box-flex: 0; -webkit-flex: 0 0 50%; -ms-flex: 0 0 50%; flex: 0 0 50%; max-width: 50%; } .col-sm-7 { -webkit-box-flex: 0; -webkit-flex: 0 0 58.333333%; -ms-flex: 0 0 58.333333%; flex: 0 0 58.333333%; max-width: 58.333333%; } .col-sm-8 { -webkit-box-flex: 0; -webkit-flex: 0 0 66.666667%; -ms-flex: 0 0 66.666667%; flex: 0 0 66.666667%; max-width: 66.666667%; } .col-sm-9 { -webkit-box-flex: 0; -webkit-flex: 0 0 75%; -ms-flex: 0 0 75%; flex: 0 0 75%; max-width: 75%; } .col-sm-10 { -webkit-box-flex: 0; -webkit-flex: 0 0 83.333333%; -ms-flex: 0 0 83.333333%; flex: 0 0 83.333333%; max-width: 83.333333%; } .col-sm-11 { -webkit-box-flex: 0; -webkit-flex: 0 0 91.666667%; -ms-flex: 0 0 91.666667%; flex: 0 0 91.666667%; max-width: 91.666667%; } .col-sm-12 { -webkit-box-flex: 0; -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%; } .pull-sm-0 { right: auto; } .pull-sm-1 { right: 8.333333%; } .pull-sm-2 { right: 16.666667%; } .pull-sm-3 { right: 25%; } .pull-sm-4 { right: 33.333333%; } .pull-sm-5 { right: 41.666667%; } .pull-sm-6 { right: 50%; } .pull-sm-7 { right: 58.333333%; } .pull-sm-8 { right: 66.666667%; } .pull-sm-9 { right: 75%; }';
//                                     //    var style3= '.pull-sm-10 { right: 83.333333%; } .pull-sm-11 { right: 91.666667%; } .pull-sm-12 { right: 100%; } .push-sm-0 { left: auto; } .push-sm-1 { left: 8.333333%; } .push-sm-2 { left: 16.666667%; } .push-sm-3 { left: 25%; } .push-sm-4 { left: 33.333333%; } .push-sm-5 { left: 41.666667%; } .push-sm-6 { left: 50%; } .push-sm-7 { left: 58.333333%; } .push-sm-8 { left: 66.666667%; } .push-sm-9 { left: 75%; } .push-sm-10 { left: 83.333333%; } .push-sm-11 { left: 91.666667%; } .push-sm-12 { left: 100%; } .offset-sm-0 { margin-left: 0%; } .offset-sm-1 { margin-left: 8.333333%; } .offset-sm-2 { margin-left: 16.666667%; } .offset-sm-3 { margin-left: 25%; } .offset-sm-4 { margin-left: 33.333333%; } .offset-sm-5 { margin-left: 41.666667%; } .offset-sm-6 { margin-left: 50%; } .offset-sm-7 { margin-left: 58.333333%; } .offset-sm-8 { margin-left: 66.666667%; } .offset-sm-9 { margin-left: 75%; } .offset-sm-10 { margin-left: 83.333333%; } .offset-sm-11 { margin-left: 91.666667%; } } @media (min-width: 768px) { .col-md { -webkit-flex-basis: 0; -ms-flex-preferred-size: 0; flex-basis: 0; -webkit-box-flex: 1; -webkit-flex-grow: 1; -ms-flex-positive: 1; flex-grow: 1; max-width: 100%; } .col-md-auto { -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; width: auto; } .col-md-1 { -webkit-box-flex: 0; -webkit-flex: 0 0 8.333333%; -ms-flex: 0 0 8.333333%; flex: 0 0 8.333333%; max-width: 8.333333%; } .col-md-2 { -webkit-box-flex: 0; -webkit-flex: 0 0 16.666667%; -ms-flex: 0 0 16.666667%; flex: 0 0 16.666667%; max-width: 16.666667%; } .col-md-3 { -webkit-box-flex: 0; -webkit-flex: 0 0 25%; -ms-flex: 0 0 25%; flex: 0 0 25%; max-width: 25%; } .col-md-4 { -webkit-box-flex: 0; -webkit-flex: 0 0 33.333333%; -ms-flex: 0 0 33.333333%; flex: 0 0 33.333333%; max-width: 33.333333%; } .col-md-5 { -webkit-box-flex: 0; -webkit-flex: 0 0 41.666667%; -ms-flex: 0 0 41.666667%; flex: 0 0 41.666667%; max-width: 41.666667%; } .col-md-6 { -webkit-box-flex: 0; -webkit-flex: 0 0 50%; -ms-flex: 0 0 50%; flex: 0 0 50%; max-width: 50%; } .col-md-7 { -webkit-box-flex: 0; -webkit-flex: 0 0 58.333333%; -ms-flex: 0 0 58.333333%; flex: 0 0 58.333333%; max-width: 58.333333%; } .col-md-8 { -webkit-box-flex: 0; -webkit-flex: 0 0 66.666667%; -ms-flex: 0 0 66.666667%; flex: 0 0 66.666667%; max-width: 66.666667%; } .col-md-9 { -webkit-box-flex: 0; -webkit-flex: 0 0 75%; -ms-flex: 0 0 75%; flex: 0 0 75%; max-width: 75%; } .col-md-10 { -webkit-box-flex: 0; -webkit-flex: 0 0 83.333333%; -ms-flex: 0 0 83.333333%; flex: 0 0 83.333333%; max-width: 83.333333%; } .col-md-11 { -webkit-box-flex: 0; -webkit-flex: 0 0 91.666667%; -ms-flex: 0 0 91.666667%; flex: 0 0 91.666667%; max-width: 91.666667%; } .col-md-12 { -webkit-box-flex: 0; -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%; } .pull-md-0 { right: auto; } .pull-md-1 { right: 8.333333%; } .pull-md-2 { right: 16.666667%; } .pull-md-3 { right: 25%; } .pull-md-4 { right: 33.333333%; } .pull-md-5 { right: 41.666667%; } .pull-md-6 { right: 50%; } .pull-md-7 { right: 58.333333%; } .pull-md-8 { right: 66.666667%; } .pull-md-9 { right: 75%; } .pull-md-10 { right: 83.333333%; } .pull-md-11 { right: 91.666667%; } .pull-md-12 { right: 100%; } .push-md-0 { left: auto; } .push-md-1 { left: 8.333333%; } .push-md-2 { left: 16.666667%; } .push-md-3 { left: 25%; } .push-md-4 { left: 33.333333%; } .push-md-5 { left: 41.666667%; } .push-md-6 { left: 50%; } .push-md-7 { left: 58.333333%; } .push-md-8 { left: 66.666667%; } .push-md-9 { left: 75%; } .push-md-10 { left: 83.333333%; } .push-md-11 { left: 91.666667%; } .push-md-12 { left: 100%; } .offset-md-0 { margin-left: 0%; } .offset-md-1 { margin-left: 8.333333%; } .offset-md-2 { margin-left: 16.666667%; } .offset-md-3 { margin-left: 25%; } .offset-md-4 { margin-left: 33.333333%; } .offset-md-5 { margin-left: 41.666667%; } .offset-md-6 { margin-left: 50%; } .offset-md-7 { margin-left: 58.333333%; } .offset-md-8 { margin-left: 66.666667%; } .offset-md-9 { margin-left: 75%; } .offset-md-10 { margin-left: 83.333333%; } .offset-md-11 { margin-left: 91.666667%; } } @media (min-width: 992px) { .col-lg { -webkit-flex-basis: 0; -ms-flex-preferred-size: 0; flex-basis: 0; -webkit-box-flex: 1; -webkit-flex-grow: 1; -ms-flex-positive: 1; flex-grow: 1; max-width: 100%; } .col-lg-auto { -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; width: auto; } .col-lg-1 { -webkit-box-flex: 0; -webkit-flex: 0 0 8.333333%; -ms-flex: 0 0 8.333333%; flex: 0 0 8.333333%; max-width: 8.333333%; } .col-lg-2 { -webkit-box-flex: 0; -webkit-flex: 0 0 16.666667%; -ms-flex: 0 0 16.666667%; flex: 0 0 16.666667%; max-width: 16.666667%; } .col-lg-3 { -webkit-box-flex: 0; -webkit-flex: 0 0 25%; -ms-flex: 0 0 25%; flex: 0 0 25%; max-width: 25%; } .col-lg-4 { -webkit-box-flex: 0; -webkit-flex: 0 0 33.333333%; -ms-flex: 0 0 33.333333%; flex: 0 0 33.333333%; max-width: 33.333333%; } .col-lg-5 { -webkit-box-flex: 0; -webkit-flex: 0 0 41.666667%; -ms-flex: 0 0 41.666667%; flex: 0 0 41.666667%; max-width: 41.666667%; } .col-lg-6 { -webkit-box-flex: 0; -webkit-flex: 0 0 50%; -ms-flex: 0 0 50%; flex: 0 0 50%; max-width: 50%; } .col-lg-7 { -webkit-box-flex: 0; -webkit-flex: 0 0 58.333333%; -ms-flex: 0 0 58.333333%; flex: 0 0 58.333333%; max-width: 58.333333%; } .col-lg-8 { -webkit-box-flex: 0; -webkit-flex: 0 0 66.666667%; -ms-flex: 0 0 66.666667%; flex: 0 0 66.666667%; max-width: 66.666667%; } .col-lg-9 { -webkit-box-flex: 0; -webkit-flex: 0 0 75%; -ms-flex: 0 0 75%; flex: 0 0 75%; max-width: 75%; } .col-lg-10 { -webkit-box-flex: 0; -webkit-flex: 0 0 83.333333%; -ms-flex: 0 0 83.333333%; flex: 0 0 83.333333%; max-width: 83.333333%; } .col-lg-11 { -webkit-box-flex: 0; -webkit-flex: 0 0 91.666667%; -ms-flex: 0 0 91.666667%; flex: 0 0 91.666667%; max-width: 91.666667%; } .col-lg-12 { -webkit-box-flex: 0; -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%; } .pull-lg-0 { right: auto; } .pull-lg-1 { right: 8.333333%; } .pull-lg-2 { right: 16.666667%; } .pull-lg-3 { right: 25%; } .pull-lg-4 { right: 33.333333%; } .pull-lg-5 { right: 41.666667%; } .pull-lg-6 { right: 50%; } .pull-lg-7 { right: 58.333333%; } .pull-lg-8 { right: 66.666667%; } .pull-lg-9 { right: 75%; } .pull-lg-10 { right: 83.333333%; } .pull-lg-11 { right: 91.666667%; } .pull-lg-12 { right: 100%; } .push-lg-0 { left: auto; } .push-lg-1 { left: 8.333333%; } .push-lg-2 { left: 16.666667%; } .push-lg-3 { left: 25%; } .push-lg-4 { left: 33.333333%; } .push-lg-5 { left: 41.666667%; } .push-lg-6 { left: 50%; } .push-lg-7 { left: 58.333333%; } .push-lg-8 { left: 66.666667%; } .push-lg-9 { left: 75%; } .push-lg-10 { left: 83.333333%; } .push-lg-11 { left: 91.666667%; } .push-lg-12 { left: 100%; } .offset-lg-0 { margin-left: 0%; } .offset-lg-1 { margin-left: 8.333333%; } .offset-lg-2 { margin-left: 16.666667%; } .offset-lg-3 { margin-left: 25%; } .offset-lg-4 { margin-left: 33.333333%; } .offset-lg-5 { margin-left: 41.666667%; } .offset-lg-6 { margin-left: 50%; } .offset-lg-7 { margin-left: 58.333333%; } .offset-lg-8 { margin-left: 66.666667%; } .offset-lg-9 { margin-left: 75%; } .offset-lg-10 { margin-left: 83.333333%; } .offset-lg-11 { margin-left: 91.666667%; } } @media (min-width: 1200px) { .col-xl { -webkit-flex-basis: 0; -ms-flex-preferred-size: 0; flex-basis: 0; -webkit-box-flex: 1; -webkit-flex-grow: 1; -ms-flex-positive: 1; flex-grow: 1; max-width: 100%; } .col-xl-auto { -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; width: auto; } .col-xl-1 { -webkit-box-flex: 0; -webkit-flex: 0 0 8.333333%; -ms-flex: 0 0 8.333333%; flex: 0 0 8.333333%; max-width: 8.333333%; } .col-xl-2 { -webkit-box-flex: 0; -webkit-flex: 0 0 16.666667%; -ms-flex: 0 0 16.666667%; flex: 0 0 16.666667%; max-width: 16.666667%; } .col-xl-3 { -webkit-box-flex: 0; -webkit-flex: 0 0 25%; -ms-flex: 0 0 25%; flex: 0 0 25%; max-width: 25%; } .col-xl-4 { -webkit-box-flex: 0; -webkit-flex: 0 0 33.333333%; -ms-flex: 0 0 33.333333%; flex: 0 0 33.333333%; max-width: 33.333333%; } .col-xl-5 { -webkit-box-flex: 0; -webkit-flex: 0 0 41.666667%; -ms-flex: 0 0 41.666667%; flex: 0 0 41.666667%; max-width: 41.666667%; } .col-xl-6 { -webkit-box-flex: 0; -webkit-flex: 0 0 50%; -ms-flex: 0 0 50%; flex: 0 0 50%; max-width: 50%; } .col-xl-7 { -webkit-box-flex: 0; -webkit-flex: 0 0 58.333333%; -ms-flex: 0 0 58.333333%; flex: 0 0 58.333333%; max-width: 58.333333%; } .col-xl-8 { -webkit-box-flex: 0; -webkit-flex: 0 0 66.666667%; -ms-flex: 0 0 66.666667%; flex: 0 0 66.666667%; max-width: 66.666667%; } .col-xl-9 { -webkit-box-flex: 0; -webkit-flex: 0 0 75%; -ms-flex: 0 0 75%; flex: 0 0 75%; max-width: 75%; } .col-xl-10 { -webkit-box-flex: 0; -webkit-flex: 0 0 83.333333%; -ms-flex: 0 0 83.333333%; flex: 0 0 83.333333%; max-width: 83.333333%; } .col-xl-11 { -webkit-box-flex: 0; -webkit-flex: 0 0 91.666667%; -ms-flex: 0 0 91.666667%; flex: 0 0 91.666667%; max-width: 91.666667%; } .col-xl-12 { -webkit-box-flex: 0; -webkit-flex: 0 0 100%; -ms-flex: 0 0 100%; flex: 0 0 100%; max-width: 100%; } .pull-xl-0 { right: auto; } .pull-xl-1 { right: 8.333333%; } .pull-xl-2 { right: 16.666667%; } .pull-xl-3 { right: 25%; } .pull-xl-4 { right: 33.333333%; } .pull-xl-5 { right: 41.666667%; } .pull-xl-6 { right: 50%; } .pull-xl-7 { right: 58.333333%; } .pull-xl-8 { right: 66.666667%; } .pull-xl-9 { right: 75%; } .pull-xl-10 { right: 83.333333%; } .pull-xl-11 { right: 91.666667%; } .pull-xl-12 { right: 100%; } .push-xl-0 { left: auto; } .push-xl-1 { left: 8.333333%; } .push-xl-2 { left: 16.666667%; } .push-xl-3 { left: 25%; } .push-xl-4 { left: 33.333333%; } .push-xl-5 { left: 41.666667%; } .push-xl-6 { left: 50%; } .push-xl-7 { left: 58.333333%; } .push-xl-8 { left: 66.666667%; } .push-xl-9 { left: 75%; } .push-xl-10 { left: 83.333333%; } .push-xl-11 { left: 91.666667%; } .push-xl-12 { left: 100%; } .offset-xl-0 { margin-left: 0%; }';
//                                     //    var style4='.offset-xl-1 { margin-left: 8.333333%; } .offset-xl-2 { margin-left: 16.666667%; } .offset-xl-3 { margin-left: 25%; } .offset-xl-4 { margin-left: 33.333333%; } .offset-xl-5 { margin-left: 41.666667%; } .offset-xl-6 { margin-left: 50%; } .offset-xl-7 { margin-left: 58.333333%; } .offset-xl-8 { margin-left: 66.666667%; } .offset-xl-9 { margin-left: 75%; } .offset-xl-10 { margin-left: 83.333333%; } .offset-xl-11 { margin-left: 91.666667%; } } .table { width: 100%; max-width: 100%; margin-bottom: 1rem; } .table th, .table td { padding: 0.75rem; vertical-align: top; border-top: 1px solid #eceeef; } .table thead th { vertical-align: bottom; border-bottom: 2px solid #eceeef; } .table tbody + tbody { border-top: 2px solid #eceeef; } .table .table { background-color: #fff; } .table-sm th, .table-sm td { padding: 0.3rem; } .table-bordered { border: 1px solid #eceeef; } .table-bordered th, .table-bordered td { border: 1px solid #eceeef; } .table-bordered thead th, .table-bordered thead td { border-bottom-width: 2px; } .table-striped tbody tr:nth-of-type(odd) { background-color: rgba(0, 0, 0, 0.05); } .table-hover tbody tr:hover { background-color: rgba(0, 0, 0, 0.075); } .table-active, .table-active > th, .table-active > td { background-color: rgba(0, 0, 0, 0.075); } .table-hover .table-active:hover { background-color: rgba(0, 0, 0, 0.075); } .table-hover .table-active:hover > td, .table-hover .table-active:hover > th { background-color: rgba(0, 0, 0, 0.075); } .table-success, .table-success > th, .table-success > td { background-color: #dff0d8; } .table-hover .table-success:hover { background-color: #d0e9c6; } .table-hover .table-success:hover > td, .table-hover .table-success:hover > th { background-color: #d0e9c6; } .table-info, .table-info > th, .table-info > td { background-color: #d9edf7; } .table-hover .table-info:hover { background-color: #c4e3f3; } .table-hover .table-info:hover > td, .table-hover .table-info:hover > th { background-color: #c4e3f3; } .table-warning, .table-warning > th, .table-warning > td { background-color: #fcf8e3; } .table-hover .table-warning:hover { background-color: #faf2cc; } .table-hover .table-warning:hover > td, .table-hover .table-warning:hover > th { background-color: #faf2cc; } .table-danger, .table-danger > th, .table-danger > td { background-color: #f2dede; } .table-hover .table-danger:hover { background-color: #ebcccc; } .table-hover .table-danger:hover > td, .table-hover .table-danger:hover > th { background-color: #ebcccc; } .thead-inverse th { color: #fff; background-color: #292b2c; } .thead-default th { color: #464a4c; background-color: #eceeef; } .table-inverse { color: #fff; background-color: #292b2c; } .table-inverse th, .table-inverse td, .table-inverse thead th { border-color: #fff; } .table-inverse.table-bordered { border: 0; } .table-responsive { display: block; width: 100%; overflow-x: auto; -ms-overflow-style: -ms-autohiding-scrollbar; } .table-responsive.table-bordered { border: 0; } .form-control { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 1rem; line-height: 1.25; color: #464a4c; background-color: #fff; background-image: none; -webkit-background-clip: padding-box; background-clip: padding-box; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.25rem; -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s; -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s; } .form-control::-ms-expand { background-color: transparent; border: 0; } .form-control:focus { color: #464a4c; background-color: #fff; border-color: #5cb3fd; outline: none; } .form-control::-webkit-input-placeholder { color: #636c72; opacity: 1; } .form-control::-moz-placeholder { color: #636c72; opacity: 1; } .form-control:-ms-input-placeholder { color: #636c72; opacity: 1; } .form-control::placeholder { color: #636c72; opacity: 1; } .form-control:disabled, .form-control[readonly] { background-color: #eceeef; opacity: 1; } .form-control:disabled { cursor: not-allowed; } select.form-control:not([size]):not([multiple]) { height: calc(2.25rem + 2px); } select.form-control:focus::-ms-value { color: #464a4c; background-color: #fff; } .form-control-file, .form-control-range { display: block; } .col-form-label { padding-top: calc(0.5rem - 1px * 2); padding-bottom: calc(0.5rem - 1px * 2); margin-bottom: 0; } .col-form-label-lg { padding-top: calc(0.75rem - 1px * 2); padding-bottom: calc(0.75rem - 1px * 2); font-size: 1.25rem; } .col-form-label-sm { padding-top: calc(0.25rem - 1px * 2); padding-bottom: calc(0.25rem - 1px * 2); font-size: 0.875rem; } .col-form-legend { padding-top: 0.5rem; padding-bottom: 0.5rem; margin-bottom: 0; font-size: 1rem; } .form-control-static { padding-top: 0.5rem; padding-bottom: 0.5rem; margin-bottom: 0; line-height: 1.25; border: solid transparent; border-width: 1px 0; } .form-control-static.form-control-sm, .input-group-sm > .form-control-static.form-control, .input-group-sm > .form-control-static.input-group-addon, .input-group-sm > .input-group-btn > .form-control-static.btn, .form-control-static.form-control-lg, .input-group-lg > .form-control-static.form-control, .input-group-lg > .form-control-static.input-group-addon, .input-group-lg > .input-group-btn > .form-control-static.btn { padding-right: 0; padding-left: 0; } .form-control-sm, .input-group-sm > .form-control, .input-group-sm > .input-group-addon, .input-group-sm > .input-group-btn > .btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; border-radius: 0.2rem; } select.form-control-sm:not([size]):not([multiple]), .input-group-sm > select.form-control:not([size]):not([multiple]), .input-group-sm > select.input-group-addon:not([size]):not([multiple]), .input-group-sm > .input-group-btn > select.btn:not([size]):not([multiple]) { height: 1.8125rem; } .form-control-lg, .input-group-lg > .form-control, .input-group-lg > .input-group-addon, .input-group-lg > .input-group-btn > .btn { padding: 0.75rem 1.5rem; font-size: 1.25rem; border-radius: 0.3rem; } select.form-control-lg:not([size]):not([multiple]), .input-group-lg > select.form-control:not([size]):not([multiple]), .input-group-lg > select.input-group-addon:not([size]):not([multiple]), .input-group-lg > .input-group-btn > select.btn:not([size]):not([multiple]) { height: 3.166667rem; } .form-group { margin-bottom: 1rem; } .form-text { display: block; margin-top: 0.25rem; } .form-check { position: relative; display: block; margin-bottom: 0.5rem; } .form-check.disabled .form-check-label { color: #636c72; cursor: not-allowed; } .form-check-label { padding-left: 1.25rem; margin-bottom: 0; cursor: pointer; } .form-check-input { position: absolute; margin-top: 0.25rem; margin-left: -1.25rem; } .form-check-input:only-child { position: static; } .form-check-inline { display: inline-block; } .form-check-inline .form-check-label { vertical-align: middle; } .form-check-inline + .form-check-inline { margin-left: 0.75rem; } .form-control-feedback { margin-top: 0.25rem; } .form-control-success, .form-control-warning, .form-control-danger { padding-right: 2.25rem; background-repeat: no-repeat; background-position: center right 0.5625rem; -webkit-background-size: 1.125rem 1.125rem; background-size: 1.125rem 1.125rem; } .has-success .form-control-feedback, .has-success .form-control-label, .has-success .col-form-label, .has-success .form-check-label, .has-success .custom-control { color: #5cb85c; } .has-success .form-control { border-color: #5cb85c; } .has-success .input-group-addon { color: #5cb85c; border-color: #5cb85c; background-color: #eaf6ea; }';
//                                     //    var style5= '@media (min-width: 576px) { .form-inline label { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; margin-bottom: 0; } .form-inline .form-group { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-flex: 0; -webkit-flex: 0 0 auto; -ms-flex: 0 0 auto; flex: 0 0 auto; -webkit-flex-flow: row wrap; -ms-flex-flow: row wrap; flex-flow: row wrap; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; margin-bottom: 0; } .form-inline .form-control { display: inline-block; width: auto; vertical-align: middle; } .form-inline .form-control-static { display: inline-block; } .form-inline .input-group { width: auto; } .form-inline .form-control-label { margin-bottom: 0; vertical-align: middle; } .form-inline .form-check { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; width: auto; margin-top: 0; margin-bottom: 0; } .form-inline .form-check-label { padding-left: 0; } .form-inline .form-check-input { position: relative; margin-top: 0; margin-right: 0.25rem; margin-left: 0; } .form-inline .custom-control { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; padding-left: 0; } .form-inline .custom-control-indicator { position: static; display: inline-block; margin-right: 0.25rem; vertical-align: text-bottom; } .form-inline .has-feedback .form-control-feedback { top: 0; } } .btn { display: inline-block; font-weight: normal; line-height: 1.25; text-align: center; white-space: nowrap; vertical-align: middle; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; border: 1px solid transparent; padding: 0.5rem 1rem; font-size: 1rem; border-radius: 0.25rem; -webkit-transition: all 0.2s ease-in-out; -o-transition: all 0.2s ease-in-out; transition: all 0.2s ease-in-out; } .btn:focus, .btn:hover { text-decoration: none; } .btn:focus, .btn.focus { outline: 0; -webkit-box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.25); box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.25); } .btn.disabled, .btn:disabled { cursor: not-allowed; opacity: .65; } .btn:active, .btn.active { background-image: none; } a.btn.disabled, fieldset[disabled] a.btn { pointer-events: none; } .btn-primary { color: #fff; background-color: #0275d8; border-color: #0275d8; } .btn-primary:hover { color: #fff; background-color: #025aa5; border-color: #01549b; } .btn-primary:focus, .btn-primary.focus { -webkit-box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.5); box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.5); } .btn-primary.disabled, .btn-primary:disabled { background-color: #0275d8; border-color: #0275d8; } .btn-primary:active, .btn-primary.active, .show > .btn-primary.dropdown-toggle { color: #fff; background-color: #025aa5; background-image: none; border-color: #01549b; } .btn-secondary { color: #292b2c; background-color: #fff; border-color: #ccc; } .btn-secondary:hover { color: #292b2c; background-color: #e6e6e6; border-color: #adadad; } .btn-secondary:focus, .btn-secondary.focus { -webkit-box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); } .btn-secondary.disabled, .btn-secondary:disabled { background-color: #fff; border-color: #ccc; } .btn-secondary:active, .btn-secondary.active, .show > .btn-secondary.dropdown-toggle { color: #292b2c; background-color: #e6e6e6; background-image: none; border-color: #adadad; } .btn-info { color: #fff; background-color: #5bc0de; border-color: #5bc0de; } .btn-info:hover { color: #fff; background-color: #31b0d5; border-color: #2aabd2; } .btn-info:focus, .btn-info.focus { -webkit-box-shadow: 0 0 0 2px rgba(91, 192, 222, 0.5); box-shadow: 0 0 0 2px rgba(91, 192, 222, 0.5); } .btn-info.disabled, .btn-info:disabled { background-color: #5bc0de; border-color: #5bc0de; } .btn-info:active, .btn-info.active, .show > .btn-info.dropdown-toggle { color: #fff; background-color: #31b0d5; background-image: none; border-color: #2aabd2; } .btn-success { color: #fff; background-color: #5cb85c; border-color: #5cb85c; } .btn-success:hover { color: #fff; background-color: #449d44; border-color: #419641; } .btn-success:focus, .btn-success.focus { -webkit-box-shadow: 0 0 0 2px rgba(92, 184, 92, 0.5); box-shadow: 0 0 0 2px rgba(92, 184, 92, 0.5); } .btn-success.disabled, .btn-success:disabled { background-color: #5cb85c; border-color: #5cb85c; } .btn-success:active, .btn-success.active, .show > .btn-success.dropdown-toggle { color: #fff; background-color: #449d44; background-image: none; border-color: #419641; } .btn-warning { color: #fff; background-color: #f0ad4e; border-color: #f0ad4e; } .btn-warning:hover { color: #fff; background-color: #ec971f; border-color: #eb9316; } .btn-warning:focus, .btn-warning.focus { -webkit-box-shadow: 0 0 0 2px rgba(240, 173, 78, 0.5); box-shadow: 0 0 0 2px rgba(240, 173, 78, 0.5); } .btn-warning.disabled, .btn-warning:disabled { background-color: #f0ad4e; border-color: #f0ad4e; } .btn-warning:active, .btn-warning.active, .show > .btn-warning.dropdown-toggle { color: #fff; background-color: #ec971f; background-image: none; border-color: #eb9316; } .btn-danger { color: #fff; background-color: #d9534f; border-color: #d9534f; } .btn-danger:hover { color: #fff; background-color: #c9302c; border-color: #c12e2a; } .btn-danger:focus, .btn-danger.focus { -webkit-box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.5); box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.5); } .btn-danger.disabled, .btn-danger:disabled { background-color: #d9534f; border-color: #d9534f; } .btn-danger:active, .btn-danger.active, .show > .btn-danger.dropdown-toggle { color: #fff; background-color: #c9302c; background-image: none; border-color: #c12e2a; } .btn-outline-primary { color: #0275d8; background-image: none; background-color: transparent; border-color: #0275d8; } .btn-outline-primary:hover { color: #fff; background-color: #0275d8; border-color: #0275d8; } .btn-outline-primary:focus, .btn-outline-primary.focus { -webkit-box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.5); box-shadow: 0 0 0 2px rgba(2, 117, 216, 0.5); } .btn-outline-primary.disabled, .btn-outline-primary:disabled { color: #0275d8; background-color: transparent; } .btn-outline-primary:active, .btn-outline-primary.active, .show > .btn-outline-primary.dropdown-toggle { color: #fff; background-color: #0275d8; border-color: #0275d8; } .btn-outline-secondary { color: #ccc; background-image: none; background-color: transparent; border-color: #ccc; } .btn-outline-secondary:hover { color: #fff; background-color: #ccc; border-color: #ccc; } .btn-outline-secondary:focus, .btn-outline-secondary.focus { -webkit-box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); } .btn-outline-secondary.disabled, .btn-outline-secondary:disabled { color: #ccc; background-color: transparent; } .btn-outline-secondary:active, .btn-outline-secondary.active, .show > .btn-outline-secondary.dropdown-toggle { color: #fff; background-color: #ccc; border-color: #ccc; } .btn-outline-info { color: #5bc0de; background-image: none; background-color: transparent; border-color: #5bc0de; } .btn-outline-info:hover { color: #fff; background-color: #5bc0de; border-color: #5bc0de; } .btn-outline-info:focus, .btn-outline-info.focus { -webkit-box-shadow: 0 0 0 2px rgba(91, 192, 222, 0.5); box-shadow: 0 0 0 2px rgba(91, 192, 222, 0.5); } .btn-outline-info.disabled, .btn-outline-info:disabled { color: #5bc0de; background-color: transparent; } .btn-outline-info:active, .btn-outline-info.active, .show > .btn-outline-info.dropdown-toggle { color: #fff; background-color: #5bc0de; border-color: #5bc0de; } .btn-outline-success { color: #5cb85c; background-image: none; background-color: transparent; border-color: #5cb85c; } .btn-outline-success:hover { color: #fff; background-color: #5cb85c; border-color: #5cb85c; } .btn-outline-success:focus, .btn-outline-success.focus { -webkit-box-shadow: 0 0 0 2px rgba(92, 184, 92, 0.5); box-shadow: 0 0 0 2px rgba(92, 184, 92, 0.5); } .btn-outline-success.disabled, .btn-outline-success:disabled { color: #5cb85c; background-color: transparent; } .btn-outline-success:active, .btn-outline-success.active, .show > .btn-outline-success.dropdown-toggle { color: #fff; background-color: #5cb85c; border-color: #5cb85c; } .btn-outline-warning { color: #f0ad4e; background-image: none; background-color: transparent; border-color: #f0ad4e; } .btn-outline-warning:hover { color: #fff; background-color: #f0ad4e; border-color: #f0ad4e; } .btn-outline-warning:focus, .btn-outline-warning.focus { -webkit-box-shadow: 0 0 0 2px rgba(240, 173, 78, 0.5); box-shadow: 0 0 0 2px rgba(240, 173, 78, 0.5); } .btn-outline-warning.disabled, .btn-outline-warning:disabled { color: #f0ad4e; background-color: transparent; } .btn-outline-warning:active, .btn-outline-warning.active, .show > .btn-outline-warning.dropdown-toggle { color: #fff; background-color: #f0ad4e; border-color: #f0ad4e; } .btn-outline-danger { color: #d9534f; background-image: none; background-color: transparent; border-color: #d9534f; } .btn-outline-danger:hover { color: #fff; background-color: #d9534f; border-color: #d9534f; } .btn-outline-danger:focus,';
//                                     //    var style6= '.btn-outline-danger.focus { -webkit-box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.5); box-shadow: 0 0 0 2px rgba(217, 83, 79, 0.5); } .btn-outline-danger.disabled, .btn-outline-danger:disabled { color: #d9534f; background-color: transparent; } .btn-outline-danger:active, .btn-outline-danger.active, .show > .btn-outline-danger.dropdown-toggle { color: #fff; background-color: #d9534f; border-color: #d9534f; } .btn-link { font-weight: normal; color: #0275d8; border-radius: 0; } .btn-link, .btn-link:active, .btn-link.active, .btn-link:disabled { background-color: transparent; } .btn-link, .btn-link:focus, .btn-link:active { border-color: transparent; } .btn-link:hover { border-color: transparent; } .btn-link:focus, .btn-link:hover { color: #014c8c; text-decoration: underline; background-color: transparent; } .btn-link:disabled { color: #636c72; } .btn-link:disabled:focus, .btn-link:disabled:hover { text-decoration: none; } .btn-lg, .btn-group-lg > .btn { padding: 0.75rem 1.5rem; font-size: 1.25rem; border-radius: 0.3rem; } .btn-sm, .btn-group-sm > .btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; border-radius: 0.2rem; } .btn-block { display: block; width: 100%; } .btn-block + .btn-block { margin-top: 0.5rem; } input[type="submit"].btn-block, input[type="reset"].btn-block, input[type="button"].btn-block { width: 100%; } .fade { opacity: 0; -webkit-transition: opacity 0.15s linear; -o-transition: opacity 0.15s linear; transition: opacity 0.15s linear; } .fade.show { opacity: 1; } .collapse { display: none; } .collapse.show { display: block; } tr.collapse.show { display: table-row; } tbody.collapse.show { display: table-row-group; } .collapsing { position: relative; height: 0; overflow: hidden; -webkit-transition: height 0.35s ease; -o-transition: height 0.35s ease; transition: height 0.35s ease; } .dropup, .dropdown { position: relative; } .dropdown-toggle::after { display: inline-block; width: 0; height: 0; margin-left: 0.3em; vertical-align: middle; content: ""; border-top: 0.3em solid; border-right: 0.3em solid transparent; border-left: 0.3em solid transparent; } .dropdown-toggle:focus { outline: 0; } .dropup .dropdown-toggle::after { border-top: 0; border-bottom: 0.3em solid; } .dropdown-menu { position: absolute; top: 100%; left: 0; z-index: 1000; display: none; float: left; min-width: 10rem; padding: 0.5rem 0; margin: 0.125rem 0 0; font-size: 1rem; color: #292b2c; text-align: left; list-style: none; background-color: #fff; -webkit-background-clip: padding-box; background-clip: padding-box; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.25rem; } .dropdown-divider { height: 1px; margin: 0.5rem 0; overflow: hidden; background-color: #eceeef; } .dropdown-item { display: block; width: 100%; padding: 3px 1.5rem; clear: both; font-weight: normal; color: #292b2c; text-align: inherit; white-space: nowrap; background: none; border: 0; } .dropdown-item:focus, .dropdown-item:hover { color: #1d1e1f; text-decoration: none; background-color: #f7f7f9; } .dropdown-item.active, .dropdown-item:active { color: #fff; text-decoration: none; background-color: #0275d8; } .dropdown-item.disabled, .dropdown-item:disabled { color: #636c72; cursor: not-allowed; background-color: transparent; } .show > .dropdown-menu { display: block; } .show > a { outline: 0; } .dropdown-menu-right { right: 0; left: auto; } .dropdown-menu-left { right: auto; left: 0; } .dropdown-header { display: block; padding: 0.5rem 1.5rem; margin-bottom: 0; font-size: 0.875rem; color: #636c72; white-space: nowrap; } .dropdown-backdrop { position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 990; } .dropup .dropdown-menu { top: auto; bottom: 100%; margin-bottom: 0.125rem; } .btn-group, .btn-group-vertical { position: relative; display: -webkit-inline-box; display: -webkit-inline-flex; display: -ms-inline-flexbox; display: inline-flex; vertical-align: middle; } .btn-group > .btn, .btn-group-vertical > .btn { position: relative; -webkit-box-flex: 0; -webkit-flex: 0 1 auto; -ms-flex: 0 1 auto; flex: 0 1 auto; } .btn-group > .btn:hover, .btn-group-vertical > .btn:hover { z-index: 2; } .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active, .btn-group-vertical > .btn:focus, .btn-group-vertical > .btn:active, .btn-group-vertical > .btn.active { z-index: 2; } .btn-group .btn + .btn, .btn-group .btn + .btn-group, .btn-group .btn-group + .btn, .btn-group .btn-group + .btn-group, .btn-group-vertical .btn + .btn, .btn-group-vertical .btn + .btn-group, .btn-group-vertical .btn-group + .btn, .btn-group-vertical .btn-group + .btn-group { margin-left: -1px; } .btn-toolbar { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-pack: start; -webkit-justify-content: flex-start; -ms-flex-pack: start; justify-content: flex-start; } .btn-toolbar .input-group { width: auto; } .btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) { border-radius: 0; } .btn-group > .btn:first-child { margin-left: 0; } .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) { border-bottom-right-radius: 0; border-top-right-radius: 0; } .btn-group > .btn:last-child:not(:first-child), .btn-group > .dropdown-toggle:not(:first-child) { border-bottom-left-radius: 0; border-top-left-radius: 0; } .btn-group > .btn-group { float: left; } .btn-group > .btn-group:not(:first-child):not(:last-child) > .btn { border-radius: 0; } .btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle { border-bottom-right-radius: 0; border-top-right-radius: 0; } .btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child { border-bottom-left-radius: 0; border-top-left-radius: 0; } .btn-group .dropdown-toggle:active, .btn-group.open .dropdown-toggle { outline: 0; } .btn + .dropdown-toggle-split { padding-right: 0.75rem; padding-left: 0.75rem; } .btn + .dropdown-toggle-split::after { margin-left: 0; } .btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split { padding-right: 0.375rem; padding-left: 0.375rem; } .btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split { padding-right: 1.125rem; padding-left: 1.125rem; } .btn-group-vertical { display: -webkit-inline-box; display: -webkit-inline-flex; display: -ms-inline-flexbox; display: inline-flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-box-align: start; -webkit-align-items: flex-start; -ms-flex-align: start; align-items: flex-start; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; } .btn-group-vertical .btn, .btn-group-vertical .btn-group { width: 100%; } .btn-group-vertical > .btn + .btn, .btn-group-vertical > .btn + .btn-group, .btn-group-vertical > .btn-group + .btn, .btn-group-vertical > .btn-group + .btn-group { margin-top: -1px; margin-left: 0; } .btn-group-vertical > .btn:not(:first-child):not(:last-child) { border-radius: 0; } .btn-group-vertical > .btn:first-child:not(:last-child) { border-bottom-right-radius: 0; border-bottom-left-radius: 0; } .btn-group-vertical > .btn:last-child:not(:first-child) { border-top-right-radius: 0; border-top-left-radius: 0; } .btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn { border-radius: 0; } .btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child, .btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle { border-bottom-right-radius: 0; border-bottom-left-radius: 0; } .btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child { border-top-right-radius: 0; border-top-left-radius: 0; } [data-toggle="buttons"] > .btn input[type="radio"], [data-toggle="buttons"] > .btn input[type="checkbox"], [data-toggle="buttons"] > .btn-group > .btn input[type="radio"], [data-toggle="buttons"] > .btn-group > .btn input[type="checkbox"] { position: absolute; clip: rect(0, 0, 0, 0); pointer-events: none; } .input-group { position: relative; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; width: 100%; } .input-group .form-control { position: relative; z-index: 2; -webkit-box-flex: 1; -webkit-flex: 1 1 auto; -ms-flex: 1 1 auto; flex: 1 1 auto; width: 1%; margin-bottom: 0; } .input-group .form-control:focus, .input-group .form-control:active, .input-group .form-control:hover { z-index: 3; } .input-group-addon, .input-group-btn, .input-group .form-control { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-box-pack: center; -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; } .input-group-addon:not(:first-child):not(:last-child), .input-group-btn:not(:first-child):not(:last-child), .input-group .form-control:not(:first-child):not(:last-child) { border-radius: 0; } .input-group-addon, .input-group-btn { white-space: nowrap; vertical-align: middle; } .input-group-addon { padding: 0.5rem 0.75rem; margin-bottom: 0; font-size: 1rem; font-weight: normal; line-height: 1.25; color: #464a4c; text-align: center; background-color: #eceeef; border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 0.25rem; } .input-group-addon.form-control-sm, .input-group-sm > .input-group-addon, .input-group-sm > .input-group-btn > .input-group-addon.btn { padding: 0.25rem 0.5rem; font-size: 0.875rem; border-radius: 0.2rem; } .input-group-addon.form-control-lg, .input-group-lg > .input-group-addon, .input-group-lg > .input-group-btn > .input-group-addon.btn { padding: 0.75rem 1.5rem; font-size: 1.25rem; border-radius: 0.3rem; } ';
//                                     //    var style7= '.input-group-addon input[type="radio"], .input-group-addon input[type="checkbox"] { margin-top: 0; } .input-group .form-control:not(:last-child), .input-group-addon:not(:last-child), .input-group-btn:not(:last-child) > .btn, .input-group-btn:not(:last-child) > .btn-group > .btn, .input-group-btn:not(:last-child) > .dropdown-toggle, .input-group-btn:not(:first-child) > .btn:not(:last-child):not(.dropdown-toggle), .input-group-btn:not(:first-child) > .btn-group:not(:last-child) > .btn { border-bottom-right-radius: 0; border-top-right-radius: 0; } .input-group-addon:not(:last-child) { border-right: 0; } .input-group .form-control:not(:first-child), .input-group-addon:not(:first-child), .input-group-btn:not(:first-child) > .btn, .input-group-btn:not(:first-child) > .btn-group > .btn, .input-group-btn:not(:first-child) > .dropdown-toggle, .input-group-btn:not(:last-child) > .btn:not(:first-child), .input-group-btn:not(:last-child) > .btn-group:not(:first-child) > .btn { border-bottom-left-radius: 0; border-top-left-radius: 0; } .form-control + .input-group-addon:not(:first-child) { border-left: 0; } .input-group-btn { position: relative; font-size: 0; white-space: nowrap; } .input-group-btn > .btn { position: relative; -webkit-box-flex: 1; -webkit-flex: 1 1 0%; -ms-flex: 1 1 0%; flex: 1 1 0%; } .input-group-btn > .btn + .btn { margin-left: -1px; } .input-group-btn > .btn:focus, .input-group-btn > .btn:active, .input-group-btn > .btn:hover { z-index: 3; } .input-group-btn:not(:last-child) > .btn, .input-group-btn:not(:last-child) > .btn-group { margin-right: -1px; } .input-group-btn:not(:first-child) > .btn, .input-group-btn:not(:first-child) > .btn-group { z-index: 2; margin-left: -1px; } .input-group-btn:not(:first-child) > .btn:focus, .input-group-btn:not(:first-child) > .btn:active, .input-group-btn:not(:first-child) > .btn:hover, .input-group-btn:not(:first-child) > .btn-group:focus, .input-group-btn:not(:first-child) > .btn-group:active, .input-group-btn:not(:first-child) > .btn-group:hover { z-index: 3; } .custom-control { position: relative; display: -webkit-inline-box; display: -webkit-inline-flex; display: -ms-inline-flexbox; display: inline-flex; min-height: 1.5rem; padding-left: 1.5rem; margin-right: 1rem; cursor: pointer; } .custom-control-input { position: absolute; z-index: -1; opacity: 0; } .custom-control-input:checked ~ .custom-control-indicator { color: #fff; background-color: #0275d8; } .custom-control-input:focus ~ .custom-control-indicator { -webkit-box-shadow: 0 0 0 1px #fff, 0 0 0 3px #0275d8; box-shadow: 0 0 0 1px #fff, 0 0 0 3px #0275d8; } .custom-control-input:active ~ .custom-control-indicator { color: #fff; background-color: #8fcafe; } .custom-control-input:disabled ~ .custom-control-indicator { cursor: not-allowed; background-color: #eceeef; } .custom-control-input:disabled ~ .custom-control-description { color: #636c72; cursor: not-allowed; } .custom-control-indicator { position: absolute; top: 0.25rem; left: 0; display: block; width: 1rem; height: 1rem; pointer-events: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; background-color: #ddd; background-repeat: no-repeat; background-position: center center;</style></head>';
//                                     //    var newstyle=style+style2+style3+style4+style5+style6+style7;
//                                     var testdiv = '<body><div class="container"><div class="row"> <div class="col-sm-8">gfjlglffffffffffffffffffffffffffffhdlfffffffffffff <div class="row"> <div class="col-sm-6">.col-sm-6</div> <div class="col-sm-6">.col-sm-6</div> </div> </div> <div class="col-sm-4">.col-sm-4</div> </div></div>';
//                                     //var tab1 = '<div bgcolor="#e4e4e4" topmargin="0" leftmargin="0" marginheight="0" marginwidth="0" style="-webkit-font-smoothing: antialiased; width: 100% !important; background: #e4e4e4; -webkit-text-size-adjust: none;"> <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e4e4e4"> <tr> <td bgcolor="#e4e4e4" width="100%"> <table width="755" cellpadding="0" cellspacing="0" border="0" align="center" class="table"> <tr> <td width="755" class="cell"> <table align="center" style="width: 755px; height: auto; background: #fff; border: 1px solid #000; "> <tr style="border: 1px solid #000;"> <td colspan="0"> <table style="width:100%;"> <tr> <td> <div class="header"> <h2>RISK ASSESSMENT DETAILS</h2> </div></td></tr></table> </td></tr></table> <br/> <br/>';



//                                     var raname = '<div class="row"> <div class="col-md-6"> <div class="form-group"> <label for="Project Name">Project Name</label> <input class="form-control" id="Project Name" title="Project Name" type="text" class="form-control" ng-model="raData.project_name" disabled placeholder="Project Name"> </div> </div> <div class="col-md-6"> <div class="form-group"> <label for="Department">Department</label> <input class="form-control" id="Department" title="Department" type="text" class="form-control" ng-model="raData.dept" disabled placeholder="Department"> </div> </div> </div>';

//                                     var tab2 = '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table style="border: 1px solid #000;" class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"> <tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>RISK ASSESSMENT DETAILS </strong></td><td colspan="3" style="color:#666"> <div class="cst_option">';


//                                     if (typeof newsRa.country[0].color != "undefined") {
//                                         var countryColor = newsRa.country[0].color.replace(/'/g, "");

//                                     } else {
//                                         countryColor = "";

//                                     }


//                                     // // if (countryColorData.length != 0) {


//                                     // //     // countryColor = newsRa.country[0].color.replace(/'/g, "");
//                                     // //     console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzz")
//                                     // //     console.log(countryColor)
//                                     // //     if (countryColor == 'red') {
//                                     // //         var tab2A = '<label><input type="radio" class="option-input radio RED" name="example" checked/> RED </label>';
//                                     // //     } else if (countryColor == 'green') {
//                                     // //         var tab2A = '<label><input type="radio" class="option-input radio GREEN" name="example" /> GREEN </label>';
//                                     // //     } else if (countryColor == 'amber') {
//                                     // //         var tab2A = '<label><input type="radio" class="option-input radio AMBER" name="example" /> AMBER </label>';
//                                     // //     } else {
//                                     // //         var tab2A = '';
//                                     // //     }
//                                     // // } else {
//                                     // //     var tab2A = '';
//                                     // // }

//                                     // var tab2B = '</div></td></tr><tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>Status of RA :</strong></td><td colspan="3" style="color:#666">Pending</td></tr><tr style="border: 1px solid #000;"></tr><tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>Date Risk Assessment Filed : </strong></td><td colspan="3" style="color:#666">' + moment(newsRa.date_of_ra).format('MM/DD/YYYY') + '</td></tr><tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>Country of Operation: </strong></td><td colspan="3" style="color:#666">' + newsRa.country[0].name + '</td></tr><tr style="border: 1px solid #000;"> <td colspan="6"> <table style="width:100%; text-align:left;"> <tbody> <tr> <th style="width:33.3%;padding-left: 20px; height: 30px;">Project Name</th> <th style="width:33.3%; padding-left: 20px; height: 30px;">Department</th> <th style="width:33.3%;padding-left: 20px; height: 30px;">Project Code</th> </tr><tr style="border-top:1px solid #000;"> <td style="padding-left: 20px; height: 30px;">' + newsRa.project_name + '</td><td style="padding-left: 20px; height: 30px;">' + departmentArr + '</td><td style="padding-left: 20px; height: 30px;">' + newsRa.project_code + '</td></tr></tbody> </table> </td></tr><tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>Task Description : </strong></td><td colspan="3" style="color:#666">' + newsRa.description_of_task + '</td></tr><tr style="border: 1px solid #000;"> <td colspan="6"> <table style="width:100%; text-align:left;"> <tbody> <tr> <th style="width:50%;padding-left: 20px; height: 30px;">Dates of Project</th> <th style="width:50%;padding-left: 20px; height: 30px;">Project Schedule </th> </tr>';

//                                     // // var tab2C = '<tr style="border-top:1px solid #000;"> <td style="padding-left: 20px; height: 30px;"></td><td style="padding-left: 20px; height: 30px;"><p>' + newsRa.itineary_description + '</p></td></tr>';
//                                     // var tab2C = '<tr style="border-top:1px solid #000;"> <td style="padding-left: 20px; height: 30px;">' + moment(newsRa.startdate).format('MM/DD/YYYY') + ' – ' + moment(newsRa.enddate).format('MM/DD/YYYY') + '</td><td style="padding-left: 20px; height: 30px;"><p>' + newsRa.itineary_description + '</p></td></tr>';

//                                     // // var tab2C = ' ';
//                                     // // for (var i = 0; i < newsRa.itinearyArr.length; i++) {
//                                     // //     tab2C += '<tr style="border-top:1px solid #000;"> <td style="padding-left: 20px; height: 30px;">' + moment(newsRa.itinearyArr[i].itineary.startDate).format('MM/DD/YYYY') + ' – ' + moment(newsRa.itinearyArr[i].itineary.endDate).format('MM/DD/YYYY') + '</td><td style="padding-left: 20px; height: 30px;"><p>' + newsRa.itinearyArr[i].itineary_description + '</p></td></tr>';
//                                     // // };

//                                     // var tab2D = '</tbody> </table> </td></tr><tr style="border: 1px solid #000;"> <td colspan="3" style="padding-left: 20px; height: 30px;" width="200"><strong>Approving Manager(s) : </strong></td><td colspan="3" style="color:#666">' + approvingMname + '</td></tr></table> </div></td></tr></table><br/><br/><br/><br/><br/><br/>';

//                                     // var tab3 = '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table> <tr> <td> <h2>USERS (S) DETAILS:</h2></td></tr></table>';

//                                     // var tab3A = ' ';
//                                     // var medical_info_check;
//                                     // var passport_details_check;
//                                     // var mobile_number_check;

//                                     // for (var i = 0; i < newsRa.travellerTeamArr.length; i++) {

//                                     //     if (newsRa.travellerTeamArr[i].medical_info) {
//                                     //         medical_info_check = 'Completed';
//                                     //     } else {
//                                     //         medical_info_check = 'Pending';
//                                     //     }

//                                     //     if (newsRa.travellerTeamArr[i].passport_details) {
//                                     //         passport_details_check = 'Completed';
//                                     //     } else {

//                                     //         passport_details_check = 'Pending';
//                                     //     }

//                                     //     if (newsRa.travellerTeamArr[i].mobile_number) {
//                                     //         mobile_number_check = newsRa.travellerTeamArr[i].mobile_number;
//                                     //     }

//                                     //     tab3A += '<table class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;" width="172"><strong>Name:</strong></td><td style="color:#666"><strong>' + newsRa.travellerTeamArr[i].firstname + ' ' + newsRa.travellerTeamArr[i].lastname + '</strong></td><td style="padding-left: 20px; height: 30px;" width="172"><strong>Department: </strong></td><td style="color:#666"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Email:</strong></td><td style="color:#666"><strong> ' + newsRa.travellerTeamArr[i].email + ' </strong></td><td style="padding-left: 20px; height: 30px;"><strong>Mobile:</strong></td><td style="color:#666"><strong>' + mobile_number_check + '</strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Passport details and NOK :</strong></td><td style="color:#666"><strong>' + passport_details_check + '</strong></td><td style="padding-left: 20px; height: 30px;"><strong>Medical Details :</strong></td><td style="color:#666"><strong>' + medical_info_check + '</strong></td></tr></table>';

//                                     // };

//                                     // var tab3B = '</div></td></tr></table><br/>';

//                                     // var tab4 = '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table> <tr> <td> <h2>RISKS IDENTFIED </h2></td></tr></table> <table class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"> <tr style="border: 1px solid #000;"> <th style="padding-left: 20px; height: 30px; color:#666; width:170"><strong>Risk mitigation</strong></th> <th style="color:#666"><strong>Best Practice Advice </strong></th> <th style="color:#666" width="200"><strong>User completed</strong></th> </tr>';
//                                     // var tab4A = ' ';
//                                     // for (var i = 0; i < queData.length; i++) {
//                                     //     tab4A += '<tr style="border: 1px solid #000; color:#666"> <td style="color:#666; vertical-align: baseline;"> <p>' + queData[i].question + '</p></td><td style="color:#666">' + queData[i].best_practice_advice + '</td><td style="color:#666; vertical-align: baseline;">' + queData[i].specific_mitigation + '</td></tr>';
//                                     // }
//                                     // var tab4B = '</table> </div></td></tr></table><br/>';

//                                     // var tab5 = ' ';
//                                     // for (var i = 0; i < supplierData.length; i++) {
//                                     //     var personTypeSupp = supplierData[i].client_admin_id ? 'Admin' : 'Traveller';
//                                     //     tab5 += '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table> <tr> <td> <h2>SUPPLIER (' + personTypeSupp + ')</h2></td></tr></table> <br/> <table class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"> <tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px; width:30%;"><strong>Name:</strong>' + supplierData[i].supplier_name + '</td><td style="color:#666 ; width:25%;"><strong></strong></td><td style="padding-left: 20px; height: 30px; width:22%"><strong>Service: </strong>' + supplierData[i].service_provided + '</td><td style="color:#666; width:23%;"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Country:</strong>' + supplierData[i].country + '</td><td style="color:#666"><strong></strong></td><td style="padding-left: 20px; height: 30px;"><strong>City: </strong>' + supplierData[i].city + '</td><td style="color:#666"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Day Rate:</strong>' + (supplierData[i].rate == true ? 'Yes' : 'No') + '</td><td style="color:#666"><strong></strong></td><td style="padding-left: 20px; height: 30px;"><strong>Currency: </strong>' + supplierData[i].currency + '</td><td style="color:#666"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Was the supplier recommended:</strong></td><td style="color:#666"><strong></strong></td><td style="padding-left: 20px; height: 30px;"><strong>If so by whom: </strong></td><td style="color:#666"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;" colspan="2"><strong>What rating was the supplier recommended with:</strong></td><td style="color:#666" colspan="2"><strong></strong></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Okay to use :</strong></td><td style="color:#666"><strong></strong></td><td style="padding-left: 20px; height: 30px;" width=""><strong>Use with caution : </strong></td><td style="color:#666"><strong></strong></td></tr></table> </div></td></tr></table> <br/>';
//                                     // }

//                                     // var tab6 = ' ';
//                                     // for (var i = 0; i < communicationData.length; i++) {
//                                     //     var personTypeComm = communicationData[i].client_admin_id ? 'Admin' : 'Traveller';
//                                     //     tab6 += '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table> <tr> <td> <h2>Communications (' + personTypeComm + ')</h2></td></tr><tr> <td style="padding-left: 20px; height: 30px;"> <p>list of all local numbers of team including IMEI if not in traveller profile already</p></td></tr></table> <table class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%">';

//                                     //     for (var j = 0; j < communicationData[i].details_of_team.length; j++) {
//                                     //         tab6 += '<tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px; width:50%"><strong>Name :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].details_of_team[j].name + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Local Number :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].details_of_team[j].local_number + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>IME :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].details_of_team[j].imei + '</p></td></tr>';
//                                     //     };

//                                     //     tab6 += '<tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;" colspan="2"> <p>List of local contacts in adddtion to fixer who can be contacted in case of emergency</p></td></tr>';
//                                     //     var comm_cont_email;
//                                     //     for (var k = 0; k < communicationData[i].emergency_contact.length; k++) {
//                                     //         if (communicationData[i].emergency_contact[k].email) {
//                                     //             comm_cont_email = communicationData[i].emergency_contact[k].email;
//                                     //         }
//                                     //         tab6 += '<tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Name :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].emergency_contact[k].name + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Role :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].emergency_contact[k].role + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong> Number :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].emergency_contact[k].number + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Email :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + comm_cont_email + '</p></td></tr>';
//                                     //     }

//                                     //     for (var l = 0; l < communicationData[i].call_in_schedule.length; l++) {
//                                     //         tab6 += '<tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Call In Schedule :</strong></td><td style="padding-left: 20px; height: 30px;"> <p></p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Number Of Check In :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].call_in_schedule[l].number_of_checkin + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>1 Check In Time :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].call_in_schedule[l].one_check_in_time + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>2 Check In Time :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].call_in_schedule[l].two_check_in_time + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Point Of Contact :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + communicationData[i].call_in_schedule[l].point_of_contact + '</p></td></tr>';
//                                     //     }

//                                     //     tab6 += '<tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Detail an overdue procedure (how many hours before concern/ is there a telephone cascade system):</strong></td><td style="padding-left: 20px; height: 30px;"> <p></p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Do you want to receive a text reminder 15 minutes before your check in time :</strong></td><td style="padding-left: 20px; height: 30px;"> <p></p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Do you want your POC to receive a text reminder if you are X hours late with your check in     :</strong></td><td style="padding-left: 20px; height: 30px;"> <p></p></td></tr></table> </div></td></tr></table><br/>';
//                                     // };

//                                     // var tab7 = ' ';
//                                     // for (var i = 0; i < contingencyData.length; i++) {
//                                     //     var personTypeCont = contingencyData[i].client_admin_id ? 'Admin' : 'Traveller';
//                                     //     tab7 += '<table align="center" style="width: 755px; height: auto; background: #fff; padding-bottom: 15px;"> <tr> <td> <div class="header_sub"> <table> <tr> <td> <h2>Contingencies (' + personTypeCont + ')</h2></td></tr></table> <table class="tp01" cellpadding="0" cellspacing="0" border="0" align="center" width="100%"> <tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px; width:50%"><strong>What medical provision/skill is there to treat a casualty at point of injury :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + contingencyData[i].medical_provision + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Detail method of evacuation to nearest hospital(self drive/ambulance) :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + contingencyData[i].method_of_evacuation + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Detail nearest hospital, address, number :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + contingencyData[i].detail_nearest_hospital + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Medevac Company :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + contingencyData[i].medevac_company + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Specialist kit being taken :</strong></td><td style="padding-left: 20px; height: 30px;"> <p></p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong> Sat Phone/ Number :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + (contingencyData[i].sat_phone_number == true ? 'Yes' : 'No') + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Tracker/ID :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + (contingencyData[i].tracker_id == true ? 'Yes' : 'No') + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>First Aid Kit :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + (contingencyData[i].first_aid_kit == true ? 'Yes' : 'No') + '</p></td></tr><tr style="border: 1px solid #000;"> <td style="padding-left: 20px; height: 30px;"><strong>Personal Protective Equipment :</strong></td><td style="padding-left: 20px; height: 30px;"> <p>' + (contingencyData[i].personal_protective_equipment == true ? 'Yes' : 'No') + '</p></td></tr></table> </div></td></tr></table> <br/>';
//                                     // };

//                                     // var tab8 = '<table align="center" style="width: 755px; height: auto; background: #fff; padding:5px; color:#666;"> <tr> <td style="padding-left: 20px; font-size:14px;"><strong>ANY OTHER INFORMATION</strong></td></tr><tr> <td style="padding-left: 20px; font-size:14px;"><strong>' + newsRa.relevant_info + '</strong></td></tr></table> <br/> </table> </td><td></td></tr></table></body></html>';
//                                     // //var html = header + head_end + testdiv + raname + tab2 + tab2A + tab2B + tab2C + tab2D + tab3 + tab3A + tab3B + tab4 + tab4A + tab4B + tab5 + tab6 + tab7 + tab8;

//                                     // //   var finalHtml = html
//                                     // // console.log(html)
//                                     var departmentArray = [];
//                                     newsRa.department.forEach(item => {
//                                         departmentArray.push(item.department_name);
//                                     });
//                                     console.log('newsRanewsRa', newsRa.department);
//                                     var first = '<!doctype html> <html class="no-js" ng-app="superadmin"> <head> <meta charset="utf-8"> <title>Riskpal</title> <meta name="description" content=""> <meta name="viewport" content="width=device-width">';
//                                     var second = '<style> html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:bold}dfn{font-style:italic}h1{font-size:1em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:60%}sub,sup{font-size:65%;line-height:0;position:relative;vertical-align:baseline}sup{top:-0.5em}sub{bottom:-0.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0}input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{height:auto}input[type="search"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:bold}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}@media print{*{text-shadow:none !important;color:#000 !important;background:transparent !important;box-shadow:none !important}a,a:visited{text-decoration:underline}a[href]:after{content:" (" attr(href) ")"}abbr[title]:after{content:" (" attr(title) ")"}a[href^="javascript:"]:after,a[href^="#"]:after{content:""}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100% !important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}select{background:#fff !important}.navbar{display:none}.table td,.table th{background-color:#fff !important}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000 !important}.label{border:1px solid #000}.table{border-collapse:collapse !important}.table-bordered th,.table-bordered td{border:1px solid #ddd !important}}.glyphicon-asterisk:before{content:"\2a"}.glyphicon-plus:before{content:"\2b"}.glyphicon-euro:before{content:"\20ac"}.glyphicon-minus:before{content:"\2212"}.glyphicon-cloud:before{content:"\2601"}.glyphicon-envelope:before{content:"\2709"}.glyphicon-pencil:before{content:"\270f"}.glyphicon-glass:before{content:"\e001"}.glyphicon-music:before{content:"\e002"}.glyphicon-search:before{content:"\e003"}.glyphicon-heart:before{content:"\e005"}.glyphicon-star:before{content:"\e006"}.glyphicon-star-empty:before{content:"\e007"}.glyphicon-user:before{content:"\e008"}.glyphicon-film:before{content:"\e009"}.glyphicon-th-large:before{content:"\e010"}.glyphicon-th:before{content:"\e011"}.glyphicon-th-list:before{content:"\e012"}.glyphicon-ok:before{content:"\e013"}.glyphicon-remove:before{content:"\e014"}.glyphicon-zoom-in:before{content:"\e015"}.glyphicon-zoom-out:before{content:"\e016"}.glyphicon-off:before{content:"\e017"}.glyphicon-signal:before{content:"\e018"}.glyphicon-cog:before{content:"\e019"}.glyphicon-trash:before{content:"\e020"}.glyphicon-home:before{content:"\e021"}.glyphicon-file:before{content:"\e022"}.glyphicon-time:before{content:"\e023"}.glyphicon-road:before{content:"\e024"}.glyphicon-download-alt:before{content:"\e025"}.glyphicon-download:before{content:"\e026"}.glyphicon-upload:before{content:"\e027"}.glyphicon-inbox:before{content:"\e028"}.glyphicon-play-circle:before{content:"\e029"}.glyphicon-repeat:before{content:"\e030"}.glyphicon-refresh:before{content:"\e031"}.glyphicon-list-alt:before{content:"\e032"}.glyphicon-lock:before{content:"\e033"}.glyphicon-flag:before{content:"\e034"}.glyphicon-headphones:before{content:"\e035"}.glyphicon-volume-off:before{content:"\e036"}.glyphicon-volume-down:before{content:"\e037"}.glyphicon-volume-up:before{content:"\e038"}.glyphicon-qrcode:before{content:"\e039"}.glyphicon-barcode:before{content:"\e040"}.glyphicon-tag:before{content:"\e041"}.glyphicon-tags:before{content:"\e042"}.glyphicon-book:before{content:"\e043"}.glyphicon-bookmark:before{content:"\e044"}.glyphicon-print:before{content:"\e045"}.glyphicon-camera:before{content:"\e046"}.glyphicon-font:before{content:"\e047"}.glyphicon-bold:before{content:"\e048"}.glyphicon-italic:before{content:"\e049"}.glyphicon-text-height:before{content:"\e050"}.glyphicon-text-width:before{content:"\e051"}.glyphicon-align-left:before{content:"\e052"}.glyphicon-align-center:before{content:"\e053"}.glyphicon-align-right:before{content:"\e054"}.glyphicon-align-justify:before{content:"\e055"}.glyphicon-list:before{content:"\e056"}.glyphicon-indent-left:before{content:"\e057"}.glyphicon-indent-right:before{content:"\e058"}.glyphicon-facetime-video:before{content:"\e059"}.glyphicon-picture:before{content:"\e060"}.glyphicon-map-marker:before{content:"\e062"}.glyphicon-adjust:before{content:"\e063"}.glyphicon-tint:before{content:"\e064"}.glyphicon-edit:before{content:"\e065"}.glyphicon-share:before{content:"\e066"}.glyphicon-check:before{content:"\e067"}.glyphicon-move:before{content:"\e068"}.glyphicon-step-backward:before{content:"\e069"}.glyphicon-fast-backward:before{content:"\e070"}.glyphicon-backward:before{content:"\e071"}.glyphicon-play:before{content:"\e072"}.glyphicon-pause:before{content:"\e073"}.glyphicon-stop:before{content:"\e074"}.glyphicon-forward:before{content:"\e075"}.glyphicon-fast-forward:before{content:"\e076"}.glyphicon-step-forward:before{content:"\e077"}.glyphicon-eject:before{content:"\e078"}.glyphicon-chevron-left:before{content:"\e079"}.glyphicon-chevron-right:before{content:"\e080"}.glyphicon-plus-sign:before{content:"\e081"}.glyphicon-minus-sign:before{content:"\e082"}.glyphicon-remove-sign:before{content:"\e083"}.glyphicon-ok-sign:before{content:"\e084"}.glyphicon-question-sign:before{content:"\e085"}.glyphicon-info-sign:before{content:"\e086"}.glyphicon-screenshot:before{content:"\e087"}.glyphicon-remove-circle:before{content:"\e088"}.glyphicon-ok-circle:before{content:"\e089"}.glyphicon-ban-circle:before{content:"\e090"}.glyphicon-arrow-left:before{content:"\e091"}.glyphicon-arrow-right:before{content:"\e092"}.glyphicon-arrow-up:before{content:"\e093"}.glyphicon-arrow-down:before{content:"\e094"}.glyphicon-share-alt:before{content:"\e095"}.glyphicon-resize-full:before{content:"\e096"}.glyphicon-resize-small:before{content:"\e097"}.glyphicon-exclamation-sign:before{content:"\e101"}.glyphicon-gift:before{content:"\e102"}.glyphicon-leaf:before{content:"\e103"}.glyphicon-fire:before{content:"\e104"}.glyphicon-eye-open:before{content:"\e105"}.glyphicon-eye-close:before{content:"\e106"}.glyphicon-warning-sign:before{content:"\e107"}.glyphicon-plane:before{content:"\e108"}.glyphicon-calendar:before{content:"\e109"}.glyphicon-random:before{content:"\e110"}.glyphicon-comment:before{content:"\e111"}.glyphicon-magnet:before{content:"\e112"}.glyphicon-chevron-up:before{content:"\e113"}.glyphicon-chevron-down:before{content:"\e114"}.glyphicon-retweet:before{content:"\e115"}.glyphicon-shopping-cart:before{content:"\e116"}.glyphicon-folder-close:before{content:"\e117"}.glyphicon-folder-open:before{content:"\e118"}.glyphicon-resize-vertical:before{content:"\e119"}.glyphicon-resize-horizontal:before{content:"\e120"}.glyphicon-hdd:before{content:"\e121"}.glyphicon-bullhorn:before{content:"\e122"}.glyphicon-bell:before{content:"\e123"}.glyphicon-certificate:before{content:"\e124"}.glyphicon-thumbs-up:before{content:"\e125"}.glyphicon-thumbs-down:before{content:"\e126"}.glyphicon-hand-right:before{content:"\e127"}.glyphicon-hand-left:before{content:"\e128"}.glyphicon-hand-up:before{content:"\e129"}.glyphicon-hand-down:before{content:"\e130"}.glyphicon-circle-arrow-right:before{content:"\e131"}.glyphicon-circle-arrow-left:before{content:"\e132"}.glyphicon-circle-arrow-up:before{content:"\e133"}.glyphicon-circle-arrow-down:before{content:"\e134"}.glyphicon-globe:before{content:"\e135"}.glyphicon-wrench:before{content:"\e136"}.glyphicon-tasks:before{content:"\e137"}.glyphicon-filter:before{content:"\e138"}.glyphicon-briefcase:before{content:"\e139"}.glyphicon-fullscreen:before{content:"\e140"}.glyphicon-dashboard:before{content:"\e141"}.glyphicon-paperclip:before{content:"\e142"}.glyphicon-heart-empty:before{content:"\e143"}.glyphicon-link:before{content:"\e144"}.glyphicon-phone:before{content:"\e145"}.glyphicon-pushpin:before{content:"\e146"}.glyphicon-usd:before{content:"\e148"}.glyphicon-gbp:before{content:"\e149"}.glyphicon-sort:before{content:"\e150"}.glyphicon-sort-by-alphabet:before{content:"\e151"}.glyphicon-sort-by-alphabet-alt:before{content:"\e152"}.glyphicon-sort-by-order:before{content:"\e153"}.glyphicon-sort-by-order-alt:before{content:"\e154"}.glyphicon-sort-by-attributes:before{content:"\e155"}.glyphicon-sort-by-attributes-alt:before{content:"\e156"}.glyphicon-unchecked:before{content:"\e157"}.glyphicon-expand:before{content:"\e158"}.glyphicon-collapse-down:before{content:"\e159"}.glyphicon-collapse-up:before{content:"\e160"}.glyphicon-log-in:before{content:"\e161"}.glyphicon-flash:before{content:"\e162"}.glyphicon-log-out:before{content:"\e163"}.glyphicon-new-window:before{content:"\e164"}';
//                                     var third = '.glyphicon-record:before{content:"\e165"}.glyphicon-save:before{content:"\e166"}.glyphicon-open:before{content:"\e167"}.glyphicon-saved:before{content:"\e168"}.glyphicon-import:before{content:"\e169"}.glyphicon-export:before{content:"\e170"}.glyphicon-send:before{content:"\e171"}.glyphicon-floppy-disk:before{content:"\e172"}.glyphicon-floppy-saved:before{content:"\e173"}.glyphicon-floppy-remove:before{content:"\e174"}.glyphicon-floppy-save:before{content:"\e175"}.glyphicon-floppy-open:before{content:"\e176"}.glyphicon-credit-card:before{content:"\e177"}.glyphicon-transfer:before{content:"\e178"}.glyphicon-cutlery:before{content:"\e179"}.glyphicon-header:before{content:"\e180"}.glyphicon-compressed:before{content:"\e181"}.glyphicon-earphone:before{content:"\e182"}.glyphicon-phone-alt:before{content:"\e183"}.glyphicon-tower:before{content:"\e184"}.glyphicon-stats:before{content:"\e185"}.glyphicon-sd-video:before{content:"\e186"}.glyphicon-hd-video:before{content:"\e187"}.glyphicon-subtitles:before{content:"\e188"}.glyphicon-sound-stereo:before{content:"\e189"}.glyphicon-sound-dolby:before{content:"\e190"}.glyphicon-sound-5-1:before{content:"\e191"}.glyphicon-sound-6-1:before{content:"\e192"}.glyphicon-sound-7-1:before{content:"\e193"}.glyphicon-copyright-mark:before{content:"\e194"}.glyphicon-registration-mark:before{content:"\e195"}.glyphicon-cloud-download:before{content:"\e197"}.glyphicon-cloud-upload:before{content:"\e198"}.glyphicon-tree-conifer:before{content:"\e199"}.glyphicon-tree-deciduous:before{content:"\e200"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*:before,*:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10px;line-height:1.42857143;color:#333;background-color:#fff}input,button,select,textarea{font-family:inherit;font-size:12px;line-height:inherit}a{color:#428bca;text-decoration:none}a:hover,a:focus{color:#2a6496;text-decoration:underline}a:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.img-responsive,.thumbnail>img,.thumbnail a>img,.carousel-inner>.item>img,.carousel-inner>.item>a>img{display:block;width:100% \9;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;display:inline-block;width:100% \9;max-width:100%;height:auto}.img-circle{border-radius:50%}.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small,.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 .small,h2 .small,h3 .small,h4 .small,h5 .small,h6 .small,.h1 .small,.h2 .small,.h3 .small,.h4 .small,.h5 .small,.h6 .small{font-weight:normal;line-height:1;color:#777}h1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px}h1 small,.h1 small,h2 small,.h2 small,h3 small,.h3 small,h1 .small,.h1 .small,h2 .small,.h2 .small,h3 .small,.h3 .small{font-size:55%}h4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px}h4 small,.h4 small,h5 small,.h5 small,h6 small,.h6 small,h4 .small,.h4 .small,h5 .small,.h5 .small,h6 .small,.h6 .small{font-size:65%}h1,.h1{font-size:20px}h2,.h2{font-size:18px}h3,.h3{font-size:16px}h4,.h4{font-size:16px}h5,.h5{font-size:14px}h6,.h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}small,.small{font-size:65%}cite{font-style:normal}mark,.mark{background-color:#fcf8e3;padding:.2em}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#428bca}a.text-primary:hover{color:#3071a9}.text-success{color:#3c763d}a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#428bca}a.bg-primary:hover{background-color:#3071a9}.bg-success{background-color:#dff0d8}a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ul,ol{margin-top:0;margin-bottom:10px}ul ul,ol ul,ul ol,ol ol{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none;margin-left:-5px}.list-inline>li{display:inline-block;padding-left:5px;padding-right:5px}dl{margin-top:0;margin-bottom:20px}dt,dd{line-height:1.42857143}dt{font-weight:bold}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;clear:left;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[title],abbr[data-original-title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote p:last-child,blockquote ul:last-child,blockquote ol:last-child{margin-bottom:0}blockquote footer,blockquote small,blockquote .small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote footer:before,blockquote small:before,.blockquote-reverse footer:before,blockquote.pull-right footer:before,.blockquote-reverse small:before,blockquote.pull-right small:before,.blockquote-reverse .small:before,blockquote.pull-right .smal,blockquote.pull-right footer:after,.blockquote-reverse small:after,blockquote.pull-right small:after,.blockquote-reverse .small:after,blockquote.pull-right ,blockquote:after{content:""}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,"Courier New",monospace}code{padding:2px 4px;font-size:70%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:70%;color:#fff;background-color:#333;border-radius:3px;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25)}kbd kbd{padding:0;font-size:100%;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px} .container-fluid{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}.row{margin-left:-15px;margin-right:-15px}.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position:relative;min-height:1px;padding-left:15px;padding-right:15px}.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}';
//                                     var fourth = '.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>thead>tr>td{border-bottom-width:2px}.table-striped>tbody>tr:nth-child(odd)>td,.table-striped>tbody>tr:nth-child(odd)>th{background-color:#f9f9f9}.table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th{background-color:#f5f5f5}table col[class*="col-"]{position:static;float:none;display:table-column}table td[class*="col-"],table th[class*="col-"]{position:static;float:none;display:table-cell}.table>thead>tr>td.active,.table>tbody>tr>td.active,.table>tfoot>tr>td.active,.table>thead>tr>th.active,.table>tbody>tr>th.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>tbody>tr.active>td,.table>tfoot>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr.active>th,.table>tfoot>tr.active>th{background-color:#f5f5f5}.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover,.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr.active:hover>th{background-color:#e8e8e8}.table>thead>tr>td.success,.table>tbody>tr>td.success,.table>tfoot>tr>td.success,.table>thead>tr>th.success,.table>tbody>tr>th.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>tbody>tr.success>td,.table>tfoot>tr.success>td,.table>thead>tr.success>th,.table>tbody>tr.success>th,.table>tfoot>tr.success>th{background-color:#dff0d8}.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover,.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr.success:hover>th{background-color:#d0e9c6}.table>thead>tr>td.info,.table>tbody>tr>td.info,.table>tfoot>tr>td.info,.table>thead>tr>th.info,.table>tbody>tr>th.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>tbody>tr.info>td,.table>tfoot>tr.info>td,.table>thead>tr.info>th,.table>tbody>tr.info>th,.table>tfoot>tr.info>th{background-color:#d9edf7}.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover,.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr.info:hover>th{background-color:#c4e3f3}.table>thead>tr>td.warning,.table>tbody>tr>td.warning,.table>tfoot>tr>td.warning,.table>thead>tr>th.warning,.table>tbody>tr>th.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>tbody>tr.warning>td,.table>tfoot>tr.warning>td,.table>thead>tr.warning>th,.table>tbody>tr.warning>th,.table>tfoot>tr.warning>th{background-color:#fcf8e3}.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr.warning:hover>th{background-color:#faf2cc}.table>thead>tr>td.danger,.table>tbody>tr>td.danger,.table>tfoot>tr>td.danger,.table>thead>tr>th.danger,.table>tbody>tr>th.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>tbody>tr.danger>td,.table>tfoot>tr.danger>td,.table>thead>tr.danger>th,.table>tbody>tr.danger>th,.table>tfoot>tr.danger>th{background-color:#f2dede}';
//                                     var fivth = '.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover,.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr.danger:hover>th{background-color:#ebcccc}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;overflow-x:auto;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd;-webkit-overflow-scrolling:touch}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>thead>tr>th,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tfoot>tr>td{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>thead>tr>th:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.table-responsive>.table-bordered>thead>tr>th:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>th,.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>td{border-bottom:0}}fieldset{padding:0;margin:0;border:0;min-width:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:16px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:bold}input[type="search"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type="radio"],input[type="checkbox"]{margin:4px 0 0;margin-top:1px \9;line-height:normal}input[type="file"]{display:block}input[type="range"]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type="file"]:focus,input[type="radio"]:focus,input[type="checkbox"]:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:24px;padding:6px 12px;font-size:10px;line-height:1.42857143;color:#555;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6)}.form-control::-moz-placeholder{color:#777;opacity:1}.form-control:-ms-input-placeholder{color:#777}.form-control::-webkit-input-placeholder{color:#777}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{cursor:not-allowed;background-color:#eee;opacity:1}textarea.form-control{height:auto}input[type="search"]{-webkit-appearance:none}input[type="date"],input[type="time"],input[type="datetime-local"],input[type="month"]{line-height:34px;line-height:1.42857143 \0}input[type="date"].input-sm,input[type="time"].input-sm,input[type="datetime-local"].input-sm,input[type="month"].input-sm{line-height:30px}input[type="date"].input-lg,input[type="time"].input-lg,input[type="datetime-local"].input-lg,input[type="month"].input-lg{line-height:46px}.form-group{margin-bottom:15px}.radio,.checkbox{position:relative;display:block;min-height:20px;margin-top:10px;margin-bottom:10px}.radio label,.checkbox label{padding-left:20px;margin-bottom:0;font-weight:normal;cursor:pointer}.radio input[type="radio"],.radio-inline input[type="radio"],.checkbox input[type="checkbox"],.checkbox-inline input[type="checkbox"]{position:absolute;margin-left:-20px;margin-top:4px \9}.radio+.radio,.checkbox+.checkbox{margin-top:-5px}.radio-inline,.checkbox-inline{display:inline-block;padding-left:20px;margin-bottom:0;vertical-align:middle;font-weight:normal;cursor:pointer}.radio-inline+.radio-inline,.checkbox-inline+.checkbox-inline{margin-top:0;margin-left:10px}input[type="radio"][disabled],input[type="checkbox"][disabled],input[type="radio"].disabled,input[type="checkbox"].disabled,fieldset[disabled] input[type="radio"],fieldset[disabled] input[type="checkbox"]{cursor:not-allowed}.radio-inline.disabled,.checkbox-inline.disabled,fieldset[disabled] .radio-inline,fieldset[disabled] .checkbox-inline{cursor:not-allowed}.radio.disabled label,.checkbox.disabled label,fieldset[disabled] .radio label,fieldset[disabled] .checkbox label{cursor:not-allowed}.form-control-static{padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-left:0;padding-right:0}.input-sm,.form-horizontal .form-group-sm .form-control{height:30px;padding:5px 10px;font-size:8px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}textarea.input-sm,select[multiple].input-sm{height:auto}.input-lg,.form-horizontal .form-group-lg .form-control{height:46px;padding:10px 16px;font-size:12px;line-height:1.33;border-radius:6px}select.input-lg{height:46px;line-height:46px}textarea.input-lg,select[multiple].input-lg{height:auto}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:25px;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center}.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .help-block,.has-success .control-label,.has-success .radio,.has-success .checkbox,.has-success .radio-inline,.has-success .checkbox-inline{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;border-color:#3c763d;background-color:#dff0d8}.has-success .form-control-feedback{color:#3c763d}.has-warning .help-block,.has-warning .control-label,.has-warning .radio,.has-warning .checkbox,.has-warning .radio-inline,.has-warning .checkbox-inline{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;border-color:#8a6d3b;background-color:#fcf8e3}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .help-block,.has-error .control-label,.has-error .radio,.has-error .checkbox,.has-error .radio-inline,.has-error .checkbox-inline{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;border-color:#a94442;background-color:#f2dede}.has-error .form-control-feedback{color:#a94442}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn,.form-inline .input-group .form-control{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .radio,.form-inline .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .radio label,.form-inline .checkbox label{padding-left:0}.form-inline .radio input[type="radio"],.form-inline .checkbox input[type="checkbox"]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .radio,.form-horizontal .checkbox,.form-horizontal .radio-inline,.form-horizontal .checkbox-inline{margin-top:0;margin-bottom:0;padding-top:7px}.form-horizontal .radio,.form-horizontal .checkbox{min-height:27px}.form-horizontal .form-group{margin-left:-15px;margin-right:-15px}@media (min-width:768px){.form-horizontal .control-label{text-align:right;margin-bottom:0;padding-top:7px}}';
//                                     var sixth = '.form-horizontal .has-feedback .form-control-feedback{top:0;right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:14.3px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px}}.btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn:focus,.btn:active:focus,.btn.active:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn:hover,.btn:focus{color:#333;text-decoration:none}.btn:active,.btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;pointer-events:none;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default:hover,.btn-default:focus,.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled,.btn-default[disabled],fieldset[disabled] .btn-default,.btn-default.disabled:hover,.btn-default[disabled]:hover,fieldset[disabled] .btn-default:hover,.btn-default.disabled:focus,.btn-default[disabled]:focus,fieldset[disabled] .btn-default:focus,.btn-default.disabled:active,.btn-default[disabled]:active,fieldset[disabled] .btn-default:active,.btn-default.disabled.active,.btn-default[disabled].active,fieldset[disabled] .btn-default.active{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#428bca;border-color:#357ebd}.btn-primary:hover,.btn-primary:focus,.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#3071a9;border-color:#285e8e}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled,.btn-primary[disabled],fieldset[disabled] .btn-primary,.btn-primary.disabled:hover,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary:hover,.btn-primary.disabled:focus,.btn-primary[disabled]:focus,fieldset[disabled] .btn-primary:focus,.btn-primary.disabled:active,.btn-primary[disabled]:active,fieldset[disabled] .btn-primary:active,.btn-primary.disabled.active,.btn-primary[disabled].active,fieldset[disabled] .btn-primary.active{background-color:#428bca;border-color:#357ebd}.btn-primary .badge{color:#428bca;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success:hover,.btn-success:focus,.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled,.btn-success[disabled],fieldset[disabled] .btn-success,.btn-success.disabled:hover,.btn-success[disabled]:hover,fieldset[disabled] .btn-success:hover,.btn-success.disabled:focus,.btn-success[disabled]:focus,fieldset[disabled] .btn-success:focus,.btn-success.disabled:active,.btn-success[disabled]:active,fieldset[disabled] .btn-success:active,.btn-success.disabled.active,.btn-success[disabled].active,fieldset[disabled] .btn-success.active{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info:hover,.btn-info:focus,.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled,.btn-info[disabled],fieldset[disabled] .btn-info,.btn-info.disabled:hover,.btn-info[disabled]:hover,fieldset[disabled] .btn-info:hover,.btn-info.disabled:focus,.btn-info[disabled]:focus,fieldset[disabled] .btn-info:focus,.btn-info.disabled:active,.btn-info[disabled]:active,fieldset[disabled] .btn-info:active,.btn-info.disabled.active,.btn-info[disabled].active,fieldset[disabled] .btn-info.active{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning:hover,.btn-warning:focus,.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled,.btn-warning[disabled],fieldset[disabled] .btn-warning,.btn-warning.disabled:hover,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning:hover,.btn-warning.disabled:focus,.btn-warning[disabled]:focus,fieldset[disabled] .btn-warning:focus,.btn-warning.disabled:active,.btn-warning[disabled]:active,fieldset[disabled] .btn-warning:active,.btn-warning.disabled.active,.btn-warning[disabled].active,fieldset[disabled] .btn-warning.active{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger:hover,.btn-danger:focus,.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled,.btn-danger[disabled],fieldset[disabled] .btn-danger,.btn-danger.disabled:hover,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger:hover,.btn-danger.disabled:focus,.btn-danger[disabled]:focus,fieldset[disabled] .btn-danger:focus,.btn-danger.disabled:active,.btn-danger[disabled]:active,fieldset[disabled] .btn-danger:active,.btn-danger.disabled.active,.btn-danger[disabled].active,fieldset[disabled] .btn-danger.active{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{color:#428bca;font-weight:normal;cursor:pointer;border-radius:0}.btn-link,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:hover,.btn-link:focus,.btn-link:active{border-color:transparent}.btn-link:hover,.btn-link:focus{color:#2a6496;text-decoration:underline;background-color:transparent}.btn-link[disabled]:hover,fieldset[disabled] .btn-link:hover,.btn-link[disabled]:focus,fieldset[disabled] .btn-link:focus{color:#777;text-decoration:none}.btn-lg,.btn-group-lg>.btn{padding:10px 16px;font-size:18px;line-height:1.33;border-radius:6px}.btn-sm,.btn-group-sm>.btn{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-xs,.btn-group-xs>.btn{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type="submit"].btn-block,input[type="reset"].btn-block,input[type="button"].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition:height .35s ease;-o-transition:height .35s ease;transition:height .35s ease}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;font-size:14px;text-align:left;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.175);box-shadow:0 6px 12px rgba(0,0,0,0.175);background-clip:padding-box}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:hover,.dropdown-menu>li>a:focus{text-decoration:none;color:#262626;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:hover,.dropdown-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#428bca}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{color:#777}.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:not-allowed}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{left:auto;right:0}.dropdown-menu-left{left:0;right:auto}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}';
//                                     var seventh = '.dropdown-backdrop{position:fixed;left:0;right:0;bottom:0;top:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{border-top:0;border-bottom:4px solid;content:""}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:1px}@media (min-width:768px){.navbar-right .dropdown-menu{left:auto;right:0}.navbar-right .dropdown-menu-left{left:0;right:auto}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group>.btn,.btn-group-vertical>.btn{position:relative;float:left}.btn-group>.btn:hover,.btn-group-vertical>.btn:hover,.btn-group>.btn:focus,.btn-group-vertical>.btn:focus,.btn-group>.btn:active,.btn-group-vertical>.btn:active,.btn-group>.btn.active,.btn-group-vertical>.btn.active{z-index:2}.btn-group>.btn:focus,.btn-group-vertical>.btn:focus{outline:0}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child>.btn:last-child,.btn-group>.btn-group:first-child>.dropdown-toggle{border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn-group:last-child>.btn:first-child{border-bottom-left-radius:0;border-top-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-left:8px;padding-right:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-left:12px;padding-right:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-bottom-left-radius:4px;border-top-right-radius:0;border-top-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-right-radius:0;border-top-left-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{float:none;display:table-cell;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle="buttons"]>.btn>input[type="radio"],[data-toggle="buttons"]>.btn>input[type="checkbox"]{position:absolute;z-index:-1;opacity:0;filter:alpha(opacity=0)}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*="col-"]{float:none;padding-left:0;padding-right:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.33;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn,select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn,select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn{height:auto}.input-group-addon,.input-group-btn,.input-group .form-control{display:table-cell}.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child),.input-group .form-control:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:normal;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type="radio"],.input-group-addon input[type="checkbox"]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group-btn:last-child>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-top-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:first-child>.btn-group:not(:first-child)>.btn{border-bottom-left-radius:0;border-top-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:hover,.input-group-btn>.btn:focus,.input-group-btn>.btn:active{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{margin-left:-1px}.nav{margin-bottom:0;padding-left:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:hover,.nav>li>a:focus{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#777;text-decoration:none;background-color:transparent;cursor:not-allowed}.nav .open>a,.nav .open>a:hover,.nav .open>a:focus{background-color:#eee;border-color:#428bca}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#555;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent;cursor:default}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:hover,.nav-pills>li.active>a:focus{color:#fff;background-color:#428bca}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}';
//                                     var eight = '@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-right-radius:0;border-top-left-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{overflow-x:visible;padding-right:15px;padding-left:15px;border-top:1px solid transparent;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);-webkit-overflow-scrolling:touch}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;box-shadow:none}.navbar-collapse.collapse{display:block !important;height:auto !important;padding-bottom:0;overflow:visible !important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{padding-left:0;padding-right:0}}.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:340px}@media (max-width:480px) and (orientation:landscape){.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:200px}}.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-top,.navbar-fixed-bottom{position:fixed;right:0;left:0;z-index:1030;-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}@media (min-width:768px){.navbar-fixed-top,.navbar-fixed-bottom{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;padding:15px 15px;font-size:18px;line-height:20px;height:50px}.navbar-brand:hover,.navbar-brand:focus{text-decoration:none}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;margin-right:15px;padding:9px 10px;margin-top:8px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;box-shadow:none}.navbar-nav .open .dropdown-menu>li>a,.navbar-nav .open .dropdown-menu .dropdown-header{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:hover,.navbar-nav .open .dropdown-menu>li>a:focus{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}.navbar-nav.navbar-right:last-child{margin-right:-15px}}@media (min-width:768px){.navbar-left{float:left !important;float:left}.navbar-right{float:right !important;float:right}}.navbar-form{margin-left:-15px;margin-right:-15px;padding:10px 15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);margin-top:8px;margin-bottom:8px}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn,.navbar-form .input-group .form-control{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .radio,.navbar-form .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .radio label,.navbar-form .checkbox label{padding-left:0}.navbar-form .radio input[type="radio"],.navbar-form .checkbox input[type="checkbox"]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}}@media (min-width:768px){.navbar-form{width:auto;border:0;margin-left:0;margin-right:0;padding-top:0;padding-bottom:0;-webkit-box-shadow:none;box-shadow:none}.navbar-form.navbar-right:last-child{margin-right:-15px}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-right-radius:0;border-top-left-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-left:15px;margin-right:15px}.navbar-text.navbar-right:last-child{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:hover,.navbar-default .navbar-brand:focus{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:hover,.navbar-default .navbar-nav>li>a:focus{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:hover,.navbar-default .navbar-nav>.active>a:focus{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:hover,.navbar-default .navbar-nav>.disabled>a:focus{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:hover,.navbar-default .navbar-nav>.open>a:focus{background-color:#e7e7e7;color:#555}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:hover,.navbar-default .btn-link:focus{color:#333}.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:hover,.navbar-default .btn-link[disabled]:focus,fieldset[disabled] .navbar-default .btn-link:focus{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#777}.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-brand:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#777}.navbar-inverse .navbar-nav>li>a{color:#777}.navbar-inverse .navbar-nav>li>a:hover,.navbar-inverse .navbar-nav>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:hover,.navbar-inverse .navbar-nav>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:hover,.navbar-inverse .navbar-nav>.disabled>a:focus{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:hover,.navbar-inverse .navbar-toggle:focus{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:hover,.navbar-inverse .navbar-nav>.open>a:focus{background-color:#080808;color:#fff}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#777}';
//                                     var nine = '.padding-0{padding:0}.paragraph-style{align:justify;background:white;border-radius: 4px; padding: 6px 12px;line-height: 1.42857143;border: 1px solid #ccc;}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#777}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#777}.navbar-inverse .btn-link:hover,.navbar-inverse .btn-link:focus{color:#fff}.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:hover,.navbar-inverse .btn-link[disabled]:focus,fieldset[disabled] .navbar-inverse .btn-link:focus{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{content:"/\00a0";padding:0 5px;color:#ccc}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;line-height:1.42857143;text-decoration:none;color:#428bca;background-color:#fff;border:1px solid #ddd;margin-left:-1px}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-bottom-left-radius:4px;border-top-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-bottom-right-radius:4px;border-top-right-radius:4px}.pagination>li>a:hover,.pagination>li>span:hover,.pagination>li>a:focus,.pagination>li>span:focus{color:#2a6496;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{z-index:2;color:#fff;background-color:#428bca;border-color:#428bca;cursor:default}.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus{color:#777;background-color:#fff;border-color:#ddd;cursor:not-allowed}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-bottom-left-radius:6px;border-top-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-bottom-right-radius:6px;border-top-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-bottom-left-radius:3px;border-top-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-bottom-right-radius:3px;border-top-right-radius:3px}.pager{padding-left:0;margin:20px 0;list-style:none;text-align:center}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:hover,.pager li>a:focus{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:hover,.pager .disabled>a:focus,.pager .disabled>span{color:#777;background-color:#fff;cursor:not-allowed}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:bold;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:hover,a.label:focus{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:hover,.label-default[href]:focus{background-color:#5e5e5e}.label-primary{background-color:#428bca}.label-primary[href]:hover,.label-primary[href]:focus{background-color:#3071a9}.label-success{background-color:#5cb85c}.label-success[href]:hover,.label-success[href]:focus{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:hover,.label-info[href]:focus{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:hover,.label-warning[href]:focus{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:hover,.label-danger[href]:focus{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:bold;color:#fff;line-height:1;vertical-align:baseline;white-space:nowrap;text-align:center;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-xs .badge{top:0;padding:1px 5px}a.badge:hover,a.badge:focus{color:#fff;text-decoration:none;cursor:pointer}a.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#428bca;background-color:#fff}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron h1,.jumbotron .h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron{border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron{padding-left:60px;padding-right:60px}.jumbotron h1,.jumbotron .h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.thumbnail>img,.thumbnail a>img{margin-left:auto;margin-right:auto}a.thumbnail:hover,a.thumbnail:focus,a.thumbnail.active{border-color:#428bca}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:bold}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{background-color:#dff0d8;border-color:#d6e9c6;color:#3c763d}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{background-color:#d9edf7;border-color:#bce8f1;color:#31708f}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{background-color:#fcf8e3;border-color:#faebcc;color:#8a6d3b}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{background-color:#f2dede;border-color:#ebccd1;color:#a94442}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{overflow:hidden;height:20px;margin-bottom:20px;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#428bca;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-striped .progress-bar,.progress-bar-striped{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-size:40px 40px}.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar[aria-valuenow="1"],.progress-bar[aria-valuenow="2"]{min-width:30px}.progress-bar[aria-valuenow="0"]{color:#777;min-width:30px;background-color:transparent;background-image:none;box-shadow:none}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-info{background-color:#5bc0de}';
//                                     var ten = '@media all {.section1{page-break-after: always !important;} .traveltest{page-break-before:always !important}.form-group {page-break-inside: avoid;display:block !important;} }.form-group{page-break-inside: avoid !important;display:block !important;}.traveltest{page-break-before:always !important}.section1{page-break-after: always !important;}</style> </head> <body>';
//                                     var leven = `<section class="content" style="margin:20px !important" id="myTemplate">
                                     
//                                         <div class="row">  
//                                             <div class="col-xs-12"> 
//                                                 <div class="box box-primary"> 
//                                                     <div class="box-header with-border">
//                                                         <h4 class="box-title">
//                                                             <u>Section 1: Risk Assessment Details</u>
//                                                         </h4> 
//                                                     </div> 
//                                                     <div class="box-body"> 
//                                                         <div ng-if="showLoader" class="col-lg-7 pull-right"> 
//                                                             <div loader-css="ball-pulse">
//                                                             </div> 
//                                                         </div> 
//                                                         <div class="row"> 
//                                                             <div class="col-xs-12"> 
//                                                                 <div class="form-group"> 
//                                                                     <label for="Project Name">Project Name </label>
//                                                                     <input class="form-control" id="Project Name" 
//                                                                         ng-bind="project_name" type="text" 
//                                                                         class="form-control" 
//                                                                         value="${newsRa.project_name}" disabled 
//                                                                         placeholder="Project Name"> 
//                                                                 </div> 
//                                                             </div>
//                                                         </div> 
//                                                         <div class="row"> 
//                                                             <div class="col-xs-12"> 
//                                                                 <div class="form-group"> 
//                                                                     <label for="Department">Department</label> 
//                                                                     <p>${departmentArray}</p> 
//                                                                 </div> 
//                                                             </div> 
//                                                         </div> 
//                                                         <div class="row">
//                                                         <div class="col-xs-12 padding-0"> 
//                                                             <div class="col-xs-3"> 
//                                                                 <div class="form-group"> 
//                                                                     <label for="StartDate">Start Date</label> 
//                                                                     <input class="form-control" id="StartDate" title="Start Date" 
//                                                                         type="text" class="form-control" ng-model="startdate" 
//                                                                         value="${st_date}" disabled placeholder="Date of RA"> 
//                                                                 </div> 
//                                                             </div> 
//                                                             <div class="col-xs-3"> 
//                                                                 <div class="form-group"> 
//                                                                     <label for="enddate">End Date</label> 
//                                                                     <input class="form-control" id="enddate" title="End Date"
//                                                                         type="text" class="form-control" ng-model="enddate" 
//                                                                         value="${ed_date}" disabled placeholder="End Date"> 
//                                                                 </div> 
//                                                             </div>
//                                                             </div>
//                                                         </div>`;
//                                     var aftlabel = '';
//                                     if (newsRa.authorcheck == 0) {
//                                         aftlabel += `<div class="row"> 
//                                             <div class="col-xs-12">
//                                                 <div class="form-group"> 
//                                                     <label for="StartDate">Approving Manager</label> 
//                                                     <input style="width:50% !important" class="form-control" 
//                                                         id="StartDate" title="Approving" type="text" class="form-control"  
//                                                         value="${newsRa.approvingManager[0].firstname}" "
//                                                         ${newsRa.approvingManager[0].lastname}" disabled 
//                                                         placeholder="Approving Manager"> 
//                                                 </div> 
//                                             </div>
//                                         </div> <br/>`;
//                                     } else if (newsRa.authorcheck == 1) {
//                                         aftlabel += `<div class="row"> 
//                                             <div class="col-xs-6">
//                                                 <div class="form-group"> 
//                                                     <label for="StartDate">Approving Manager</label> 
//                                                     <input  class="form-control" id="StartDate" title="Approving" 
//                                                         type="text" class="form-control"  
//                                                         value="${newsRa.approvingManager[0].firstname}" " 
//                                                         ${newsRa.approvingManager[0].lastname}" disabled 
//                                                         placeholder="Approving Manager"> 
//                                                 </div> 
//                                             </div> 
//                                             <div class="col-xs-6">
//                                                 <div class="form-group"> 
//                                                     <label for="StartDate">Author</label>
//                                                     <input  class="form-control" id="StartDate" title="Author" 
//                                                         type="text" class="form-control"  
//                                                         value="${newsRa.author_id.firstname} " "
//                                                         ${newsRa.author_id.lastname}" disabled placeholder="Author">
//                                                 </div>
//                                             </div>
//                                         </div> <br/>`;
//                                     }
//                                     aftlabel += '<div class="row"> <div class="col-xs-12"> <label for="TaskDescription">Task Description</label> <div  class="paragraph-style">' + newsRa.description_of_task + '</div> </div> </div> <br/> <div class="row"> <div class="col-xs-12"> <label for="TaskDescription">Itinerary Description</label> <div class="paragraph-style" >' + newsRa.itineary_description + '</div> </div> </div> <br/>';
//                                     if (newsRa.types_of_ra_id.countryrequired == true) {


//                                         // var aftlabel2 = `
//                                         //     <div class="row"> 
//                                         //         <div class="col-xs-12"> 
//                                         //             <label for="TaskDescription">Country Risk Overview</label> 
//                                         //             <div style="background-color:#FFFFFF !important;">
//                                         //                 <img src="${graph}" width="300" height="150">
//                                         //             </div>
//                                         //         </div>
//                                         //     </div>`;
//                                         var aftlabel4 = '';
//                                         countryMatrixData.forEach((item, key) => {
//                                             var countrycolorname = "";
//                                             if (item.country_id.color == "amber") {
//                                                 countrycolorname = "Amber";
//                                                 var inputstyle = 'style="background-color:rgb(255, 194, 0) !important;"';
//                                             } else if (item.country_id.color == "red") {

//                                                 countrycolorname = "Red";

//                                                 inputstyle = 'style="background-color:red !important;"';

//                                             } else if (item.country_id.color == "green") {

//                                                 countrycolorname = "Green";


//                                                 inputstyle = 'style="background-color:green !important;"';
//                                             }

//                                             // var inputstyle='style=background-color:green !important;';

//                                             //  '  style="' +countryColor+ '" == "amber"? {"background-color":"#ffc200" !important }:'+ countryColor+' =="red" ? { "background-color": red !important } : '+ countryColor+' == "green" ? { "background-color": green !important}:{ "background-color": gray !important }" ';

//                                             if (item.description == undefined || null) {
//                                                 var countryDescription = '';
//                                             } else {
//                                                 var countryDescription = item.description;
//                                             }
//                                             if (item.security == undefined || null) {
//                                                 var checkSecurity = '';
//                                             } else {
//                                                 checkSecurity = item.security;
//                                             }
//                                             aftlabel4 += `<br/>
//                                                 <div class="row">
//                                                     <div class="col-xs-12">
//                                                         <h1>${item.country_id.name}</h1>
//                                                     </div>
//                                                 </div>`;

//                                             aftlabel4 += `
//                                                 <div class="row">
//                                                 <div class="col-xs-12 padding-0"> 
//                                                     <div class="col-xs-3"> 
//                                                         <div class="form-group"> 
//                                                             <label for="Country">Country</label> 
//                                                             <input  class="form-control" id="Country" 
//                                                                 title="Country" type="text" 
//                                                                 class="form-control" ng-model="raData.countryArr" 
//                                                                 value="${item.country_id.name}" disabled placeholder="Country"> 
//                                                         </div> 
//                                                     </div> 
//                                                     <div class="col-xs-3"> 
//                                                         <div class="form-group"> 
//                                                             <label for="Classification">Classification</label> 
//                                                             <input ${inputstyle} class="form-control" id="Classification" 
//                                                                 title="Classification" type="text" 
//                                                                 class="form-control" ng-model="raData.countrycolor"
//                                                                 value ="${countrycolorname}" disabled 
//                                                                 placeholder="Classification"> 
//                                                         </div>
//                                                         </div> 
//                                                     </div> 
//                                                 </div>`;

//                                             if (Array.isArray(graph)) {
//                                                 aftlabel4 += `
//                                                     <div class="row"> 
//                                                         <div class="col-xs-12"> 
//                                                             <label for="TaskDescription">Country Risk Overview</label> 
//                                                             <div style="background-color:#FFFFFF !important;">
//                                                                 <img src="${graph[key]}" width="300" height="150">
//                                                             </div>
//                                                         </div>
//                                                     </div>`;
//                                             }

//                                             aftlabel4 += `
//                                                 <div class="row"> 
//                                                     <div class="col-xs-12"> 
//                                                         <div class="" style="margin:left !important"> 
//                                                             <label for="des">Description</label> 
//                                                             <span><p align="justify">${countryDescription}</p></span>
//                                                         </div> 
//                                                     </div> 
//                                                 </div> 
//                                                 <div class="row"> 
//                                                     <div class="col-xs-12"> 
//                                                         <div class=""> 
//                                                             <label for="sec">Security</label> 
//                                                             <span><p align="justify">${checkSecurity}</p></span> 
//                                                         </div> 
//                                                     </div> 
//                                                 </div> 
//                                                 </div> </div><br />`;
//                                         })

//                                     } else {
//                                         // aftlabel2 = '';
//                                         aftlabel4 = '';
//                                     }
//                                     var travellerdiv = '<div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style= "border: 1 !important; border-top: 2px dotted #4863A0 !important;"><div class="box box-primary traveltest"  > <div class="box-header with-border"> <h4 class="box-title"><u>Section 2: Traveller Details</u></h4> </div> <div class="box-body"><h6><u>Primary Traveller:</u></h6> <div class="row"> <div class="col-xs-4"> <div class="form-group"> <label for="travellerFirstName">Name</label> <input class="form-control" id="travellerFirstName" title="Traveller First Name" type="text" class="form-control" ng-model="raData.traveller_id.firstname" value="' + traveller.firstname + ' ' + traveller.lastname + ' " disabled placeholder="Traveller First Name"> </div> </div>  <div class="col-xs-5"> <div class="form-group"> <label for="Email">Email</label> <input class="form-control" id="Email" title="Traveller Email" type="text" class="form-control" value="' + traveller.email + '" disabled placeholder="Email"> </div> </div> <div class="col-xs-3"> <div class="form-group"> <label for="MobileNumber">Mobile Number</label> <input class="form-control" id="MobileNumber" title="Mobile Number" type="text" class="form-control" value="' + traveller.mobile_number + '" disabled placeholder="Mobile Number"> </div> </div> </div>';

//                                     var passportdet = '';
//                                     traveller.passport_data.forEach(function (passportdata) {

//                                         passportdet += '<div class="row"> <div class="col-xs-3"> <div class="form-group"> <label for="Nationality">Nationality</label> <input class="form-control" id="Nationality" title="Nationality" type="text" class="form-control" ng-model="passportObj.nationality" value="' + passportdata.nationality + '" disabled placeholder="Nationality"> </div> </div> <div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Passport Number</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control" ng-model="passportObj.passport_number" value="' + passportdata.passport_number + '" disabled placeholder="Passport Number"> </div> </div><div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Valid From</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control" ng-model="passportObj.passport_number" value="' + passportdata.issuedate + '" disabled placeholder=""> </div> </div><div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Expiry</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control"  value="' + passportdata.expirydate + '" disabled > </div> </div> </div>';


//                                     })

//                                     if (typeof traveller.passport_details.emergency_contact == "undefined") {

//                                         traveller.passport_details.emergency_contact = {
//                                             full_name: "",
//                                             mobile_number: "",
//                                             email: "",
//                                             relationship_to_you: "",
//                                             alternative_full_name: "",
//                                             alternative_mobile_number: "",
//                                             alternative_email: "",
//                                             alternative_relationship_to_you: "",


//                                         };
//                                     }

//                                     travellerdiv += `<div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="emergency">Emergency Name</label>
//                                             <input class="form-control" id="emergency" title="emergency" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.full_name + ` "
//                                                 disabled placeholder="Name">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Email</label>
//                                             <input class="form-control" id="DateofBirth" title="Passport Number" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.email + `"
//                                                 disabled placeholder="Email">
//                                         </div>
//                                     </div>
//                                     </div>
//                                     <div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="emergency">Mobile Number</label>
//                                             <input class="form-control" id="emergency" title="Mobile" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.mobile_number + ` "
//                                                 disabled placeholder="Mobile">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Relationship</label>
//                                             <input class="form-control" id="DateofBirth" title="Relationship" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.relationship_to_you + `"
//                                                 disabled placeholder="Relationship">
//                                         </div>
//                                     </div>
//                                     </div>`;


//                                     travellerdiv += `<div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="emergency">Alternative Contact</label>
//                                             <input class="form-control" id="emergency" title="emergency" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.alternative_full_name + ` "
//                                                 disabled placeholder="Name">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Email</label>
//                                             <input class="form-control" id="DateofBirth" title="Passport Number" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.alternative_email + `"
//                                                 disabled placeholder="Email">
//                                         </div>
//                                     </div>
//                                     </div>
//                                     <div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="emergency">Mobile</label>
//                                             <input class="form-control" id="emergency" title="Mobile" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.alternative_mobile_number + ` "
//                                                 disabled placeholder="Contact">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Relationship</label>
//                                             <input class="form-control" id="DateofBirth" title="Relationship" type="text" class="form-control" value=" `+ traveller.passport_details.emergency_contact.alternative_relationship_to_you + `"
//                                                 disabled placeholder="Relationship">
//                                         </div>
//                                     </div>
//                                     </div>`;


//                                     var travellerend = '</div</div><br />';

//                                     var othertravellerdiv = "";

//                                     if (typeof newsRa.travellerTeamArr != "undefined" && Array.isArray(newsRa.travellerTeamArr)) {

//                                         if (newsRa.travellerTeamArr.length > 0) {

//                                             othertravellerdiv += '<br><br><br><div class="box box-primary" > <div class="box-header with-border"> </div><div class="box-body"><h6><u>Other Traveller:</u></h6>';
//                                         }

//                                         var otherpassportdet = '';


//                                         newsRa.travellerTeamArr.forEach(function (teamarr) {
//                                             // console.log(teamarr.passport_details.emergency_contact.full_name)

//                                             if (typeof teamarr.passport_details.emergency_contact == "undefined") {

//                                                 teamarr.passport_details.emergency_contact = {
//                                                     full_name: "",
//                                                     mobile_number: "",
//                                                     email: "",
//                                                     relationship_to_you: "",
//                                                     alternative_full_name: "",
//                                                     alternative_mobile_number: "",
//                                                     alternative_email: "",
//                                                     alternative_relationship_to_you: "",


//                                                 };
//                                             }


//                                             othertravellerdiv += '  <div class="row"> <div class="col-xs-4"> <div class="form-group"> <label for="travellerFirstName">Name</label> <input class="form-control" id="travellerFirstName" title="Traveller First Name" type="text" class="form-control" ng-model="raData.traveller_id.firstname" value="' + teamarr.firstname + ' ' + teamarr.lastname + ' " disabled placeholder="Traveller First Name"> </div> </div>  <div class="col-xs-5"> <div class="form-group"> <label for="Email">Email</label> <input class="form-control" id="Email" title="Traveller Email" type="text" class="form-control" value="' + teamarr.email + '" disabled placeholder="Email"> </div> </div> <div class="col-xs-3"> <div class="form-group"> <label for="MobileNumber">Mobile Number</label> <input class="form-control" id="MobileNumber" title="Mobile Number" type="text" class="form-control" value="' + teamarr.mobile_number + '" disabled placeholder="Mobile Number"> </div> </div> </div>';

//                                             teamarr.passport_data.forEach(function (passportdata) {

//                                                 othertravellerdiv += '<div class="row"> <div class="col-xs-3"> <div class="form-group"> <label for="Nationality">Nationality</label> <input class="form-control" id="Nationality" title="Nationality" type="text" class="form-control" ng-model="passportObj.nationality" value="' + passportdata.nationality + '" disabled placeholder="Nationality"> </div> </div> <div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Passport Number</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control" ng-model="passportObj.passport_number" value="' + passportdata.passport_number + '" disabled placeholder="Passport Number"> </div> </div><div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Valid From</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control" ng-model="passportObj.passport_number" value="' + passportdata.issuedate + '" disabled placeholder=""> </div> </div><div class="col-xs-3"> <div class="form-group"> <label for="DateofBirth">Expiry</label> <input class="form-control" id="DateofBirth" title="Travellers Date Of Birth" type="text" class="form-control"  value="' + passportdata.expirydate + '" disabled > </div> </div> </div>';


//                                             })





//                                             othertravellerdiv += `<div class="row">
//                                         <div class="col-xs-6">
//                                             <div class="form-group">
//                                                 <label for="emergency">Emergency Name</label>
//                                                 <input class="form-control" id="emergency" title="emergency" type="text" class="form-control" value=" `+ teamarr.passport_details.emergency_contact.full_name + ` "
//                                                     disabled placeholder="Name">
//                                             </div>
//                                         </div>
//                                         <div class="col-xs-6">
//                                             <div class="form-group">
//                                                 <label for="DateofBirth">Email</label>
//                                                 <input class="form-control" id="DateofBirth" title="Passport Number" type="text" class="form-control" value=" `+ teamarr.passport_details.emergency_contact.email + `"
//                                                     disabled placeholder="Email">
//                                             </div>
//                                         </div>
//                                         </div>`;
//                                             othertravellerdiv += `<div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Mobile</label>
//                                             <input class="form-control" id="DateofBirth" title="Traveller Date Of Birth" type="text" class="form-control" value=" `+ teamarr.passport_details.emergency_contact.mobile_number + `"
//                                                 disabled placeholder="Contact">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="Relationship">Relationship</label>
//                                             <input class="form-control" id="Relationship" title="Traveller Date Of Birth" type="text" class="form-control" value="` + teamarr.passport_details.emergency_contact.relationship_to_you + `"
//                                                 disabled placeholder="Relationship">
//                                         </div>
//                                     </div>
//                                     </div>`
//                                             othertravellerdiv += `<div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Alternative Contact</label>
//                                             <input class="form-control" id="DateofBirth" title="Traveller Date Of Birth" type="text" class="form-control" value=" `+ teamarr.passport_details.emergency_contact.alternative_full_name + `"
//                                                 disabled placeholder="Name">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="Relationship">Email</label>
//                                             <input class="form-control" id="Relationship" title="Traveller Date Of Birth" type="text" class="form-control" value="` + teamarr.passport_details.emergency_contact.alternative_email + `"
//                                                 disabled placeholder="Email">
//                                         </div>
//                                     </div>
//                                     </div>`
//                                             othertravellerdiv += `<div class="row">
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="DateofBirth">Mobile</label>
//                                             <input class="form-control" id="DateofBirth" title="Traveller Date Of Birth" type="text" class="form-control" value=" `+ teamarr.passport_details.emergency_contact.alternative_mobile_number + `"
//                                                 disabled placeholder="Contact">
//                                         </div>
//                                     </div>
//                                     <div class="col-xs-6">
//                                         <div class="form-group">
//                                             <label for="Relationship">Relationship</label>
//                                             <input class="form-control" id="Relationship" title="Traveller Date Of Birth" type="text" class="form-control" value="` + teamarr.passport_details.emergency_contact.alternative_relationship_to_you + `"
//                                                 disabled placeholder="Relationship">
//                                         </div>
//                                     </div>
//                                     </div>`



//                                         })
//                                         var othertravellerend = '</div</div><br />';
//                                     }

//                                     if (newsRa.types_of_ra_id.supplierRequired == true) {


//                                         var supplier_details = '<div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style= " border-top: 2px dotted #4863A0 !important;"><div class="box box-primary" > <div class="box-header with-border"><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <h4 class="box-title"><u>Section 3: Logistics</u></h4> </div> <div class="box-body">';

//                                         supplierData.forEach(function (supplier) {

//                                             if (typeof supplier.supplier_name == "undefined" || supplier.supplier_name == null) {
//                                                 supplier.supplier_name = "";
//                                             }

//                                             if (typeof supplier.number == "undefined" || supplier.number == null) {
//                                                 supplier.number = "";
//                                             }

//                                             if (typeof supplier.email == "undefined" || supplier.email == null) {
//                                                 supplier.email = "";
//                                             }

//                                             if (typeof supplier.country == "undefined" || supplier.country == null) {
//                                                 supplier.country = "";
//                                             }
//                                             if (typeof supplier.city == "undefined" || supplier.city == null) {
//                                                 supplier.city = "";
//                                             }

//                                             if (typeof supplier.cost == "undefined" || supplier.cost == null) {
//                                                 supplier.cost = "";
//                                             }

//                                             if (typeof supplier.currency == "undefined" || supplier.currency == null) {
//                                                 supplier.currency = "";
//                                             }
//                                             if (supplier.service_provided == "Accomodation") {
//                                                 supplier.service_provided = "Accommodation";
//                                             }

//                                             supplier_details += '<div class="row" ng-repeat="supplier in supplier"> <div class="col-xs-6"> <div class="form-group"> <label for="sName">Supplier Name</label> <input class="form-control" id="sName" type="text" placeholder="Name" disabled value="' + supplier.supplier_name + '" title="Name"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="ServiceProvided">Service Provided</label> <input class="form-control" id="ServiceProvided" type="text" placeholder="Service Provided" disabled title="Service Provided" value="' + supplier.service_provided + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="ContactNumber">Mobile Number</label> <input class="form-control" type="text" id="ContactNumber" placeholder="Contact Number" disabled title="Contact Number" value="' + supplier.number + '" /> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="ContactNumber">Email</label> <input class="form-control" type="text" id="ContactNumber" placeholder="Email" disabled title="Contact Number" value="' + supplier.email + '" /> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCountry">Country</label> <input class="form-control" id="sCountry" type="text" placeholder="Country" disabled value="' + supplier.country + '" title="Country"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCountry">City</label> <input class="form-control" id="sCountry" type="text" placeholder="City" disabled value="' + supplier.city + '" title="Country"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCost">Cost per Day</label> <input class="form-control" id="sCost" type="text" placeholder="Cost" disabled title="Cost" value="' + supplier.cost + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCurrency">Currency</label> <input class="form-control" id="sCurrency" type="text" placeholder="Currency" disabled title="Currency" value="' + supplier.currency + '"> </div> </div>';

//                                             if (typeof supplier.sourcing != "undefined" && (supplier.sourcing != null) && supplier.sourced_by == null) {
//                                                 supplier_details += '<div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Sourcing</label> <input class="form-control" id="sCurrency" type="text" placeholder="Sourcing" disabled title="Currency" value="' + supplier.sourcing + '"> </div> </div>';

//                                                 if (supplier.sourcing == "other") {

//                                                     supplier_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Other Information</label> <p align="justify">' + supplier.more_info + '</p> </div> </div> ';

//                                                 } else if (supplier.who_recommended != '' && supplier.who_recommended != null) {

//                                                     supplier_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Recommended by</label> <input class="form-control" id="sName" type="text" placeholder="Name" disabled value="' + supplier.who_recommended + '" title="Name"> </div> </div> </br>';

//                                                 }

//                                             }
//                                             else if (typeof supplier.sourced_by != "undefined" && supplier.sourced_by != null && supplier.sourcing == null) {
//                                                 supplier_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Recommended by</label> <input class="form-control" id="sName" type="text" placeholder="Name" disabled value="' + supplier.sourced_by + '" title="Name"> </div> </div>';

//                                             }



//                                             //  supplier_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Recommended by</label> <p align="justify">' + supplier.sourced_by + '</p> </div> </div>';


//                                             supplier_details += '</div></div>';

//                                         })

//                                         if (typeof supplierData.description != "undefined" && supplierData.description != "null") {

//                                             supplier_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Description</label> <p align="justify">' + supplierData.description + '</p> </div> </div>';

//                                         }

//                                         var supplierend = '</div> </div><br />';
//                                     } else {
//                                         supplier_details = '';
//                                         supplierend = '';

//                                     }

//                                     if (newsRa.types_of_ra_id.communicationRequired == true) {
//                                         var sno_comm = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired) ? 4 : 3;


//                                         var communication_details = '<div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style=" border-top: 2px dotted #4863A0 !important;"> <div class="box box-primary"> <div class="box-header with-border"> </div> <div class="box-body">';

//                                         communication_details += ' <br/><br/><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <h4 class="box-title"> <u>Section ' + sno_comm + ': Communications</u> </h4> <h5> <u> Team Contacts </u> </h5>';

//                                         communicationData.forEach(function (communicationd) {


//                                             communicationd.details_of_team.forEach(function (teamdetails) {

//                                                 if (typeof teamdetails.name == "undefined" || teamdetails.name == null) {
//                                                     teamdetails.name = "";
//                                                 }

//                                                 if (typeof teamdetails.local_number == "undefined" || teamdetails.local_number == null) {
//                                                     teamdetails.local_number = "";
//                                                 }

//                                                 if (typeof teamdetails.imei == "undefined" || teamdetails.imei == null) {
//                                                     teamdetails.imei = "";
//                                                 }

//                                                 communication_details += '<div class="row"> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">Name</label> <input class="form-control" type="text" disabled title="Currency" value="' + teamdetails.name + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">Local Mobile Number</label> <input class="form-control" type="text" disabled title="Currency" value="' + teamdetails.local_number + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">IMEI</label> <input class="form-control" type="text" disabled title="Currency" value="' + teamdetails.imei + '"> </div> </div> </div>';

//                                             })



//                                         })

//                                         communication_details += '<br/><br/> <div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><h5> <u> Emergency Details </u> </h5>';


//                                         communicationData.forEach(function (communicationd) {


//                                             communicationd.emergency_contact.forEach(function (emergency) {

//                                                 if (typeof emergency.name == "undefined" || emergency.name == null) {
//                                                     emergency.name = "";
//                                                 }

//                                                 if (typeof emergency.number == "undefined" || emergency.number == null) {
//                                                     emergency.number = "";
//                                                 }

//                                                 if (typeof emergency.role == "undefined" || emergency.role == null) {
//                                                     emergency.role = "";
//                                                 }
//                                                 if (typeof emergency.email == "undefined" || emergency.email == null) {
//                                                     emergency.email = "";
//                                                 }

//                                                 communication_details += '<div class="row"> <div class="col-xs-6"> <div class="form-group"> <label for="sCurrency">Name</label> <input class="form-control" type="text" disabled title="Currency" value="' + emergency.name + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCurrency">Role</label> <input class="form-control" type="text" disabled title="Currency" value="' + emergency.role + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCurrency">Mobile Number</label> <input class="form-control" type="text" disabled title="Currency" value="' + emergency.number + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="sCurrency">Email</label> <input class="form-control" type="text" disabled title="Currency" value="' + emergency.email + '"> </div> </div> </div>';


//                                             })



//                                         })

//                                         communication_details += '<br/> <h5> <u> Check-in Schedule </u> </h5>';


//                                         communicationData.forEach(function (communicationd) {

//                                             if (typeof communicationd.no_of_checkin == "undefined" || communicationd.no_of_checkin == null) {
//                                                 communicationd.no_of_checkin = "";
//                                             }

//                                             if (communicationd.timezone == undefined || null) {
//                                                 var checkTimezone = '';
//                                             } else {
//                                                 checkTimezone = communicationd.timezone;
//                                             }
//                                             communication_details += '<div class="container"> <div class="row"> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">No. of Check-ins </label> <input class="form-control" type="text" disabled title="Currency" value="' + communicationd.no_of_checkin + '"> </div> </div> <div class="col-xs-8"> <div class="form-group"> <label for="sCurrency">Timezone</label> <input class="form-control" type="text" disabled title="Currency" value="' + checkTimezone + '"> </div> </div>';
//                                             communication_details += '</div> <h5> Call In Times </h5>';

//                                             var array_vall = [];

//                                             communicationd.call_intime.forEach(function (calintime) {

//                                                 array_vall.push(calintime.call_in_time);

//                                             })

//                                             // var firstval = array_vall.slice(0, 12)
//                                             // var secondval = array_vall.slice(12, 24)


//                                             if (array_vall.length > 0) {
//                                                 communication_details += '<div class="row"><div class="col-xs-12"><div class="paragraph-style">' + array_vall + '</div></div></div>';
//                                             }


//                                             if (typeof communicationd.point_of_contact == "undefined" || communicationd.point_of_contact == null) {
//                                                 communicationd.point_of_contact = "";
//                                             }

//                                             if (typeof communicationd.number == "undefined" || communicationd.number == null) {
//                                                 communicationd.number = "";
//                                             }

//                                             if (typeof communicationd.email == "undefined" || communicationd.email == null) {
//                                                 communicationd.email = "";
//                                             }



//                                             communication_details += '<br /> <div class="row" > <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">Point of Contact</label> <input class="form-control" type="text" disabled title="Currency" value="' + communicationd.point_of_contact + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">Mobile Number</label> <input class="form-control" type="text" disabled title="Currency" value="' + communicationd.number + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label for="sCurrency">Email</label> <input class="form-control" type="text" disabled title="Currency" value="' + communicationd.email + '"> </div> </div><br />\n';
//                                             communication_details += ' <div class="col-xs-12"> <div class="form-group"> <label for="sCurrency">Detail an Overdue Procedure</label> <p>';
//                                             if (typeof communicationd.detail_an_overdue_procedure == "undefined" || communicationd.detail_an_overdue_procedure == null) {
//                                                 var overdue = "";

//                                             } else {
//                                                 overdue = communicationd.detail_an_overdue_procedure;

//                                             }
//                                             communication_details += '' + '<div class="paragraph-style">' + overdue + '</div> </div> </div>';

//                                         })





//                                         var communication_end = '</div> </div> <br /> ';
//                                     } else {

//                                         communication_details = '';
//                                         communication_end = '';
//                                     }



//                                     if (newsRa.types_of_ra_id.questionRequired == true || newsRa.types_of_ra_id.contingenciesRequired == true) {


//                                         if (newsRa.types_of_ra_id.contingenciesRequired == true) {

//                                             var sno_cont = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 5 :
//                                                 (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 4 :
//                                                     (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 4 : 3;

//                                             var contigencieshtml = '<div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style= " border-top: 2px dotted #4863A0 !important;"><div class="container"><div class="box box-primary"> <div class="box-header with-border"><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <h4 class="box-title"><u>Section ' + sno_cont + ': Contingencies</u></h4> </div> <div class="box-body">';

//                                             contingencyData.forEach(function (contingency) {

//                                                 if (typeof contingency.medical_provision == "undefined" || contingency.medical_provision == null) {
//                                                     contingency.medical_provision = "";
//                                                 }
//                                                 if (typeof contingency.method_of_evacuation == "undefined" || contingency.method_of_evacuation == null) {
//                                                     contingency.method_of_evacuation = "";
//                                                 }
//                                                 if (typeof contingency.detail_nearest_hospital == "undefined" || contingency.detail_nearest_hospital == null) {
//                                                     contingency.detail_nearest_hospital = "";
//                                                 }
//                                                 if (typeof contingency.medevac_company == "undefined" || contingency.medevac_company == null) {
//                                                     contingency.medevac_company = "";
//                                                 }


//                                                 contigencieshtml += '<div class="row"> <div class="col-xs-6"> <div class="form-group"> <label for="MedicalProvision">Medical Provision</label> <input class="form-control" id="MedicalProvision" type="text" disabled value="' + contingency.medical_provision + '" title="Medical Provision" placeholder="Medical Provision"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="Evacuation">Method Of Evacuation </label> <input class="form-control" id="Evacuation" type="text" placeholder="Method Of Evacuation" disabled value="' + contingency.method_of_evacuation + '" title="Method Of Evacuation"> </div> </div> </div> <div class="row"> <div class="col-xs-6"> <div class="form-group"> <label for="NearestHospital">Local Hospital Information</label> <input class="form-control" id="NearestHospital" type="text" placeholder="Detail Nearest Hospital" disabled value="' + contingency.detail_nearest_hospital + '" title="Detail Nearest Hospital"> </div> </div> <div class="col-xs-6"> <div> <label for="Medevac">Medical Evacuation Company</label> <div class="paragraph-style">' + contingency.medevac_company + '</div> </div> </div> </div>';

//                                                 if (contingency.first_aid_kit == true) {

//                                                     var fiaid = "Yes";
//                                                 } else {
//                                                     fiaid = " ";

//                                                 }

//                                                 if (contingency.personal_protective_equipment == true) {

//                                                     var ppi = "Yes";
//                                                 } else {
//                                                     ppi = " ";
//                                                 }
//                                                 if (contingency.no_of_satellite_phone == undefined || null) {
//                                                     var satellitePhone = '';
//                                                 } else {
//                                                     satellitePhone = contingency.no_of_satellite_phone;
//                                                 }
//                                                 if (contingency.no_of_tracker == undefined || null) {
//                                                     var noOfTracker = '';
//                                                 } else {
//                                                     var noOfTracker = contingency.no_of_tracker;
//                                                 }
//                                                 contigencieshtml += '<div class="row"> <div class="col-xs-6"> <div class="form-group"> <label for="NearestHospital">First Aid Kit: ' + fiaid + '</label>  </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="Medevac">Personal Protective Equipment: ' + ppi + ' </label> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="Medevac">Satellite Phone</label> <span> <input type="text" disabled value="' + satellitePhone + '" id="test3" /> </span> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label for="Medevac">Tracker ID</label> <span> <input type="text" disabled value="' + noOfTracker + '" id="" /> </span> </div> </div> </div>';

//                                             })
//                                         }

//                                         if (newsRa.types_of_ra_id.questionRequired == true) {

//                                             var sno_ques = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
//                                                 (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                     (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                         (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                             (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                 (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                     (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                         (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 : 3;


//                                             contigencieshtml += '<br /><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style= " border-top: 2px dotted #4863A0 !important;"> <div class="row"> <div class="col-xs-12"> <div class="form-group"><h4 class="box-title"><u>Section ' + sno_ques + ': Risks and Mitigation</u></h4> <table id="t01" class="table table-bordered question_table"> <thead> <tr> <th>Question</th> <th>Best Practice Advice</th> <th>Specific Mitigation</th> <th>Marked as </th></tr> </thead> <tbody>';


//                                             queData.forEach(function (que) {

//                                                 if (que.ticked) {


//                                                     contigencieshtml += '<tr > <td>' + que.question + '</td> <td> ' + que.best_practice_advice + '</td> <td>' + que.specific_mitigation + '</td> <td>';
//                                                     if (que.ticked == true) {
//                                                         contigencieshtml += 'Applicable';

//                                                     } else {

//                                                         contigencieshtml += 'Not Applicable';

//                                                     }

//                                                     contigencieshtml += '</td> </tr>';
//                                                 }

//                                             })
//                                         }

//                                         contigencieshtml += '</tbody> </table> </div> </div> </div>';




//                                         var contigenciesend = '</div></div><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><hr style= " border-top: 2px dotted #4863A0 !important;"></div><br />';

//                                     } else {
//                                         contigencieshtml = '';
//                                         contigenciesend = '';

//                                     }
//                                     var baseUrl = envConfig.host;
//                                     if (newsRa.supporting_docs != null) {
//                                         if (newsRa.supporting_docs.length > 0) {
//                                             var supporting_content = '<b>Files Attached</b>';
//                                             var count = 1;
//                                             newsRa.supporting_docs.forEach(function (docs) {

//                                                 var link = baseUrl + docs;
//                                                 supporting_content += '<br /> <div class="row"> <div class="col-xs-12"> <div class="form-group"><span> <p>' + count + "." + docs + '</p> </span>  </div> </div><br/> <div class="col-xs-6"><a href=" ' + link + ' " >Click here </a></div></div> </div> </div><br/>';
//                                                 count++;


//                                             })

//                                         }
//                                     }

//                                     console.log(baseUrl);
//                                     var doc = "1516367980241_risk.png";

//                                     var sno_anyother = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 7 :
//                                         (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
//                                             (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
//                                                 (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
//                                                     (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 6 :
//                                                         (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                             (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                                 (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                                     (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                                         (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
//                                                                             (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :

//                                                                                 (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                                     (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                                         (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                                             (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
//                                                                                                 (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 : 3;


//                                     if (typeof newsRa.risk_detailed == "undefined" || newsRa.risk_detailed == null) {
//                                         newsRa.risk_detailed = "";
//                                     }
//                                     if (typeof newsRa.relevant_info == "undefined" || newsRa.relevant_info == null) {
//                                         newsRa.relevant_info = "";
//                                     }

//                                     var otherinfodetails = '<div class="container"><div class="box box-primary"> <div class="box-header with-border">   <div class="box-body"> <div class="row"> <div class="col-xs-12"><h4 class="box-title"><u>Section ' + sno_anyother + ': Any Other Information</u></h4> <div class="form-group"> <label for="relevant_info">Additional risks identified</label> <span> <p>' + newsRa.risk_detailed + '</p> </span> <span></span> </div> </div> </div> <div class="row"> <div class="col-xs-12"> <div class="form-group"> <label for="risk_detailed">Additional information provided</label> <span> <p>' + newsRa.relevant_info + '</p> </span> </div> </div> </div>';




//                                     if (newsRa.supporting_docs.length > 0) {
//                                         otherinfodetails += supporting_content;
//                                     }
//                                     var enddiv = ' </div></div> </section>';
//                                     var twleve = '<style> table { width: 100%; } table, th, td { border: 1px solid black; border-collapse: collapse; } th, td { padding: 5px; text-align: left; } table#t01 tr:nth-child(even) { background-color: #eee; } table#t01 tr:nth-child(odd) { background-color: #fff; } table#t01 th { background-color: #3c8dbc; color: white; } </style> </body> </html>';


//                                     var result = first + second + third + fourth + fivth + sixth + seventh + eight + nine + ten + leven + aftlabel + aftlabel4 + travellerdiv + passportdet + travellerend + othertravellerdiv + otherpassportdet + othertravellerend + supplier_details + supplierend + communication_details + communication_end + contigencieshtml + contigenciesend + otherinfodetails + enddiv + twleve;
//                                     var filePath = './clientPortal/pdf/' + newsRa._id + '_traveller_newsRA.pdf';

//                                     phantom.create(['--ignore-ssl-errors=yes']).then(function (ph) {


//                                         ph.createPage().then(function (page) {

//                                             var approvingManagerName = currenttraveller.firstname + ' ' + currenttraveller.lastname;

//                                             var footerfunc = `function(pageNum, numPages) {                 
//                                                              return "<hr><div ><span style='text-align:center;font-size:10px;margin-bottom: 20px !important;'><b>Approval Date:</b>"
//                                                               + new Date() +
//                                                                ' <b>Final Approving Manager: </b>` + approvingManagerName + `</span></div>';
//                                                            }`;




//                                             page.property(
//                                                 'paperSize', {
//                                                     format: 'A4',
//                                                     orientation: 'portrait', // portrait or landscape

//                                                     margin: '20px !important',
//                                                     header: {
//                                                         height: "50px",
//                                                         contents: ph.callback(function (pageNum, numPages) {
//                                                             return "<span style='float:right;color:#4863A0'><i>Riskpal</i></span><br/><hr style=' margin-bottom: 10px !important; border: 0; border-top: 2px solid #4863A0 !important;'><br />";
//                                                         })
//                                                     },


//                                                     footer: {

//                                                         height: "1.5cm",
//                                                         contents: ph.callback(footerfunc)
//                                                     }

//                                                 }).then(function () {
//                                                     page.property('content', result).then(function () {
//                                                         setTimeout(function () {
//                                                             page.render(filePath).then(function () {
//                                                                 page.close();
//                                                                 ph.exit();
//                                                                 console.log('file generated:- ', filePath)
//                                                                 fs.readFile(filePath, function (err, fileData) {
//                                                                     if (fileData) {
//                                                                         // console.log(approvingManager)
//                                                                         callback(newsRa, filePath, approvingManager, fileData);
//                                                                     }
//                                                                 })
//                                                             });
//                                                         }, 2000);
//                                                     }).catch(function (err) {
//                                                         console.log('Err:- ', err);
//                                                     });
//                                                 }).catch(function (err) {
//                                                     console.log('Err:- ', err);
//                                                 });
//                                         }).catch(function (err) {
//                                             console.log('Err:- ', err);
//                                         });
//                                     })

//                                 })
//                         }
//                     });


//                 }


//             })





// }

// /* @function : createPdf  for submitRa toManager and Approve 
//  *  @author  : MadhuriK 
//  *  @created  : 11-Jun-17
//  *  @modified :
//  *  @purpose  : To callback function for creating pdf.
//  */
function createPdf(req, news_ra_id, countryMatrixData, graph, fromApprove, callback) {
    
    newsRaObj.findOne({
        _id: news_ra_id,
        is_deleted: false
    })
        .populate('travellerTeamArr')
        .populate('approvingManager')
        .populate('department')
        .populate('types_of_ra_id')
        .populate('author_id')
        .populate('country')
        .exec(
            function (err, newsRa) {
                if (newsRa) {
                    async.waterfall([
                        function (callback) {
                            newsRaAnsObj.find({
                                news_ra_id: news_ra_id,
                                is_deleted: false
                            })
                                .populate('category_id')
                                .exec(function (err, queData) {
                                    if (err) {
                                        callback(err, []);
                                    } else {
                                        callback(null, queData);
                                    }
                                })
                        },
                        function (queData, callback) {
                            supplierObj.find({
                                news_ra_id: news_ra_id,
                                is_deleted: false
                            }, function (err, supplierData) {
                                if (err) {
                                    callback(err, [], []);
                                } else {
                                    callback(null, queData, supplierData);
                                }
                            })
                        },
                        function (queData, supplierData, callback) {
                            communicationObj.find({
                                news_ra_id: news_ra_id,
                                is_deleted: false
                            }, function (err, communicationData) {
                                if (err) {
                                    callback(err, [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData);
                                }
                            })
                        },
                        function (queData, supplierData, communicationData, callback) {
                            contingencyObj.find({
                                news_ra_id: news_ra_id,
                                is_deleted: false
                            }, function (err, contingencyData) {
                                if (err) {
                                    callback(err, [], [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData, contingencyData);
                                }
                            })
                        },
                        function (queData, supplierData, communicationData, contingencyData, callback) {
                            countryRiskObj.find({
                                country_id: newsRa.country[0]._id
                            }, function (err, countryColorData) {
                                if (err) {
                                    callback(err, [], [], [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData, contingencyData, countryColorData);
                                }
                            })
                        },
                        function (queData, supplierData, communicationData, contingencyData, countryColorData, callback) {
                            userTable.findOne({
                                _id: newsRa.traveller_id,
                                is_deleted: false
                            }).populate('department')
                                .exec(
                                    function (err, traveller) {
                                        if (err) {
                                            callback(err, [], [], [], [], []);
                                        } else {
                                            callback(null, queData, supplierData, communicationData, contingencyData, countryColorData, traveller);
                                        }
                                    })
                        },
                        function (queData, supplierData, communicationData, contingencyData, countryColorData, traveller, callback) {
                            userTable.findOne({
                                _id: req.user.id,
                                is_deleted: false
                            }).populate('department')
                                .exec(
                                    function (err, currenttraveller) {
                                        if (err) {
                                            callback(err, [], [], [], [], []);
                                        } else {
                                            callback(null, queData, supplierData, communicationData, contingencyData, countryColorData, traveller, currenttraveller);
                                        }
                                    })
                        }
                    ], function (err, queData, supplierData, communicationData, contingencyData, countryColorData, traveller, currenttraveller) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            
                            newsRaAnsObj.find({
                                news_ra_id: news_ra_id,
                                traveller_id: newsRa.traveller_id,
                                is_deleted: false
                            })
                                .populate('category_id')
                                .exec(function (err, news_ra_ans) {

                                    var supplierArr = [];
                                    supplierData.forEach(function (supplierD) {
                                        supplierArr.push(supplierD)
                                    })




                                    var countryArr = [];
                                    var travellerTeamArr = [];
                                    var approvingManager = [];
                                    var colorArr = [];
                                    var approvingMname = [];
                                    var departmentArr = [];

                                    var numbers = [];
                                    newsRa.country.forEach(function (countryName) {
                                        countryArr.push(countryName.name);
                                    });
                                    if (newsRa.country != null) {
                                        newsRa.country.forEach(function (countrycolor) {
                                            colorArr.push(countrycolor.color);
                                        })
                                    }

                                    if (newsRa.travellerTeamArr != null) {
                                        newsRa.travellerTeamArr.forEach(function (team) {
                                            travellerTeamArr.push(team.firstname);

                                        });
                                    }

                                    newsRa.approvingManager.forEach(function (manager) {
                                        approvingManager.push(manager.email);
                                    })
                                    newsRa.approvingManager.forEach(function (approvingname) {
                                        approvingMname.push(approvingname.firstname);
                                    })
                                    traveller.department.forEach(function (departmentName) {
                                        departmentArr.push(departmentName.department_name);
                                    })
                                    if (typeof newsRa.country[0].color != "undefined") {
                                        var countryColor = newsRa.country[0].color.replace(/'/g, "");

                                    } else {
                                        countryColor = "";

                                    }

                                    var departmentArray = [];
                                    newsRa.department.forEach(item => {
                                        departmentArray.push(item.department_name);
                                    });
                                   
                                    var first = '<!doctype html> <html class="no-js" ng-app="superadmin"> <head> <meta charset="utf-8"> <title>Riskpal</title> <meta name="description" content=""> <meta name="viewport" content="width=device-width">';
                                    var second = '<style>  html{font-family:sans-serif;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:transparent}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:bold}dfn{font-style:italic}h1{font-size:1em;margin:.67em 0}mark{background:#ff0;color:#000}small{font-size:60%}sub,sup{font-size:65%;line-height:0;position:relative;vertical-align:baseline}sup{top:-0.5em}sub{bottom:-0.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{color:inherit;font:inherit;margin:0}button{overflow:visible}button,select{text-transform:none}button,html input[type="button"],input[type="reset"],input[type="submit"]{-webkit-appearance:button;cursor:pointer}button[disabled],html input[disabled]{cursor:default}button::-moz-focus-inner,input::-moz-focus-inner{border:0;padding:0}input{line-height:normal}input[type="checkbox"],input[type="radio"]{box-sizing:border-box;padding:0}input[type="number"]::-webkit-inner-spin-button,input[type="number"]::-webkit-outer-spin-button{height:auto}input[type="search"]{-webkit-appearance:textfield;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;box-sizing:content-box}input[type="search"]::-webkit-search-cancel-button,input[type="search"]::-webkit-search-decoration{-webkit-appearance:none}fieldset{border:1px solid #c0c0c0;margin:0 2px;padding:.35em .625em .75em}legend{border:0;padding:0}textarea{overflow:auto}optgroup{font-weight:bold}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}@media print{*{text-shadow:none !important;color:#000 !important;background:transparent !important;box-shadow:none !important}a,a:visited{text-decoration:underline}a[href]:after{content:" (" attr(href) ")"}abbr[title]:after{content:" (" attr(title) ")"}a[href^="javascript:"]:after,a[href^="#"]:after{content:""}pre,blockquote{border:1px solid #999;page-break-inside:avoid}thead{display:table-header-group}tr,img{page-break-inside:avoid}img{max-width:100% !important}p,h2,h3{orphans:3;widows:3}h2,h3{page-break-after:avoid}select{background:#fff !important}.navbar{display:none}.table td,.table th{background-color:#fff !important}.btn>.caret,.dropup>.btn>.caret{border-top-color:#000 !important}.label{border:1px solid #000}.table{border-collapse:collapse !important}.table-bordered th,.table-bordered td{border:1px solid #ddd !important}}.glyphicon-asterisk:before{content:"\2a"}.glyphicon-plus:before{content:"\2b"}.glyphicon-euro:before{content:"\20ac"}.glyphicon-minus:before{content:"\2212"}.glyphicon-cloud:before{content:"\2601"}.glyphicon-envelope:before{content:"\2709"}.glyphicon-pencil:before{content:"\270f"}.glyphicon-glass:before{content:"\e001"}.glyphicon-music:before{content:"\e002"}.glyphicon-search:before{content:"\e003"}.glyphicon-heart:before{content:"\e005"}.glyphicon-star:before{content:"\e006"}.glyphicon-star-empty:before{content:"\e007"}.glyphicon-user:before{content:"\e008"}.glyphicon-film:before{content:"\e009"}.glyphicon-th-large:before{content:"\e010"}.glyphicon-th:before{content:"\e011"}.glyphicon-th-list:before{content:"\e012"}.glyphicon-ok:before{content:"\e013"}.glyphicon-remove:before{content:"\e014"}.glyphicon-zoom-in:before{content:"\e015"}.glyphicon-zoom-out:before{content:"\e016"}.glyphicon-off:before{content:"\e017"}.glyphicon-signal:before{content:"\e018"}.glyphicon-cog:before{content:"\e019"}.glyphicon-trash:before{content:"\e020"}.glyphicon-home:before{content:"\e021"}.glyphicon-file:before{content:"\e022"}.glyphicon-time:before{content:"\e023"}.glyphicon-road:before{content:"\e024"}.glyphicon-download-alt:before{content:"\e025"}.glyphicon-download:before{content:"\e026"}.glyphicon-upload:before{content:"\e027"}.glyphicon-inbox:before{content:"\e028"}.glyphicon-play-circle:before{content:"\e029"}.glyphicon-repeat:before{content:"\e030"}.glyphicon-refresh:before{content:"\e031"}.glyphicon-list-alt:before{content:"\e032"}.glyphicon-lock:before{content:"\e033"}.glyphicon-flag:before{content:"\e034"}.glyphicon-headphones:before{content:"\e035"}.glyphicon-volume-off:before{content:"\e036"}.glyphicon-volume-down:before{content:"\e037"}.glyphicon-volume-up:before{content:"\e038"}.glyphicon-qrcode:before{content:"\e039"}.glyphicon-barcode:before{content:"\e040"}.glyphicon-tag:before{content:"\e041"}.glyphicon-tags:before{content:"\e042"}.glyphicon-book:before{content:"\e043"}.glyphicon-bookmark:before{content:"\e044"}.glyphicon-print:before{content:"\e045"}.glyphicon-camera:before{content:"\e046"}.glyphicon-font:before{content:"\e047"}.glyphicon-bold:before{content:"\e048"}.glyphicon-italic:before{content:"\e049"}.glyphicon-text-height:before{content:"\e050"}.glyphicon-text-width:before{content:"\e051"}.glyphicon-align-left:before{content:"\e052"}.glyphicon-align-center:before{content:"\e053"}.glyphicon-align-right:before{content:"\e054"}.glyphicon-align-justify:before{content:"\e055"}.glyphicon-list:before{content:"\e056"}.glyphicon-indent-left:before{content:"\e057"}.glyphicon-indent-right:before{content:"\e058"}.glyphicon-facetime-video:before{content:"\e059"}.glyphicon-picture:before{content:"\e060"}.glyphicon-map-marker:before{content:"\e062"}.glyphicon-adjust:before{content:"\e063"}.glyphicon-tint:before{content:"\e064"}.glyphicon-edit:before{content:"\e065"}.glyphicon-share:before{content:"\e066"}.glyphicon-check:before{content:"\e067"}.glyphicon-move:before{content:"\e068"}.glyphicon-step-backward:before{content:"\e069"}.glyphicon-fast-backward:before{content:"\e070"}.glyphicon-backward:before{content:"\e071"}.glyphicon-play:before{content:"\e072"}.glyphicon-pause:before{content:"\e073"}.glyphicon-stop:before{content:"\e074"}.glyphicon-forward:before{content:"\e075"}.glyphicon-fast-forward:before{content:"\e076"}.glyphicon-step-forward:before{content:"\e077"}.glyphicon-eject:before{content:"\e078"}.glyphicon-chevron-left:before{content:"\e079"}.glyphicon-chevron-right:before{content:"\e080"}.glyphicon-plus-sign:before{content:"\e081"}.glyphicon-minus-sign:before{content:"\e082"}.glyphicon-remove-sign:before{content:"\e083"}.glyphicon-ok-sign:before{content:"\e084"}.glyphicon-question-sign:before{content:"\e085"}.glyphicon-info-sign:before{content:"\e086"}.glyphicon-screenshot:before{content:"\e087"}.glyphicon-remove-circle:before{content:"\e088"}.glyphicon-ok-circle:before{content:"\e089"}.glyphicon-ban-circle:before{content:"\e090"}.glyphicon-arrow-left:before{content:"\e091"}.glyphicon-arrow-right:before{content:"\e092"}.glyphicon-arrow-up:before{content:"\e093"}.glyphicon-arrow-down:before{content:"\e094"}.glyphicon-share-alt:before{content:"\e095"}.glyphicon-resize-full:before{content:"\e096"}.glyphicon-resize-small:before{content:"\e097"}.glyphicon-exclamation-sign:before{content:"\e101"}.glyphicon-gift:before{content:"\e102"}.glyphicon-leaf:before{content:"\e103"}.glyphicon-fire:before{content:"\e104"}.glyphicon-eye-open:before{content:"\e105"}.glyphicon-eye-close:before{content:"\e106"}.glyphicon-warning-sign:before{content:"\e107"}.glyphicon-plane:before{content:"\e108"}.glyphicon-calendar:before{content:"\e109"}.glyphicon-random:before{content:"\e110"}.glyphicon-comment:before{content:"\e111"}.glyphicon-magnet:before{content:"\e112"}.glyphicon-chevron-up:before{content:"\e113"}.glyphicon-chevron-down:before{content:"\e114"}.glyphicon-retweet:before{content:"\e115"}.glyphicon-shopping-cart:before{content:"\e116"}.glyphicon-folder-close:before{content:"\e117"}.glyphicon-folder-open:before{content:"\e118"}.glyphicon-resize-vertical:before{content:"\e119"}.glyphicon-resize-horizontal:before{content:"\e120"}.glyphicon-hdd:before{content:"\e121"}.glyphicon-bullhorn:before{content:"\e122"}.glyphicon-bell:before{content:"\e123"}.glyphicon-certificate:before{content:"\e124"}.glyphicon-thumbs-up:before{content:"\e125"}.glyphicon-thumbs-down:before{content:"\e126"}.glyphicon-hand-right:before{content:"\e127"}.glyphicon-hand-left:before{content:"\e128"}.glyphicon-hand-up:before{content:"\e129"}.glyphicon-hand-down:before{content:"\e130"}.glyphicon-circle-arrow-right:before{content:"\e131"}.glyphicon-circle-arrow-left:before{content:"\e132"}.glyphicon-circle-arrow-up:before{content:"\e133"}.glyphicon-circle-arrow-down:before{content:"\e134"}.glyphicon-globe:before{content:"\e135"}.glyphicon-wrench:before{content:"\e136"}.glyphicon-tasks:before{content:"\e137"}.glyphicon-filter:before{content:"\e138"}.glyphicon-briefcase:before{content:"\e139"}.glyphicon-fullscreen:before{content:"\e140"}.glyphicon-dashboard:before{content:"\e141"}.glyphicon-paperclip:before{content:"\e142"}.glyphicon-heart-empty:before{content:"\e143"}.glyphicon-link:before{content:"\e144"}.glyphicon-phone:before{content:"\e145"}.glyphicon-pushpin:before{content:"\e146"}.glyphicon-usd:before{content:"\e148"}.glyphicon-gbp:before{content:"\e149"}.glyphicon-sort:before{content:"\e150"}.glyphicon-sort-by-alphabet:before{content:"\e151"}.glyphicon-sort-by-alphabet-alt:before{content:"\e152"}.glyphicon-sort-by-order:before{content:"\e153"}.glyphicon-sort-by-order-alt:before{content:"\e154"}.glyphicon-sort-by-attributes:before{content:"\e155"}.glyphicon-sort-by-attributes-alt:before{content:"\e156"}.glyphicon-unchecked:before{content:"\e157"}.glyphicon-expand:before{content:"\e158"}.glyphicon-collapse-down:before{content:"\e159"}.glyphicon-collapse-up:before{content:"\e160"}.glyphicon-log-in:before{content:"\e161"}.glyphicon-flash:before{content:"\e162"}.glyphicon-log-out:before{content:"\e163"}.glyphicon-new-window:before{content:"\e164"}';
                                    var third = '.glyphicon-record:before{content:"\e165"}.glyphicon-save:before{content:"\e166"}.glyphicon-open:before{content:"\e167"}.glyphicon-saved:before{content:"\e168"}.glyphicon-import:before{content:"\e169"}.glyphicon-export:before{content:"\e170"}.glyphicon-send:before{content:"\e171"}.glyphicon-floppy-disk:before{content:"\e172"}.glyphicon-floppy-saved:before{content:"\e173"}.glyphicon-floppy-remove:before{content:"\e174"}.glyphicon-floppy-save:before{content:"\e175"}.glyphicon-floppy-open:before{content:"\e176"}.glyphicon-credit-card:before{content:"\e177"}.glyphicon-transfer:before{content:"\e178"}.glyphicon-cutlery:before{content:"\e179"}.glyphicon-header:before{content:"\e180"}.glyphicon-compressed:before{content:"\e181"}.glyphicon-earphone:before{content:"\e182"}.glyphicon-phone-alt:before{content:"\e183"}.glyphicon-tower:before{content:"\e184"}.glyphicon-stats:before{content:"\e185"}.glyphicon-sd-video:before{content:"\e186"}.glyphicon-hd-video:before{content:"\e187"}.glyphicon-subtitles:before{content:"\e188"}.glyphicon-sound-stereo:before{content:"\e189"}.glyphicon-sound-dolby:before{content:"\e190"}.glyphicon-sound-5-1:before{content:"\e191"}.glyphicon-sound-6-1:before{content:"\e192"}.glyphicon-sound-7-1:before{content:"\e193"}.glyphicon-copyright-mark:before{content:"\e194"}.glyphicon-registration-mark:before{content:"\e195"}.glyphicon-cloud-download:before{content:"\e197"}.glyphicon-cloud-upload:before{content:"\e198"}.glyphicon-tree-conifer:before{content:"\e199"}.glyphicon-tree-deciduous:before{content:"\e200"}*{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}*:before,*:after{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}html{font-size:10px;-webkit-tap-highlight-color:rgba(0,0,0,0)}body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:10px;line-height:1.42857143;color:#333;background-color:#fff}input,button,select,textarea{font-family:inherit;font-size:12px;line-height:inherit}a{color:#428bca;text-decoration:none}a:hover,a:focus{color:#2a6496;text-decoration:underline}a:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}figure{margin:0}img{vertical-align:middle}.img-responsive,.thumbnail>img,.thumbnail a>img,.carousel-inner>.item>img,.carousel-inner>.item>a>img{display:block;width:100% \9;max-width:100%;height:auto}.img-rounded{border-radius:6px}.img-thumbnail{padding:4px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out;display:inline-block;width:100% \9;max-width:100%;height:auto}.img-circle{border-radius:50%}.sr-only{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0, 0, 0, 0);border:0}.sr-only-focusable:active,.sr-only-focusable:focus{position:static;width:auto;height:auto;margin:0;overflow:visible;clip:auto}h1,h2,h3,h4,h5,h6,.h1,.h2,.h3,.h4,.h5,.h6{font-family:inherit;font-weight:500;line-height:1.1;color:inherit}h1 small,h2 small,h3 small,h4 small,h5 small,h6 small,.h1 small,.h2 small,.h3 small,.h4 small,.h5 small,.h6 small,h1 .small,h2 .small,h3 .small,h4 .small,h5 .small,h6 .small,.h1 .small,.h2 .small,.h3 .small,.h4 .small,.h5 .small,.h6 .small{font-weight:normal;line-height:1;color:#777}h1,.h1,h2,.h2,h3,.h3{margin-top:20px;margin-bottom:10px}h1 small,.h1 small,h2 small,.h2 small,h3 small,.h3 small,h1 .small,.h1 .small,h2 .small,.h2 .small,h3 .small,.h3 .small{font-size:55%}h4,.h4,h5,.h5,h6,.h6{margin-top:10px;margin-bottom:10px}h4 small,.h4 small,h5 small,.h5 small,h6 small,.h6 small,h4 .small,.h4 .small,h5 .small,.h5 .small,h6 .small,.h6 .small{font-size:65%}h1,.h1{font-size:20px}h2,.h2{font-size:18px}h3,.h3{font-size:16px}h4,.h4{font-size:16px}h5,.h5{font-size:14px}h6,.h6{font-size:12px}p{margin:0 0 10px}.lead{margin-bottom:20px;font-size:16px;font-weight:300;line-height:1.4}@media (min-width:768px){.lead{font-size:21px}}small,.small{font-size:65%}cite{font-style:normal}mark,.mark{background-color:#fcf8e3;padding:.2em}.text-left{text-align:left}.text-right{text-align:right}.text-center{text-align:center}.text-justify{text-align:justify}.text-nowrap{white-space:nowrap}.text-lowercase{text-transform:lowercase}.text-uppercase{text-transform:uppercase}.text-capitalize{text-transform:capitalize}.text-muted{color:#777}.text-primary{color:#428bca}a.text-primary:hover{color:#3071a9}.text-success{color:#3c763d}a.text-success:hover{color:#2b542c}.text-info{color:#31708f}a.text-info:hover{color:#245269}.text-warning{color:#8a6d3b}a.text-warning:hover{color:#66512c}.text-danger{color:#a94442}a.text-danger:hover{color:#843534}.bg-primary{color:#fff;background-color:#428bca}a.bg-primary:hover{background-color:#3071a9}.bg-success{background-color:#dff0d8}a.bg-success:hover{background-color:#c1e2b3}.bg-info{background-color:#d9edf7}a.bg-info:hover{background-color:#afd9ee}.bg-warning{background-color:#fcf8e3}a.bg-warning:hover{background-color:#f7ecb5}.bg-danger{background-color:#f2dede}a.bg-danger:hover{background-color:#e4b9b9}.page-header{padding-bottom:9px;margin:40px 0 20px;border-bottom:1px solid #eee}ul,ol{margin-top:0;margin-bottom:10px}ul ul,ol ul,ul ol,ol ol{margin-bottom:0}.list-unstyled{padding-left:0;list-style:none}.list-inline{padding-left:0;list-style:none;margin-left:-5px}.list-inline>li{display:inline-block;padding-left:5px;padding-right:5px}dl{margin-top:0;margin-bottom:20px}dt,dd{line-height:1.42857143}dt{font-weight:bold}dd{margin-left:0}@media (min-width:768px){.dl-horizontal dt{float:left;width:160px;clear:left;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dl-horizontal dd{margin-left:180px}}abbr[title],abbr[data-original-title]{cursor:help;border-bottom:1px dotted #777}.initialism{font-size:90%;text-transform:uppercase}blockquote{padding:10px 20px;margin:0 0 20px;font-size:17.5px;border-left:5px solid #eee}blockquote p:last-child,blockquote ul:last-child,blockquote ol:last-child{margin-bottom:0}blockquote footer,blockquote small,blockquote .small{display:block;font-size:80%;line-height:1.42857143;color:#777}blockquote footer:before,blockquote small:before,.blockquote-reverse footer:before,blockquote.pull-right footer:before,.blockquote-reverse small:before,blockquote.pull-right small:before,.blockquote-reverse .small:before,blockquote.pull-right .smal,blockquote.pull-right footer:after,.blockquote-reverse small:after,blockquote.pull-right small:after,.blockquote-reverse .small:after,blockquote.pull-right ,blockquote:after{content:""}address{margin-bottom:20px;font-style:normal;line-height:1.42857143}code,kbd,pre,samp{font-family:Menlo,Monaco,Consolas,"Courier New",monospace}code{padding:2px 4px;font-size:70%;color:#c7254e;background-color:#f9f2f4;border-radius:4px}kbd{padding:2px 4px;font-size:70%;color:#fff;background-color:#333;border-radius:3px;box-shadow:inset 0 -1px 0 rgba(0,0,0,0.25)}kbd kbd{padding:0;font-size:100%;box-shadow:none}pre{display:block;padding:9.5px;margin:0 0 10px;font-size:13px;line-height:1.42857143;word-break:break-all;word-wrap:break-word;color:#333;background-color:#f5f5f5;border:1px solid #ccc;border-radius:4px}pre code{padding:0;font-size:inherit;color:inherit;white-space:pre-wrap;background-color:transparent;border-radius:0}.pre-scrollable{max-height:340px;overflow-y:scroll}.container{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px} .container-fluid{margin-right:auto;margin-left:auto;padding-left:15px;padding-right:15px}.row{margin-left:-15px;margin-right:-15px}.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12{position:relative;min-height:1px;padding-left:15px;padding-right:15px}.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12{float:left}.col-xs-12{width:100%}.col-xs-11{width:91.66666667%}.col-xs-10{width:83.33333333%}.col-xs-9{width:75%}.col-xs-8{width:66.66666667%}.col-xs-7{width:58.33333333%}.col-xs-6{width:50%}.col-xs-5{width:41.66666667%}.col-xs-4{width:33.33333333%}.col-xs-3{width:25%}.col-xs-2{width:16.66666667%}.col-xs-1{width:8.33333333%}.col-xs-pull-12{right:100%}.col-xs-pull-11{right:91.66666667%}.col-xs-pull-10{right:83.33333333%}.col-xs-pull-9{right:75%}.col-xs-pull-8{right:66.66666667%}.col-xs-pull-7{right:58.33333333%}.col-xs-pull-6{right:50%}.col-xs-pull-5{right:41.66666667%}.col-xs-pull-4{right:33.33333333%}.col-xs-pull-3{right:25%}.col-xs-pull-2{right:16.66666667%}.col-xs-pull-1{right:8.33333333%}.col-xs-pull-0{right:auto}.col-xs-push-12{left:100%}.col-xs-push-11{left:91.66666667%}.col-xs-push-10{left:83.33333333%}.col-xs-push-9{left:75%}.col-xs-push-8{left:66.66666667%}.col-xs-push-7{left:58.33333333%}.col-xs-push-6{left:50%}.col-xs-push-5{left:41.66666667%}.col-xs-push-4{left:33.33333333%}.col-xs-push-3{left:25%}.col-xs-push-2{left:16.66666667%}.col-xs-push-1{left:8.33333333%}.col-xs-push-0{left:auto}.col-xs-offset-12{margin-left:100%}.col-xs-offset-11{margin-left:91.66666667%}';
                                    var fourth = '.col-xs-offset-10{margin-left:83.33333333%}.col-xs-offset-9{margin-left:75%}.col-xs-offset-8{margin-left:66.66666667%}.col-xs-offset-7{margin-left:58.33333333%}.col-xs-offset-6{margin-left:50%}.col-xs-offset-5{margin-left:41.66666667%}.col-xs-offset-4{margin-left:33.33333333%}.col-xs-offset-3{margin-left:25%}.col-xs-offset-2{margin-left:16.66666667%}.col-xs-offset-1{margin-left:8.33333333%}.col-xs-offset-0{margin-left:0}@media (min-width:768px){.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12{float:left}.col-sm-12{width:100%}.col-sm-11{width:91.66666667%}.col-sm-10{width:83.33333333%}.col-sm-9{width:75%}.col-sm-8{width:66.66666667%}.col-sm-7{width:58.33333333%}.col-sm-6{width:50%}.col-sm-5{width:41.66666667%}.col-sm-4{width:33.33333333%}.col-sm-3{width:25%}.col-sm-2{width:16.66666667%}.col-sm-1{width:8.33333333%}.col-sm-pull-12{right:100%}.col-sm-pull-11{right:91.66666667%}.col-sm-pull-10{right:83.33333333%}.col-sm-pull-9{right:75%}.col-sm-pull-8{right:66.66666667%}.col-sm-pull-7{right:58.33333333%}.col-sm-pull-6{right:50%}.col-sm-pull-5{right:41.66666667%}.col-sm-pull-4{right:33.33333333%}.col-sm-pull-3{right:25%}.col-sm-pull-2{right:16.66666667%}.col-sm-pull-1{right:8.33333333%}.col-sm-pull-0{right:auto}.col-sm-push-12{left:100%}.col-sm-push-11{left:91.66666667%}.col-sm-push-10{left:83.33333333%}.col-sm-push-9{left:75%}.col-sm-push-8{left:66.66666667%}.col-sm-push-7{left:58.33333333%}.col-sm-push-6{left:50%}.col-sm-push-5{left:41.66666667%}.col-sm-push-4{left:33.33333333%}.col-sm-push-3{left:25%}.col-sm-push-2{left:16.66666667%}.col-sm-push-1{left:8.33333333%}.col-sm-push-0{left:auto}.col-sm-offset-12{margin-left:100%}.col-sm-offset-11{margin-left:91.66666667%}.col-sm-offset-10{margin-left:83.33333333%}.col-sm-offset-9{margin-left:75%}.col-sm-offset-8{margin-left:66.66666667%}.col-sm-offset-7{margin-left:58.33333333%}.col-sm-offset-6{margin-left:50%}.col-sm-offset-5{margin-left:41.66666667%}.col-sm-offset-4{margin-left:33.33333333%}.col-sm-offset-3{margin-left:25%}.col-sm-offset-2{margin-left:16.66666667%}.col-sm-offset-1{margin-left:8.33333333%}.col-sm-offset-0{margin-left:0}}@media (min-width:992px){.col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12{float:left}.col-md-12{width:100%}.col-md-11{width:91.66666667%}.col-md-10{width:83.33333333%}.col-md-9{width:75%}.col-md-8{width:66.66666667%}.col-md-7{width:58.33333333%}.col-md-6{width:50%}.col-md-5{width:41.66666667%}.col-md-4{width:33.33333333%}.col-md-3{width:25%}.col-md-2{width:16.66666667%}.col-md-1{width:8.33333333%}.col-md-pull-12{right:100%}.col-md-pull-11{right:91.66666667%}.col-md-pull-10{right:83.33333333%}.col-md-pull-9{right:75%}.col-md-pull-8{right:66.66666667%}.col-md-pull-7{right:58.33333333%}.col-md-pull-6{right:50%}.col-md-pull-5{right:41.66666667%}.col-md-pull-4{right:33.33333333%}.col-md-pull-3{right:25%}.col-md-pull-2{right:16.66666667%}.col-md-pull-1{right:8.33333333%}.col-md-pull-0{right:auto}.col-md-push-12{left:100%}.col-md-push-11{left:91.66666667%}.col-md-push-10{left:83.33333333%}.col-md-push-9{left:75%}.col-md-push-8{left:66.66666667%}.col-md-push-7{left:58.33333333%}.col-md-push-6{left:50%}.col-md-push-5{left:41.66666667%}.col-md-push-4{left:33.33333333%}.col-md-push-3{left:25%}.col-md-push-2{left:16.66666667%}.col-md-push-1{left:8.33333333%}.col-md-push-0{left:auto}.col-md-offset-12{margin-left:100%}.col-md-offset-11{margin-left:91.66666667%}.col-md-offset-10{margin-left:83.33333333%}.col-md-offset-9{margin-left:75%}.col-md-offset-8{margin-left:66.66666667%}.col-md-offset-7{margin-left:58.33333333%}.col-md-offset-6{margin-left:50%}.col-md-offset-5{margin-left:41.66666667%}.col-md-offset-4{margin-left:33.33333333%}.col-md-offset-3{margin-left:25%}.col-md-offset-2{margin-left:16.66666667%}.col-md-offset-1{margin-left:8.33333333%}.col-md-offset-0{margin-left:0}}@media (min-width:1200px){.col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12{float:left}.col-lg-12{width:100%}.col-lg-11{width:91.66666667%}.col-lg-10{width:83.33333333%}.col-lg-9{width:75%}.col-lg-8{width:66.66666667%}.col-lg-7{width:58.33333333%}.col-lg-6{width:50%}.col-lg-5{width:41.66666667%}.col-lg-4{width:33.33333333%}.col-lg-3{width:25%}.col-lg-2{width:16.66666667%}.col-lg-1{width:8.33333333%}.col-lg-pull-12{right:100%}.col-lg-pull-11{right:91.66666667%}.col-lg-pull-10{right:83.33333333%}.col-lg-pull-9{right:75%}.col-lg-pull-8{right:66.66666667%}.col-lg-pull-7{right:58.33333333%}.col-lg-pull-6{right:50%}.col-lg-pull-5{right:41.66666667%}.col-lg-pull-4{right:33.33333333%}.col-lg-pull-3{right:25%}.col-lg-pull-2{right:16.66666667%}.col-lg-pull-1{right:8.33333333%}.col-lg-pull-0{right:auto}.col-lg-push-12{left:100%}.col-lg-push-11{left:91.66666667%}.col-lg-push-10{left:83.33333333%}.col-lg-push-9{left:75%}.col-lg-push-8{left:66.66666667%}.col-lg-push-7{left:58.33333333%}.col-lg-push-6{left:50%}.col-lg-push-5{left:41.66666667%}.col-lg-push-4{left:33.33333333%}.col-lg-push-3{left:25%}.col-lg-push-2{left:16.66666667%}.col-lg-push-1{left:8.33333333%}.col-lg-push-0{left:auto}.col-lg-offset-12{margin-left:100%}.col-lg-offset-11{margin-left:91.66666667%}.col-lg-offset-10{margin-left:83.33333333%}.col-lg-offset-9{margin-left:75%}.col-lg-offset-8{margin-left:66.66666667%}.col-lg-offset-7{margin-left:58.33333333%}.col-lg-offset-6{margin-left:50%}.col-lg-offset-5{margin-left:41.66666667%}.col-lg-offset-4{margin-left:33.33333333%}.col-lg-offset-3{margin-left:25%}.col-lg-offset-2{margin-left:16.66666667%}.col-lg-offset-1{margin-left:8.33333333%}.col-lg-offset-0{margin-left:0}}table{background-color:transparent}th{text-align:left}.table{width:100%;max-width:100%;margin-bottom:20px}.table>thead>tr>th,.table>tbody>tr>th,.table>tfoot>tr>th,.table>thead>tr>td,.table>tbody>tr>td,.table>tfoot>tr>td{padding:8px;line-height:1.42857143;vertical-align:top;border-top:1px solid #ddd}.table>thead>tr>th{vertical-align:bottom;border-bottom:2px solid #ddd}.table>caption+thead>tr:first-child>th,.table>colgroup+thead>tr:first-child>th,.table>thead:first-child>tr:first-child>th,.table>caption+thead>tr:first-child>td,.table>colgroup+thead>tr:first-child>td,.table>thead:first-child>tr:first-child>td{border-top:0}.table>tbody+tbody{border-top:2px solid #ddd}.table .table{background-color:#fff}.table-condensed>thead>tr>th,.table-condensed>tbody>tr>th,.table-condensed>tfoot>tr>th,.table-condensed>thead>tr>td,.table-condensed>tbody>tr>td,.table-condensed>tfoot>tr>td{padding:5px}.table-bordered{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>tbody>tr>th,.table-bordered>tfoot>tr>th,.table-bordered>thead>tr>td,.table-bordered>tbody>tr>td,.table-bordered>tfoot>tr>td{border:1px solid #ddd}.table-bordered>thead>tr>th,.table-bordered>thead>tr>td{border-bottom-width:2px}.table-striped>tbody>tr:nth-child(odd)>td,.table-striped>tbody>tr:nth-child(odd)>th{background-color:#f9f9f9}.table-hover>tbody>tr:hover>td,.table-hover>tbody>tr:hover>th{background-color:#f5f5f5}table col[class*="col-"]{position:static;float:none;display:table-column}table td[class*="col-"],table th[class*="col-"]{position:static;float:none;display:table-cell}.table>thead>tr>td.active,.table>tbody>tr>td.active,.table>tfoot>tr>td.active,.table>thead>tr>th.active,.table>tbody>tr>th.active,.table>tfoot>tr>th.active,.table>thead>tr.active>td,.table>tbody>tr.active>td,.table>tfoot>tr.active>td,.table>thead>tr.active>th,.table>tbody>tr.active>th,.table>tfoot>tr.active>th{background-color:#f5f5f5}.table-hover>tbody>tr>td.active:hover,.table-hover>tbody>tr>th.active:hover,.table-hover>tbody>tr.active:hover>td,.table-hover>tbody>tr:hover>.active,.table-hover>tbody>tr.active:hover>th{background-color:#e8e8e8}.table>thead>tr>td.success,.table>tbody>tr>td.success,.table>tfoot>tr>td.success,.table>thead>tr>th.success,.table>tbody>tr>th.success,.table>tfoot>tr>th.success,.table>thead>tr.success>td,.table>tbody>tr.success>td,.table>tfoot>tr.success>td,.table>thead>tr.success>th,.table>tbody>tr.success>th,.table>tfoot>tr.success>th{background-color:#dff0d8}.table-hover>tbody>tr>td.success:hover,.table-hover>tbody>tr>th.success:hover,.table-hover>tbody>tr.success:hover>td,.table-hover>tbody>tr:hover>.success,.table-hover>tbody>tr.success:hover>th{background-color:#d0e9c6}.table>thead>tr>td.info,.table>tbody>tr>td.info,.table>tfoot>tr>td.info,.table>thead>tr>th.info,.table>tbody>tr>th.info,.table>tfoot>tr>th.info,.table>thead>tr.info>td,.table>tbody>tr.info>td,.table>tfoot>tr.info>td,.table>thead>tr.info>th,.table>tbody>tr.info>th,.table>tfoot>tr.info>th{background-color:#d9edf7}.table-hover>tbody>tr>td.info:hover,.table-hover>tbody>tr>th.info:hover,.table-hover>tbody>tr.info:hover>td,.table-hover>tbody>tr:hover>.info,.table-hover>tbody>tr.info:hover>th{background-color:#c4e3f3}.table>thead>tr>td.warning,.table>tbody>tr>td.warning,.table>tfoot>tr>td.warning,.table>thead>tr>th.warning,.table>tbody>tr>th.warning,.table>tfoot>tr>th.warning,.table>thead>tr.warning>td,.table>tbody>tr.warning>td,.table>tfoot>tr.warning>td,.table>thead>tr.warning>th,.table>tbody>tr.warning>th,.table>tfoot>tr.warning>th{background-color:#fcf8e3}.table-hover>tbody>tr>td.warning:hover,.table-hover>tbody>tr>th.warning:hover,.table-hover>tbody>tr.warning:hover>td,.table-hover>tbody>tr:hover>.warning,.table-hover>tbody>tr.warning:hover>th{background-color:#faf2cc}.table>thead>tr>td.danger,.table>tbody>tr>td.danger,.table>tfoot>tr>td.danger,.table>thead>tr>th.danger,.table>tbody>tr>th.danger,.table>tfoot>tr>th.danger,.table>thead>tr.danger>td,.table>tbody>tr.danger>td,.table>tfoot>tr.danger>td,.table>thead>tr.danger>th,.table>tbody>tr.danger>th,.table>tfoot>tr.danger>th{background-color:#f2dede}';
                                    var fivth = '.table-hover>tbody>tr>td.danger:hover,.table-hover>tbody>tr>th.danger:hover,.table-hover>tbody>tr.danger:hover>td,.table-hover>tbody>tr:hover>.danger,.table-hover>tbody>tr.danger:hover>th{background-color:#ebcccc}@media screen and (max-width:767px){.table-responsive{width:100%;margin-bottom:15px;overflow-y:hidden;overflow-x:auto;-ms-overflow-style:-ms-autohiding-scrollbar;border:1px solid #ddd;-webkit-overflow-scrolling:touch}.table-responsive>.table{margin-bottom:0}.table-responsive>.table>thead>tr>th,.table-responsive>.table>tbody>tr>th,.table-responsive>.table>tfoot>tr>th,.table-responsive>.table>thead>tr>td,.table-responsive>.table>tbody>tr>td,.table-responsive>.table>tfoot>tr>td{white-space:nowrap}.table-responsive>.table-bordered{border:0}.table-responsive>.table-bordered>thead>tr>th:first-child,.table-responsive>.table-bordered>tbody>tr>th:first-child,.table-responsive>.table-bordered>tfoot>tr>th:first-child,.table-responsive>.table-bordered>thead>tr>td:first-child,.table-responsive>.table-bordered>tbody>tr>td:first-child,.table-responsive>.table-bordered>tfoot>tr>td:first-child{border-left:0}.table-responsive>.table-bordered>thead>tr>th:last-child,.table-responsive>.table-bordered>tbody>tr>th:last-child,.table-responsive>.table-bordered>tfoot>tr>th:last-child,.table-responsive>.table-bordered>thead>tr>td:last-child,.table-responsive>.table-bordered>tbody>tr>td:last-child,.table-responsive>.table-bordered>tfoot>tr>td:last-child{border-right:0}.table-responsive>.table-bordered>tbody>tr:last-child>th,.table-responsive>.table-bordered>tfoot>tr:last-child>th,.table-responsive>.table-bordered>tbody>tr:last-child>td,.table-responsive>.table-bordered>tfoot>tr:last-child>td{border-bottom:0}}fieldset{padding:0;margin:0;border:0;min-width:0}legend{display:block;width:100%;padding:0;margin-bottom:20px;font-size:16px;line-height:inherit;color:#333;border:0;border-bottom:1px solid #e5e5e5}label{display:inline-block;max-width:100%;margin-bottom:5px;font-weight:bold}input[type="search"]{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}input[type="radio"],input[type="checkbox"]{margin:4px 0 0;margin-top:1px \9;line-height:normal}input[type="file"]{display:block}input[type="range"]{display:block;width:100%}select[multiple],select[size]{height:auto}input[type="file"]:focus,input[type="radio"]:focus,input[type="checkbox"]:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}output{display:block;padding-top:7px;font-size:14px;line-height:1.42857143;color:#555}.form-control{display:block;width:100%;height:24px;padding:6px 12px;font-size:10px;line-height:1.42857143;background-color:#fff;background-image:none;border:1px solid #ccc;border-radius:4px;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;-o-transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s, box-shadow ease-in-out .15s}.form-control:focus{border-color:#66afe9;outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102, 175, 233, 0.6)}.form-control::-moz-placeholder{color:#777;opacity:1}.form-control:-ms-input-placeholder{color:#777}.form-control::-webkit-input-placeholder{color:#777}.form-control[disabled],.form-control[readonly],fieldset[disabled] .form-control{cursor:not-allowed;background-color:#eee;opacity:1}textarea.form-control{height:auto}input[type="search"]{-webkit-appearance:none}input[type="date"],input[type="time"],input[type="datetime-local"],input[type="month"]{line-height:34px;line-height:1.42857143 \0}input[type="date"].input-sm,input[type="time"].input-sm,input[type="datetime-local"].input-sm,input[type="month"].input-sm{line-height:30px}input[type="date"].input-lg,input[type="time"].input-lg,input[type="datetime-local"].input-lg,input[type="month"].input-lg{line-height:46px}.form-group{margin-bottom:15px}.radio,.checkbox{position:relative;display:block;min-height:20px;margin-top:10px;margin-bottom:10px}.radio label,.checkbox label{padding-left:20px;margin-bottom:0;font-weight:normal;cursor:pointer}.radio input[type="radio"],.radio-inline input[type="radio"],.checkbox input[type="checkbox"],.checkbox-inline input[type="checkbox"]{position:absolute;margin-left:-20px;margin-top:4px \9}.radio+.radio,.checkbox+.checkbox{margin-top:-5px}.radio-inline,.checkbox-inline{display:inline-block;padding-left:20px;margin-bottom:0;vertical-align:middle;font-weight:normal;cursor:pointer}.radio-inline+.radio-inline,.checkbox-inline+.checkbox-inline{margin-top:0;margin-left:10px}input[type="radio"][disabled],input[type="checkbox"][disabled],input[type="radio"].disabled,input[type="checkbox"].disabled,fieldset[disabled] input[type="radio"],fieldset[disabled] input[type="checkbox"]{cursor:not-allowed}.radio-inline.disabled,.checkbox-inline.disabled,fieldset[disabled] .radio-inline,fieldset[disabled] .checkbox-inline{cursor:not-allowed}.radio.disabled label,.checkbox.disabled label,fieldset[disabled] .radio label,fieldset[disabled] .checkbox label{cursor:not-allowed}.form-control-static{padding-top:7px;padding-bottom:7px;margin-bottom:0}.form-control-static.input-lg,.form-control-static.input-sm{padding-left:0;padding-right:0}.input-sm,.form-horizontal .form-group-sm .form-control{height:30px;padding:5px 10px;font-size:8px;line-height:1.5;border-radius:3px}select.input-sm{height:30px;line-height:30px}textarea.input-sm,select[multiple].input-sm{height:auto}.input-lg,.form-horizontal .form-group-lg .form-control{height:46px;padding:10px 16px;font-size:12px;line-height:1.33;border-radius:6px}select.input-lg{height:46px;line-height:46px}textarea.input-lg,select[multiple].input-lg{height:auto}.has-feedback{position:relative}.has-feedback .form-control{padding-right:42.5px}.form-control-feedback{position:absolute;top:25px;right:0;z-index:2;display:block;width:34px;height:34px;line-height:34px;text-align:center}.input-lg+.form-control-feedback{width:46px;height:46px;line-height:46px}.input-sm+.form-control-feedback{width:30px;height:30px;line-height:30px}.has-success .help-block,.has-success .control-label,.has-success .radio,.has-success .checkbox,.has-success .radio-inline,.has-success .checkbox-inline{color:#3c763d}.has-success .form-control{border-color:#3c763d;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-success .form-control:focus{border-color:#2b542c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #67b168}.has-success .input-group-addon{color:#3c763d;border-color:#3c763d;background-color:#dff0d8}.has-success .form-control-feedback{color:#3c763d}.has-warning .help-block,.has-warning .control-label,.has-warning .radio,.has-warning .checkbox,.has-warning .radio-inline,.has-warning .checkbox-inline{color:#8a6d3b}.has-warning .form-control{border-color:#8a6d3b;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-warning .form-control:focus{border-color:#66512c;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #c0a16b}.has-warning .input-group-addon{color:#8a6d3b;border-color:#8a6d3b;background-color:#fcf8e3}.has-warning .form-control-feedback{color:#8a6d3b}.has-error .help-block,.has-error .control-label,.has-error .radio,.has-error .checkbox,.has-error .radio-inline,.has-error .checkbox-inline{color:#a94442}.has-error .form-control{border-color:#a94442;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.has-error .form-control:focus{border-color:#843534;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483;box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 6px #ce8483}.has-error .input-group-addon{color:#a94442;border-color:#a94442;background-color:#f2dede}.has-error .form-control-feedback{color:#a94442}.has-feedback label.sr-only~.form-control-feedback{top:0}.help-block{display:block;margin-top:5px;margin-bottom:10px;color:#737373}@media (min-width:768px){.form-inline .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}.form-inline .input-group{display:inline-table;vertical-align:middle}.form-inline .input-group .input-group-addon,.form-inline .input-group .input-group-btn,.form-inline .input-group .form-control{width:auto}.form-inline .input-group>.form-control{width:100%}.form-inline .control-label{margin-bottom:0;vertical-align:middle}.form-inline .radio,.form-inline .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.form-inline .radio label,.form-inline .checkbox label{padding-left:0}.form-inline .radio input[type="radio"],.form-inline .checkbox input[type="checkbox"]{position:relative;margin-left:0}.form-inline .has-feedback .form-control-feedback{top:0}}.form-horizontal .radio,.form-horizontal .checkbox,.form-horizontal .radio-inline,.form-horizontal .checkbox-inline{margin-top:0;margin-bottom:0;padding-top:7px}.form-horizontal .radio,.form-horizontal .checkbox{min-height:27px}.form-horizontal .form-group{margin-left:-15px;margin-right:-15px}@media (min-width:768px){.form-horizontal .control-label{text-align:right;margin-bottom:0;padding-top:7px}}';
                                    var sixth = '.form-horizontal .has-feedback .form-control-feedback{top:0;right:15px}@media (min-width:768px){.form-horizontal .form-group-lg .control-label{padding-top:14.3px}}@media (min-width:768px){.form-horizontal .form-group-sm .control-label{padding-top:6px}}.btn{display:inline-block;margin-bottom:0;font-weight:normal;text-align:center;vertical-align:middle;cursor:pointer;background-image:none;border:1px solid transparent;white-space:nowrap;padding:6px 12px;font-size:14px;line-height:1.42857143;border-radius:4px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.btn:focus,.btn:active:focus,.btn.active:focus{outline:thin dotted;outline:5px auto -webkit-focus-ring-color;outline-offset:-2px}.btn:hover,.btn:focus{color:#333;text-decoration:none}.btn:active,.btn.active{outline:0;background-image:none;-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn.disabled,.btn[disabled],fieldset[disabled] .btn{cursor:not-allowed;pointer-events:none;opacity:.65;filter:alpha(opacity=65);-webkit-box-shadow:none;box-shadow:none}.btn-default{color:#333;background-color:#fff;border-color:#ccc}.btn-default:hover,.btn-default:focus,.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{color:#333;background-color:#e6e6e6;border-color:#adadad}.btn-default:active,.btn-default.active,.open>.dropdown-toggle.btn-default{background-image:none}.btn-default.disabled,.btn-default[disabled],fieldset[disabled] .btn-default,.btn-default.disabled:hover,.btn-default[disabled]:hover,fieldset[disabled] .btn-default:hover,.btn-default.disabled:focus,.btn-default[disabled]:focus,fieldset[disabled] .btn-default:focus,.btn-default.disabled:active,.btn-default[disabled]:active,fieldset[disabled] .btn-default:active,.btn-default.disabled.active,.btn-default[disabled].active,fieldset[disabled] .btn-default.active{background-color:#fff;border-color:#ccc}.btn-default .badge{color:#fff;background-color:#333}.btn-primary{color:#fff;background-color:#428bca;border-color:#357ebd}.btn-primary:hover,.btn-primary:focus,.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{color:#fff;background-color:#3071a9;border-color:#285e8e}.btn-primary:active,.btn-primary.active,.open>.dropdown-toggle.btn-primary{background-image:none}.btn-primary.disabled,.btn-primary[disabled],fieldset[disabled] .btn-primary,.btn-primary.disabled:hover,.btn-primary[disabled]:hover,fieldset[disabled] .btn-primary:hover,.btn-primary.disabled:focus,.btn-primary[disabled]:focus,fieldset[disabled] .btn-primary:focus,.btn-primary.disabled:active,.btn-primary[disabled]:active,fieldset[disabled] .btn-primary:active,.btn-primary.disabled.active,.btn-primary[disabled].active,fieldset[disabled] .btn-primary.active{background-color:#428bca;border-color:#357ebd}.btn-primary .badge{color:#428bca;background-color:#fff}.btn-success{color:#fff;background-color:#5cb85c;border-color:#4cae4c}.btn-success:hover,.btn-success:focus,.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{color:#fff;background-color:#449d44;border-color:#398439}.btn-success:active,.btn-success.active,.open>.dropdown-toggle.btn-success{background-image:none}.btn-success.disabled,.btn-success[disabled],fieldset[disabled] .btn-success,.btn-success.disabled:hover,.btn-success[disabled]:hover,fieldset[disabled] .btn-success:hover,.btn-success.disabled:focus,.btn-success[disabled]:focus,fieldset[disabled] .btn-success:focus,.btn-success.disabled:active,.btn-success[disabled]:active,fieldset[disabled] .btn-success:active,.btn-success.disabled.active,.btn-success[disabled].active,fieldset[disabled] .btn-success.active{background-color:#5cb85c;border-color:#4cae4c}.btn-success .badge{color:#5cb85c;background-color:#fff}.btn-info{color:#fff;background-color:#5bc0de;border-color:#46b8da}.btn-info:hover,.btn-info:focus,.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{color:#fff;background-color:#31b0d5;border-color:#269abc}.btn-info:active,.btn-info.active,.open>.dropdown-toggle.btn-info{background-image:none}.btn-info.disabled,.btn-info[disabled],fieldset[disabled] .btn-info,.btn-info.disabled:hover,.btn-info[disabled]:hover,fieldset[disabled] .btn-info:hover,.btn-info.disabled:focus,.btn-info[disabled]:focus,fieldset[disabled] .btn-info:focus,.btn-info.disabled:active,.btn-info[disabled]:active,fieldset[disabled] .btn-info:active,.btn-info.disabled.active,.btn-info[disabled].active,fieldset[disabled] .btn-info.active{background-color:#5bc0de;border-color:#46b8da}.btn-info .badge{color:#5bc0de;background-color:#fff}.btn-warning{color:#fff;background-color:#f0ad4e;border-color:#eea236}.btn-warning:hover,.btn-warning:focus,.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{color:#fff;background-color:#ec971f;border-color:#d58512}.btn-warning:active,.btn-warning.active,.open>.dropdown-toggle.btn-warning{background-image:none}.btn-warning.disabled,.btn-warning[disabled],fieldset[disabled] .btn-warning,.btn-warning.disabled:hover,.btn-warning[disabled]:hover,fieldset[disabled] .btn-warning:hover,.btn-warning.disabled:focus,.btn-warning[disabled]:focus,fieldset[disabled] .btn-warning:focus,.btn-warning.disabled:active,.btn-warning[disabled]:active,fieldset[disabled] .btn-warning:active,.btn-warning.disabled.active,.btn-warning[disabled].active,fieldset[disabled] .btn-warning.active{background-color:#f0ad4e;border-color:#eea236}.btn-warning .badge{color:#f0ad4e;background-color:#fff}.btn-danger{color:#fff;background-color:#d9534f;border-color:#d43f3a}.btn-danger:hover,.btn-danger:focus,.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{color:#fff;background-color:#c9302c;border-color:#ac2925}.btn-danger:active,.btn-danger.active,.open>.dropdown-toggle.btn-danger{background-image:none}.btn-danger.disabled,.btn-danger[disabled],fieldset[disabled] .btn-danger,.btn-danger.disabled:hover,.btn-danger[disabled]:hover,fieldset[disabled] .btn-danger:hover,.btn-danger.disabled:focus,.btn-danger[disabled]:focus,fieldset[disabled] .btn-danger:focus,.btn-danger.disabled:active,.btn-danger[disabled]:active,fieldset[disabled] .btn-danger:active,.btn-danger.disabled.active,.btn-danger[disabled].active,fieldset[disabled] .btn-danger.active{background-color:#d9534f;border-color:#d43f3a}.btn-danger .badge{color:#d9534f;background-color:#fff}.btn-link{color:#428bca;font-weight:normal;cursor:pointer;border-radius:0}.btn-link,.btn-link:active,.btn-link[disabled],fieldset[disabled] .btn-link{background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.btn-link,.btn-link:hover,.btn-link:focus,.btn-link:active{border-color:transparent}.btn-link:hover,.btn-link:focus{color:#2a6496;text-decoration:underline;background-color:transparent}.btn-link[disabled]:hover,fieldset[disabled] .btn-link:hover,.btn-link[disabled]:focus,fieldset[disabled] .btn-link:focus{color:#777;text-decoration:none}.btn-lg,.btn-group-lg>.btn{padding:10px 16px;font-size:18px;line-height:1.33;border-radius:6px}.btn-sm,.btn-group-sm>.btn{padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}.btn-xs,.btn-group-xs>.btn{padding:1px 5px;font-size:12px;line-height:1.5;border-radius:3px}.btn-block{display:block;width:100%}.btn-block+.btn-block{margin-top:5px}input[type="submit"].btn-block,input[type="reset"].btn-block,input[type="button"].btn-block{width:100%}.fade{opacity:0;-webkit-transition:opacity .15s linear;-o-transition:opacity .15s linear;transition:opacity .15s linear}.fade.in{opacity:1}.collapse{display:none}.collapse.in{display:block}tr.collapse.in{display:table-row}tbody.collapse.in{display:table-row-group}.collapsing{position:relative;height:0;overflow:hidden;-webkit-transition:height .35s ease;-o-transition:height .35s ease;transition:height .35s ease}.caret{display:inline-block;width:0;height:0;margin-left:2px;vertical-align:middle;border-top:4px solid;border-right:4px solid transparent;border-left:4px solid transparent}.dropdown{position:relative}.dropdown-toggle:focus{outline:0}.dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:160px;padding:5px 0;margin:2px 0 0;list-style:none;font-size:14px;text-align:left;background-color:#fff;border:1px solid #ccc;border:1px solid rgba(0,0,0,0.15);border-radius:4px;-webkit-box-shadow:0 6px 12px rgba(0,0,0,0.175);box-shadow:0 6px 12px rgba(0,0,0,0.175);background-clip:padding-box}.dropdown-menu.pull-right{right:0;left:auto}.dropdown-menu .divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.dropdown-menu>li>a{display:block;padding:3px 20px;clear:both;font-weight:normal;line-height:1.42857143;color:#333;white-space:nowrap}.dropdown-menu>li>a:hover,.dropdown-menu>li>a:focus{text-decoration:none;color:#262626;background-color:#f5f5f5}.dropdown-menu>.active>a,.dropdown-menu>.active>a:hover,.dropdown-menu>.active>a:focus{color:#fff;text-decoration:none;outline:0;background-color:#428bca}.dropdown-menu>.disabled>a,.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{color:#777}.dropdown-menu>.disabled>a:hover,.dropdown-menu>.disabled>a:focus{text-decoration:none;background-color:transparent;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled = false);cursor:not-allowed}.open>.dropdown-menu{display:block}.open>a{outline:0}.dropdown-menu-right{left:auto;right:0}.dropdown-menu-left{left:0;right:auto}.dropdown-header{display:block;padding:3px 20px;font-size:12px;line-height:1.42857143;color:#777;white-space:nowrap}';
                                    var seventh = '.dropdown-backdrop{position:fixed;left:0;right:0;bottom:0;top:0;z-index:990}.pull-right>.dropdown-menu{right:0;left:auto}.dropup .caret,.navbar-fixed-bottom .dropdown .caret{border-top:0;border-bottom:4px solid;content:""}.dropup .dropdown-menu,.navbar-fixed-bottom .dropdown .dropdown-menu{top:auto;bottom:100%;margin-bottom:1px}@media (min-width:768px){.navbar-right .dropdown-menu{left:auto;right:0}.navbar-right .dropdown-menu-left{left:0;right:auto}}.btn-group,.btn-group-vertical{position:relative;display:inline-block;vertical-align:middle}.btn-group>.btn,.btn-group-vertical>.btn{position:relative;float:left}.btn-group>.btn:hover,.btn-group-vertical>.btn:hover,.btn-group>.btn:focus,.btn-group-vertical>.btn:focus,.btn-group>.btn:active,.btn-group-vertical>.btn:active,.btn-group>.btn.active,.btn-group-vertical>.btn.active{z-index:2}.btn-group>.btn:focus,.btn-group-vertical>.btn:focus{outline:0}.btn-group .btn+.btn,.btn-group .btn+.btn-group,.btn-group .btn-group+.btn,.btn-group .btn-group+.btn-group{margin-left:-1px}.btn-toolbar{margin-left:-5px}.btn-toolbar .btn-group,.btn-toolbar .input-group{float:left}.btn-toolbar>.btn,.btn-toolbar>.btn-group,.btn-toolbar>.input-group{margin-left:5px}.btn-group>.btn:not(:first-child):not(:last-child):not(.dropdown-toggle){border-radius:0}.btn-group>.btn:first-child{margin-left:0}.btn-group>.btn:first-child:not(:last-child):not(.dropdown-toggle){border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn:last-child:not(:first-child),.btn-group>.dropdown-toggle:not(:first-child){border-bottom-left-radius:0;border-top-left-radius:0}.btn-group>.btn-group{float:left}.btn-group>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group>.btn-group:first-child>.btn:last-child,.btn-group>.btn-group:first-child>.dropdown-toggle{border-bottom-right-radius:0;border-top-right-radius:0}.btn-group>.btn-group:last-child>.btn:first-child{border-bottom-left-radius:0;border-top-left-radius:0}.btn-group .dropdown-toggle:active,.btn-group.open .dropdown-toggle{outline:0}.btn-group>.btn+.dropdown-toggle{padding-left:8px;padding-right:8px}.btn-group>.btn-lg+.dropdown-toggle{padding-left:12px;padding-right:12px}.btn-group.open .dropdown-toggle{-webkit-box-shadow:inset 0 3px 5px rgba(0,0,0,0.125);box-shadow:inset 0 3px 5px rgba(0,0,0,0.125)}.btn-group.open .dropdown-toggle.btn-link{-webkit-box-shadow:none;box-shadow:none}.btn .caret{margin-left:0}.btn-lg .caret{border-width:5px 5px 0;border-bottom-width:0}.dropup .btn-lg .caret{border-width:0 5px 5px}.btn-group-vertical>.btn,.btn-group-vertical>.btn-group,.btn-group-vertical>.btn-group>.btn{display:block;float:none;width:100%;max-width:100%}.btn-group-vertical>.btn-group>.btn{float:none}.btn-group-vertical>.btn+.btn,.btn-group-vertical>.btn+.btn-group,.btn-group-vertical>.btn-group+.btn,.btn-group-vertical>.btn-group+.btn-group{margin-top:-1px;margin-left:0}.btn-group-vertical>.btn:not(:first-child):not(:last-child){border-radius:0}.btn-group-vertical>.btn:first-child:not(:last-child){border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn:last-child:not(:first-child){border-bottom-left-radius:4px;border-top-right-radius:0;border-top-left-radius:0}.btn-group-vertical>.btn-group:not(:first-child):not(:last-child)>.btn{border-radius:0}.btn-group-vertical>.btn-group:first-child:not(:last-child)>.btn:last-child,.btn-group-vertical>.btn-group:first-child:not(:last-child)>.dropdown-toggle{border-bottom-right-radius:0;border-bottom-left-radius:0}.btn-group-vertical>.btn-group:last-child:not(:first-child)>.btn:first-child{border-top-right-radius:0;border-top-left-radius:0}.btn-group-justified{display:table;width:100%;table-layout:fixed;border-collapse:separate}.btn-group-justified>.btn,.btn-group-justified>.btn-group{float:none;display:table-cell;width:1%}.btn-group-justified>.btn-group .btn{width:100%}.btn-group-justified>.btn-group .dropdown-menu{left:auto}[data-toggle="buttons"]>.btn>input[type="radio"],[data-toggle="buttons"]>.btn>input[type="checkbox"]{position:absolute;z-index:-1;opacity:0;filter:alpha(opacity=0)}.input-group{position:relative;display:table;border-collapse:separate}.input-group[class*="col-"]{float:none;padding-left:0;padding-right:0}.input-group .form-control{position:relative;z-index:2;float:left;width:100%;margin-bottom:0}.input-group-lg>.form-control,.input-group-lg>.input-group-addon,.input-group-lg>.input-group-btn>.btn{height:46px;padding:10px 16px;font-size:18px;line-height:1.33;border-radius:6px}select.input-group-lg>.form-control,select.input-group-lg>.input-group-addon,select.input-group-lg>.input-group-btn>.btn{height:46px;line-height:46px}textarea.input-group-lg>.form-control,textarea.input-group-lg>.input-group-addon,textarea.input-group-lg>.input-group-btn>.btn,select[multiple].input-group-lg>.form-control,select[multiple].input-group-lg>.input-group-addon,select[multiple].input-group-lg>.input-group-btn>.btn{height:auto}.input-group-sm>.form-control,.input-group-sm>.input-group-addon,.input-group-sm>.input-group-btn>.btn{height:30px;padding:5px 10px;font-size:12px;line-height:1.5;border-radius:3px}select.input-group-sm>.form-control,select.input-group-sm>.input-group-addon,select.input-group-sm>.input-group-btn>.btn{height:30px;line-height:30px}textarea.input-group-sm>.form-control,textarea.input-group-sm>.input-group-addon,textarea.input-group-sm>.input-group-btn>.btn,select[multiple].input-group-sm>.form-control,select[multiple].input-group-sm>.input-group-addon,select[multiple].input-group-sm>.input-group-btn>.btn{height:auto}.input-group-addon,.input-group-btn,.input-group .form-control{display:table-cell}.input-group-addon:not(:first-child):not(:last-child),.input-group-btn:not(:first-child):not(:last-child),.input-group .form-control:not(:first-child):not(:last-child){border-radius:0}.input-group-addon,.input-group-btn{width:1%;white-space:nowrap;vertical-align:middle}.input-group-addon{padding:6px 12px;font-size:14px;font-weight:normal;line-height:1;color:#555;text-align:center;background-color:#eee;border:1px solid #ccc;border-radius:4px}.input-group-addon.input-sm{padding:5px 10px;font-size:12px;border-radius:3px}.input-group-addon.input-lg{padding:10px 16px;font-size:18px;border-radius:6px}.input-group-addon input[type="radio"],.input-group-addon input[type="checkbox"]{margin-top:0}.input-group .form-control:first-child,.input-group-addon:first-child,.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group>.btn,.input-group-btn:first-child>.dropdown-toggle,.input-group-btn:last-child>.btn:not(:last-child):not(.dropdown-toggle),.input-group-btn:last-child>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-top-right-radius:0}.input-group-addon:first-child{border-right:0}.input-group .form-control:last-child,.input-group-addon:last-child,.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group>.btn,.input-group-btn:last-child>.dropdown-toggle,.input-group-btn:first-child>.btn:not(:first-child),.input-group-btn:first-child>.btn-group:not(:first-child)>.btn{border-bottom-left-radius:0;border-top-left-radius:0}.input-group-addon:last-child{border-left:0}.input-group-btn{position:relative;font-size:0;white-space:nowrap}.input-group-btn>.btn{position:relative}.input-group-btn>.btn+.btn{margin-left:-1px}.input-group-btn>.btn:hover,.input-group-btn>.btn:focus,.input-group-btn>.btn:active{z-index:2}.input-group-btn:first-child>.btn,.input-group-btn:first-child>.btn-group{margin-right:-1px}.input-group-btn:last-child>.btn,.input-group-btn:last-child>.btn-group{margin-left:-1px}.nav{margin-bottom:0;padding-left:0;list-style:none}.nav>li{position:relative;display:block}.nav>li>a{position:relative;display:block;padding:10px 15px}.nav>li>a:hover,.nav>li>a:focus{text-decoration:none;background-color:#eee}.nav>li.disabled>a{color:#777}.nav>li.disabled>a:hover,.nav>li.disabled>a:focus{color:#777;text-decoration:none;background-color:transparent;cursor:not-allowed}.nav .open>a,.nav .open>a:hover,.nav .open>a:focus{background-color:#eee;border-color:#428bca}.nav .nav-divider{height:1px;margin:9px 0;overflow:hidden;background-color:#e5e5e5}.nav>li>a>img{max-width:none}.nav-tabs{border-bottom:1px solid #ddd}.nav-tabs>li{float:left;margin-bottom:-1px}.nav-tabs>li>a{margin-right:2px;line-height:1.42857143;border:1px solid transparent;border-radius:4px 4px 0 0}.nav-tabs>li>a:hover{border-color:#eee #eee #ddd}.nav-tabs>li.active>a,.nav-tabs>li.active>a:hover,.nav-tabs>li.active>a:focus{color:#555;background-color:#fff;border:1px solid #ddd;border-bottom-color:transparent;cursor:default}.nav-tabs.nav-justified{width:100%;border-bottom:0}.nav-tabs.nav-justified>li{float:none}.nav-tabs.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-tabs.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}@media (min-width:768px){.nav-tabs.nav-justified>li{display:table-cell;width:1%}.nav-tabs.nav-justified>li>a{margin-bottom:0}}.nav-tabs.nav-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs.nav-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs.nav-justified>.active>a,.nav-tabs.nav-justified>.active>a:hover,.nav-tabs.nav-justified>.active>a:focus{border-bottom-color:#fff}}.nav-pills>li{float:left}.nav-pills>li>a{border-radius:4px}.nav-pills>li+li{margin-left:2px}.nav-pills>li.active>a,.nav-pills>li.active>a:hover,.nav-pills>li.active>a:focus{color:#fff;background-color:#428bca}.nav-stacked>li{float:none}.nav-stacked>li+li{margin-top:2px;margin-left:0}.nav-justified{width:100%}.nav-justified>li{float:none}.nav-justified>li>a{text-align:center;margin-bottom:5px}.nav-justified>.dropdown .dropdown-menu{top:auto;left:auto}';
                                    var eight = '@media (min-width:768px){.nav-justified>li{display:table-cell;width:1%}.nav-justified>li>a{margin-bottom:0}}.nav-tabs-justified{border-bottom:0}.nav-tabs-justified>li>a{margin-right:0;border-radius:4px}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border:1px solid #ddd}@media (min-width:768px){.nav-tabs-justified>li>a{border-bottom:1px solid #ddd;border-radius:4px 4px 0 0}.nav-tabs-justified>.active>a,.nav-tabs-justified>.active>a:hover,.nav-tabs-justified>.active>a:focus{border-bottom-color:#fff}}.tab-content>.tab-pane{display:none}.tab-content>.active{display:block}.nav-tabs .dropdown-menu{margin-top:-1px;border-top-right-radius:0;border-top-left-radius:0}.navbar{position:relative;min-height:50px;margin-bottom:20px;border:1px solid transparent}@media (min-width:768px){.navbar{border-radius:4px}}@media (min-width:768px){.navbar-header{float:left}}.navbar-collapse{overflow-x:visible;padding-right:15px;padding-left:15px;border-top:1px solid transparent;box-shadow:inset 0 1px 0 rgba(255,255,255,0.1);-webkit-overflow-scrolling:touch}.navbar-collapse.in{overflow-y:auto}@media (min-width:768px){.navbar-collapse{width:auto;border-top:0;box-shadow:none}.navbar-collapse.collapse{display:block !important;height:auto !important;padding-bottom:0;overflow:visible !important}.navbar-collapse.in{overflow-y:visible}.navbar-fixed-top .navbar-collapse,.navbar-static-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{padding-left:0;padding-right:0}}.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:340px}@media (max-width:480px) and (orientation:landscape){.navbar-fixed-top .navbar-collapse,.navbar-fixed-bottom .navbar-collapse{max-height:200px}}.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:-15px;margin-left:-15px}@media (min-width:768px){.container>.navbar-header,.container-fluid>.navbar-header,.container>.navbar-collapse,.container-fluid>.navbar-collapse{margin-right:0;margin-left:0}}.navbar-static-top{z-index:1000;border-width:0 0 1px}@media (min-width:768px){.navbar-static-top{border-radius:0}}.navbar-fixed-top,.navbar-fixed-bottom{position:fixed;right:0;left:0;z-index:1030;-webkit-transform:translate3d(0, 0, 0);transform:translate3d(0, 0, 0)}@media (min-width:768px){.navbar-fixed-top,.navbar-fixed-bottom{border-radius:0}}.navbar-fixed-top{top:0;border-width:0 0 1px}.navbar-fixed-bottom{bottom:0;margin-bottom:0;border-width:1px 0 0}.navbar-brand{float:left;padding:15px 15px;font-size:18px;line-height:20px;height:50px}.navbar-brand:hover,.navbar-brand:focus{text-decoration:none}@media (min-width:768px){.navbar>.container .navbar-brand,.navbar>.container-fluid .navbar-brand{margin-left:-15px}}.navbar-toggle{position:relative;float:right;margin-right:15px;padding:9px 10px;margin-top:8px;margin-bottom:8px;background-color:transparent;background-image:none;border:1px solid transparent;border-radius:4px}.navbar-toggle:focus{outline:0}.navbar-toggle .icon-bar{display:block;width:22px;height:2px;border-radius:1px}.navbar-toggle .icon-bar+.icon-bar{margin-top:4px}@media (min-width:768px){.navbar-toggle{display:none}}.navbar-nav{margin:7.5px -15px}.navbar-nav>li>a{padding-top:10px;padding-bottom:10px;line-height:20px}@media (max-width:767px){.navbar-nav .open .dropdown-menu{position:static;float:none;width:auto;margin-top:0;background-color:transparent;border:0;box-shadow:none}.navbar-nav .open .dropdown-menu>li>a,.navbar-nav .open .dropdown-menu .dropdown-header{padding:5px 15px 5px 25px}.navbar-nav .open .dropdown-menu>li>a{line-height:20px}.navbar-nav .open .dropdown-menu>li>a:hover,.navbar-nav .open .dropdown-menu>li>a:focus{background-image:none}}@media (min-width:768px){.navbar-nav{float:left;margin:0}.navbar-nav>li{float:left}.navbar-nav>li>a{padding-top:15px;padding-bottom:15px}.navbar-nav.navbar-right:last-child{margin-right:-15px}}@media (min-width:768px){.navbar-left{float:left !important;float:left}.navbar-right{float:right !important;float:right}}.navbar-form{margin-left:-15px;margin-right:-15px;padding:10px 15px;border-top:1px solid transparent;border-bottom:1px solid transparent;-webkit-box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);box-shadow:inset 0 1px 0 rgba(255,255,255,0.1),0 1px 0 rgba(255,255,255,0.1);margin-top:8px;margin-bottom:8px}@media (min-width:768px){.navbar-form .form-group{display:inline-block;margin-bottom:0;vertical-align:middle}.navbar-form .form-control{display:inline-block;width:auto;vertical-align:middle}.navbar-form .input-group{display:inline-table;vertical-align:middle}.navbar-form .input-group .input-group-addon,.navbar-form .input-group .input-group-btn,.navbar-form .input-group .form-control{width:auto}.navbar-form .input-group>.form-control{width:100%}.navbar-form .control-label{margin-bottom:0;vertical-align:middle}.navbar-form .radio,.navbar-form .checkbox{display:inline-block;margin-top:0;margin-bottom:0;vertical-align:middle}.navbar-form .radio label,.navbar-form .checkbox label{padding-left:0}.navbar-form .radio input[type="radio"],.navbar-form .checkbox input[type="checkbox"]{position:relative;margin-left:0}.navbar-form .has-feedback .form-control-feedback{top:0}}@media (max-width:767px){.navbar-form .form-group{margin-bottom:5px}}@media (min-width:768px){.navbar-form{width:auto;border:0;margin-left:0;margin-right:0;padding-top:0;padding-bottom:0;-webkit-box-shadow:none;box-shadow:none}.navbar-form.navbar-right:last-child{margin-right:-15px}}.navbar-nav>li>.dropdown-menu{margin-top:0;border-top-right-radius:0;border-top-left-radius:0}.navbar-fixed-bottom .navbar-nav>li>.dropdown-menu{border-bottom-right-radius:0;border-bottom-left-radius:0}.navbar-btn{margin-top:8px;margin-bottom:8px}.navbar-btn.btn-sm{margin-top:10px;margin-bottom:10px}.navbar-btn.btn-xs{margin-top:14px;margin-bottom:14px}.navbar-text{margin-top:15px;margin-bottom:15px}@media (min-width:768px){.navbar-text{float:left;margin-left:15px;margin-right:15px}.navbar-text.navbar-right:last-child{margin-right:0}}.navbar-default{background-color:#f8f8f8;border-color:#e7e7e7}.navbar-default .navbar-brand{color:#777}.navbar-default .navbar-brand:hover,.navbar-default .navbar-brand:focus{color:#5e5e5e;background-color:transparent}.navbar-default .navbar-text{color:#777}.navbar-default .navbar-nav>li>a{color:#777}.navbar-default .navbar-nav>li>a:hover,.navbar-default .navbar-nav>li>a:focus{color:#333;background-color:transparent}.navbar-default .navbar-nav>.active>a,.navbar-default .navbar-nav>.active>a:hover,.navbar-default .navbar-nav>.active>a:focus{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav>.disabled>a,.navbar-default .navbar-nav>.disabled>a:hover,.navbar-default .navbar-nav>.disabled>a:focus{color:#ccc;background-color:transparent}.navbar-default .navbar-toggle{border-color:#ddd}.navbar-default .navbar-toggle:hover,.navbar-default .navbar-toggle:focus{background-color:#ddd}.navbar-default .navbar-toggle .icon-bar{background-color:#888}.navbar-default .navbar-collapse,.navbar-default .navbar-form{border-color:#e7e7e7}.navbar-default .navbar-nav>.open>a,.navbar-default .navbar-nav>.open>a:hover,.navbar-default .navbar-nav>.open>a:focus{background-color:#e7e7e7;color:#555}@media (max-width:767px){.navbar-default .navbar-nav .open .dropdown-menu>li>a{color:#777}.navbar-default .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>li>a:focus{color:#333;background-color:transparent}.navbar-default .navbar-nav .open .dropdown-menu>.active>a,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.active>a:focus{color:#555;background-color:#e7e7e7}.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-default .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#ccc;background-color:transparent}}.navbar-default .navbar-link{color:#777}.navbar-default .navbar-link:hover{color:#333}.navbar-default .btn-link{color:#777}.navbar-default .btn-link:hover,.navbar-default .btn-link:focus{color:#333}.navbar-default .btn-link[disabled]:hover,fieldset[disabled] .navbar-default .btn-link:hover,.navbar-default .btn-link[disabled]:focus,fieldset[disabled] .navbar-default .btn-link:focus{color:#ccc}.navbar-inverse{background-color:#222;border-color:#080808}.navbar-inverse .navbar-brand{color:#777}.navbar-inverse .navbar-brand:hover,.navbar-inverse .navbar-brand:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-text{color:#777}.navbar-inverse .navbar-nav>li>a{color:#777}.navbar-inverse .navbar-nav>li>a:hover,.navbar-inverse .navbar-nav>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav>.active>a,.navbar-inverse .navbar-nav>.active>a:hover,.navbar-inverse .navbar-nav>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav>.disabled>a,.navbar-inverse .navbar-nav>.disabled>a:hover,.navbar-inverse .navbar-nav>.disabled>a:focus{color:#444;background-color:transparent}.navbar-inverse .navbar-toggle{border-color:#333}.navbar-inverse .navbar-toggle:hover,.navbar-inverse .navbar-toggle:focus{background-color:#333}.navbar-inverse .navbar-toggle .icon-bar{background-color:#fff}.navbar-inverse .navbar-collapse,.navbar-inverse .navbar-form{border-color:#101010}.navbar-inverse .navbar-nav>.open>a,.navbar-inverse .navbar-nav>.open>a:hover,.navbar-inverse .navbar-nav>.open>a:focus{background-color:#080808;color:#fff}@media (max-width:767px){.navbar-inverse .navbar-nav .open .dropdown-menu>.dropdown-header{border-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu .divider{background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a{color:#777}';
                                    var nine = '.padding-0{padding:0}.paragraph-style{font-size: 12px;align:justify;background:white;border-radius: 4px; padding: 6px 12px;line-height: 1.42857143;border: 1px solid #ccc;}.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>li>a:focus{color:#fff;background-color:transparent}.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.active>a:focus{color:#fff;background-color:#080808}.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:hover,.navbar-inverse .navbar-nav .open .dropdown-menu>.disabled>a:focus{color:#444;background-color:transparent}}.navbar-inverse .navbar-link{color:#777}.navbar-inverse .navbar-link:hover{color:#fff}.navbar-inverse .btn-link{color:#777}.navbar-inverse .btn-link:hover,.navbar-inverse .btn-link:focus{color:#fff}.navbar-inverse .btn-link[disabled]:hover,fieldset[disabled] .navbar-inverse .btn-link:hover,.navbar-inverse .btn-link[disabled]:focus,fieldset[disabled] .navbar-inverse .btn-link:focus{color:#444}.breadcrumb{padding:8px 15px;margin-bottom:20px;list-style:none;background-color:#f5f5f5;border-radius:4px}.breadcrumb>li{display:inline-block}.breadcrumb>li+li:before{content:"/\00a0";padding:0 5px;color:#ccc}.breadcrumb>.active{color:#777}.pagination{display:inline-block;padding-left:0;margin:20px 0;border-radius:4px}.pagination>li{display:inline}.pagination>li>a,.pagination>li>span{position:relative;float:left;padding:6px 12px;line-height:1.42857143;text-decoration:none;color:#428bca;background-color:#fff;border:1px solid #ddd;margin-left:-1px}.pagination>li:first-child>a,.pagination>li:first-child>span{margin-left:0;border-bottom-left-radius:4px;border-top-left-radius:4px}.pagination>li:last-child>a,.pagination>li:last-child>span{border-bottom-right-radius:4px;border-top-right-radius:4px}.pagination>li>a:hover,.pagination>li>span:hover,.pagination>li>a:focus,.pagination>li>span:focus{color:#2a6496;background-color:#eee;border-color:#ddd}.pagination>.active>a,.pagination>.active>span,.pagination>.active>a:hover,.pagination>.active>span:hover,.pagination>.active>a:focus,.pagination>.active>span:focus{z-index:2;color:#fff;background-color:#428bca;border-color:#428bca;cursor:default}.pagination>.disabled>span,.pagination>.disabled>span:hover,.pagination>.disabled>span:focus,.pagination>.disabled>a,.pagination>.disabled>a:hover,.pagination>.disabled>a:focus{color:#777;background-color:#fff;border-color:#ddd;cursor:not-allowed}.pagination-lg>li>a,.pagination-lg>li>span{padding:10px 16px;font-size:18px}.pagination-lg>li:first-child>a,.pagination-lg>li:first-child>span{border-bottom-left-radius:6px;border-top-left-radius:6px}.pagination-lg>li:last-child>a,.pagination-lg>li:last-child>span{border-bottom-right-radius:6px;border-top-right-radius:6px}.pagination-sm>li>a,.pagination-sm>li>span{padding:5px 10px;font-size:12px}.pagination-sm>li:first-child>a,.pagination-sm>li:first-child>span{border-bottom-left-radius:3px;border-top-left-radius:3px}.pagination-sm>li:last-child>a,.pagination-sm>li:last-child>span{border-bottom-right-radius:3px;border-top-right-radius:3px}.pager{padding-left:0;margin:20px 0;list-style:none;text-align:center}.pager li{display:inline}.pager li>a,.pager li>span{display:inline-block;padding:5px 14px;background-color:#fff;border:1px solid #ddd;border-radius:15px}.pager li>a:hover,.pager li>a:focus{text-decoration:none;background-color:#eee}.pager .next>a,.pager .next>span{float:right}.pager .previous>a,.pager .previous>span{float:left}.pager .disabled>a,.pager .disabled>a:hover,.pager .disabled>a:focus,.pager .disabled>span{color:#777;background-color:#fff;cursor:not-allowed}.label{display:inline;padding:.2em .6em .3em;font-size:75%;font-weight:bold;line-height:1;color:#fff;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25em}a.label:hover,a.label:focus{color:#fff;text-decoration:none;cursor:pointer}.label:empty{display:none}.btn .label{position:relative;top:-1px}.label-default{background-color:#777}.label-default[href]:hover,.label-default[href]:focus{background-color:#5e5e5e}.label-primary{background-color:#428bca}.label-primary[href]:hover,.label-primary[href]:focus{background-color:#3071a9}.label-success{background-color:#5cb85c}.label-success[href]:hover,.label-success[href]:focus{background-color:#449d44}.label-info{background-color:#5bc0de}.label-info[href]:hover,.label-info[href]:focus{background-color:#31b0d5}.label-warning{background-color:#f0ad4e}.label-warning[href]:hover,.label-warning[href]:focus{background-color:#ec971f}.label-danger{background-color:#d9534f}.label-danger[href]:hover,.label-danger[href]:focus{background-color:#c9302c}.badge{display:inline-block;min-width:10px;padding:3px 7px;font-size:12px;font-weight:bold;color:#fff;line-height:1;vertical-align:baseline;white-space:nowrap;text-align:center;background-color:#777;border-radius:10px}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.btn-xs .badge{top:0;padding:1px 5px}a.badge:hover,a.badge:focus{color:#fff;text-decoration:none;cursor:pointer}a.list-group-item.active>.badge,.nav-pills>.active>a>.badge{color:#428bca;background-color:#fff}.nav-pills>li>a>.badge{margin-left:3px}.jumbotron{padding:30px;margin-bottom:30px;color:inherit;background-color:#eee}.jumbotron h1,.jumbotron .h1{color:inherit}.jumbotron p{margin-bottom:15px;font-size:21px;font-weight:200}.jumbotron>hr{border-top-color:#d5d5d5}.container .jumbotron{border-radius:6px}.jumbotron .container{max-width:100%}@media screen and (min-width:768px){.jumbotron{padding-top:48px;padding-bottom:48px}.container .jumbotron{padding-left:60px;padding-right:60px}.jumbotron h1,.jumbotron .h1{font-size:63px}}.thumbnail{display:block;padding:4px;margin-bottom:20px;line-height:1.42857143;background-color:#fff;border:1px solid #ddd;border-radius:4px;-webkit-transition:all .2s ease-in-out;-o-transition:all .2s ease-in-out;transition:all .2s ease-in-out}.thumbnail>img,.thumbnail a>img{margin-left:auto;margin-right:auto}a.thumbnail:hover,a.thumbnail:focus,a.thumbnail.active{border-color:#428bca}.thumbnail .caption{padding:9px;color:#333}.alert{padding:15px;margin-bottom:20px;border:1px solid transparent;border-radius:4px}.alert h4{margin-top:0;color:inherit}.alert .alert-link{font-weight:bold}.alert>p,.alert>ul{margin-bottom:0}.alert>p+p{margin-top:5px}.alert-dismissable,.alert-dismissible{padding-right:35px}.alert-dismissable .close,.alert-dismissible .close{position:relative;top:-2px;right:-21px;color:inherit}.alert-success{background-color:#dff0d8;border-color:#d6e9c6;color:#3c763d}.alert-success hr{border-top-color:#c9e2b3}.alert-success .alert-link{color:#2b542c}.alert-info{background-color:#d9edf7;border-color:#bce8f1;color:#31708f}.alert-info hr{border-top-color:#a6e1ec}.alert-info .alert-link{color:#245269}.alert-warning{background-color:#fcf8e3;border-color:#faebcc;color:#8a6d3b}.alert-warning hr{border-top-color:#f7e1b5}.alert-warning .alert-link{color:#66512c}.alert-danger{background-color:#f2dede;border-color:#ebccd1;color:#a94442}.alert-danger hr{border-top-color:#e4b9c0}.alert-danger .alert-link{color:#843534}@-webkit-keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}@keyframes progress-bar-stripes{from{background-position:40px 0}to{background-position:0 0}}.progress{overflow:hidden;height:20px;margin-bottom:20px;background-color:#f5f5f5;border-radius:4px;-webkit-box-shadow:inset 0 1px 2px rgba(0,0,0,0.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.1)}.progress-bar{float:left;width:0;height:100%;font-size:12px;line-height:20px;color:#fff;text-align:center;background-color:#428bca;-webkit-box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);box-shadow:inset 0 -1px 0 rgba(0,0,0,0.15);-webkit-transition:width .6s ease;-o-transition:width .6s ease;transition:width .6s ease}.progress-striped .progress-bar,.progress-bar-striped{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-size:40px 40px}.progress.active .progress-bar,.progress-bar.active{-webkit-animation:progress-bar-stripes 2s linear infinite;-o-animation:progress-bar-stripes 2s linear infinite;animation:progress-bar-stripes 2s linear infinite}.progress-bar[aria-valuenow="1"],.progress-bar[aria-valuenow="2"]{min-width:30px}.progress-bar[aria-valuenow="0"]{color:#777;min-width:30px;background-color:transparent;background-image:none;box-shadow:none}.progress-bar-success{background-color:#5cb85c}.progress-striped .progress-bar-success{background-image:-webkit-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:-o-linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent);background-image:linear-gradient(45deg, rgba(255,255,255,0.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.15) 75%, transparent 75%, transparent)}.progress-bar-info{background-color:#5bc0de}';
                                    var ten = `@media all {.section1{} 
                                    .upper-case { text-transform: uppercase; }
                                    .form-group {page-break-inside: avoid;display:block !important;} }
                                    .form-group{page-break-inside: avoid !important;display:block !important;}
                                    
                                            .fnt-28 {font-size: 28px;}
                                            .fnt-17 {font-size: 17px;}
                                            .fnt-16 {font-size: 16px;}
                                            .primary-color {color: #087483 !important;}
                                            .form-group label, .row label {color: #2F577B !important;}
                                            .form-group input {height: 40px;    font-size: 12px !important;}
                                            .count-fnt-12 * { font-size: 12px !important;}
                                            .count-fnt-12 { font-size: 12px !important;}
                                            .form-group div{ color: #3C3C3C !important;word-break: break-all;}
                                            .form-control {color: #3C3C3C !important;}
                                            .red input {color: #FF1C47 !important}
                                            .green input {color: #71BE68 !important}
                                            .amber input {color: #E0C055 !important}
                                            .box{width: 100%;}
                                            .accord { width: 100% !important; margin-bottom: 15px !important; 
                                                border-bottom: 1px solid #1169A9 !important; height: 48px !important;}
                                            .accord .heading-page {background: #1169A9 !important;
                                                color: #fff !important;
                                                font-size: 12px !important;
                                                text-transform: uppercase !important;
                                                font-weight: 800 !important;
                                                font-family: "Roboto", sans-serif !important;
                                                line-height: 38px !important;
                                                display: inline-block !important;
                                                padding: 0 60px 0 20px !important;
                                                -webkit-clip-path: polygon(0 0, 75% 0, 100% 100%, 0% 100%) !important;
                                                clip-path: polygon(0 0, 75% 0, 100% 100%, 0% 100%) !important;}
                                            .box-title {
                                                width: 100% !important;
                                                color: #0D2234 !important;
                                            }
                                            .brdr-top {
                                                border-top: 2px solid #000000 !important;
                                                width: 100% !important;
                                            }
                                            .brdr-top-dotted {
                                                border-top: 2px dotted #000000 !important;
                                            }
                                            .risk-mit {
                                                border: 1px solid #DBE2E5 !important;
                                                padding: 30px 40px !important;
                                                margin-bottom: 10px !important;
                                            }
                                            .risk-mit .head{
                                                color: #0D2234 !important;
                                                font-size: 15px !important;
                                                border-bottom: 1px dotted #DBE2E5 !important;
                                            }
                                            .risk-mit h1 {
                                                color: #0C3B64 !important;
                                                font-size: 11px !important;
                                                font-weight: bold !important;
                                            }
                                            .risk-mit ul li {
                                                list-style: none !important;
                                            }
                                            .risk-mit .bpa div > p { padding-left: 40px;}
                                            .risk-mit .bpa {
                                                color: #49505A !important;
                                                font-size: 11px !important;
                                                text-align: justify !important;
                                            }
                                            .risk-mit .bpa .brdr-bottom {
                                                border-bottom: 1px dotted #DBE2E5;
                                                padding-bottom: 10px;
                                            }
                                            .supp-doc {
                                                border: 1px solid #DFE1E3;
                                                padding: 13px 17px;
                                                border-radius: 5px;
                                                background: #F7F8F9 !important;
                                            }
                                            .p-brdr{
                                                word-break: break-all;
                                                border: 1px solid #DFE1E3 !important;
                                                padding: 10px !important;
                                                border-radius: 5px !important;
                                                font-size: 13px !important;
                                                min-height: 40px !important;
                                            }
                                            .p-que { color: #0D2234;font-size: 15px !important;font-weight: 400; }
                                            .p-que p {color: #0D2234;font-size: 15px !important;font-weight: 400;}
                                            a[href]:after { content : "" }
                                            html { zoom: 0.72; }
                                        </style> </head> <body>`;
                                        let raTraveller = traveller.firstname + ' ' + traveller.lastname;
                                        if ( newsRa.authorCheck == 1 ) {
                                            raTraveller = newsRa.author_id.firstname + ' ' + newsRa.author_id.lastname;
                                        }
                                        var approveHtml = ``;
                                        var date = ``;
                                        if ( fromApprove ) {
                                            
                                            var approvingManagerName = currenttraveller.firstname + ' ' + currenttraveller.lastname;
                                            // coming from approve RA page
                                            approveHtml = `<p class="fnt-17">
                                                    <span>Final Approving Manager:</span>
                                                    <span class="primary-color">${approvingManagerName}</span>
                                                </p>`;
                                            date = `<p class="fnt-17">
                                                    <span>Date of Approval:</span>
                                                    <span class="primary-color">${getformatedDate(new Date())}</span>
                                                </p>`;
                                        }
                                        // <h1 class="primary-color fnt-28" >${raTraveller}</h1>
                                        // <img style="display: none" class="bg" style="position:absolute;top: -90px !important;left: -50px; bottom: 0;height: 1620px;" 
                                        // src="https://s3.eu-west-2.amazonaws.com/riskapl-images/public/bg-pdf.png" />
                                        // background: url(https://s3.eu-west-2.amazonaws.com/riskapl-images/public/bg-pdf.png) top left no-repeat !important;
                                        //     background-size: contain !important;
                                    var leven = `
                                   
                                    <div class="" style="
                                        position: relative;
                                            text-align: center;
                                            width: 100%;height: 1050px;">
                                            <img  class="bg" style="position:absolute;top: -90px !important;left: -50px; bottom: 0;height: 1155px;" 
                                             src="https://s3.eu-west-2.amazonaws.com/riskapl-images/public/bg-pdf.png" />
                                            <div class="row" style="position: absolute; top: 0;left : 0;right: 0;bottom: 0;margin: auto;height: 260px">
                                                
                                                <div class="col-md-12" >
                                                    <img style="width: 229px;height: 135px;    margin-bottom: 78px;" src="https://s3.eu-west-2.amazonaws.com/riskapl-images/public/logo.svg" />
                                                    <h5 class="fnt-16" style="color:#2B2E34">RISK ASSESSMENT</h5>
                                                    
                                                    <p class="fnt-17">
                                                        <span>Project name:</span>
                                                        <span class="primary-color" >${newsRa.project_name}</span>
                                                    </p>
                                                    ${approveHtml}
                                                    ${date}
                                                </div>
                                            </div>
                                        </div>
                                        <div style="margin:20px !important;display : table !important; page-break-before: always;">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                    
                                    <section class="content" 
                                    style="margin:20px !important;" 
                                    id="myTemplate">
                                        
                                        
                                        <div class="">  
                                            <div class=""> 
                                                
                                                <div class="box box-primary traveltest" 
                                                style="height: 27cm;
                                                "> 
                                                    <div class="box-header with-border" >
                                                        <h4 class="box-title">
                                                            Risk Assessment Details
                                                            <hr class="brdr-top">
                                                        </h4> 
                                                    </div> 
                                                    <div class="box-body"> 
                                                        <div ng-if="showLoader" class="col-lg-7 pull-right"> 
                                                            <div loader-css="ball-pulse">
                                                            </div> 
                                                        </div> 
                                                        <div class="row"> 
                                                            <div class="col-xs-12"> 
                                                                <div class="form-group"> 
                                                                    <label class="upper-case" for="Project Name">Project Name </label>
                                                                    <input class="form-control" id="Project Name" 
                                                                        ng-bind="project_name" type="text" 
                                                                        value="${newsRa.project_name}"  
                                                                        placeholder="Project Name"> 
                                                                </div> 
                                                            </div>
                                                        </div> 
                                                        <div class="row"> 
                                                            <div class="col-xs-12"> 
                                                                <div class="form-group"> 
                                                                    <label class="upper-case" for="Department">Department</label> 
                                                                    <div style="background-color: white" class="p-brdr">${departmentArray}</div> 
                                                                </div> 
                                                            </div> 
                                                        </div> 
                                                        <div class="row"> 
                                                        <div class="padding-0"> 
                                                            <div class="col-xs-6"> 
                                                                <div class="form-group"> 
                                                                    <label class="upper-case" for="StartDate">Start Date</label> 
                                                                    <input class="form-control" id="StartDate" title="Start Date" 
                                                                        type="text" class="form-control" ng-model="startdate" 
                                                                        value="${getformatedDate(newsRa.startdate)}"  placeholder="Date of RA"> 
                                                                </div> 
                                                            </div> 
                                                            <div class="col-xs-6"> 
                                                                <div class="form-group"> 
                                                                    <label class="upper-case" for="enddate">End Date</label> 
                                                                    <input class="form-control" id="enddate" title="End Date"
                                                                        type="text" class="form-control" ng-model="enddate" 
                                                                        value="${getformatedDate(newsRa.enddate)}"  placeholder="End Date"> 
                                                                </div> 
                                                            </div>
                                                            </div>
                                                        </div>`;
                                    var aftlabel = '';
                                    if (newsRa.authorcheck == 0) {
                                        aftlabel += `<div class="row"> 
                                            <div class="col-xs-12">
                                                <div class="form-group"> 
                                                    <label class="upper-case" for="StartDate">Approving Manager</label> 
                                                    <input style="width:50% !important" class="form-control" 
                                                        id="StartDate" title="Approving" type="text" class="form-control"  
                                                        value="${newsRa.approvingManager[0].firstname}" "
                                                        ${newsRa.approvingManager[0].lastname}"  
                                                        placeholder="Approving Manager"> 
                                                </div> 
                                            </div>
                                        </div> <br/>`;
                                    } else if (newsRa.authorcheck == 1) {
                                        aftlabel += `<div class="row"> 
                                            <div class="col-xs-6">
                                                <div class="form-group"> 
                                                    <label class="upper-case" for="StartDate">Approving Manager</label> 
                                                    <input  class="form-control" id="StartDate" title="Approving" 
                                                        type="text" class="form-control"  
                                                        value="${newsRa.approvingManager[0].firstname}" " 
                                                        ${newsRa.approvingManager[0].lastname}"  
                                                        placeholder="Approving Manager"> 
                                                </div> 
                                            </div> 
                                            <div class="col-xs-6">
                                                <div class="form-group"> 
                                                    <label class="upper-case" for="StartDate">Author</label>
                                                    <input  class="form-control" id="StartDate" title="Author" 
                                                        type="text" class="form-control"  
                                                        value="${newsRa.author_id.firstname} " "
                                                        ${newsRa.author_id.lastname}"  placeholder="Author">
                                                </div>
                                            </div>
                                        </div> <br/>`;
                                    }

                                    aftlabel += '<div class="row"> <div class="col-xs-12"> <div class="form-group"> <label class="upper-case" for="TaskDescription">Task Description</label> <div  class="paragraph-style">' + newsRa.description_of_task + '</div></div> </div> </div> <br/> <div class="row"> <div class="col-xs-12"> <label class="upper-case" for="TaskDescription">Itinerary Description</label> <div class="paragraph-style" >' + newsRa.itineary_description + '</div> </div> </div> <br/>';
                                    
                                    if (newsRa.types_of_ra_id.countryrequired == true) {
                                        var aftlabel4 = '';
                                       
                                        
                                        countryMatrixData.forEach((item, key) => {
                                            var countrycolorname = "";
                                            if (item.country_id.color == "amber") {
                                                countrycolorname = "Amber";
                                                var inputstyle = 'style="color: #E0C055 !important;border: 1px solid #E0C055 !important; font-weight: 800 !important"';
                                            } else if (item.country_id.color == "red") {

                                                countrycolorname = "Red";

                                                inputstyle = 'style="color:#E24040 !important;border: 1px solid #E24040 !important; font-weight: 800 !important"';

                                            } else if (item.country_id.color == "green" || 'Green') {

                                                countrycolorname = "Green";


                                                inputstyle = 'style="color:#71BE68 !important;border: 1px solid #71BE68 !important; font-weight: 800 !important"';
                                            }

                                          
                                            if (item.description == undefined || null) {
                                                var countryDescription = '';
                                            } else {
                                                var countryDescription = item.description;
                                            }
                                            var checkSecurity = '';
                                            if (item.security != undefined && item.security != null) {
                                                checkSecurity = item.security;
                                            }
                                            
                                            aftlabel4 += `<br/>
                                            
                                                <div class="row">
                                                    <div class="col-xs-12">
                                                        <h1>${item.country_id.name}</h1>
                                                    </div>
                                                </div>
                                                
                                                <div class="row">
                                                <div class=" padding-0"> 
                                                    <div class="col-xs-3"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="Country">Country</label> 
                                                            <input  class="form-control" id="Country" 
                                                                title="Country" type="text" 
                                                                class="form-control" ng-model="raData.countryArr" 
                                                                value="${item.country_id.name}"  placeholder="Country"> 
                                                        </div> 
                                                    </div> 
                                                    <div class="col-xs-3"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="Classification">Classification</label> 
                                                            <input ${inputstyle} class="form-control" id="Classification" 
                                                                title="Classification" type="text" 
                                                                class="form-control" ng-model="raData.countrycolor"
                                                                value ="${countrycolorname}"  
                                                                placeholder="Classification"> 
                                                        </div> 
                                                    </div> 
                                                    </div>
                                                </div>`;
                                                if ( Array.isArray(graph) && graph.length > 0 ) {
                                                    aftlabel4 += `
                                                    <div class="row"> 
                                                        <div class="col-xs-12"> 
                                                            <label class="upper-case" for="TaskDescription">Country Risk Overview</label> 
                                                            <div style="background-color:#FFFFFF !important;">
                                                                <img src="${graph[key]}" width="300" height="150">
                                                            </div>
                                                        </div>
                                                    </div>`;
                                                }
                                                
                                                aftlabel4 += `
                                                <div class="row"> 
                                                    <div class="col-xs-12"> 
                                                        <div class="form-group" style="margin:left !important"> 
                                                            <label class="upper-case" for="des">Description</label> 
                                                            <p align="justify" class="count-fnt-12">${countryDescription}</p>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                <div class="row"> 
                                                    <div class="col-xs-12"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sec">Security</label> 
                                                            <p align="justify" class="count-fnt-12">${checkSecurity}</p>
                                                        </div> 
                                                    </div> 
                                                </div> 
                                                
                                               `;
                                               const conlen = countryMatrixData.length - 1;
                                            if ( countryMatrixData.length > 1 && conlen != key) {
                                                console.log('hiiiiiii');
                                                aftlabel4 += `<div style="margin:20px !important;display : table !important; page-break-before: always;">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;
                                            }

                                        });
                                    //    if ( countryMatrixData.length == 1 || countryMatrixData.length == '1' ) {
                                    //        aftlabel4 += `<div style="margin:20px !important;display : table !important; page-break-before: always;">
                                    //        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;
                                    //    }
                                        // aftlabel4 +='</div> </div><br />';
                                        
                                    } else {
                                        // aftlabel2 = '';
                                        aftlabel4 = '';
                                    }
                                    aftlabel4 += "</div>";
                                    var travellerdiv = '';
                                   
                                    travellerdiv += `
                                    
                                        <div class="box box-primary traveltest" style="clear:both;float:none;">`;
                                        // if ( countryMatrixData.length == 1 || countryMatrixData.length == '1' ) {
                                        //     travellerdiv += `<div style="margin:20px !important;display : table !important; page-break-before: always;">
                                        //     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>`;
                                        // }
                                        travellerdiv += `
                                        <div style="margin:20px !important;display : table !important; page-break-before: always;">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                        <div class="box-header with-border"> 
                                        <h4 class="box-title" >
                                            Traveller Details</h4> 
                                            <hr class="brdr-top">
                                        </div> 
                                        <div class="box-body" style="width:100% !important;">
                                            <div class="accord">
                                                <h6 class="heading-page">Primary Traveller:</h6> 
                                            </div>
                                            
                                            <div class="row"> <div class="col-xs-4"> 
                                                <div class="form-group"> 
                                                    <label class="upper-case" for="travellerFirstName">Name</label>
                                                    <input class="form-control" id="travellerFirstName" title="Traveller First Name" type="text" class="form-control" 
                                                        ng-model="raData.traveller_id.firstname" value="${traveller.firstname} ${traveller.lastname}"  placeholder="Traveller First Name"> 
                                                </div>
                                            </div>
                                        <div class="col-xs-5"> 
                                        <div class="form-group"> 
                                        <label class="upper-case" for="Email">Email</label> 
                                        <input class="form-control" id="Email" title="Traveller Email" type="text" class="form-control" 
                                            value="${traveller.email}"  placeholder="Email">
                                        </div> </div> 
                                        <div class="col-xs-3">
                                             <div class="form-group"> 
                                             <label class="upper-case" for="MobileNumber">Mobile Number</label>
                                              <input class="form-control" id="MobileNumber" title="Mobile Number" type="text" class="form-control" 
                                                value="${traveller.mobile_number}"  placeholder="Mobile Number"> </div> </div> </div>`;

                                    var passportdet = '';
                                    
                                    var travellerend = '</div></div><br />';

                                    var othertravellerdiv = "";

                                    if (typeof newsRa.travellerTeamArr != "undefined" && Array.isArray(newsRa.travellerTeamArr)) {

                                        if (newsRa.travellerTeamArr.length > 0) {

                                            othertravellerdiv += `<br><br><br>
                                                <div class="box box-primary" > 
                                                    <div class="box-header with-border"> 
                                                    </div>
                                                    <div class="box-body">
                                                    <div class="accord" style="display: block;height: 66px !important;">
                                                        <h6 class="heading-page" style="clear:both">Other Traveller:</h6> 
                                                    </div>`;
                                        }

                                        var otherpassportdet = '';


                                        newsRa.travellerTeamArr.forEach(function (teamarr) {
                                            console.log(teamarr.passport_details.emergency_contact)

                                            if (typeof teamarr.passport_details.emergency_contact == "undefined" || typeof teamarr.passport_details.emergency_contact.full_name == "undefined") {

                                                teamarr.passport_details.emergency_contact = {
                                                    full_name: "",
                                                    mobile_number: "",
                                                    email: "",
                                                    relationship_to_you: "",
                                                    alternative_full_name: "",
                                                    alternative_mobile_number: "",
                                                    alternative_email: "",
                                                    alternative_relationship_to_you: "",


                                                };
                                            }


                                            othertravellerdiv += ' <div class="row"> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="travellerFirstName">Name</label> <input class="form-control" id="travellerFirstName" title="Traveller First Name" type="text" class="form-control" ng-model="raData.traveller_id.firstname" value="' + teamarr.firstname + ' ' + teamarr.lastname + ' "  placeholder="Traveller First Name"> </div> </div>  <div class="col-xs-5"> <div class="form-group"> <label class="upper-case" for="Email">Email</label> <input class="form-control" id="Email" title="Traveller Email" type="text" class="form-control" value="' + teamarr.email + '"  placeholder="Email"> </div> </div> <div class="col-xs-3"> <div class="form-group"> <label class="upper-case" for="MobileNumber">Mobile Number</label> <input class="form-control" id="MobileNumber" title="Mobile Number" type="text" class="form-control" value="' + teamarr.mobile_number + '"  placeholder="Mobile Number"> </div> </div> </div>';

                                        })

                                        var othertravellerend = '</div</div><br />';
                                    }

                                    if (newsRa.types_of_ra_id.supplierRequired == true && supplierData.length > 0) {
                                    
                                            var supplier_details = `
                                            <div style="display : table !important;page-break-before: always;">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </div>
                                            <div class="box box-primary" > 
                                                <div class="box-header with-border">
                                                     
                                                    <h4 class="box-title">
                                                        Logistics<hr class="brdr-top">
                                                    </h4>
                                                </div> 
                                                <div class="box-body">`;

                                        supplierData.forEach(function (supplier, index) {

                                            if (typeof supplier.supplier_name == "undefined" || supplier.supplier_name == null) {
                                                supplier.supplier_name = "";
                                            }

                                            if (typeof supplier.number == "undefined" || supplier.number == null) {
                                                supplier.number = "";
                                            }

                                            if (typeof supplier.email == "undefined" || supplier.email == null) {
                                                supplier.email = "";
                                            }

                                            if (typeof supplier.country == "undefined" || supplier.country == null) {
                                                supplier.country = "";
                                            }
                                            if (typeof supplier.city == "undefined" || supplier.city == null) {
                                                supplier.city = "";
                                            }
                                            if (typeof supplier.cost == "undefined" || supplier.cost == null || supplier.cost == "") {
                                                supplier.cost = "";
                                            }

                                            if (typeof supplier.currency == "undefined" || supplier.currency == null || supplier.currency == "") {
                                                supplier.currency = "";
                                            }

                                            if (supplier.service_provided == "Accomodation") {
                                                supplier.service_provided = "Accommodation";
                                            }
                                            var suppcss = '';
                                            if ( index != 0 ) {
                                                suppcss = `brdr-top-dotted`;
                                            }
                                            supplier_details += `
                                                <div class="row ${suppcss}" style="display: inline-block; padding-top: 15px;margin-top:15px;" ng-repeat="supplier in supplier"> `;
                                                
                                            supplier_details += `
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sName">Supplier Name</label> 
                                                            <input class="form-control" id="sName" type="text" 
                                                                placeholder="Name"  value="${supplier.supplier_name}" title="Name">
                                                        </div>
                                                    </div> 
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="ServiceProvided">Service Provided</label>
                                                            <input class="form-control" id="ServiceProvided" type="text" 
                                                                placeholder="Service Provided"  title="Service Provided" 
                                                                value="${supplier.service_provided}"> 
                                                        </div>
                                                    </div>`;
                                                    if ( supplier.service_provided == 'Other - please specify' ) {
                                                        supplier_details += `<div class="col-xs-6"> 
                                                                <div class="form-group"> 
                                                                    <label class="upper-case" for="">Details</label>
                                                                    <input class="form-control" id="" type="text" 
                                                                        placeholder=""  title="" 
                                                                        value="${supplier.other_service}"> 
                                                                </div>
                                                            </div>`;
                                                    }
                                                    supplier_details += `<div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="ContactNumber">Mobile Number</label> 
                                                            <input class="form-control" type="text" id="ContactNumber" 
                                                                placeholder="Contact Number"  title="Contact Number" 
                                                                value="${supplier.number}" /> 
                                                        </div>
                                                    </div> 
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="ContactNumber">Email</label> 
                                                            <input class="form-control" type="text" id="ContactNumber" 
                                                                placeholder="Email"  title="Contact Number" 
                                                                value="${supplier.email}" /> 
                                                        </div>
                                                    </div> 
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sCountry">Country</label> 
                                                            <input class="form-control" id="sCountry" type="text" 
                                                                placeholder="Country"  value="${supplier.country}" 
                                                                title="Country">
                                                        </div>
                                                    </div> 
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sCountry">City</label> 
                                                            <input class="form-control" id="sCountry" type="text" 
                                                                placeholder="City"  value="${supplier.city}" 
                                                                title="Country">
                                                        </div>
                                                    </div> 
                                                    <div class="col-xs-6"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sCost">DAILY RATE</label> 
                                                            <input class="form-control" id="sCost" type="text"
                                                                 title="Cost" value="${supplier.cost}"> 
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6">
                                                        <div class="form-group">
                                                            <label class="upper-case" for="sCurrency">Currency</label>
                                                            <input class="form-control" id="sCurrency" type="text" 
                                                                  title="Currency" 
                                                                value="${supplier.currency}">
                                                        </div>
                                                    </div>
                                                   `;
                                                    
                                            if (typeof supplier.sourcing != "undefined" && (supplier.sourcing != null) && supplier.sourced_by == null) {
                                                supplier_details += `
                                                    <div class="col-xs-12"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sCurrency">Sourcing</label> 
                                                            <input class="form-control" id="sCurrency" type="text" 
                                                                placeholder="Sourcing"  title="Currency" 
                                                                value="${supplier.sourcing}"> 
                                                        </div>
                                                    </div>`;

                                                if (supplier.sourcing == "other") {

                                                    supplier_details += `
                                                        <div class="col-xs-12">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="sCurrency">Other Information</label> 
                                                                <p align="justify">${supplier.more_info}</p> 
                                                            </div>
                                                        </div>`;

                                                } else if (supplier.who_recommended != '' && supplier.who_recommended != null) {

                                                    supplier_details += `
                                                        <div class="col-xs-12">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="sCurrency">Recommended by</label> 
                                                                <input class="form-control" id="sName" type="text" 
                                                                      value="${supplier.who_recommended}"
                                                                    title="Name"> 
                                                            </div> 
                                                        </div> </br>`;

                                                }

                                            }
                                            else if (typeof supplier.sourced_by != "undefined" && supplier.sourced_by != null && supplier.sourcing == null) {
                                                supplier_details += `
                                                    <div class="col-xs-12">
                                                        <div class="form-group">
                                                            <label class="upper-case" for="sCurrency">SOURCED BY</label>
                                                            <input class="form-control" id="sName" type="text" 
                                                                 value="${supplier.sourced_by}" title="Name">
                                                        </div>
                                                    </div>`;

                                            }
                                            if (typeof supplier.description != "undefined" && supplier.description != "null" ) {

                                                supplier_details += `
                                                    <div class="col-xs-12"> 
                                                        <div class="form-group"> 
                                                            <label class="upper-case" for="sCurrency">Description</label> 
                                                            <div class="paragraph-style p-brdr">${supplier.description}</div> 
                                                        </div>
                                                    </div>`;
    
                                            }
                                            if (supplier.attachment != null && supplier.attachment != '') {
                                                // if (newsRa.supporting_docs.length > 0) {
                                                    // var supplier_details = '<b>File Attached</b>';
                                                    var link = supplier.attachment;
                                                    var split = link.split('/');
                                                    var docName = split[split.length - 1];
                                                    var docType = docName.split('.');
                                                    var img = `<img src="${config.icon_png_attachment}">`;
                                                    if ( docType == 'pdf' ) {
                                                        img = `<img src="${config.icon_pdf_attachment}">`;
                                                    }
                                                    
                                                    supplier_details += `<br /> 
                                                           
                                                                <div class="col-xs-12" style="margin-right: 10px;">
                                                                    <div class="form-group"> 
                                                                        <label for="">Attachment</label>
                                                                        <div style="display:block">
                                                                            <a style="display: inline-block;" href="${link}" class="supp-doc">
                                                                                ${img} ${docName}
                                                                            </a>
                                                                        </div>
                                                                </div></div><br/>`;
        
                                                // }
                                            }
                                            supplier_details += '</div>';

                                        })
                                    

                                        
                                        var supplierend = '</div> </div><br />';
                                    
                                 } else {
                                        supplier_details = '';
                                        supplierend = '';

                                    }
                                    console.log("supplierDatasupplierData :", supplierData);
                                    if (newsRa.types_of_ra_id.communicationRequired == true) {
                                        var sno_comm = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired) ? 4 : 3;


                                        var communication_details = `<div style="margin:20px !important;display : table !important; page-break-before: always;">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class="box box-primary"> <div class="box-header with-border"> </div> <div class="box-body">`;

                                        communication_details += '<div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <h4 class="box-title">Communications<hr class="brdr-top" > </h4> <div class="accord"><h6 class="heading-page">Team Contacts:</h6></div>';

                                        communicationData.forEach(function (communicationd) {


                                            communicationd.details_of_team.forEach(function (teamdetails) {

                                                if (typeof teamdetails.localName == "undefined" || teamdetails.localName == null || teamdetails.localName == "") {
                                                    teamdetails.localName = "";
                                                }

                                                if (typeof teamdetails.localTelephone == "undefined" || teamdetails.localTelephone == null || teamdetails.localTelephone == "") {
                                                    teamdetails.localTelephone = "";
                                                }

                                                if (typeof teamdetails.imei == "undefined" || teamdetails.imei == null || teamdetails.imei == "") {
                                                    teamdetails.imei = "";
                                                }

                                                communication_details += '<div class="row"> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">Name</label> <input class="form-control" type="text"  title="Currency" value="' + teamdetails.localName + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">LOCAL TELEPHONE</label> <input class="form-control" type="text"  title="Currency" value="' + teamdetails.localTelephone + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">IMEI</label> <input class="form-control" type="text"  title="Currency" value="' + teamdetails.imei + '"> </div> </div> </div>';

                                            })



                                        })

                                        communication_details += `<br/><br/> 
                                            <div style="diplay : block !important">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            </div>
                                            <div style="width: 100%;" class="accord"><h6 class="heading-page">
                                            LOCAL EMERGENCY CONTACTS </h6></div>`;


                                        communicationData.forEach(function (communicationd) {


                                            communicationd.emergency_contact.forEach(function (emergency) {

                                                if (typeof emergency.emgName == "undefined" || emergency.emgName == null || emergency.emgName == "") {
                                                    emergency.emgName = "";
                                                }

                                                if (typeof emergency.emgTelephone == "undefined" || emergency.emgTelephone == null || emergency.emgTelephone == "") {
                                                    emergency.emgTelephone = "";
                                                }

                                                if (typeof emergency.emgImei == "undefined" || emergency.emgImei == null || emergency.emgImei == "") {
                                                    emergency.emgImei == "";
                                                }
                                                if (typeof emergency.emgEmail == "undefined" || emergency.emgEmail == null || emergency.emgEmail == "") {
                                                    emergency.emgEmail = "";
                                                }
                                                if (typeof emergency.emgOtherInfo == "undefined" || emergency.emgOtherInfo == null || emergency.emgOtherInfo == "") {
                                                    emergency.emgOtherInfo = "";
                                                } 
                                                communication_details += '<div class="row"> <div class="col-xs-6"> <div class="form-group"> <label class="upper-case" for="sCurrency">Name</label> <input class="form-control" type="text"  title="Currency" value="' + emergency.emgName + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label class="upper-case" for="sCurrency">IMEI</label> <input class="form-control" type="text"  title="Currency" value="' + emergency.emgImei + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label class="upper-case" for="sCurrency">LOCAL TELEPHONE</label> <input class="form-control" type="text"  title="Currency" value="' + emergency.emgTelephone + '"> </div> </div> <div class="col-xs-6"> <div class="form-group"> <label class="upper-case" for="sCurrency">Email</label> <input class="form-control" type="text"  title="Currency" value="' + emergency.emgEmail + '"> </div> </div> </div>';
                         
                                                communication_details += '<div class="row"><div class="col-xs-12"> <div class="form-group"> <label class="upper-case" for="sCurrency">Other Information</label> <div class="p-brdr">' + emergency.emgOtherInfo + '</div></div></div></div>';

                                            })



                                        })

                                        communication_details += '<br/> <div style="clear:both;float:none;" class="accord"><h6 class="heading-page"> Check-in Schedule </h6></div>';


                                        communicationData.forEach(function (communicationd) {

                                            if (typeof communicationd.no_of_checkin == "undefined" || communicationd.no_of_checkin == null) {
                                                communicationd.no_of_checkin = "";
                                            }

                                            if (communicationd.timezone == undefined || null) {
                                                var checkTimezone = '';
                                            } else {
                                                checkTimezone = communicationd.timezone;
                                            }
                                            communication_details += '<div class=""> <div class="row"> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">NUMBER OF CHECK-INS </label> <input class="form-control" type="text"  title="Currency" value="' + communicationd.no_of_checkin + '"> </div> </div> <div class="col-xs-8"> <div class="form-group"> <label class="upper-case" for="sCurrency">TIMEZONE FOR CHECK-IN</label> <input class="form-control" type="text"  title="Currency" value="' + checkTimezone + '"> </div> </div>';
                                            communication_details += '</div>';

                                            var array_vall = [];
                                            var call_intime = getCheckInTime(communicationd.no_of_checkin);
                                            
                                            if (Array.isArray(call_intime)) {
                                                communication_details += `  <div class="row">
                                                <div class="form-group col-md-2 margin-bottom">
                                                  <label class="upper-case"> Check-In Times </label>
                                                </div>
                                              </div><div class="row" style="display: block">`;
                                                call_intime.forEach(function (calintime) {
                                                    array_vall.push(calintime.call_in_time);
                                                    communication_details += `
                                                    
                                                        <div class="form-group col-xs-2">
                                                            <input  class="form-control" id="call" title="" type="text" class="form-control"
                                                                value="${calintime.call_in_time}"  placeholder="">
                                                        </div>`;

                                                });
                                                communication_details += '</div>'
                                            }


                                            // var firstval = array_vall.slice(0, 12)
                                            // var secondval = array_vall.slice(12, 24)


                                            if (typeof communicationd.point_of_contact == "undefined" || communicationd.point_of_contact == null) {
                                                communicationd.point_of_contact = "";
                                            }

                                            if (typeof communicationd.number == "undefined" || communicationd.number == null) {
                                                communicationd.number = "";
                                            }

                                            if (typeof communicationd.email == "undefined" || communicationd.email == null) {
                                                communicationd.email = "";
                                            }



                                            communication_details += ' <div class="row" ><div class="col-xs-12" style="padding-left:0px; padding-right:0px"> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">Point of Contact</label> <input class="form-control" type="text"  title="Currency" value="' + communicationd.point_of_contact + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">TELEPHONE</label> <input class="form-control" type="text"  title="Currency" value="' + communicationd.number + '"> </div> </div> <div class="col-xs-4"> <div class="form-group"> <label class="upper-case" for="sCurrency">Email</label> <input class="form-control" type="text"  title="Currency" value="' + communicationd.email + '"> </div> </div></div><br />\n';
                                            communication_details += ' <div class="col-xs-12"> <div class="form-group"> <label class="upper-case" for="sCurrency">OVERDUE PROCEDURE (minutes/hours before concern; telephone cascade plan/system)</label> <p>';
                                            if (typeof communicationd.detail_an_overdue_procedure == "undefined" || communicationd.detail_an_overdue_procedure == null) {
                                                var overdue = "N/A";

                                            } else {
                                                overdue = communicationd.detail_an_overdue_procedure;

                                            }
                                            communication_details += '' + '<div class="paragraph-style p-brdr">' + overdue + '</div> </div> </div>';

                                        })


                                        var communication_end = '</div> </div> <br /> ';
                                    } else {

                                        communication_details = '';
                                        communication_end = '';
                                    }


                                    if (newsRa.types_of_ra_id.questionRequired == true || newsRa.types_of_ra_id.contingenciesRequired == true) {


                                        if (newsRa.types_of_ra_id.contingenciesRequired == true && contingencyData.length > 0) {

                                            var sno_cont = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 5 :
                                                (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 4 :
                                                    (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired) ? 4 : 3;

                                            var contigencieshtml = '<div style="margin:20px !important;display : table !important; page-break-before: always;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div><div class=""><div class="box box-primary"> <div class="box-header with-border"><div style="diplay : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div> <h4 class="box-title">Contingencies <hr class="brdr-top"></h4> </div> <div class="box-body">';

                                            contingencyData.forEach(function (contingency) {

                                                if (typeof contingency.medical_provision == "undefined" || contingency.medical_provision == null) {
                                                    contingency.medical_provision = "";
                                                }
                                                if (typeof contingency.method_of_evacuation == "undefined" || contingency.method_of_evacuation == null) {
                                                    contingency.method_of_evacuation = "";
                                                }
                                                if (typeof contingency.detail_nearest_hospital == "undefined" || contingency.detail_nearest_hospital == null) {
                                                    contingency.detail_nearest_hospital = "";
                                                }
                                                if (typeof contingency.medevac_company == "undefined" || contingency.medevac_company == null) {
                                                    contingency.medevac_company = "";
                                                }
                                                var detail_nearest_hospital = [];
                                                var medevac_company = [];
                                                if ( Array.isArray(contingency.detail_nearest_hospital) && contingency.detail_nearest_hospital.length > 0 ) {
                                                    contingency.detail_nearest_hospital.map(item => {
                                                        detail_nearest_hospital.push(item.localHospitalInfo)
                                                    })
                                                }
                                                if ( Array.isArray(contingency.medevac_company) && contingency.medevac_company.length > 0 ) {
                                                    contingency.medevac_company.map(item => {
                                                        medevac_company.push(item.medicalCompany)
                                                    })
                                                }
                                                contigencieshtml += `
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="form-group">
                                                                <label class="upper-case" for="MedicalProvision">WHAT MEDICAL PROVISIONAL/SKILL IS THERE TO TREAT A CASUALTY AT POINT OF INJURY?</label>
                                                                <input class="form-control" id="MedicalProvision" type="text" 
                                                                     value="${contingency.medical_provision}" 
                                                                    title="Medical Provision" placeholder="Medical Provision">
                                                            </div>
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="Evacuation">METHOD OF EVACUATION TO NEAREST HOSPITAL (SELF DRIVE/AMBULANCE ETC)</label>
                                                                <input class="form-control" id="Evacuation" type="text" 
                                                                    placeholder="Method Of Evacuation"  
                                                                    value="${contingency.method_of_evacuation}" 
                                                                    title="Method Of Evacuation"> 
                                                            </div>
                                                        </div>
                                                    </div>`;
                                                    if ( Array.isArray(contingency.detail_nearest_hospital) && contingency.detail_nearest_hospital.length > 0 ) {
                                                        contigencieshtml += `  <div class="row">
                                                        <div class="form-group col-md-2 " style="margin-bottom: 0;">
                                                          <label class="upper-case">Local Hospital Information</label>
                                                        </div>
                                                      </div><div class="row" style="display: block">`;
                                                      contingency.detail_nearest_hospital.forEach(function (hospital) {
                                                        contigencieshtml += `
                                                            
                                                                <div class="form-group col-xs-6">
                                                                    <div style="min-height: 40px;" class="paragraph-style p-brdr">${hospital.localHospitalInfo}</div>
                                                                </div>`;
        
                                                        });
                                                        contigencieshtml += '</div>';
                                                    }
                                                    if ( Array.isArray(contingency.medevac_company) && contingency.medevac_company.length > 0 ) {
                                                        contigencieshtml += `  <div class="row" style="display: block; clear: both;">
                                                        <div class="form-group col-md-2" style="margin-bottom: 0;">
                                                          <label class="upper-case">Medical Evacuation Company</label>
                                                        </div>
                                                      </div><div class="row" style="display: block">`;
                                                      contingency.medevac_company.forEach(function (med) {
                                                        contigencieshtml += `
                                                            
                                                                <div class="form-group col-xs-6">
                                                                    <div style="min-height: 40px;" class="paragraph-style p-brdr">${med.medicalCompany}</div>
                                                                </div>`;
        
                                                        });
                                                        contigencieshtml += '</div>'
                                                    }
                                                    if ( Array.isArray(contingency.embassy_location) && contingency.embassy_location.length > 0 ) {
                                                        contigencieshtml += `  <div class="row" style="display: block; clear: both;">
                                                        <div class="form-group col-md-2 " style="margin-bottom: 0;">
                                                          <label class="upper-case">EMBASSY LOCATION</label>
                                                        </div>
                                                      </div><div class="row" style="display: block">`;
                                                      contingency.embassy_location.forEach(function (med) {
                                                        contigencieshtml += `
                                                            
                                                                <div class="form-group col-xs-6">
                                                                    <div style="min-height: 40px;" class="paragraph-style p-brdr">${med.embassyLoc}</div>
                                                                </div>`;
        
                                                        });
                                                        contigencieshtml += '</div>'
                                                    }
                                                    
                                                    
                                                if (contingency.first_aid_kit == true) {

                                                    var fiaid = contingency.first_aid_kit_details;
                                                } else {
                                                    fiaid = " ";

                                                }

                                                if (contingency.personal_protective_equipment == true) {

                                                    var ppi = contingency.personal_protective_equipment_details;
                                                } else {
                                                    ppi = " ";
                                                }
                                                if (contingency.no_of_satellite_phone == undefined || null) {
                                                    var satellitePhone = '';
                                                } else {
                                                    satellitePhone = contingency.no_of_satellite_phone;
                                                }
                                                if (contingency.no_of_tracker == undefined || null) {
                                                    var noOfTracker = '';
                                                } else {
                                                    var noOfTracker = contingency.no_of_tracker;
                                                }
                                                contigencieshtml += `
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="NearestHospital">First Aid Kit</label>
                                                                <input class="form-control" type="text" 
                                                                    value="${fiaid}"> 
                                                            </div> 
                                                        </div> 
                                                        <div class="col-xs-6"> 
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="Medevac">PERSONAL PROTECTIVE EQUIPMENT (PPE)</label>
                                                                <input class="form-control" type="text" 
                                                                    value="${ppi}">  
                                                            </div> 
                                                        </div>
                                                        <div class="col-xs-6">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="Medevac">Satellite Phone</label> 
                                                                <input type="text" class="form-control"  value="${satellitePhone}" id="test3" /> 
                                                            </div> 
                                                        </div> 
                                                        <div class="col-xs-6">
                                                            <div class="form-group"> 
                                                                <label class="upper-case" for="Medevac">Tracker ID</label> 
                                                                <input type="text" class="form-control"  value="${noOfTracker}" id="" />
                                                            </div>
                                                        </div> 
                                                    </div>`;
                                                contigencieshtml += `
                                                    <div class="row">
                                                        <div class="col-xs-6">
                                                            <div class="form-group">
                                                                <label class="upper-case" for="MedicalProvision">ADDITIONAL ITEMS</label>
                                                                <div style="min-height: 40px;" class="paragraph-style p-brdr">${contingency.additional_item}</div>
                                                            </div>
                                                        </div>
                                                    </div>`;

                                            })
                                        }

                                        if (newsRa.types_of_ra_id.questionRequired == true) {

                                            var sno_ques = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
                                                (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                    (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                        (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                            (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                    (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                        (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 : 3;


                  

                                            contigencieshtml += `<br />
                                            <div style="margin:20px !important;display : table !important; page-break-before: always;">
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                            <div class="row" > <div class="col-xs-12"> 
                                                <div class="form-group"><h4 class="box-title">
                                                        Risks and Mitigation<hr class="brdr-top"></h4> 

                                                    `;
                                            queData.forEach(function (que) {
                                                if (que.ticked) {
                                                    
                                                    var smclass = '';
                                                    if ( que.specific_mitigation != '') {
                                                        smclass = "brdr-bottom";
                                                    }

                                                    contigencieshtml += `
                                                    <div class="risk-mit" 
                                                        style="width: 100%;display: inline-block;page-break-after: avoid;margin-top: 20px !important;">
                                                    <div class="p-que" >
                                                        ${que.question}
                                                    </div>
                                                    <hr style="border-top: 1px dotted #DBE2E5 !important" />
                                                    <div class="bpa">
                                                            <h1>MITIGATION ADVICE</h1>
                                                            <div class="${smclass}">${que.best_practice_advice}</div>`;
                                                    if ( que.specific_mitigation != '') {
                                                        contigencieshtml += `<div>
                                                                <h1>SPECIFIC INFORMATION</h1>
                                                                <div>${que.specific_mitigation}</div>
                                                            </div>`;
                                                    }
                                                            
                                                    contigencieshtml += `</div></div>`;
                                                   
                                                }

                                            })
                                        }

                                        contigencieshtml += ' </div> </div> </div>';




                                        var contigenciesend = '</div></div><div style="display : block !important">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div></div><br />';

                                    } else {
                                        contigencieshtml = '';
                                        contigenciesend = '';

                                    }
                                    var baseUrl = envConfig.host;

                                    if (newsRa.supporting_docs != null) {
                                        if (newsRa.supporting_docs.length > 0) {
                                            var supporting_content = `<div class="" style="clear:both"> 
                                                <label style="display: block">UPLOAD SUPPORTING MATERIAL</label></ br>`;
                                            var count = 1;
                                            newsRa.supporting_docs.forEach(function (docs, index) {

                                                var link = docs;
                                                var split = link.split('/');
                                                var docName = split[split.length - 1];
                                                var docType = docName.split('.');
                                                var img = `<img style="float:left" src="${config.icon_png_attachment}">`;
                                                if ( docType == 'pdf' ) {
                                                    img = `<img style="float:left" src="${config.icon_pdf_attachment}">`;
                                                }
                                                
                                                supporting_content += `
                                                    
                                                        <div class="" style="float:left;margin-right:15px;margin-bottom: 15px;" >
                                                            <a style="display: inline-block;" href="${link}" class="supp-doc">${img} 
                                                            
                                                            <span style="word-break: break-all; margin-left: 5px;width:80%; position: relative;top: 5px;">${docName}</span></a>
                                                        </div>`;
                                                count++;

                                            });
                                            supporting_content += '</div>'

                                        }
                                    }

                                    var doc = "1516367980241_risk.png";

                                    var sno_anyother = (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 7 :
                                        (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
                                            (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
                                                (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 6 :
                                                    (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 6 :
                                                        (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                            (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                                (newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                                    (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                                        (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 5 :
                                                                            (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 5 :

                                                                                (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                                    (newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                                        (!newsRa.types_of_ra_id.supplierRequired && newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                                            (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && newsRa.types_of_ra_id.contingenciesRequired && !newsRa.types_of_ra_id.questionRequired) ? 4 :
                                                                                                (!newsRa.types_of_ra_id.supplierRequired && !newsRa.types_of_ra_id.communicationRequired && !newsRa.types_of_ra_id.contingenciesRequired && newsRa.types_of_ra_id.questionRequired) ? 4 : 3;


                                    if (typeof newsRa.risk_detailed == "undefined" || newsRa.risk_detailed == null) {
                                        newsRa.risk_detailed = "";
                                    }
                                    if (typeof newsRa.relevant_info == "undefined" || newsRa.relevant_info == null) {
                                        newsRa.relevant_info = "";
                                    }

                                    var otherinfodetails = 
                                    `
                                     <div class="">
                                        <div class="box box-primary">
                                            <div class="box-header with-border">  
                                                <div class="box-body"> 
                                                    <div class="row"> 
                                                        <div class="col-xs-12">
                                                            <h4 class="box-title">ADDITIONAL INFORMATION
                                                                <hr class="brdr-top">
                                                            </h4> 
                                                            <div class="form-group"> 
                                                                <label  class="upper-case" for="relevant_info">
                                                                    PLEASE PROVIDE ANY INFORMATION THAT YOU HAVE MISSED OR EXPLAIN WHY SECTIONS OF THE RISK ASSESSMENT HAVE BEEN LEFT INCOMPLETE
                                                                </label> 
                                                                <span> 
                                                                    <div style="align:justify" class="p-brdr">
                                                                        ${newsRa.relevant_info}
                                                                    </div> 
                                                                </span> 
                                                            </div>
                                                        </div> 
                                                    </div> 
                                                    <div class="row"> 
                                                        <div class="col-xs-12"> 
                                                            <div class="form-group">
                                                                <label class="upper-case" class="upper-case" for="risk_detailed">
                                                                    PLEASE DETAIL ANY OTHER RISKS NOT ALREADY IDENTIFIED
                                                                </label> 
                                                                <span> 
                                                                    <div style="align:justify" class="p-brdr">
                                                                        ${newsRa.risk_detailed}
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>`;

                                    if (newsRa.supporting_docs.length > 0) {
                                        otherinfodetails += supporting_content;
                                    }
                                    var enddiv = '</div></div></div></div>    </div></div> </section>';
                                    var twleve = '<style> table { width: 100%; } table, th, td { border: 1px solid black; border-collapse: collapse; } th, td { padding: 5px; text-align: left; } table#t01 tr:nth-child(even) { background-color: #eee; } table#t01 tr:nth-child(odd) { background-color: #fff; } table#t01 th { background-color: #3c8dbc; color: white; } </style> </body> </html>';


                                    var result_str = first + second + third + fourth + fivth + sixth + seventh + eight + nine + ten + leven + aftlabel + aftlabel4 + travellerdiv + passportdet + travellerend + othertravellerdiv + otherpassportdet + othertravellerend + supplier_details + supplierend + communication_details + communication_end + contigencieshtml + contigenciesend + otherinfodetails + enddiv + twleve;
                                    var result = result_str.replace(/undefined/g, '');
                                    var filePath = './clientPortal/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                                    // console.log('resultttttt', result);
                                    // console.log('resulttttt', result);
                                    

                                    phantom.create(['--ignore-ssl-errors=yes']).then(function (ph) {


                                        ph.createPage().then(function (page) {
                                            var paperSize = {
                                                format: 'A4',
                                                orientation: 'portrait', // portrait or landscape
                                                width: '21cm',
                                                height: '27cm',
                                                margin: '40px !important',
                                                // header: {
                                                //     height: "50px",
                                                //     contents: ph.callback(function (pageNum, numPages) {
                                                //         if ( pageNum != 1 ) {
                                                //             return "<span style='float:right;color:#4863A0'><i>Riskpal</i></span><br/><hr style=' margin-bottom: 10px !important; border: 0; border-top: 2px solid #4863A0 !important;'><br />";
                                                //         }
                                                        
                                                //     })
                                                // },



                                            };
                                            function footer(approvingManagerName, date) {
                                                return function (pageNum, numPages) {
                                                  var title='%APPROVINGMANAGER%';
                                                  var daterange = '%DATE%';
                                                  html = [];
                                                  if ( pageNum != 1 ) {
                                                    html = [
                                                        '<div style="background: #087483;width: 100%;display: table;padding: 13px 0;margin: 0 !important;"><div style="font-size:12px;color: white;" class="col-xs-10"><b>Approval Date:</b>' + daterange + '<span style="margin-right: 5px;margin-left: 5px;"> |</span> <b>Final Approving Manager: </b>' + title + '</div><div  style="font-size:12px;color: white;text-align: right;padding-right: 22px;" class="col-xs-2">' + pageNum + "</div></div>"
                                                      ];
                                                  }
                                                  
                                                 
                                                  return html.join('');
                                                }
                                                .toString()
                                                .replace(/%APPROVINGMANAGER%/, approvingManagerName)
                                                .replace(/%DATE%/, date);
                                              }
                                            if ( fromApprove ) {
                                                // coming from approve RA page
                                                // paperSize.footer = { height: "28px", contents: ph.callback(footer(approvingManagerName, new Date())) };
                                            }
                                            console.log('pagersize', paperSize);
                                            page.property(
                                                'paperSize', paperSize).then(function () {
                                                    page.property('content', result).then(function () {
                                                        setTimeout(function () {
                                                            page.render(filePath).then(function () {
                                                                page.close();
                                                                ph.exit();
                                                                console.log('file generated:- ', filePath)
                                                                fs.readFile(filePath, function (err, fileData) {
                                                                    if (fileData) {
                                                                        console.log(approvingManager)
                                                                        callback(newsRa, filePath, approvingManager, fileData);
                                                                    }
                                                                    
                                                                })
                                                            });
                                                        }, 4000);
                                                    }).catch(function (err) {
                                                        console.log('Err:- ', err);
                                                    });
                                                }).catch(function (err) {
                                                    console.log('Err:- ', err);
                                                });
                                        }).catch(function (err) {
                                            console.log('Err:- ', err);
                                        });
                                    })

                                })
                        }
                    });


                }


            })





}
var getCheckInTime = function(checkInNumber) {
    
    callInTime = [];
    const numberOfCheckIn = 24 / checkInNumber;
    let org_time = '0';
    let dummy_val = 0;
    for (let i = 0; i < checkInNumber; i++) {
      callInTime.push({ call_in_time: org_time });
      dummy_val = Math.round(dummy_val + numberOfCheckIn);

      if (dummy_val == 0) {
        org_time = "0000";
      } else if (dummy_val == 1) {
        org_time = "0100";
      } else if (dummy_val == 2) {
        org_time = "0200";
      } else if (dummy_val == 3) {
        org_time = "0300";
      } else if (dummy_val == 4) {
        org_time = "0400";
      } else if (dummy_val == 5) {
        org_time = "0500";
      } else if (dummy_val == 6) {
        org_time = "0600";
      } else if (dummy_val == 7) {
        org_time = "0700";
      } else if (dummy_val == 8) {
        org_time = "0800";
      } else if (dummy_val == 9) {
        org_time = "0900";
      } else if (dummy_val == 10) {
        org_time = "1000";
      } else if (dummy_val == 11) {
        org_time = "1100";
      } else if (dummy_val == 12) {
        org_time = "1200";
      } else if (dummy_val == 13) {
        org_time = "1300";
      } else if (dummy_val == 14) {
        org_time = "1400";
      } else if (dummy_val == 15) {
        org_time = "1500";
      } else if (dummy_val == 16) {
        org_time = "1600";
      } else if (dummy_val == 17) {
        org_time = "1700";
      } else if (dummy_val == 18) {
        org_time = "1800";
      } else if (dummy_val == 19) {
        org_time = "1900";
      } else if (dummy_val == 20) {
        org_time = "2000";
      } else if (dummy_val == 21) {
        org_time = "2100";
      } else if (dummy_val == 22) {
        org_time = "2200";
      } else if (dummy_val == 23) {
        org_time = "2300";
      }
    }
    return callInTime;
}

var getformatedDate = function(date){
    var today = new Date(date);
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    }
    return dd+'/'+mm+'/'+yyyy;
}
/* @function : getDepartmentList
 *  @author  : MadhuriK 
 *  @created  : 11-Jun-17
 *  @modified :
 *  @purpose  : To getDepartmentList.
 */
exports.getDepartmentList = function (req, res, next) {

    userTable.findOne({
        _id: req.traveller.id,
        is_deleted: false
    }).populate('client_id').exec(function (err, traveller) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            departmentObj.find({
                // client_admin_id: traveller.client_admin_id,
                client_id: traveller.client_id._id,
                is_deleted: false,
                status: 'Active'
            }, function (err, departArr) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': departArr,
                    });
                }
            })
        }
    })
}


/* @function : getRaDetails
 *  @author  : MadhuriK 
 *  @created  : 11-Jun-17
 *  @modified :
 *  @purpose  : To getRaDetails.
 */
exports.getRaDetails = function (req, res, next) {
    if (req.params.raId) {
        typeOfRaObj.findOne({
            _id: req.params.raId
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': raData,
                });
            }
        })
    }
}


/* @function : getRaQuestions
 *  @author  : MadhuriK 
 *  @created  : 25-July-17
 *  @modified :
 *  @purpose  : To get questions of selected ra.
 */
exports.getRaQuestions = function (req, res, next) {
    if (req.params.ra_id) {
        questionnaireObj.find({
            assigned_ra_id: req.params.ra_id,
            is_deleted: false,
            status: "Active"
        }, function (err, questions) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questions,
                });
            }
        })
    }

}

/* @function : addQuestionToRa
 *  @author  : MadhuriK 
 *  @created  : 25-July-17
 *  @modified :
 *  @purpose  : To add questions to ra.
 */
exports.addQuestionToRa = function (req, res, next) {
    if (req.user.id && req.body.news_ra_id) {
        newsRaAnsObj.update({
            news_ra_id: req.body.news_ra_id,
            questionnaire_id: req.body.questionnaire_id
        }, {
                $set: {
                    ticked: req.body.ticked
                }
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Question updated successfully',
                    });
                }
            }
        )
    }

}




/* @function : addQuestionToRa
 *  @author  : MadhuriK 
 *  @created  : 25-July-17
 *  @modified :
 *  @purpose  : To add questions to ra.
 */
exports.addQuestionToRaupdate = function (req, res, next) {
    if (req.body) {
        var question = req.body;
        console.log("sbody :", question)
        newsRaAnsObj.update({
            _id: question._id
        }, {
                $set: {
                    specific_mitigation: question.specific_mitigation
                }
            }, function (err) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'message': 'Failed to update specific Information!'
                    });

                } else {
                    newsRaAnsObj.find({news_ra_id: req.body.news_ra_id}, function(err, data){
                    res.json({
                        'query': data,
                        'code': config.success,
                        'message': 'Specific Information updated successfully'
                    });
                })
                }
            })

    } else {
        res.json({
            'code': config.error,
            'message': 'No data provided in the request body!'
        });
    }
}

/* @function : InsertquestiontoRa
 *  @author  : Riskpal 
 *  @created  : 10-Sep-18
 *  @modified :
 *  @purpose  : To add questions to RA first page load 
 */
exports.insertquestiontora = function (req, res, next) {
    var news_ra_id = req.body[0].newsRa_id;
    var types_of_ra_id = req.body[0].types_of_ra_id;
    console.log("testttttttt")
    console.log(req.body)
    console.log(news_ra_id)

    var quesArr = [];

    newsRaObj.findOne({
        _id: news_ra_id,
        is_deleted: false,
    }, function (err, newsradetails) {

        console.log(newsradetails)

        req.body.forEach(function (que) {
            quesArr.push({
                traveller_id: newsradetails.traveller_id,
                news_ra_id: news_ra_id,
                types_of_ra_id: types_of_ra_id,

                questionnaire_id: que.questionnaire_id ? que.questionnaire_id : que._id,
                question: que.question,
                best_practice_advice: que.best_practice_advice,
                ticked: que.ticked ? que.ticked : false,
                specific_mitigation: que.specific_mitigation ? que.specific_mitigation : ""
            });
        })

        async.each(quesArr, function (que, fn) {
            var news_ra_ans = new newsRaAnsObj(que);
            news_ra_ans.save(function (err, success) {
                console.log("1111111111111111111111111111111111111111111111111111");
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


    })
}

/* @function : getNewsRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get specific mitigation of questions filled by traveller .
 */
exports.getRaAnswers = function (req, res, next) {

    if (req.params.types_of_ra_id && req.params.newsRa_id) {
        newsRaAnsObj.find({
            news_ra_id: req.params.newsRa_id,
            types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false
        }, function (err, newsRa) {
            if (newsRa.length > 0) {
                res.json({
                    'code': config.success,
                    'data': newsRa,
                    'message': 'success',
                });
            } else {
                questionnaireObj.find({
                    assigned_ra_id: req.params.types_of_ra_id,
                    is_deleted: false,
                    status: "Active"
                }, function (err, questions) {
                    if (questions.length > 0) {
                        var questionArray = [];
                        questions.forEach(function (question) {
                            questionArray.push({
                                news_ra_id: req.params.newsRa_id,
                                types_of_ra_id: req.params.types_of_ra_id,
                                category_id: question.category_id,
                                questionnaire_id: question.questionnaire_id ? question.questionnaire_id : question._id,
                                question: question.question,
                                best_practice_advice: question.best_practice_advice,
                                ticked: question.ticked ? question.ticked : false,
                                specific_mitigation: question.specific_mitigation ? question.specific_mitigation : ""
                            });
                        });
                        var count = 0;

                        async.each(questionArray, function (que, fn) {
                            var news_ra_ans = new newsRaAnsObj(que);
                            news_ra_ans.save(function (err, success) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    console.log("qqq :", count);
                                    count++;
                                    console.log("vvv :", count);
                                    if(questionArray.length == count){
                                    newsRaAnsObj.find({news_ra_id: req.params.newsRa_id}, function(err, data){
                                        if(err){
                                            next(createError(config.serverError, err));
                                        } else {
                                            res.json({
                                                'code': config.success,
                                                'data' : data,
                                                'fromQuery': questionArray,
                                                'message': 'sucess',
                                            });
                                        }
                                    });
                                   
                                }
                                }
                            })
                        }
                        // , function (err) {
                          
                        // }
                    );
                    } else {
                        res.json({
                            'code': config.success,
                            'data': [],
                            'message': 'no data',
                        });
                    }
                }
                )
            }
        })
    }

}



/* @function : getSupplierDetailsOfRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get supplier details of ra before submit ra.
 */
exports.getSupplierDetailsOfRa = function (req, res, next) {
    if (req.params.newsRa_id && req.params.types_of_ra_id) {
        supplierObj.findOne({
            news_ra_id: req.params.newsRa_id,
            types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            service_provided: "Local Contact"
        }, function (err, supplierData) {


            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplierData,
                    'message': 'success',
                });
            }
        })
    }
}

/* @function : getSupplierDetailsOfRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get supplier details of ra before submit ra.
 */
exports.getSupplierDetailsOfRaLocalContact = function (req, res, next) {
    if (req.params.newsRa_id && req.params.types_of_ra_id) {
        supplierObj.findOne({
            news_ra_id: req.params.newsRa_id,
            types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            service_provided: "Local Contact"
        }, function (err, supplierData) {


            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplierData,
                    'message': 'success',
                });
            }
        })
    }
}

/* @function : getSupplierDetailsOfRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get supplier details of ra before submit ra.
 */
exports.getSupplierDetailsOfRaLocalDriver = function (req, res, next) {
    if (req.params.newsRa_id && req.params.types_of_ra_id) {
        supplierObj.findOne({
            news_ra_id: req.params.newsRa_id,
            types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            service_provided: "Local Driver"
        }, function (err, supplierData) {


            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplierData,
                    'message': 'success',
                });
            }
        })
    }
}
/* @function : getSupplierDetailsOfRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get supplier details of ra before submit ra.
 */
exports.getSupplierDetailsOfRaAccomadation = function (req, res, next) {
    if (req.params.newsRa_id && req.params.types_of_ra_id) {
        supplierObj.findOne({
            news_ra_id: req.params.newsRa_id,
            types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            service_provided: "Accomodation"
        }, function (err, supplierData) {
            console.log("1111111111111111111111111111111111111111111111")

            console.log(supplierData)
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplierData,
                    'message': 'success',
                });
            }
        })
    }
}
getNewsRaRecords = function(query) {
    return newsRaObj.findOne(query).lean(true).exec();
}
updateNewsRa = function(query, toUpdate) {
    newsRaObj.findOneAndUpdate(query, {
            $set: toUpdate
        }, { new: true }).exec();
}

/* @function : getSupplierDetailsOfRa
 *  @author  : MadhuriK 
 *  @created  : 26-July-17
 *  @modified :
 *  @purpose  : To get supplier details of ra before submit ra.
 */
exports.getSupplierDetailsOfRaOther = function (req, res, next) {
    const newsRa_id = req.params.newsRa_id;
    if (req.params.newsRa_id && req.params.types_of_ra_id) {
        supplierObj.find({
            news_ra_id: req.params.newsRa_id,
            // types_of_ra_id: req.params.types_of_ra_id,
            is_deleted: false
        }, function (err, supplierData) {
            if (supplierData.length > 0) {
                res.json({
                    'code': config.success,
                    'data': supplierData,
                    'message': 'success.',
                });
            } else {
                supplierObj.find({
                    types_of_ra_id: req.params.types_of_ra_id,
                    
                    // $or: [
                    //     {from_template: {$exists: false}},
                    //     {from_template: false}
                    // ],
                    is_deleted: false
                }, async function (err, suppliers) {
                    console.log('suppliers', suppliers);
                    
                    if (suppliers.length > 0) {
                        try {
                        const newsRaData = await getNewsRaRecords({
                            _id: newsRa_id,
                            from_template: true,
                            is_deleted: false
                        });
                        console.log('newsRadataaa', newsRaData);
                        if ( newsRaData === null ) {
                            
                        
                                const updateRA = await updateNewsRa({
                                    _id: newsRa_id,
                                    is_deleted: false
                                }, {from_template: true});
console.log('updateRA', updateRA);
                                var supplierArray = [];
                                var newsRaId = req.params.newsRa_id;

                                async.each(suppliers, function (supp, fn) {

                                    supplierObj.update({
                                        _id: supp._id
                                    }, {
                                            $push: {
                                                news_ra_id: newsRaId
                                            },
                                            from_template: true
                                        }, {new: true}, function (err, success) {
                                            if ( err) {
                                                fn(err);
                                            } else {
                                                console.log('succcessss', success);
                                                fn(null, success);
                                            }
                                            
                                        })
                                }, function (err, supplierss) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'data': suppliers,
                                            'message': 'success..',
                                        });
                                    }
                                });
                            } else {
                                res.json({
                                    'code': config.success,
                                    'data': [],
                                    'message': 'no data',
                                });
                            }
                        } catch (e) {
                            res.json({
                                'code': config.success,
                                'data': [],
                                'message': 'no data',
                            });
                        }
                    } else {
                        res.json({
                            'code': config.success,
                            'data': [],
                            'message': 'no data',
                        });
                    }
                }
                )
            }
        })
    }
}
exports.deleteOthersuppliers = function (req, res, next) {
    if (req.params.user_id) {
        supplierObj.update({
            _id: req.params.user_id,
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
                        'message': 'Supplier deleted successfully'
                    });
                }
            })
    }

}


exports.getSupplierRaData = function (req, res, next) {
    console.log('dfgdgdfgdfg', req.body);
    console.log(req.user.id);
    userTable.findOne({
        _id: req.user.id,
        super_admin: false,
        is_deleted: false
    }).populate('client_id').lean().exec(function (err, traveller) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            supplierObj.find({
                // types_of_ra_id: req.body.ra_id,
                client_id: traveller.client_id._id,
                // companyId: traveller.client_admin_id.companyId,
                is_deleted: false
            }).lean().exec(function (err, supplierData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': supplierData,
                        'message': 'success',
                    });
                }
            })
            //}
        }
    })
}

exports.getRaCommunicationData = function (req, res, next) {
    console.log(req.user.id);
    // userTable.findOne({
    //     _id: req.user.id,
    //     super_admin: false,
    //     is_deleted: false
    // }).populate('client_id').exec(function (err, traveller) {
    //     if (err) {
    //         next(createError(config.serverError, err));

    //     } else {
    // traveller.client_admin_id

    // if (req.params.newsRa_id && req.params.types_of_ra_id) {
    if (req.body) {
        communicationObj.findOne({
            types_of_ra_id: req.body.types_of_ra_id,
            // client_id: traveller.client_id,
            // companyId: traveller.client_admin_id.companyId,
            is_deleted: false
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': communicationData,
                    'message': 'success',
                });
            }
        });
    }
    //}
    //     }
    // })
}

exports.getRasPreviewData = function (req, res, next) {
    if (req.params.newsRa_id) {
        newsRaObj.findOne({
            _id: req.params.newsRa_id,
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
                function (err, raData) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else if (raData) {
                        async.waterfall([
                            function (callback) {
                                newsRaAnsObj.find({
                                    news_ra_id: req.params.newsRa_id,
                                    is_deleted: false
                                })
                                    .populate('category_id')
                                    .exec(function (err, queData) {
                                        if (err) {
                                            callback(err, []);
                                        } else {
                                            callback(null, queData);
                                        }
                                    })
                            },
                            function (queData, callback) {
                                userTable.find({
                                    _id: raData.traveller_id,
                                    is_deleted: false
                                })
                                    .populate('client_id')
                                    .populate('department')
                                    .exec(function (err, userdata) {
                                        if (err) {
                                            callback(err, []);
                                        } else {
                                            callback(null, queData, userdata);
                                        }
                                    })
                            },
                            function (queData, userdata, callback) {
                                supplierObj.find({
                                    news_ra_id: req.params.newsRa_id,
                                    is_deleted: false
                                }, function (err, supplierData) {
                                    console.log("supplierData>>>>>>>>", supplierData)
                                    if (err) {
                                        callback(err, [], []);
                                    } else {
                                        callback(null, queData, userdata, supplierData);
                                    }
                                })
                            },
                            function (queData, userdata, supplierData, callback) {
                                communicationObj.find({
                                    news_ra_id: req.params.newsRa_id,
                                    is_deleted: false
                                }, function (err, communicationData) {
                                    if (err) {
                                        callback(err, [], [], []);
                                    } else {
                                        callback(null, queData, userdata, supplierData, communicationData);
                                    }
                                })
                            },
                            function (queData, userdata, supplierData, communicationData, callback) {
                                contingencyObj.find({
                                    news_ra_id: req.params.newsRa_id,
                                    is_deleted: false
                                }, function (err, contingencyData) {
                                    if (err) {
                                        callback(err, [], [], [], []);
                                    } else {
                                        callback(null, queData, userdata, supplierData, communicationData, contingencyData);
                                    }
                                })
                            }
                        ], function (err, queData, userdata, supplierData, communicationData, contingencyData) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'queData': queData,
                                    'raData': raData,
                                    'supplierData': supplierData,
                                    'communicationData': communicationData,
                                    'contingencyData': contingencyData,
                                    'userdata': userdata

                                })
                            }
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'success',
                            'raData': raData,
                        });
                    }
                })
    }
}

exports.getRaContingencyData = function (req, res, next) {
    console.log(req.user.id);
    // userTable.findOne({
    //     _id: req.user.id,
    //     super_admin: false,
    //     is_deleted: false
    // }).populate('client_id').exec(function (err, traveller) {
    //     if (err) {
    //         next(createError(config.serverError, err));
    //     } else {
    if (req.body) {
        contingencyObj.findOne({
            types_of_ra_id: req.body.types_of_ra_id,
            // client_id: traveller.client_id._id,
            //companyId: traveller.client_admin_id.companyId,
            is_deleted: false
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': contingencyData,
                    'message': 'success'
                });
            }
        });
    }
    //     }
    // })
}


exports.insertToRa = function (req, res, next) {
    if (req.user.id) {
        var questionData = req.body;
        if (questionData) {
            if (questionData.ticked) {
                var newQuestion = {
                    news_ra_id: questionData.news_ra_id,
                    types_of_ra_id: questionData.types_of_ra_id,
                    category_id: questionData.category_id,
                    questionnaire_id: questionData.questionnaire_id ? questionData.questionnaire_id : questionData._id,
                    question: questionData.question,
                    best_practice_advice: questionData.best_practice_advice,
                    ticked: questionData.ticked ? questionData.ticked : false,
                    specific_mitigation: questionData.specific_mitigation ? questionData.specific_mitigation : ""
                };
                var ra_new_question = new newsRaAnsObj(newQuestion);
                ra_new_question.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'New question added successfully'
                        });
                    }

                })
            } else {
                if (questionData._id) {
                    newsRaAnsObj.remove(
                        {
                            'questionnaire_id': questionData._id
                        }, function (err) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                res.json({
                                    'code': config.success,
                                    'message': 'Question deleted successfully'
                                });
                            }
                        })
                } else {
                    res.json({
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                }

            }

        } else {
            res.json({
                'code': config.error,
                'message': 'No data provided in the request body!'
            });
        }
    } else {
        res.json({
            'code': config.error,
            'message': 'Authentication failed!'
        });
    }
}