var superAdminObj = require('./../../schema/super_admin.js'); // include super admin schema file
var userObj = require('./../../schema/users.js'); // include super admin schema file
var catObj = require('./../../schema/category'); // include category schema file
var countryMatrixLogObj = require('./../../schema/country_matrix_log');
var typeOfRaObj = require('./../../schema/type_of_ra'); // include type_of_ra schema file
var riskCatObj = require('./../../schema/risk_associated_category'); // include risk associated category schema file
var questionnaireObj = require('./../../schema/questionnaire.js'); // include questionnaire schema file
var countryObj = require('./../../schema/country'); // include country schema file
var languageObj = require('./../../schema/language');
var countryThreatMatrixObj = require('./../../schema/country_threat_matrix.js'); // include country risk schema file
var jwt = require('jsonwebtoken');
var riskcategory = require('./../../schema/risk_associated_category.js'); // include country risk schema file

var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');
var emailHelper = require('./../../helper/email.helper');
var template = require('./../../helper/template');
var _ = require('underscore');
var userTable = require('./../../schema/usertables.js');
var userroleObj = require('./../../schema/roles.js');
var clientObj = require('./../../schema/clients.js');
var envConfig = require('../../config/config');
var createError = require('http-errors');
const authObj = require('./../../helper/auth.helper');
var { encryptUserFields } = require('./../../helper/general.helper');

/* @function : superAdminLogin
 *  @author  : MadhuriK 
 *  @created  : 18-May-17
 *  @modified :
 *  @purpose  : To super admin login.
 */
exports.superAdminLogin = function (req, res, next) {
    // userTable.find({}).exec(function (err, user) {
    //     user.map( item => {
    //         console.log('item', item._id)
    //         userTable.findOneAndUpdate({ _id: item._id }, { $set: {
    //             firstname: item.firstname,
    //             lastname: item.lastname,
    //             email: item.email ? item.email.toLowerCase() : item.email ,
    //             mobile_number: item.mobile_number,
    //             passport_data: item.passport_data,
    //             gendar: item.gendar,
    //             proof_of_life_answer: item.proof_of_life_answer,
    //             passport_details: item.passport_details

    //          } }, function (err, doc) {
    //              console.log('errrrr', err);
    //          });
    //     });
    // });
    // return;
    if (req.body) {
        var body = req.body;
        console.log("body :", body);
        var email = body.email;
        var password = body.password;
        var jwtToken = null;
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        const searchEncryptedFields = new userTable({email});
        searchEncryptedFields.encryptFieldsSync();
        console.log('fdfffff', searchEncryptedFields.email)
        // searchEncryptedFields.encrypt(); { $regex: new RegExp("^" + searchEncryptedFields.email, "i") }
        userTable.findOne({
            email: { $regex: new RegExp("^" + searchEncryptedFields.email, "i") },
            password: encryptedPassword,
            status: 'Active',
            is_deleted: false,
        }, 'email -_id')
            .exec(function (err, user) {
                if (err) {
                    next(createError(config.error, err));
                } else if (!user) {
                    res.json({
                        'code': config.error,
                        'err': 'Invalid email or password'
                    });
                } else {
                    res.json({
                        'code': config.success,
                        // 'data': user,
                        'message': 'Login Successfull'
                    });
                }
            });
    }
}


/* @function : checkLogin
 *  @author  : MadhuriK 
 *  @created  : 18-May-17
 *  @modified :
 *  @purpose  : To check super admin login.
 */
exports.checkLogin = function (req, res, next) {
    if (req.headers["authorization"]) {
        var bearer = req.headers["authorization"].split(' ');
        var bearerToken = bearer[1];
        console.log("req :", req.user);
        jwt.verify(bearerToken, config.secret, function (err, decoded) {
            // req.user = decoded;
            if (err) {
                res.json({
                    'code': config.error,
                    'err': 'Your Session Expired, Please login Again.',
                    'message': 'Your Session Expired, Please login Again.'
                });
            } else {
                if (bearer.length == 2) {
                    userTable.findOne({
                        duoToken: bearer[1],
                        status: 'Active',
                    }, '-client_id -authyID -random_email_token -duoVerified -hashcode -verified -password').populate('roleId').exec(function (err, user) {
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
exports.destroySession = function (req, res, next) {
    req.session.destroy(function(err) {
        // cannot access session here
      });
}

/* @function : superAdminLogout
 *  @author  : MadhuriK 
 *  @created  : 18-May-17
 *  @modified :
 *  @purpose  : To log out super admin.
 */
exports.superAdminLogout = function (req, res, next) {
    if (req.headers.authorization) {
        var parts = req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : "";
        if (parts.length == 2) {
            userTable.findOne({
                _id: req.user.id,
                duoToken: parts[1],
                duoVerified: true,

            }, function (err, user) {
                if (err) {
                    authObj.destroySession(req);
                    res.json({
                        'code': config.error,
                        'err': err,
                        'message': 'Logout successfully1'
                    });
                } else if (user) {
                    user.duoToken = '';
                    user.duoVerified = false;
                    user.save(function (err, data) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            authObj.destroySession(req);
                            res.json({
                                'code': config.success,
                                'message': 'Logout successfully'
                            });
                        }
                    });
                } else {
                    authObj.destroySession(req);
                    res.json({
                        'code': config.error,
                        'err': 'Authentication failed'
                    });
                }
            });
        } else {
            authObj.destroySession(req);
            res.json({
                'code': config.error,
                'err': 'Authentication failed'
            });
        }
    } else {
        authObj.destroySession(req);
        res.json({
            'code': config.error,
            'err': 'Authentication failed'
        });
    }
}


/* @function : superAdminForgetPass
 *  @author  : MadhuriK 
 *  @created  : 18-May-17
 *  @modified :
 *  @purpose  : To send rest password link on email to super admin.
 */

exports.superAdminForgetPass = function (req, res, next) {
    const encryptedFields = encryptUserFields(req.body.email);
    console.log('fffff', req.body.email);
    console.log('encryptedFields', encryptedFields);
    if (req.body.email) {
        userTable.findOne({
            email: { $regex: new RegExp("^" + encryptedFields.email, "i") },
            is_deleted: false,

        }, function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (!user) {
                res.json({
                    'code': config.success,
                    'message': 'You should receive an email shortly if your account exists in our system.'
                });
            } else {
                // Generate token and save into db
                var token = getRandomToken();
                userTable.update({
                    _id: user._id,
                    is_deleted: false,
                }, {
                        $set: {
                            random_email_token: token,
                            reset_request_time: new Date()
                        }
                    }, async function (err, userData) {
                        console.log("userData :", userData);
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            var baseUrl = envConfig.host;
                            var url = baseUrl + '/reset-password/' + token;
                            var repalceData = { userName: user.firstname, urlText: config.emailTemplate.urlText, url: url };
                            try {
                                const body = await template.getBodyData(config.emailTemplate.resetPassword, repalceData);
                                if (body) {
                                    const email = await emailHelper.sendEmailNodeMailer(
                                        req.body.email, body.subject, body.html);
                                    if (email) {
                                        res.json({
                                            'code': config.success,
                                            'message': 'You should receive an email shortly if your account exists in our system.'
                                        });
                                    }
                                }

                            } catch (err) {
                                res.json({
                                    'code': config.success,
                                    'message': 'You should receive an email shortly if your account exists in our system.'
                                });
                            }
                        }
                    })
            }
        });
    }
}

var getRandomToken = function () {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < charactersLength; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/* @function : superAdminResetPass
 *  @author  : MadhuriK 
 *  @created  : 18-May-17
 *  @modified :
 *  @purpose  : To reset password.
 */
exports.superAdminResetPass = function (req, res, next) {
    if (req.body) {
        if (req.body.type === 'resetPassowrd') {
            var key = 'salt_from_the_user_document';
            var cipher = crypto.createCipher('aes-256-cbc', key);
            cipher.update(req.body.password, 'utf8', 'base64');
            var encryptedPassword = cipher.final('base64');
            userTable.findOneAndUpdate({
                random_email_token: req.body.emailToken,
                is_deleted: false,

            }, {
                    $set: {
                        password: encryptedPassword
                    }
                }, function (err, user) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        console.log("user :", user)
                        if (!user) {
                            res.json({
                                'code': config.error,
                                'err': 'Password reset failed'
                            });
                        } else {
                            userTable.update({
                                _id: user._id
                            }, {
                                    $set: {
                                        random_email_token: ''
                                    }
                                }, function (err, success) {
                                    if (err) {
                                        res.json({
                                            'code': config.error,
                                            'err': 'Password reset failed'
                                        });
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Password reset successfully'
                                        });
                                    }
                                })
                        }
                    }
                });
        } else if (req.body.type === 'emailTokenVerification') {
            userTable.findOne({
                random_email_token: req.body.emailToken
            }, function (err, user) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    if (!user) {
                        res.json({
                            'code': config.error,
                            'err': 'Token does not exist'
                        });
                    } else {
                        var time = getHourDiff(user.reset_request_time, new Date());
                        if (time > 12) {
                            res.json({
                                'code': config.error,
                                'err': 'Token is expired'
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Token is exist'
                            });
                        }
                    }
                }
            });
        } else {
            res.json({
                'error': config.error,
                'message': 'Something went wrong please try again!'
            });
        }
    } else {
        res.json({
            'error': config.error,
            'message': 'Body is not supplied.'
        });
    }
}

var getHourDiff = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
}
/* @function : userActivate
 *  @author  : Siroi 
 *  @created  : 28-May-18
 *  @modified :
 *  @purpose  : To activate and set the user password
 */
exports.userActivate = function (req, res, next) {
    if (req.body) {

        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');


        userTable.findOne({
            hashcode: req.body.hashcode,
            is_deleted: false,
            verified: false,
            // mobile_number: '+' + req.body.mobile_number


        }, function (err, usercheck) {

            if (err) {
                next(createError(config.serverError, err));
            } else if (!usercheck) {
                res.json({
                    'code': config.error,
                    // 'err': 'Mobile Number mismatched',
                    'message': 'Your have already set your password'
                });
            }

            else {

                userTable.update({
                    hashcode: req.body.hashcode,
                    is_deleted: false,
                    verified: false,


                }, {
                        $set: {
                            password: encryptedPassword,
                            verified: true,
                            status: "Active"

                        }
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Password created successfully'
                            });
                        }
                    })

            }
        });
    }
}

/* @function : checkVerified
 *  @author  : Siroi 
 *  @created  : 28-Mar-18
 *  @modified :
 *  @purpose  : To verify user 
 */
exports.checkUserstatus = function (req, res, next) {
    userTable.find({
        hashcode: req.body.id,
        is_deleted: false,
        verified: false

    }, function (err, usergroup) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': usergroup
            });
        }
    })
}



// category section for super admin



/* @function : getAllCategories
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To get all the categories for super admin.
 */
exports.getAllCategories = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        //created_by_master_admin: true
    }
    if (req.body.category_name)
        query.categoryName = {
            $regex: req.body.category_name,
            $options: "$i"
        };

    console.log('req.obyd', req.user);
    if (req.user.super_admin != true) {

        clientObj.findOne({
            _id: req.user.client_id,
            is_deleted: false

        })
            .exec(function (err, client) {

                query = {
                    is_deleted: false,
                    sector_name: client.sector_id
                }
                if (req.body.keyword)
                    query.categoryName = {
                        $regex: req.body.keyword,
                        $options: "$i"
                    };

                catObj.find(query)
                    .populate('created_by')
                    .sort(sortby)
                    .limit(limit)
                    .skip(skip)
                    .exec(function (err, data) {
                        if (data) {


                            catObj.count(query, function (err, count) {
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
    } else if (req.user.super_admin == true) {

        query = {
            is_deleted: false,
            // created_by_master_admin: true
        }
        if (req.body.keyword)
            query.categoryName = {
                $regex: req.body.keyword,
                $options: "$i"
            };


        catObj.find(query)
            .populate('created_by')
            .sort(sortby)
            .limit(limit)
            .skip(skip)
            // .populate('types_of_ra_id')
            .exec(function (err, data) {
                if (data) {

                    // var filterData = _.filter(data, function (obj) {
                    //     if (obj.types_of_ra_id) {
                    //         return (obj.types_of_ra_id.status == 'Active' && obj.types_of_ra_id.is_deleted == false);
                    //     }
                    // });

                    catObj.count(query, function (err, count) {
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

}



/* @function : deleteCategory
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
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


/* @function : changeCategoryStatus
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To change category status.
 */
exports.changeCategoryStatus = function (req, res, next) {
    if (req.body) {
        catObj.update({
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
                        'message': 'category status updated successfully'
                    });
                }
            })
    }
}


/* @function : getCountries
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To get all countries.
 */
exports.getCountries = function (req, res, next) {
    const sortBy = { name: 1 };
    countryObj.find({}).sort(sortBy).lean().exec(function (err, countries) {
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

exports.getLanguages = function(req, res, next){
    const sortBy = { name: 1 };
    languageObj.find({}).sort(sortBy).lean().exec(function (err, languages) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': languages
            });
        }
    })
}

/* @function : addCategory
 *  @author  : MadhuriK 
 *  @created  : 25-May-17
 *  @modified :
 *  @purpose  : To add category.
 */
exports.addCategory = function (req, res, next) {
    if (req.body) {
        req.body.created_by = req.user.id;
        catObj.find({
            categoryName: req.body.categoryName,
            is_deleted: false
        }, function (err, category) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (category.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'category name already exist'
                });

            } else {
                req.body.created_by_master_admin = true;
                req.body.comment = "fdd";
                if (req.user.super_admin != true) {
                    req.body.client_id = req.user.client_id;
                }
                var category = new catObj(req.body);
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


/* @function : getCategoryDetails
 *  @author  : MadhuriK 
 *  @created  : 25-May-17
 *  @modified :
 *  @purpose  : To get all category details.
 */
exports.getCategoryDetails = function (req, res, next) {
    if (req.params.category_id) {
        catObj.findOne({
            _id: req.params.category_id,
            is_deleted: false
        })
            .populate('sector_name')
            .exec(function (err, category) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'success',
                        'data': category
                    });
                }
            })
    }
}



/* @function : updateCategory
 *  @author  : MadhuriK 
 *  @created  : 25-May-17
 *  @modified :
 *  @purpose  : To update category.
 */
exports.updateCategory = function (req, res, next) {
    if (req.body) {
        catObj.find({
            _id: {
                $ne: req.body._id
            },
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
                catObj.update({
                    _id: req.body._id,
                    is_deleted: false
                }, {
                        $set: {
                            categoryName: req.body.categoryName,
                            country: req.body.country,
                            sector_name: req.body.sector_name
                        }
                    }, function (err) {
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
        })
    }
}


// risk associated categories section


/* @function : getAllRiskAssociatedCategories
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To get all the risk associated categories for super admin.
 */
exports.getAllRiskAssociatedCategories = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};

    var query = {
        is_deleted: false
    }
    if (req.body.keyword)
        query.categoryName = {
            $regex: req.body.keyword,
            $options: "$i"
        };



    riskCatObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                riskCatObj.count(query, function (err, count) {
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
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To delete risk associated categories.
 */
exports.deleteRiskAssociatedCategory = function (req, res, next) {
    if (req.params.risk_associated_category_id) {
        riskCatObj.update({
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
                    countryThreatMatrixObj.remove({ category_id: req.params.risk_associated_category_id }, function (err, data) {
                        if (err) {
                            next(createError(config.serverError, err));
                        }
                        res.json({
                            'code': config.success,
                            'message': 'risk associated category deleted successfully'
                        });
                    });

                }
            })
    }

}



/* @function : changeRiskCategoryStatus
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To change risk associated categories status.
 */
exports.changeRiskCategoryStatus = function (req, res, next) {
    if (req.body) {
        riskCatObj.update({
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



/* @function : addRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To add risk associated categories.
 */
exports.addRiskAssociatedCategory = function (req, res, next) {
    if (req.body) {
        var riskCat = new riskCatObj(req.body);
        riskCat.save(function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'risk associated category added successfully'
                });
            }
        })
    }

}



/* @function : addRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To add risk associated categories.
 */
exports.getRiskAssociatedCategoryDetails = function (req, res, next) {
    if (req.params.risk_associated_category_id) {
        riskCatObj.findOne({
            _id: req.params.risk_associated_category_id,
            is_deleted: false
        }, function (err, category) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': category
                });
            }
        })
    }
}


/* @function : updateRiskAssociatedCategory
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To update risk associated categories.
 */
exports.updateRiskAssociatedCategory = function (req, res, next) {
    var risk_associated_category_id = req.body._id;
    var risk_cat = {
        categoryName: req.body.categoryName,
        country: req.body.country
    }
    riskCatObj.update({
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



/* @function : markAsMandatory
 *  @author  : MadhuriK 
 *  @created  : 26-May-17
 *  @modified :
 *  @purpose  : To mark category as mandatory and not mandatory.
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



/* @function : getClientCount
 *  @author  : MadhuriK 
 *  @created  : 29-May-17
 *  @modified :
 *  @purpose  : To get client count for super admin dashboard.
 */
exports.getClientCount = function (req, res, next) {
    clientObj.count({

        is_deleted: false,


    }, function (err, client_admin) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': client_admin
            });
        }
    })
}



// questionnaire section

/* @function : addQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
 *  @modified :
 *  @purpose  : To add the questionnaire to particular category.
 */
exports.addQuestionnaire = function (req, res, next) {
    if (req.body) {
        console.log("req.user :", req.user.id);
        var questionObj = req.body;
        questionObj.created_by = req.user.id;
        questionObj.created_by_master_admin = true;
        console.log("body :", questionObj);

        var questionnaire = new questionnaireObj(questionObj);
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

/* @function : getAllQuestionnaire
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
 *  @modified :
 *  @purpose  : To get all questionnaires of selected category.
 */
exports.getAllQuestionnaire = function (req, res, next) {
    // var query = { is_deleted: false, created_by_master_admin: true };
    // var catArr = [];
    // catObj.find({ categoryName: { $regex: req.body.questionnaire_name, $options: "$i" } }, function (err, categories) {
    //     if (err) {

    //     } else {
    //         query['$or'] = [];
    //         categories.forEach(function (catObj) {
    //             catArr.push(catObj._id);
    //         })
    //         if (req.body.questionnaire_name) {
    //             query['$or'].push(
    //                 { question: { $regex: req.body.questionnaire_name, $options: "$i" } }
    //             );
    //         }
    //         if (catArr.length > 0) {
    //             query['$or'].push({ category_id: { $in: catArr } })
    //         }
    //     }
    var limit = req.body.count ? req.body.count : 10;
    // var sortby = req.body.sortby ? req.body.sortby : {};
    // var sortby = { order: "asc" };
    var sortby = !(_.isEmpty(req.body.sortby)) ? req.body.sortby : {
        order: "asc"
    };
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};

    if (req.user.super_admin == true) {
        var query = {
            is_deleted: false,
            //created_by_master_admin: true
        }
        if (req.body.questionnaire_name) {
            query['$or'] = [{ best_practice_advice: { $regex: req.body.questionnaire_name, $options: "$i" } }, { question: { $regex: req.body.questionnaire_name, $options: "$i" } }];
        }
        questionnaireObj.find(query)
            .populate({
                path: 'category_id',
                populate: {
                    path: 'sector_name',
                }
            })
            .populate('created_by')
            .sort(sortby)
            .limit(limit)
            .skip(skip)
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
    } else {

        clientObj.find({
            _id: req.user.client_id,
            is_deleted: false
        })
            .exec(function (err, client) {
                console.log(client)
                catObj.find({
                    sector_name: client[0].sector_id,
                    is_deleted: false
                })
                    .exec(function (err, cats) {
                        var cat_id = [];

                        cats.forEach(function (result) {

                            cat_id.push(result._id);
                        })
                        console.log(cat_id)

                        query = {
                            is_deleted: false,
                            // created_by_master_admin: true,
                            category_id: { $in: cat_id }
                        }
                        if (req.body.questionnaire_name) {
                            query['$or'] = [{ best_practice_advice: { $regex: req.body.questionnaire_name, $options: "$i" } }, { question: { $regex: req.body.questionnaire_name, $options: "$i" } }];
                        }
                        questionnaireObj.find(query)
                            .populate('created_by')
                            .populate({
                                path: 'category_id',
                                populate: {
                                    path: 'sector_name',
                                }
                            })
                            .sort(sortby)
                            .limit(limit)
                            .skip(skip)

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
                    })

            })
    }
    //  })
}


/* @function : deleteQuestionnair
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
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
 *  @created  : 05-Mar-17
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
 *  @created  : 05-Jun-17
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

/* @function : changeOrderOfQuestion
 *  @author  : MadhuriK 
 *  @created  : 05-May-17
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

/* @function : getCategories
 *  @author  : MadhuriK 
 *  @created  : 05-Jun-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getCategories = function (req, res, next) {

    if (req.user.super_admin != true) {

        clientObj.findOne({
            _id: req.user.client_id,
            is_deleted: false

        })
            .exec(function (err, client) {
                var query = {
                    is_deleted: false,
                    status: "Active",
                    sector_name: client.sector_id
                }

                catObj.find(query)

                    .exec(function (err, categories) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'data': categories
                            });
                        }
                    })
            })
    } else {

        var query = {
            is_deleted: false,
            status: "Active",
            created_by_master_admin: true,
        }

        catObj.find(query)

            .exec(function (err, categories) {
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
}



/* @function : getTypesOfRa
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getTypesOfRa = function (req, res, next) {
    typeOfRaObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, type_of_ra) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': type_of_ra
            });
        }
    })
}



// for country threat matrix



/* @function : getAllCategoryList
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To get all categories.
 */
exports.getAllCategoryList = function (req, res, next) {

    var query = {
        is_deleted: false,
        status: "Active"
    }
    var sort = { position: 1 };
    riskCatObj.find(query)
        .sort(sort)
        .exec(function (err, category) {
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


/* @function : getCountriesForThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To get country threat matrix.
 */
exports.getCountriesForThreatMatrix = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            countryThreatMatrixObj.find({

            }, function (err, country_threat_matrix) {

                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    riskcategory.find({
                        is_deleted: false
                    }, function (err, riskcategory) {

                        if (err) {
                            next(createError(config.serverError, err));
                        } else {

                            res.json({
                                'code': config.success,
                                'data': country,
                                'country_threat_matrix': country_threat_matrix,
                                'riskcategory': riskcategory
                            });
                        }
                    });
                }
            })

        }
    })
}

exports.getCountryThreatMatrixAndRating = function (req, res, next) {
    var countryId = req.params.id;
    countryObj.findOne({ _id: countryId }, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            countryThreatMatrixObj.find({
                countryname: country.name
            }, function (err, country_threat_matrix) {

                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    riskcategory.find({
                        is_deleted: false
                    }, function (err, riskcategory) {

                        if (err) {
                            next(createError(config.serverError, err));
                        } else {

                            res.json({
                                'code': config.success,
                                'data': country,
                                'country_threat_matrix': country_threat_matrix,
                                'riskcategory': riskcategory
                            });
                        }
                    });
                }
            })

        }
    })
}

exports.saveCountryThreatMatrixAndRating = function (req, res, next) {
    console.log("req<>>>>>>>>>>>", req.body)
    if (req.body) {

        countryObj.update({
            _id: req.body._id
        }, {
                $set: {
                    color: req.body.color,
                    checked: true
                }
            }, async function (err, data) {
                console.log('errrrr', err);
                if (err) {
                    next(createError(config.serverError, err));
                }
                var countryThreatArr = [];
                if (req.body.matrix.length > 0) {
                    for (const item of req.body.matrix) {
                        //    req.body.matrix.map(item => {
                        var query = {
                            countryname: item.countryname,
                            category_id: item.category_id,
                            category_name: item.category_name,
                            is_deleted: false
                        };
                        const country_risk = item.category_risk;

                        await new Promise((resolve, reject) => {
                            countryThreatMatrixObj.findOneAndUpdate(query, { $set: { country_risk: country_risk } },
                                { upsert: true }, function (err, doc) {
                                    countryThreatArr.push(doc);
                                    if (err) return reject(err);
                                    return resolve(doc);
                                });
                        });


                    };

                    if (req.body.matrix.length == countryThreatArr.length) {
                        res.json({
                            'code': config.success,
                            'message': 'country threat matrix updated successfully'
                        });
                    }
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'country threat matrix updated successfully'
                    });
                }



            });

    }
}

/* @function : saveCountryThreatMatrix
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To save country threat matrix common for all client admins.
 */
exports.saveCountryThreatMatrix = function (req, res, next) {
    console.log("req<>>>>>>>>>>>", req.body)
    if (req.body) {
        countryThreatMatrixObj.findOne({
            countryname: req.body.countryname,
            category_id: req.body.category_id,
            category_name: req.body.category_name,
            is_deleted: false
        }, function (err, country_threat_matrix) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (country_threat_matrix) {
                console.log("veliyaaaaaaaaaa")
                console.log(country_threat_matrix)

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
                console.log("ulllllaaaaaaaa")
                // req.body.client_admin = req.user.id;
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



/* @function : getTypesOfRa
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getAllRa = function (req, res, next) {
    typeOfRaObj.find({
        is_deleted: false,
        status: "Active"
    }, function (err, type_of_ra) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': type_of_ra
            });
        }
    })
}



/* @function : getRaCategories
 *  @author  : MadhuriK 
 *  @created  : 22-Jun-17
 *  @modified :
 *  @purpose  : To get all categories of selected ra.
 */
exports.getRaCategories = function (req, res, next) {
    if (req.params.typeOfRaId) {
        catObj.find({
            types_of_ra_id: req.params.typeOfRaId,
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

}



/* @function : getQueOfSelectedRiskLabel
 *  @author  : MadhuriK 
 *  @created  : 10-Aug-17
 *  @modified :
 *  @purpose  : To get all questions of selected risk labels
 */
exports.getQueOfSelectedRiskLabel = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        // created_by_master_admin: true,
        category_id: req.body.category_id
    };

    questionnaireObj.find(query)
        .populate('category_id')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
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

exports.addInformation = function (req, res, next) {
    if (req.body) {
        console.log("addInformation>>>>>>>>>>", req.body)
        countryObj.findOne({
            name: req.body.country
        }, function (err, country) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                countryObj.update({
                    _id: country._id
                }, {
                        $set: {
                            country_info: req.body.info
                        }
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Information  added successfully'
                            });
                        }
                    })
            }
        })

    }
}

/* @function : userRole
 *  @author  : Siroi 
 *  @created  : 21-Mar-18
 *  @modified :
 *  @purpose  : To get user permissions.
 */
exports.userRole = function (req, res, next) {
    if (req) {
        userroleObj.findOne({
            _id: req.body.data.roleId,
            is_deleted: false,

        }, function (err, roles) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                var rolesObj = {};
                if (roles) {
                    var rolesObj = JSON.parse(JSON.stringify(roles));
                    rolesObj.nodeEnv = process.env.NODE_ENV;
                } else {
                    rolesObj = {
                        nodeEnv: process.env.NODE_ENV
                    };
                }

                res.json({
                    'code': config.success,
                    'data': rolesObj
                });
            }
        })
    }

}

exports.getCountryMatrixLog = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};

    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    var startDate = new Date(y, m, 1);
    var endDate = new Date(); //new Date(y, m + 1, 0);

    var query = {
        "createdAt": {
            $lt: endDate,
            $gte: startDate
        }
    };
    console.log('date', query);
    // if( req.body.super_admin == true ){
    countryMatrixLogObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('country_id')
        .exec(function (err, data) {
            if (data) {


                countryMatrixLogObj.count(query, function (err, count) {
                    res.json({
                        'code': config.success,
                        'data': data,
                        'count': count,
                        'query': {
                            'startDate': startDate,
                            'endDate': endDate
                        }
                    });
                })
            } else {
                next(createError(config.serverError, err));
            }
        });

    //}


}