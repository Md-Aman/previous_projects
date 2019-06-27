var typeOfRaObj = require('./../../schema/type_of_ra.js'); // include type_of_ra schema file
var config = require('../../config/jwt_secret.js'); // config
var categoryObj = require('./../../schema/category'); // include category schema file
var questionnaireObj = require('./../../schema/questionnaire.js'); // include questionnaire schema file
var sectorObj = require('./../../schema/sector.js'); // include sector schema file
var usersObj = require('./../../schema/users.js'); // include users schema file
var departmentObj = require('./../../schema/department.js'); // include department schema file
var countryObj = require('./../../schema/country.js'); // include country schema file
var createError = require('http-errors');

/* @function : createTypesOfRa
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To create types of ra.
 */
exports.createTypesOfRa = function(req, res, next) {
    console.log("req.body", req.body)
    if (req.body) {
        typeOfRaObj.find({
            ra_name: req.body.ra_name,
            is_deleted: false
        }, function(err, raArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (raArr.length > 0) {
                res.json({
                    'code': config.error,
                    'error': 'Risk assessment name already exist'
                });
            } else {
                var typeOfRaArr = new typeOfRaObj(req.body);
                typeOfRaArr.save(function(err, raObj) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': raObj,
                            'message': 'Type of ra added successfully'
                        });
                    }
                })
            }
        })
    }
}



/* @function : getAllTypesOfRa
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getAllTypesOfRa = function(req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        '$and': []
    };
    query['$and'].push({
        is_deleted: false,
        is_created_compleletely: true,
        created_by_master_admin: true
    })
    var keyword = req.body.keyword ? req.body.keyword : '';
    if (keyword) {
        var keywordArray = keyword.split(' ')
        regex = keywordArray.map(function(e) {
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
        .populate('client_id')
        .populate('sector_name')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function(err, data) {
            if (data) {
                typeOfRaObj.count(query, function(err, count) {
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


/* @function : deleteTypeOfRa
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.deleteTypeOfRa = function(req, res, next) {
    if (req.params.type_of_ra_id) {
        typeOfRaObj.update({
            _id: req.params.type_of_ra_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function(err, update) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Type of ra deleted successfully'
                });
            }
        })
    }
}


/* @function : changeTypeOfRaStatus
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.changeTypeOfRaStatus = function(req, res, next) {
    if (req.body) {
        typeOfRaObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                status: req.body.status
            }
        }, function(err, changeStatus) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Type of ra status updated successfully'
                });
            }
        })
    }
}



/* @function : getRaDetails
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getRaDetails = function(req, res, next) {
    if (req.params.type_of_ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.type_of_ra_id,
            is_deleted: false
        }, function(err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': raData
                });
            }
        })
    }

}


/* @function : updateTypesOfRa
 *  @author  : MadhuriK 
 *  @created  : 08-Jun-17
 *  @modified :
 *  @purpose  : To update types of ra.
 */
exports.updateTypesOfRa = function(req, res, next) {
    if (req.body) {
        typeOfRaObj.find({
            _id: {
                $ne: req.body._id
            },
            ra_name: req.body.ra_name,
            is_deleted: false
        }, function(err, raArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (raArr.length > 0) {
                res.json({
                    'code': config.error,
                    'error': 'Risk assessment name already exist'
                });
            } else {
                typeOfRaObj.update({
                    _id: req.body._id,
                    is_deleted: false
                }, {
                    $set: {
                        ra_name: req.body.ra_name
                    }
                }, function(err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Type of ra details updated successfully'
                        });
                    }
                })
            }
        })
    }
}


/* @function : getRaPreviewData
 *  @author  : MadhuriK 
 *  @created  : 11-July-17
 *  @modified :
 *  @purpose  : To get ra data with categories and questions associated with it.
 */
exports.getRaPreviewData = function(req, res, next) {
    if (req.params.type_of_ra_id) {
        console.log("rarererererererrerererereererrrrrrrrrrrrrrrrrrrrrr")

        typeOfRaObj.findOne({
            _id: req.params.type_of_ra_id,
            is_deleted: false
        }, function(err, raData) {
            console.log("rarererererererrerererereererrrrrrrrrrrrrrrrrrrrrr")
            if (err) {
                next(createError(config.serverError, err));
            } else if (raData) {
                questionnaireObj.find({
                        assigned_ra_id: req.params.type_of_ra_id,
                        is_deleted: false,
                        status: 'Active'
                    })
                    .populate('client_id')
                    .exec(function(err, queData) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'successvara',
                                'queData': queData,
                                'raData': raData
                            });
                        }

                    })

            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'messdsdsage': 'sucdsdscess',
                    'raData': raData,
                });
            }
        })
    }

}


/* @function : getAllSectorList
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To get sector list to create generic ra.
 */
exports.getAllSectorList = function(req, res, next) {
    sectorObj.find({
        is_deleted: false,
        status: "Active"
    }, function(err, sectorData) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': sectorData,
            });
        }
    })

}



/* @function : createGenericRa
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To create generic ra.
 */

exports.createGenericRa = function(req, res, next) {
    console.log("req.body.sector_name", req.body.sector_name)
    if (req.body) {
        var raData = {
            ra_name: req.body.ra_name,
            sector_name: req.body.sector_name,
            is_generic: true,
            created_by_master_admin: true,
            status: "Inactive",
            questionRequired: req.body.questionRequired,
            supplierRequired: req.body.supplierRequired,
            contingenciesRequired: req.body.contingenciesRequired,
            communicationRequired: req.body.communicationRequired,
        }
        var saveDataObj = new typeOfRaObj(raData);
        saveDataObj.save(function(err, raObj) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Risk assessment updated successfully',
                    'data': raObj
                });
            }
        })
    }
}



/* @function : getAllClientList
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To get all client list.
 */
exports.getAllClientList = function(req, res, next) {
    usersObj.find({
        client_admin_id: {
            $exists: false
        },
        admin: true,
        is_deleted: false,
    }, function(err, clients) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': clients,
            });
        }
    })
}



/* @function : getDepartment
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To get all department list of selected client.
 */
exports.getDepartment = function(req, res, next) {
    if (req.params.client_id) {
        departmentObj.find({
            client_admin_id: req.params.client_id,
            is_deleted: false
        }, function(err, departmentArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': departmentArr,
                });
            }
        })
    }
}


/* @function : createIndividualRa
 *  @author  : MadhuriK 
 *  @created  : 13-July-17
 *  @modified :
 *  @purpose  : To create individual ra
 */
exports.createIndividualRa = function(req, res, next) {
    if (req.body) {
        usersObj.findOne({
            companyId: req.body.clientList
        }, {
            company_name: 1
        }, function(err, user) {
            var raData = {
                ra_name: req.body.ra_name,
                companyId: req.body.clientList, //company Id
                client_department: req.body.clientDepartment,
                is_individual: true,
                country: (req.body.country !== null && req.body.country !== 'Select Country') ? JSON.parse(req.body.country)._id : null,
                country_name: (req.body.country !== null && req.body.country !== 'Select Country') ? JSON.parse(req.body.country).name : null,
                created_by_master_admin: true,
                client_name: user.company_name,
                questionRequired: req.body.questionRequired,
                supplierRequired: req.body.supplierRequired,
                contingenciesRequired: req.body.contingenciesRequired,
                communicationRequired: req.body.communicationRequired,
                status: "Inactive"
            }

            var saveDataObj = new typeOfRaObj(raData);
            saveDataObj.save(function(err, raObj) {
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
        })
    }
}


/* @function : getAllCountryList
 *  @author  : MadhuriK 
 *  @created  : 14-July-17
 *  @modified :
 *  @purpose  : To get all country list
 */
exports.getAllCountryList = function(req, res, next) {
    countryObj.find({}, function(err, countryArr) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': countryArr
            });
        }
    })
}


/* @function : assignQuesToRa
 *  @author  : MadhuriK 
 *  @created  : 14-July-17
 *  @modified :
 *  @purpose  : To assign question to ra
 */
exports.assignQuesToRa = function(req, res, next) {
    if (req.body) {
        if (req.body.assign == true) {
            questionnaireObj.update({
                _id: req.body._id
            }, {
                $push: {
                    assigned_ra_id: req.body.assignRaId
                }
            }, function(err) {
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
            }, function(err) {
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


/* @function : updateGenericRa
 *  @author  : MadhuriK 
 *  @created  : 16-July-17
 *  @modified :
 *  @purpose  : To update generic ra
 */
exports.updateGenericRa = function(req, res, next) {
    if (req.body) {
        var genericRaData = {
            // sector_id: (req.body.sector.indexOf("_id") > -1) ? JSON.parse(req.body.sector)._id : req.body.sector_id,
            // sector_name: (req.body.sector.indexOf("_id") > -1) ? JSON.parse(req.body.sector).sectorName : req.body.sector_name,
            sector_name: req.body.sector_name,
            ra_name: req.body.ra_name,
            questionRequired: req.body.questionRequired,
            supplierRequired: req.body.supplierRequired,
            contingenciesRequired: req.body.contingenciesRequired,
            communicationRequired: req.body.communicationRequired,
        }
        typeOfRaObj.update({
            _id: req.body._id,
            is_deleted: false
        }, {
            $set: genericRaData
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Generic ra updated successfully',
                });
            }
        })
    }
}



/* @function : updateIndividualRa
 *  @author  : MadhuriK 
 *  @created  : 17-July-17
 *  @modified :
 *  @purpose  : To update individual ra details
 */
exports.updateIndividualRa = function(req, res, next) {
    console.log("req.body", req.body)
    if (req.body) {
        usersObj.findOne({
            is_deleted: false,
            companyId: req.body.companyId
        }, {
            company_name: 1
        }, function(err, user) {
            var individualRaData = {
                ra_name: req.body.ra_name,
                companyId: req.body.companyId, //company Id
                client_department: req.body.clientDepartment,
                country: (req.body.country == null || req.body.country == 'Select Country') ? null : (req.body.country.indexOf("_id") > -1) ? JSON.parse(req.body.country)._id : req.body.country,
                country_name: (req.body.country == null || req.body.country == 'Select Country') ? null : (req.body.country.indexOf("_id") > -1) ? JSON.parse(req.body.country).name : req.body.country_name,
                client_name: user.company_name,
                questionRequired: req.body.questionRequired,
                supplierRequired: req.body.supplierRequired,
                contingenciesRequired: req.body.contingenciesRequired,
                communicationRequired: req.body.communicationRequired,
            }
            typeOfRaObj.update({
                _id: req.body._id,
                is_deleted: false
            }, {
                $set: individualRaData
            }, function(err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Individual ra updated successfully',
                    });
                }
            })
        })

    }

}



/* @function : submitGenericRa
 *  @author  : MadhuriK 
 *  @created  : 18-July-17
 *  @modified :
 *  @purpose  : To submit generic ra
 */
exports.submitGenericRa = function(req, res, next) {
    if (req.params.generic_ra_id) {
        typeOfRaObj.update({
            _id: req.params.generic_ra_id
        }, {
            $set: {
                is_created_compleletely: true,
                status: "Active"
            }
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Generic ra created successfully',
                });
            }
        })
    }
}


/* @function : getRaToView
 *  @author  : MadhuriK 
 *  @created  : 24-July-17
 *  @modified :
 *  @purpose  : To get ra details to view
 */
exports.getRaToView = function(req, res, next) {
    if (req.params.ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.ra_id
        }, function(err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                questionnaireObj.find({
                        assigned_ra_id: req.params.ra_id,
                        is_deleted: false,
                        status: "Active"
                    })
                    .populate('category_id')
                    .exec(function(err, questionData) {
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
 *  @created  : 03-Aug-17
 *  @modified :
 *  @purpose  : To get risk labels 
 */
exports.getAllRiskLabels = function(req, res, next) {
    // categoryObj.find({ is_deleted: false, status: 'Active', created_by_master_admin: true }, function (err, riskLabels) {
    //     if (err) {
    //         res.json({
    //             'error': err,
    //             'code': config.error,
    //             'message': 'Something went wrong please try again!'
    //         });
    //     } else {
    //         res.json({
    //             'code': config.success,
    //             'data': riskLabels,
    //         });
    //     }
    // })
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        created_by_master_admin: true
    }
    // if (req.body.category_name)
    //     query.categoryName = { $regex: req.body.category_name, $options: "$i" };

    categoryObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function(err, data) {
            if (data) {
                categoryObj.count(query, function(err, count) {
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
 *  @created  : 04-Aug-17
 *  @modified :
 *  @purpose  : To get risk labels 
 */
exports.getAllRiskQuestionnaire = function(req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {
        order: "asc"
    };
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        created_by_master_admin: true,
        category_id: req.body.risk_label_id
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
        .exec(function(err, data) {
            if (data) {
                questionnaireObj.count(query, function(err, count) {
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




/* @function : getRiskQueDetail
 *  @author  : MadhuriK 
 *  @created  : 04-Aug-17
 *  @modified :
 *  @purpose  : To get question details 
 */
exports.getRiskQueDetail = function(req, res, next) {
    if (req.params.que_id) {

        questionnaireObj.findOne({
            _id: req.params.que_id,
            is_deleted: false,
            status: "Active"
        }, function(err, questionDetails) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questionDetails
                })
            }
        })
    }
}



/* @function : saveAndSubmitLater
 *  @author  : MadhuriK 
 *  @created  : 08-Aug-17
 *  @modified :
 *  @purpose  : To save ra and not submitted yet 
 */
exports.saveAndSubmitLater = function(req, res, next) {
    if (req.params.ra_id) {
        typeOfRaObj.update({
            _id: req.params.ra_id
        }, {
            $set: {
                is_created_compleletely: false,
                status: "Inactive"
            }
        }, function(err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Risk assessment saved successfully you can submit it later'
                })
            }
        })
    }
}



/* @function : getAllUnderConstructionRA
 *  @author  : MadhuriK 
 *  @created  : 08-Aug-17
 *  @modified :
 *  @purpose  : To get all ra which are save but not submitted by master admin
 */
exports.getAllUnderConstructionRA = function(req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        is_created_compleletely: false,
        created_by_master_admin: true
    }
    if (req.body.keyword)
        query['$or'] = [{
            ra_name: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            sector_name: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            client_name: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }]

    typeOfRaObj.find(query)
        .populate('client_id')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function(err, data) {
            if (data) {
                typeOfRaObj.count(query, function(err, count) {
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



/* @function : getAllRiskLableOfQue
 *  @author  : MadhuriK 
 *  @created  : 09-Aug-17
 *  @modified :
 *  @purpose  : To get all risk labels of a question
 */
exports.getAllRiskLableOfQue = function(req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        created_by_master_admin: true,
        status: "Active"
    }
    if (req.body.question_name)
        query.question = {
            $regex: req.body.question_name,
            $options: "$i"
        }

    questionnaireObj.findOne(query)
        .populate('category_id')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function(err, questions) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questions ? questions.category_id : [],
                    'count': questions ? questions.category_id.length : 0
                });
            }
        })

}