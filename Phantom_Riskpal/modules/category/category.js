var catObj = require('./../../schema/category.js'); // include category schema file
var clientAdminCatObj = require('./../../schema/client_admin_category'); // include client admin category schema file
var RiskCatObj = require('./../../schema/risk_associated_category.js'); // include category schema file
var questionnaireObj = require('./../../schema/questionnaire.js'); // include questionnaire schema file
var config = require('../../config/jwt_secret.js'); // config 
var countryObj = require('./../../schema/country.js'); // include country schema file
var _ = require('underscore');
var createError = require('http-errors');

/* @function : createCategory
 *  @author  : MadhuriK 
 *  @created  : 23-Mar-17
 *  @modified :
 *  @purpose  : To add the category.
 */
exports.createCategory = function (req, res, next) {
    if (req.body) {
        req.body.client_admin_id = req.user.id;
        req.body.client_admin_id = req.user.companyID;
        var category = new catObj(req.body);
        category.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'category added successfully'
                });
            }

        })
    }
}



/* @function : listCategory
 *  @author  : MadhuriK 
 *  @created  : 23-Mar-17
 *  @modified :
 *  @purpose  : To list all the category.
 */
exports.listCategory = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        status: "Active"
    }
    if (req.body.category_name)
        query.categoryName = {
            $regex: req.body.category_name,
            $options: "$i"
        };

    catObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        //.populate('types_of_ra_id')
        // .populate({
        //     path: 'types_of_ra_id',
        //     match: { is_deleted: false }
        // })
        .exec(function (err, data) {
            if (data) {

                // var filerCategories = _.filter(data, function (dataObj) {
                //     return (dataObj.types_of_ra_id.is_deleted == false && dataObj.types_of_ra_id.status == 'Active')
                // });

                // catObj.count(query, function (err, count) {
                clientAdminCatObj.find({
                    // client_admin_id: req.user.id,
                    companyId: req.user.companyID,
                    is_deleted: false
                }, function (err, client_admin_cat) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': data.length,
                            'clientAdminCat': client_admin_cat
                        });
                    }
                })

                // })
            } else {
                next(createError(config.serverError, err));
            }
        });
}


/* @function : addQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 24-Mar-17
 *  @modified :
 *  @purpose  : To add the questionnaire to particular category.
 */
exports.addQuestionnaire = function (req, res, next) {
    if (req.body) {
        req.body.client_admin_id = req.user.id;
        req.body.client_admin_id = req.user.companyID;
        var questionnaire = new questionnaireObj(req.body);
        questionnaire.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'questionnaire added successfully'
                });
            }

        })
    }

}


/* @function : deleteCategory
 *  @author  : MadhuriK 
 *  @created  : 24-Mar-17
 *  @modified :
 *  @purpose  : To delete the selected category.
 */
exports.deleteCategory = function (req, res, next) {
    if (req.params.category_id) {
        catObj.update({
            _id: req.params.category_id,
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
                    'message': 'category deleted successfully'
                });
            }
        })
    }
}



/* @function : getCategoryDetails
 *  @author  : MadhuriK 
 *  @created  : 24-Mar-17
 *  @modified :
 *  @purpose  : To get category details.
 */
exports.getCategoryDetails = function (req, res, next) {
    if (req.params.category_id) {
        catObj.findOne({
                _id: req.params.category_id,
                is_deleted: false
            })
            // .populate('country')
            .exec(function (err, category) {
                if (err) {
                    next(createError(config.serverError, err));

                } else {
                    res.json({
                        'code': config.success,
                        'data': category,
                    });
                }
            })
    }

}



/* @function : updateCategory
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To update the category.
 */
exports.updateCategory = function (req, res, next) {
    var category_id = req.body._id;
    catObj.update({
        _id: category_id,
        is_deleted: false
    }, {
        $set: {
            categoryName: req.body.categoryName,
            country: req.body.country
        }
    }, function (err, data) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'category updated successfully'
            });
        }

    })
}


/* @function : changeCategoryStatus
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To change category status.
 */
exports.changeCategoryStatus = function (req, res, next) {
    if (req.body) {
        clientAdminCatObj.findOne({
            client_admin_id: req.user.id,
            companyId: req.user.companyID,
            category_id: req.body._id,
            is_deleted: false
        }, function (err, client_admin_category) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (client_admin_category) {
                clientAdminCatObj.update({
                    _id: client_admin_category._id,
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
                            'message': 'category status updated successfully'
                        });
                    }
                })
            } else {
                var clientAdminCat = {
                    category_id: req.body._id,
                    categoryName: req.body.categoryName,
                    client_admin_id: req.user.id,
                    companyId: req.user.companyID,
                    status: req.body.status,
                    country: req.body.country,
                    is_mandatory: req.body.is_mandatory
                }

                var clientCat = new clientAdminCatObj(clientAdminCat);
                clientCat.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'category status updated successfully'
                        });
                    }
                })

            }
        })
    }
}


/* @function : getAllQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To get all questionnaires of selected category.
 */
exports.getAllQuestionnaire = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    //var sortby = { order: "asc" };
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        // client_admin_id: req.user.id
        companyId: req.user.companyID
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



/* @function : changeOrderOfQuestion
 *  @author  : MadhuriK 
 *  @created  : 24-May-17
 *  @modified :
 *  @purpose  : To change order of questionnaire
 */
exports.changeOrderOfQuestion = function (req, res, next) {
    if (req.body) {
        questionnaireObj.update({
            _id: req.body._id
        }, {
            $set: {
                order: req.body.order
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'questionnaire order updated successfully'
                });
            }
        })
    }

}

/* @function : deleteQuestionnair
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To delete questionnaires.
 */
exports.deleteQuestionnair = function (req, res, next) {
    if (req.params.questionnaire_id) {
        questionnaireObj.update({
            _id: req.params.questionnaire_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function (err, updated) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'questionnaire deleted successfully'
                });
            }
        })
    }

}


/* @function : getQuestionnairDetail
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To get questionnaire detail.
 */
exports.getQuestionnairDetail = function (req, res, next) {
    if (req.params.questionnaire_id) {
        questionnaireObj.findOne({
            _id: req.params.questionnaire_id,
            is_deleted: false
        }, function (err, questionnaire) {
            if (err) {
                next(createError(config.serverError, err));

            } else {
                res.json({
                    'code': config.success,
                    'data': questionnaire,
                });
            }
        })
    }
}



/* @function : getQuestionDetail
 *  @author  : MadhuriK 
 *  @created  : 09-Jun-17
 *  @modified :
 *  @purpose  : To get questionnaire detail.
 */
exports.getQuestionDetail = function (req, res, next) {
    if (req.params.questionnaire_id) {
        questionnaireObj.findOne({
                _id: req.params.questionnaire_id,
                is_deleted: false
            })
            .populate('category_id')
            .exec(function (err, questionnaire) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'data': questionnaire,
                    });
                }
            })
    }
}



/* @function : updateQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To update questionnaire .
 */
exports.updateQuestionnaire = function (req, res, next) {
    var questionnaire_id = req.body._id;
    questionnaireObj.update({
        _id: questionnaire_id,
        is_deleted: false
    }, {
        $set: {
            question: req.body.question,
            best_practice_advice: req.body.best_practice_advice,
            category_id: req.body.category_id
        }
    }, function (err, data) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'questionnaire updated successfully'
            });
        }

    })
}


/* @function : changeQuestionnaireStatus
 *  @author  : MadhuriK 
 *  @created  : 27-Mar-17
 *  @modified :
 *  @purpose  : To change questionnaire status.
 */
exports.changeQuestionnaireStatus = function (req, res, next) {
    if (req.body) {
        questionnaireObj.update({
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
                    'message': 'questionnaire status updated successfully'
                });
            }
        })
    }
}



/* @function : getCountries
 *  @author  : MadhuriK 
 *  @created  : 05-Apr-17
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


/* @function : markAsMandatory
 *  @author  : MadhuriK 
 *  @created  : 11-Apr-17
 *  @modified :
 *  @purpose  : To mark Mandatory category for traveller.
 */
exports.markAsMandatory = function (req, res, next) {
    if (req.body.id) {
        var mandatory = req.body.is_mandatory == true ? 'mandatory' : 'not mandatory';
        catObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                is_mandatory: req.body.is_mandatory
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Category marked as ' + mandatory
                });
            }
        })
    }

}


/* @function : riskAssociated
 *  @author  : MadhuriK 
 *  @created  : 12-Apr-17
 *  @modified :
 *  @purpose  : To mark risk associated to country or not.
 */
exports.riskAssociated = function (req, res, next) {
    if (req.body.id) {
        var riskAssociated = req.body.risk_associated == true ? 'risky' : 'not risky';
        catObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                risk_associated: req.body.risk_associate
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Category marked as ' + riskAssociated
                });
            }
        })
    }
}



/* @function : addRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 14-Apr-17
 *  @modified :
 *  @purpose  : To add risk associated category.
 */
exports.addRiskAssociatedCategory = function (req, res, next) {
    if (req.body) {
        req.body.client_admin_id = req.user.id;
        req.body.companyId = req.user.companyID;
        var risk_category = new RiskCatObj(req.body);
        risk_category.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Risk associated category added successfully'
                });
            }

        })
    }
}


/* @function : listRiskAssociatedCategories
 *  @author  : MadhuriK 
 *  @created  : 14-Apr-17
 *  @modified :
 *  @purpose  : To list risk associated category.
 */
exports.listRiskAssociatedCategories = function (req, res, next) {
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

    RiskCatObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                RiskCatObj.count(query, function (err, count) {
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



/* @function : deleteRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 14-Apr-17
 *  @modified :
 *  @purpose  : To delete risk associated category.
 */
exports.deleteRiskAssociatedCategory = function (req, res, next) {
    if (req.params.risk_associated_category_id) {
        RiskCatObj.update({
            _id: req.params.risk_associated_category_id,
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
                    'message': 'risk associated category deleted successfully'
                });
            }
        })
    }
}


/* @function : getRiskAssociatedCategoryDetails
 *  @author  : MadhuriK 
 *  @created  : 14-Apr-17
 *  @modified :
 *  @purpose  : To get risk associated category.
 */
exports.getRiskAssociatedCategoryDetails = function (req, res, next) {
    if (req.params.risk_associated_category_id) {
        RiskCatObj.findOne({
                _id: req.params.risk_associated_category_id,
                is_deleted: false
            })
            .exec(function (err, category) {
                if (err) {
                    next(createError(config.serverError, err));

                } else {
                    res.json({
                        'code': config.success,
                        'data': category,
                    });
                }
            })
    }
}


/* @function : updateRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 17-Apr-17
 *  @modified :
 *  @purpose  : To update risk associated category.
 */
exports.updateRiskAssociatedCategory = function (req, res, next) {
    var risk_associated_category_id = req.body._id;
    var risk_cat = {
        categoryName: req.body.categoryName,
        country: req.body.country
    }
    RiskCatObj.update({
        _id: risk_associated_category_id,
        is_deleted: false
    }, {
        $set: risk_cat
    }, function (err, data) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'Risk associated category updated successfully'
            });
        }

    })
}

/* @function : changeRiskCategoryStatus
 *  @author  : MadhuriK 
 *  @created  : 17-Apr-17
 *  @modified :
 *  @purpose  : To change risk associated category status.
 */
exports.changeRiskCategoryStatus = function (req, res, next) {
    if (req.body) {
        RiskCatObj.update({
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
                    'message': 'risk associated category status updated successfully'
                });
            }
        })
    }
}


/* @function : getCategories
 *  @author  : MadhuriK 
 *  @created  : 20-Apr-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getCategories = function (req, res, next) {
    catObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, categories) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': categories
            });
        }
    })
}