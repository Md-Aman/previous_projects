var config = require('../../config/jwt_secret.js'); // require config file
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // include type_of_ra schema file
var countryObj = require('./../../schema/country.js'); // include country schema file
var countryThreatMatrixObj = require('./../../schema/country_threat_matrix.js'); // include country schema file
var departmentObj = require('./../../schema/department.js'); // include department schema file
var questionnaireObj = require('./../../schema/questionnaire.js'); // include questionnaire schema file
var categoryObj = require('./../../schema/category.js'); // include category schema file
var userObj = require('./../../schema/users.js'); // include users schema file
var newsRaObj = require('./../../schema/news_ra.js'); // include news_ra schema file
var newsRaAns = require('./../../schema/news_ra_answer.js'); // include news_ra_answer schema file
var currencyObj = require('./../../schema/currency.js'); // include currency schema file
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var countryRiskObj = require('./../../schema/country_risk.js'); // include country_risk schema file
var communicationObj = require('./../../schema/communication.js'); // include communication schema file
var contingencyObj = require('./../../schema/contingency.js'); // include contingency schema file
var riskAssociatedCategoryObj = require('./../../schema/risk_associated_category.js'); // include risk_associated_category schema file
var async = require('async');
var csv = require("fast-csv");
var fs = require('fs-extra');
var json2csv = require('json2csv');
var multer = require('multer');
var crypto = require('crypto');
var _ = require('underscore');
var curl = require('curl');
var url = 'https://itravelsecure.com/webscr/ws_hr.php';
var pd = require('pretty-data').pd;
var xmlJs = require("xml-js")
var sanitizeHtml = require('sanitize-html');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
var parseNumber = require('libphonenumber-js').parse;
var countryCode = require('libphonenumber-js').getPhoneCode;
var clientObj= require('./../../schema/clients.js');  //Clients schema 
var createError = require('http-errors');
/* @function : getAllRiskAssessment
 *  @author  : MadhuriK 
 *  @created  : 27-July-17
 *  @modified :
 *  @purpose  : To get all risk assessments created by client super admin.
 */

exports.getAllRiskAssessment = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        '$and': []
    };
    if (req.user.super_admin == true) {
        var client_id = "";
        query['$and'].push({
            is_deleted: false,
            is_created_compleletely: true,
            created_by_client_admin: true,
            // client_id: client_id,
            // companyId: req.user.companyID
        })
    } else {
        client_id = req.user.client_id
        query['$and'].push({
            is_deleted: false,
            is_created_compleletely: true,
            created_by_client_admin: true,
            client_id: client_id,
            // companyId: req.user.companyID
        })
    }
    var keyword = req.body.keyword ? req.body.keyword : '';
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
                ra_name: {
                    "$in": regex
                }
            }, {
                client_name: {
                    "$in": regex
                }
            }]
        });
    }
    typeOfRaObj.find(query)
        .populate('country')
        .populate('client_id')
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
}


/* @function : getAllRiskAssessment
 *  @author  : MadhuriK 
 *  @created  : 27-July-17
 *  @modified :
 *  @purpose  : To get all risk assessments created by client super admin.
 */

exports.getAllRiskAssessmentByMA = function (req, res, next) {
    userObj.findOne({ _id: req.user.id, is_deleted: false })

        .exec(function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                var limit = req.body.count ? req.body.count : 10;
                var sortby = req.body.sortby ? req.body.sortby : {};
                var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
                var query = {
                    '$and': []
                };
                query['$and'].push({
                    $or: [{ sector_name: { $in: [user.sector_id] } }, { companyId: user.companyId }],
                    is_deleted: false,
                    is_created_compleletely: true,
                    created_by_master_admin: true
                })
                var keyword = req.body.keyword ? req.body.keyword : '';
                if (keyword) {
                    var keywordArray = keyword.split(' ')
                    let regex = keywordArray.map(function (e) {
                        return new RegExp(e, "i");
                    });
                    query['$and'].push({
                        $or: [{
                            ra_name: {
                                "$in": regex
                            }
                        }, {
                            client_name: {
                                "$in": regex
                            }
                        }]
                    });
                }
                typeOfRaObj.find(query)
                    .populate('sector_name')
                    .populate('client_id')
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
            }
        })
}



// exports.getAllRiskAssessmentByMA = function(req, res, next) {
//     userObj.findOne({ _id: req.user.id, is_deleted: false })
//         .exec(function(err, user) {
//             if (err) {
//                 res.json({
//                     'error': err,
//                     'code': config.error,
//                     'message': 'Something went wrong please try again!'
//                 });
//             } else {
//                 var limit = req.body.count ? req.body.count : 10;
//                 var sortby = req.body.sortby ? req.body.sortby : {};
//                 var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
//                 var query = {
//                     '$and': []
//                 };
//                 query['$and'].push({
//                     $or: [{ sector_name: { $in: [user.sector_id] } }, { companyId: user.companyId }],
//                     is_deleted: false,
//                     is_created_compleletely: true,
//                     created_by_master_admin: true
//                 })
//                 var keyword = req.body.keyword ? req.body.keyword : '';
//                 if (keyword) {
//                     var keywordArray = keyword.split(' ')
//                     regex = keywordArray.map(function(e) {
//                         return new RegExp(e, "i");
//                     });
//                     query['$and'].push({
//                         $or: [{
//                             ra_name: {
//                                 "$in": regex
//                             }
//                         }, {
//                             client_name: {
//                                 "$in": regex
//                             }
//                         }]
//                     });
//                 }
//                 typeOfRaObj.aggregate([{
//                         $match: query
//                     }, {
//                         $sort: { createdAt: -1 }
//                     }, {
//                         $skip: skip
//                     },
//                     {
//                         $limit: limit
//                     },
//                 ], function(err, result) {
//                     if (err) {
//                         res.json({
//                             'code': config.error,
//                             'error': err
//                         })
//                     } else {
//                         res.json({
//                             'code': config.success,
//                             'data': result,
//                             'count': result.length
//                         })
//                     }

//                 })
//             }
//         })
// }

/* @function : getCountryListForRa
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get all country list 
 */
exports.getCountryListForRa = function (req, res, next) {
    countryObj.find({}, function (err, countArr) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': countArr,
            });
        }
    })
}



/* @function : getAllDepartmentOfClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get all department list of client super admin 
 */
exports.getAllDepartmentOfClient = function (req, res, next) {
    if (req.user.id) {
        departmentObj.find({
            // client_admin_id: req.user.id,
            companyId: req.user.companyID,
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
}



/* @function : createIndividualRa
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To create ra by client super admin
 */
exports.createIndividualRa = function (req, res, next) {
    if (req.body) {
        if (req.user.super_admin == 1) {
            //req.body.client_id= JSON.parse(req.body.client_id)._id;
        } else {
            req.body.client_id = req.user.client_id;
        }
        var raData = {
            ra_name: req.body.ra_name,
            client_id: req.body.client_id,
            communicationRequired: req.body.communicationRequired,
            contingenciesRequired: req.body.contingenciesRequired,
            supplierRequired: req.body.supplierRequired,
            questionRequired: req.body.questionRequired,
            client_department: req.body.clientDepartment,
            countryrequired: req.body.countryrequired,
            is_individual: true,
            country: req.body.country,
            // country: (req.body.country !== null && req.body.country !== 'Select Country') ? JSON.parse(req.body.country)._id : null,
            country_name:  null,
            created_by_client_admin: true,

        }
        var saveDataObj = new typeOfRaObj(raData);
        saveDataObj.save(function (err, raObj) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Risk assessment created successfully',
                    'data': raObj
                });
            }
        })

    }
}




/* @function : updateIndividualRa
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To update ra by client super admin 
 */
exports.updateIndividualRa = function (req, res, next) {
    if (req.body) {
        // var cID;
        // var cName;
        // if (req.body.country != null) {
        //     if (req.body.country.name.indexOf("id") == -1) {
        //         cID = req.body.country._id;
        //         cName = req.body.country.name;
        //     } else {
        //         cID = JSON.parse(req.body.country.name);
        //         cName = cID.name;
        //         cID = cID._id;
        //     }
        // }
        if (req.user.super_admin) {
            //req.body.client_id= JSON.parse(req.body.client_id)._id;
        } else {
            req.body.client_id = req.user.client_id;
        }
        var individualRaData = {
            ra_name: req.body.ra_name,
            client_id: req.body.client_id,
            communicationRequired: req.body.communicationRequired,
            contingenciesRequired: req.body.contingenciesRequired,
            supplierRequired: req.body.supplierRequired,
            questionRequired: req.body.questionRequired,
            client_department: req.body.clientDepartment,
            countryrequired: req.body.countryrequired,
            is_individual: true,
            country: req.body.country,

            // country: cID ? cID : null,
            country_name:  null,
            created_by_client_admin: true
        }
        console.log(individualRaData, "********************");

        typeOfRaObj.update({
            _id: req.body._id,
            is_deleted: false
        }, {
                $set: individualRaData
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Risk assessment updated successfully ',
                    });
                }
            })
    }
}



/* @function : getAllQuestionnaireForRa
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get all questions
 */
exports.getAllQuestionnaireForRa = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false
    }
    if (req.body.questionnaire_name)
        query.question = {
            $regex: req.body.questionnaire_name,
            $options: "$i"
        };
    questionnaireObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('category_id')
        .exec(function (err, data) {
            if (data) {
                questionnaireObj.count(query, function (err, count) {
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



/* @function : getRaPreviewData
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get ra preview data
 */
exports.getRaPreviewData = function (req, res, next) {
    if (req.params.ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false,
            status: "Active"
        })
            .populate('client_department')
            .populate('country')
            .populate('client_id')
            .exec(function (err, raData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (raData) {
                    console.log("1111111111111111111111111")
                    console.log(raData)
                    async.waterfall([
                        function (callback) {
                            questionnaireObj.find({
                                assigned_ra_id: req.params.ra_id,
                                is_deleted: false,
                                status: 'Active'
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
                            supplierObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                // companyId: req.user.companyID
                            }, function (err, supplierData) {
                                if (err) {
                                    callback(err, [], []);
                                } else {
                                    callback(null, queData, supplierData);
                                }
                            })
                        },
                        function (queData, supplierData, callback) {
                            communicationObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                // companyId: req.user.companyID
                            }, function (err, communicationData) {
                                if (err) {
                                    callback(err, [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData);
                                }
                            })
                        },
                        function (queData, supplierData, communicationData, callback) {
                            contingencyObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                //  companyId: req.user.companyID
                            }, function (err, contingencyData) {
                                if (err) {
                                    callback(err, [], [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData, contingencyData);
                                }
                            })
                        }
                    ], function (err, queData, supplierData, communicationData, contingencyData) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'queData': queData,
                                'raData': raData,
                                'supplierData': supplierData,
                                'communicationData': communicationData,
                                'contingencyData': contingencyData

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



/* @function : assignQuesToRa
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To assign question to ra
 */
exports.assignQuesToRa = function (req, res, next) {
    if (req.body) {
        if (req.body.assign == true) {
            questionnaireObj.update({
                _id: req.body._id
            }, {
                    $push: {
                        assigned_ra_id: req.body.assignRaId
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Question assigned to risk assessment',
                        });
                    }
                })
        } else if (req.body.assign == false) {
            questionnaireObj.update({
                _id: req.body._id
            }, {
                    $pull: {
                        assigned_ra_id: req.body.assignRaId
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Question removed from risk assessment',
                        });
                    }
                })
        }

    }
}



/* @function : getRaDetailsCreatedByClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get ra details 
 */
// exports.getRaDetailsCreatedByClient = function (req, res, next) {
//     if (req.user.id && req.params.ra_id) {
//         typeOfRaObj.findOne({ _id: req.params.ra_id, is_deleted: false }, function (err, raData) {
//             if (err) {
//                 res.json({
//                     'error': err,
//                     'code': config.error,
//                     'message': 'Something went wrong please try again!'
//                 });
//             } 

//             else {
//                 res.json({
//                     'code': config.success,
//                     'message': 'success',
//                     'data': raData
//                 });
//             }
//         })
//     }
// }

exports.getRaDetailsCreatedByClient = function (req, res, next) {
    if (req.user.id && req.params.ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        })
            .populate('client_department')
            .populate('country')
            .exec(function (err, raData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (raData) {
                    async.waterfall([
                        function (callback) {
                            questionnaireObj.find({
                                assigned_ra_id: req.params.ra_id,
                                is_deleted: false,
                                status: 'Active'
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
                            supplierObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                companyId: req.user.companyID
                            }, function (err, supplierData) {
                                if (err) {
                                    callback(err, [], []);
                                } else {
                                    callback(null, queData, supplierData);
                                }
                            })
                        },
                        function (queData, supplierData, callback) {
                            communicationObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                companyId: req.user.companyID
                            }, function (err, communicationData) {
                                if (err) {
                                    callback(err, [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData);
                                }
                            })
                        },
                        function (queData, supplierData, communicationData, callback) {
                            contingencyObj.findOne({
                                types_of_ra_id: req.params.ra_id,
                                // client_admin_id: req.user.id
                                companyId: req.user.companyID
                            }, function (err, contingencyData) {
                                if (err) {
                                    callback(err, [], [], [], []);
                                } else {
                                    callback(null, queData, supplierData, communicationData, contingencyData);
                                }
                            })
                        }
                    ], function (err, queData, supplierData, communicationData, contingencyData) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'queData': queData,
                                'raData': raData,
                                'supplierData': supplierData,
                                'communicationData': communicationData,
                                'contingencyData': contingencyData

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

/* @function : submitRaCreatedByClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To submit created ra
 */
exports.submitRaCreatedByClient = function (req, res, next) {
    if (req.user.id && req.params.ra_id) {
        typeOfRaObj.update({
            _id: req.params.ra_id
        }, {
                $set: {
                    is_created_compleletely: true
                }
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Risk assessment created successfully',
                    });
                }
            })
    }
}



/* @function : getCategoriesForQue
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To get categories
 */
exports.getCategoriesForQue = function (req, res, next) {
    categoryObj.find({
        is_deleted: false,
        status: "Active"
    })
        .sort({
            createdAt: -1
        })
        .exec(function (err, categoryArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': categoryArr
                });
            }
        })
}



/* @function : addQuestionByClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To add question by client super admin
 */
exports.addQuestionByClient = function (req, res, next) {
    if (req.user.id && req.body) {
        req.body.created_by_client_admin = true;
        req.body.created_by = req.user.id;
        var questionnaire = new questionnaireObj(req.body);
        questionnaire.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': data,
                    'message': 'questionnaire added successfully'
                });
            }

        })
    }
}


/* @function : addCategoryByClient
 *  @author  : MadhuriK 
 *  @created  : 28-July-17
 *  @modified :
 *  @purpose  : To add category by client super admin
 */
exports.addCategoryByClient = function (req, res, next) {
    if (req.body) {
        if (req.body) {
            categoryObj.find({
                categoryName: req.body.categoryName,
                is_deleted: false
            }, function (err, category) {
                if (err) {
                    next(createError(config.serverError, err));
                } else if (category.length > 0) {
                    res.json({
                        'code': config.error,
                        'error': 'category name already exist'
                    });

                } else {
                    req.body.created_by = req.user.id;
                    req.body.companyId = req.user.companyID;
                    req.body.created_by_client_admin = true;
                    var category = new categoryObj(req.body);
                    category.save(function (err, data) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'data': data,
                                'message': 'category created successfully'
                            });
                        }
                    })
                }
            })
        }
    }

}



/* @function : changeStatus
 *  @author  : MadhuriK 
 *  @created  : 02-Aug-17
 *  @modified :
 *  @purpose  : To change status of ra
 */
exports.changeStatus = function (req, res, next) {
    if (req.body) {
        typeOfRaObj.update({
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
                        'message': 'Status updated successfully'
                    });
                }
            })
    }
}


/* @function : deleteRa
 *  @author  : MadhuriK 
 *  @created  : 02-Aug-17
 *  @modified :
 *  @purpose  : To delete ra
 */
exports.deleteRa = function (req, res, next) {
    if (req.params.ra_id) {
        typeOfRaObj.update({
            _id: req.params.ra_id
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
                        'message': 'RA deleted successfully'
                    });
                }
            })
    }
}


/* @function : getRaToView
 *  @author  : MadhuriK 
 *  @created  : 02-Aug-17
 *  @modified :
 *  @purpose  : To view ra details with assign questions
 */
exports.getRaToView = function (req, res, next) {
    if (req.params.ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.ra_id
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                questionnaireObj.find({
                    assigned_ra_id: req.params.ra_id,
                    is_deleted: false,
                    status: "Active"
                })
                    .populate('category_id')
                    .exec(function (err, questionData) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'raData': raData,
                                'questionData': questionData
                            });
                        }
                    })
            }
        })
    }
}



/* @function : getAllRiskLabels
 *  @author  : MadhuriK 
 *  @created  : 07-Aug-17
 *  @modified :
 *  @purpose  : To get all risk labels
 */
exports.getAllRiskLabels = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
   if(req.user.super_admin == true){
    var query = {
        is_deleted: false
    }
    if (req.body.label_name)
        query.categoryName = {
            $regex: req.body.label_name,
            $options: "$i"
        };
    categoryObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                categoryObj.count(query, function (err, count) {
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
    } else {
        clientObj.find({
            _id:req.user.client_id,
            is_deleted:false
        }).exec(function(err,client){
var query = {
    is_deleted: false,
    sector_name: client[0].sector_id
}
if (req.body.label_name)
    query.categoryName = {
        $regex: req.body.label_name,
        $options: "$i"
    };
categoryObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                categoryObj.count(query, function (err, count) {
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
}


/* @function : getAllRiskQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 07-Aug-17
 *  @modified :
 *  @purpose  : To get all questions of selected risk labels
 */
exports.getAllRiskQuestionnaire = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {
        order: "asc"
    };
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        category_id: req.body.risk_label_id
    }
    if (req.body.questionnaire_name){
        query['$or'] = [{ best_practice_advice: { $regex: req.body.questionnaire_name, $options: "$i" } }, { question: { $regex: req.body.questionnaire_name, $options: "$i" } }];
        
    }
    questionnaireObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('category_id')
        .exec(function (err, data) {
            if (data) {
                questionnaireObj.count(query, function (err, count) {
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



/* @function : getAllRiskQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 07-Aug-17
 *  @modified :
 *  @purpose  : To get all question details
 */
exports.getRiskQueDetail = function (req, res, next) {
    if (req.params.que_id) {
        questionnaireObj.findOne({
            _id: req.params.que_id
        }, function (err, questionData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questionData
                })
            }
        })
    }

}



/* @function : getAllSubmittedRiskAssessment
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get all submitted ra
 */
exports.getAllSubmittedRiskAssessment = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        is_submitted: true,
        // client_id: req.user.id
        companyId: req.user.companyID
    }
    if (req.body.keyword)
        // query['$or'] = [{ project_name: { $regex: req.body.keyword, $options: "$i" } }, { department: { $regex: req.body.keyword, $options: "$i" } }];
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };

    newsRaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('traveller_id')
        .populate('types_of_ra_id')
        .populate('department')
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



/* @function : getAllSubmittedRiskAssessment
 *  @author  : MadhuriK 
 *  @created  : 28-Aug-17
 *  @modified :
 *  @purpose  : To get ra details
 */
exports.getRadetailsForAdmin = function (req, res, next) {
    if (req.params.ra_id) {
        newsRaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        })
            .populate('traveller_id')
            .exec(function (err, newsRa) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    newsRaAns.find({
                        news_ra_id: req.params.ra_id
                    }, function (err, questionnaire) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'data': newsRa,
                                'question': questionnaire
                            });
                        }
                    })

                }
            })
    }
}



/* @function : getCurrencyList
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To get currency list
 */
exports.getCurrencyList = function (req, res, next) {
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


/* @function : addRaSupplierByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To save supplier with type of ra creation by client
 * super admin
 */
exports.addRaSupplierByClientAdmin = function (req, res, next) {
    if (req.body) {

        if (req.body.super_admin == 1) {

            req.body.client_id = JSON.parse(req.body.client_id)._id;
        } else {

            req.body.client_id = req.body.client_id;
        }


        req.body.rate = req.body.rate ? req.body.rate.replace(/'/g, '') : "";
        var supplierData = new supplierObj(req.body);
        supplierData.save(function (err, supplier) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Supplier added successfully',
                    'data': supplier
                })
            }
        })
    }
}




/* @function : updateRaSupplierByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To update supplier with type of ra creation by client
 * super admin
 */
exports.updateRaSupplierByClientAdmin = function (req, res, next) {
    if (req.body && req.user.id) {
        var supplier_id = req.body._id;
        delete req.body._id;
        var supplierData = {
            supplier_name: req.body.supplier_name,
            country: req.body.country,
            city: req.body.city,
            sourced_by: req.body.sourced_by,
            currency: req.body.currency,
            supplier_preview: req.body.supplier_preview,
            description: req.body.description,
            rate: req.body.rate ? req.body.rate.replace(/'/g, '') : "",
            service_provided: req.body.service_provided,
            other_service: req.body.other_service

        }
        supplierObj.update({
            _id: supplier_id,
            is_deleted: false
        }, {
                $set: supplierData
            }, function (err) {
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



/* @function : getRaSupplierData
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To get supplier data
 */
exports.getRaSupplierData = function (req, res, next) {
    if (req.params.supplier_id) {
        supplierObj.findOne({
            _id: req.params.supplier_id
        }, function (err, supplierData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplierData
                })
            }
        })
    }
}


/* @function : addRaCommunicationByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To add communication data
 */
exports.addRaCommunicationByClientAdmin = function (req, res, next) {
    if (req.body) {

        if (req.body.super_admin == 1) {

            req.body.client_id = JSON.parse(req.body.client_id)._id;
        } else {

            req.body.client_id = req.body.client_id;
        }
        //req.body.companyId = req.user.companyID;
        var communicationData = new communicationObj(req.body);
        communicationData.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': data,
                    'message': 'Communication data added successfully'
                })
            }
        })
    }
}




/* @function : updateRaCommunicationByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To update communication data
 */
exports.updateRaCommunicationByClientAdmin = function (req, res, next) {
    if (req.body && req.user.id) {
        var communication_id = req.body._id;
        delete req.body._id;
        var communicationData = {
            call_intime: req.body.call_intime,
            no_of_checkin:req.body.no_of_checkin,
            timezone:req.body.timezone,
            point_of_contact:req.body.point_of_contact,
            number:req.body.number,
            email:req.body.email,  
            detail_an_overdue_procedure: req.body.detail_an_overdue_procedure,
            reminder_before_checkIn: req.body.reminder_before_checkIn,
            want_your_poc: req.body.want_your_poc,
            emergency_contact: req.body.emergency_contact,
            details_of_team: req.body.details_of_team,
            communication_preview: req.body.communication_preview
        }

        communicationObj.update({
            _id: communication_id
        }, {
                $set: communicationData
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Communication data updated successfully'
                    })
                }
            })

    }
}



/* @function : getRaCommunicationData
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To get communication data
 */
exports.getRaCommunicationData = function (req, res, next) {
    if (req.user.id && req.params.communication_id) {
        communicationObj.findOne({
            _id: req.params.communication_id
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': communicationData
                })
            }
        })
    }
}



/* @function : addRaContingencyByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To add contingency data
 */
exports.addRaContingencyByClientAdmin = function (req, res, next) {
    if (req.body && req.user.id) {

        if (req.body.super_admin == 1) {

            req.body.client_id = JSON.parse(req.body.client_id)._id;
        } else {

            req.body.client_id = req.body.client_id;
        }
        //req.body.companyId = req.user.companyID;
        var contingencyData = new contingencyObj(req.body);
        contingencyData.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': data,
                    'message': 'Contingency data added successfully'
                })
            }
        })
    }
}




/* @function : updateRaContingencyByClientAdmin
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To update contingency data
 */
exports.updateRaContingencyByClientAdmin = function (req, res, next) {
    if (req.body && req.user.id) {
        var contingency_id = req.body._id;
        delete req.body._id;
        var contingencyData = {
            medical_provision: req.body.medical_provision,
            method_of_evacuation: req.body.method_of_evacuation,
            detail_nearest_hospital: req.body.detail_nearest_hospital,
            medevac_company: req.body.medevac_company,
            personal_protective_equipment: req.body.personal_protective_equipment,
            first_aid_kit: req.body.first_aid_kit,
            tracker_id: req.body.tracker_id,
            sat_phone_number: req.body.sat_phone_number,
            no_of_satellite_phone: req.body.no_of_satellite_phone,
            no_of_tracker: req.body.no_of_tracker,
            contingency_preview: req.body.contingency_preview,
            embassy_location: req.body.embassy_location,
            first_aid_kit_details: req.body.first_aid_kit_details,
            personal_protective_equipment_details: req.body.personal_protective_equipment_details
        }

        contingencyObj.update({
            _id: contingency_id
        }, {
                $set: contingencyData
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': "Contingency data updated successfully"
                    })
                }
            })

    }
}




/* @function : getContingencyData
 *  @author  : MadhuriK 
 *  @created  : 29-Aug-17
 *  @modified :
 *  @purpose  : To get contingency data
 */
exports.getContingencyData = function (req, res, next) {
    if (req.user.id && req.params.contingency_id) {
        contingencyObj.findOne({
            _id: req.params.contingency_id
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': contingencyData,
                })
            }
        })
    }
}
/* @function : getCountryThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 5-sep-17
 *  @modified :
 *  @purpose  : To get CountryThreatMatrix data
 */

exports.getCountryThreatMatrix = function (req, res, next) {
    console.log(">>>>>>>>")
    if (req.params.country_id) {
        countryObj.findOne({
            _id: req.params.country_id
        }, function (err, country) {
            var Cname = country.code.toLowerCase();
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/xml'
            }
            var options = {
                headers: headers
            }
            var body = `<?xml version="1.0" encoding="UTF-8"?>
                <rec xmlns="http://itravelsecure.com/schema/DestPush.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                   <recInfo>
                      <custID>1039</custID>
                      <country>
                         <CountryCode>` + Cname + `</CountryCode>
                      </country>
                   </recInfo>
                </rec>`;
            curl.post(url, body, options, function (err, response, result) {
                var sanitize = sanitizeHtml(result, {
                    allowedTags: ['description', 'security', 'data', 'risk', 'content']
                })
                var parse = xmlJs.xml2json(sanitize, {
                    compact: true,
                    spaces: 4
                });
                var finalcountry = JSON.parse(parse)
                var countryData = finalcountry.data.risk.content;
                if (finalcountry) {
                    countryThreatMatrixObj.find({
                        countryname: country.name
                    }, function (err, threatMatrix) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            console.log("threatMatrix", threatMatrix)
                            res.json({
                                'code': config.success,
                                'data': threatMatrix,
                                'country': country,
                                'countryObj': countryData
                            });
                        }
                    })
                }
            });
        })
    }
}


/* @function : getCategoriesList
 *  @author  : MadhuriK 
 *  @created  : 13-Jun-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getCategoriesList = function (req, res, next) {
    riskAssociatedCategoryObj.find({
        is_deleted: false,
        status: 'Active'
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
/* @function : getAllSubmittedRiskAssessment
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get all Rejected ra
 */
exports.getAllRejectedRiskAssessment = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        is_submitted: true,
        is_reject: true
    }
    if (req.body.keyword)
        // query['$or'] = [{ project_name: { $regex: req.body.keyword, $options: "$i" } }, { department: { $regex: req.body.keyword, $options: "$i" } }];
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
    newsRaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('traveller_id')
        .populate('types_of_ra_id')
        .populate('department')
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


exports.importCSV = function (req, res, next) {
    var outputJSON = "";
    var saveData = {};
    var dataArray = [];
    var destinationFolder = './riskpal-client/uploads/csv';
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
                                if (data.firstname != '' && data.lastname != '' && data.email != '' && data.mobile_number != '') {
                                    userObj.findOne({
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
                                            var pnumber = data.mobile_number.charAt(0) == '+' ? data.mobile_number : '+' + data.mobile_number;
                                            var number = pnumber;
                                            var code = parseNumber(number);
                                            var phone = code.phone
                                            var phoneCode = countryCode(code.country);
                                            console.log("data.email", data.email)
                                            console.log("phone", phone)
                                            console.log("phoneCode", phoneCode)
                                            authy.register_user(data.email, phone, phoneCode, function (err0, regRes) {
                                                var test1 = 'email :-' + " " + data.email + " " + ' is not allowed ';
                                                if (err0) {
                                                    callback(test1);
                                                } else {
                                                    console.log("regRes", regRes)
                                                    var randomPassword = config.randomToken(10);
                                                    var key = 'salt_from_the_user_document';
                                                    var cipher = crypto.createCipher('aes-256-cbc', key);
                                                    cipher.update(randomPassword, 'utf8', 'base64');
                                                    var encryptedPassword = cipher.final('base64');
                                                    data.duoToken = "";
                                                    data.is_deleted = false;
                                                    data.admin = false;
                                                    data.authyID = regRes.user.id;
                                                    data.mobile_number = pnumber;
                                                    data.status = 'Active';
                                                    data.passport_data = [{
                                                        passport_number: "",
                                                        nationality: ""
                                                    }];
                                                    data.client_admin_id = req.user.id;
                                                    data.companyId = req.user.companyID;
                                                    data.client_admin = false;
                                                    data.password = encryptedPassword,
                                                        userObj(data).save(function (err2, result1) {
                                                            if (err2) {
                                                                callback(err);
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
                                                                    to: data.email,
                                                                    subject: 'Account created by Client Super Admin',
                                                                    html: 'Hello traveller, ' + data.firstname + '<br><br> \n\
                                                                        \n\ your account has been created by Client Super Admin, please check the below credentials \n\
                                                                        <br><br> Email :' + data.email + '<br>\n\
                                                                         Password :' + randomPassword + '\n\
                                                                        </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                                                };
                                                                smtpTransport.sendMail(mailOptions, function (err) {
                                                                    if (err) {
                                                                        callback(err, null);
                                                                    } else {
                                                                        callback();
                                                                    }
                                                                });
                                                            }
                                                        })
                                                }
                                            })

                                        }
                                    });
                                } else {
                                    var txt = 'Invalid fields in csv file'
                                    callback(txt, null);
                                }
                            },
                                function (err) {
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
    countryRiskObj.find({
        country_id: req.params.country_id,
        // client_admin_id: req.user.id
        companyId: req.user.companyID
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


exports.getSupplierForCountry = function (req, res, next) {
    countryObj.findOne({
        _id: req.params.country_id
    }, function (err, country) {
        console.log("country.name", country.name)
        if (err) {
            next(createError(config.serverError, err));
        } else {
            supplierObj.find({
                country: country.name
            }, function (err, supplierData) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'supplierData': supplierData
                    })
                }
            })

        }
    })

}