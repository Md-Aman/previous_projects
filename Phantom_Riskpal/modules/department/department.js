var approvingManagerObj = require('./../../schema/approving_manager.js'); // include users schema file
var departmentObj = require('./../../schema/department.js');
var config = require('../../config/jwt_secret.js'); // config
var userObj = require('./../../schema/users.js'); // include user schema file
var userTable = require('./../../schema/usertables.js'); //user table update
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // include type_of_ra schema file
var createError = require('http-errors');


/* @function : getUsers
 *  @author  : getTemplates
 *  @created  : 21-Apr-18
 *  @modified :
 *  @purpose  : To get all users related logged users.
 */
exports.getUsers = function (req, res, next) {

    var client_id = req.params.client_id;

    userTable.find({
        // client_admin_id: req.user.id,
        client_id: client_id,
       // status: "Active",
        is_deleted: false
    }, function (err, users) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': users
            });
        }
    })

}


/* @function : getUsers_trackconnect
 *  @author  : getTemplates
 *  @created  : 21-Apr-18
 *  @modified :
 *  @purpose  : To get all users related logged users.
 */
exports.getUsers_trackconnect = function (req, res, next) {

    // var client_id = req.user.client_id;

    // var query = {
    //     client_id: client_id,
    //    // status: "Active",
    //     is_deleted: false

    // }
    var query = {
         super_admin: false,
         is_deleted: false
    }
    if(req.user.super_admin == true){
        query['client_id'] = req.body.client_id;
    } else {
        query['client_id'] = req.user.client_id;
    }
    console.log("que :", query);
    userTable.find(query, '_id firstname lastname __enc_firstname __enc_lastname')
        .populate('roleId')
        .exec(function (err, users) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': users
                });
            }
        })

}

/* @function : getTemplates
 *  @author  : Souqbox
 *  @created  : 21-Apr-18
 *  @modified :
 *  @purpose  : To get all RA templates related logged users.
 */
exports.getTemplates = function (req, res, next) {
    var client_id = req.user.client_id;
    var query = {
        client_id: client_id,
        status: "Active",
        is_deleted: false,
        is_created_compleletely: true,
        created_by_client_admin: true
    }
    typeOfRaObj.find(query)
        .exec(function (err, templates) {

            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': templates
                });
            }
        })

}

/* @function : getTemplates based on selected department
 *  @author  : Souqbox
 *  @created  : 21-Apr-18
 *  @modified :
 *  @purpose  : To get all RA templates related department .
 */
exports.getRelatedTemplate = function (req, res, next) {

    var dept_id = req.params.client_id;

    var query = {
        client_department: dept_id,
        is_deleted: false

    }

    typeOfRaObj.find(query)

        .exec(function (err, templates) {

            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': templates
                });
            }
        })

}
/* @function : getRelatedUser based on selected department
 *  @author  : Souqbox
 *  @created  : 21-Apr-18
 *  @modified :
 *  @purpose  : To get all RA templates related department .
 */
exports.getRelatedUser = function (req, res, next) {

    var dept_id = req.params.client_id;

    var query = {
        department: dept_id,
        is_deleted: false,
        status: "Active"

    }

    userTable.find(query, '_id client_id firstname lastname')
        .exec(function (err, users) {

            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': users
                });
            }
        })

}

/* @function : getAllApprovingManagers
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To get all approving managers.
 */
exports.getAllApprovingManagers = function (req, res, next) {
    if (req.user.id) {
        approvingManagerObj.find({
            // client_admin_id: req.user.id,
            companyId: req.user.companyID,
            is_deleted: false
        }, function (err, approving_manager) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': approving_manager
                });
            }
        })
    }
}
/* @function : getTravellersForDepartment
 *  @author  : Hemant
 *  @created  : 20-sep-17
 *  @modified :
 *  @purpose  : To get all travellers.
 */
exports.getTravellersForDepartment = function (req, res, next) {
    if (req.user.id) {
        userObj.find({
            is_deleted: false,
            admin: false,
            // client_admin_id: req.user.id
            companyId: req.user.companyID
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
/* @function : getTravellersForDepartment
 *  @author  : Hemant
 *  @created  : 20-sep-17
 *  @modified :
 *  @purpose  : To get all travellers.
 */
exports.getBasicAdminforDepartment = function (req, res, next) {
    if (req.user.id) {
        userObj.find({
            is_deleted: false,
            admin: true,
            // client_admin_id: req.user.id
            companyId: req.user.companyID
        }, function (err, basicAdmin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': basicAdmin
                });
            }
        })
    }
}
/* @function : saveDepartment
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To save department.
 */
exports.saveDepartment = function (req, res, next) {
    if (req.body) {
        if(req.body.client_id != undefined && req.body.client_id != null){
            var clientId = req.body.client_id;
        } else {
            clientId = req.user.client_id;
        }
        departmentObj.find({
            department_name: req.body.department_name,
            is_deleted: false,
            client_id: clientId
        }, function (err, department) {
            if (department.length > 0) {
                next(createError( config.error, 'Department name already exist.'));
            } else {
                var departmentArr = new departmentObj({
                    department_name: req.body.department_name,
                    creator: req.body.creator,
                    status: 'Active',
                    client_id: clientId,
                    final_approving_manager: req.body.finalam ? req.body.finalam : undefined,
                    alternative_final_approving_manager: req.body.alter_finalam ? req.body.alter_finalam : undefined,
                    basic_admin: req.body.basic_admin ? req.body.basic_admin : undefined,

                });
                try {
                    departmentArr.save(function (err, result) {
                        if (err) {
                            next(createError( config.serverError, err));
                        }
                        req.body.templatelist.forEach(function (templates) {

                            var query = {
                                _id: templates,
                                is_deleted: false
                            }

                            typeOfRaObj.findOne(query)

                                .exec(function (err, newresult) {

                                    if (err) {
                                        next(createError( config.serverError, config.generalErrorMessage));
                                    } else {
                                        var department_array = newresult.client_department.concat(result._id);
    
                                        typeOfRaObj.update(query, {
                                                $set: {
                                                    client_department: department_array
                                                }
                                            }, function (err, changeStatus) {
                                                if (err) {
                                                    next(createError( config.serverError, config.generalErrorMessage));
                                                }
                                            })


                                    }


                                })


                        })


                        req.body.newusers.forEach(function (users) {

                            var query = {
                                _id: users,
                                is_deleted: false,
                                status: "Active"
                            }

                            userTable.findOne(query)

                                .exec(function (err, newusers) {

                                    if (err) {
                                        next(createError( config.serverError, config.generalErrorMessage));
                                    } else {
                                        console.log("new :", newusers)
                                        if(typeof newusers != undefined && newusers != null){
                                        if ( typeof newusers.department != undefined && newusers.department != null) {
                                            console.log("dpet :", newusers.department)

                                            var user_array = newusers.department.concat(result._id);
                                        } else {
                                            var user_array = result._id;
                                        }
                                    }
                                        
    
                                        userTable.update(query, {
                                                $set: {
                                                    
                                                    department: user_array
                                                }
                                            }, function (err, changeStatus) {
                                                if (err) {
                                                    next(createError( config.serverError, config.generalErrorMessage));
                                                }
                                            })


                                    }


                                })


                        })


                        
                            res.json({
                                'code': config.success,
                                'message': 'Department saved  successfully'
                            });
                        



                    })
                } catch (e) {
                    next(createError( config.serverError, config.generalErrorMessage));
                }

            }
        })
    }
}



/* @function : getAllDepartment
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To get all department.
 */
exports.getAllDepartment = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
    }
    console.log('ttttttttttttttt===', req.user);
    if (req.user.super_admin != true) {
        query = {
            is_deleted: false,
            client_id: req.user.client_id
        }
    }

    if (req.body.keyword){
        query.department_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
    }
    departmentObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('final_approving_manager')
        .populate('alternative_final_approving_manager')
        .populate('intermediate_approving_manager')
        .populate('basic_admin')
        .populate('creator')
        .populate('client_id')
        .exec(function (err, data) {
            if (data) {
                departmentObj.count(query, function (err, count) {
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

/* @function : deleteDepartment
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To delete department.
 */
exports.deleteDepartment = function (req, res, next) {
    if (req.params.department_id) {
        departmentObj.update({
            _id: req.params.department_id
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
                        'message': 'department deleted successfully',
                    });
                }
            })
    }
}



/* @function : changeDepartmentStatus
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To change department status.
 */
exports.changeDepartmentStatus = function (req, res, next) {
    if (req.body) {
        departmentObj.update({
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
                        'message': 'department status updated successfully'
                    });
                }
            })
    }
}


/* @function : getDepartmentDetail
 *  @author  : MadhuriK
 *  @created  : 01-Jun-17
 *  @modified :
 *  @purpose  : To get details of department.
 */
exports.getDepartmentDetail = function (req, res, next) {
    if (req.params.department_id) {
        departmentObj.findOne({
            _id: req.params.department_id,
            is_deleted: false
        }).populate('final_approving_manager')
        .populate('alternative_final_approving_manager')
        .populate('basic_admin')
        .populate('client_id')
        .exec(function (err, department) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'success',
                    'data': department
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
exports.updateDepartment = function (req, res, next) {
    if (req.body) {
        if(req.body.client_id != undefined && req.body.client_id != null){
            var clientId = req.body.client_id;
        } else {
            clientId = req.user.client_id;
        }
        departmentObj.find({
            department_name: req.body.department_name,
            is_deleted: false,
            _id: {
                $ne: req.body._id
            },
            client_id: clientId
        }, function (err, department) {
            if (department.length > 0) {
                next(createError( config.error, 'Department name already exist.'));
            } else {
                var department_id = req.body._id;
                var final_approving_manager;
                var alternative_final_approving_manager;
                var intermediate_approving_manager;
                var basic_admin;
                if ( Array.isArray(req.body.final_approving_manager)) {
                    if (req.body.final_approving_manager.indexOf("id") == -1) {

                        final_approving_manager = req.body.final_approving_manager;
                        console.log("ulla");
                    } else {
                        console.log("veliya");

                        final_approving_manager = JSON.parse(req.body.final_approving_manager)._id;

                    }
                } else {
                  final_approving_manager = req.body.final_approving_manager ? req.body.final_approving_manager : undefined;
                }
                if ( Array.isArray(req.body.alternative_final_approving_manager)) {
                    if (req.body.alternative_final_approving_manager.indexOf("id") == -1) {

                        alternative_final_approving_manager = req.body.alternative_final_approving_manager;
                        console.log("ulla");
                    } else {
                        console.log("veliya");

                        alternative_final_approving_manager = JSON.parse(req.body.alternative_final_approving_manager)._id;

                    }
                } else {
                  alternative_final_approving_manager = req.body.alternative_final_approving_manager ? req.body.alternative_final_approving_manager : undefined;
                }

                if ( Array.isArray(req.body.basic_admin)) {
                    if (req.body.basic_admin.indexOf("id") == -1) {

                        basic_admin = req.body.basic_admin;
                        console.log("ulla");
                    } else {
                        console.log("veliya");

                        basic_admin = JSON.parse(req.body.basic_admin)._id;

                    }
                } else {
                  basic_admin = req.body.basic_admin ? req.body.basic_admin : undefined;
                }


                department = {
                    department_name: req.body.department_name,
                    final_approving_manager: final_approving_manager,
                    alternative_final_approving_manager: alternative_final_approving_manager,
                    basic_admin: basic_admin

                }

                departmentObj.update({
                    _id: department_id,
                    is_deleted: false
                }, {
                        $set: department
                    }, function (err) {

                        if (err) {
                            next(createError( config.serverError, config.generalErrorMessage));
                        } else {


                            //Starting of updating templates
                            typeOfRaObj.find({
                                client_department: department_id,
                                is_deleted: false,
                            }, function (err, allra) {

                                if (allra.length > 0) {

                                    allra.forEach(function (allra_result) {

                                        if (req.body.templatelist.length > 0) {

                                            var indexval = -1;

                                            var filteredRes = req.body.templatelist.find(function (item, i) {

                                                if (item == allra_result._id) {
                                                    indexval = i;
                                                    return indexval;

                                                }
                                            })
                                            console.log("fdddfddf")
                                            console.log(indexval)

                                            if (indexval == -1) {


                                                var query = {
                                                    _id: allra_result._id,
                                                    is_deleted: false
                                                }

                                                typeOfRaObj.findOne(query)

                                                    .exec(function (err, newresult) {
                                                        newresult.client_department = [];
                                                        if (err) {
                                                            next(createError( config.serverError, config.generalErrorMessage));
                                                        } else {
                                                            //  var department_array = newresult.client_department.concat(result._id);

                                                            console.log("11111")
                                                            var index = allra_result.client_department.indexOf(department_id)
                                                            allra_result.client_department.splice(index, 1);
                                                            typeOfRaObj.update({
                                                                _id: allra_result._id,
                                                                is_deleted: false
                                                            }, {
                                                                    $set: {
                                                                        client_department: allra_result.client_department
                                                                    }
                                                                }, function (err, changeStatus) {
                                                                    if (err) {
                                                                        next(createError( config.serverError, config.generalErrorMessage));
                                                                    }
                                                                })


                                                        }


                                                    })

                                            } else {

                                                req.body.templatelist.forEach(function (newtemplateslist) {


                                                    var query = {
                                                        _id: newtemplateslist,
                                                        is_deleted: false
                                                    }

                                                    typeOfRaObj.findOne(query)

                                                        .exec(function (err, newresult) {

                                                            if (err) {
                                                                next(createError( config.serverError, config.generalErrorMessage));
                                                            } else {

                                                      var index = newresult.client_department.indexOf(department_id)

                                                      console.log(index)

                                                      if(index == -1){

                                                    var department_array = newresult.client_department.concat(department_id);

                                                    typeOfRaObj.update({
                                                                        _id: newtemplateslist,
                                                                        is_deleted: false
                                                                    }, {
                                                                            $set: {
                                                                                client_department: department_array
                                                                            }
                                                                        }, function (err, changeStatus) {
                                                                            if (err) {
                                                                                next(createError( config.serverError, config.generalErrorMessage));
                                                                            }
                                                                        })

                                                      }


                                                            }
                                                        })




                                                            })
                                                }
                                        } else {



                                                var index = allra_result.client_department.indexOf(department_id)
                                                allra_result.client_department.splice(index, 1);

                                                console.log("33333")

                                                typeOfRaObj.update({
                                                    _id: allra_result._id,
                                                    is_deleted: false
                                                }, {
                                                        $set: {
                                                            client_department: allra_result.client_department
                                                        }
                                                    }, function (err, changeStatus) {
                                                        if (err) {
                                                            next(createError( config.serverError, config.generalErrorMessage));
                                                        }
                                                    })


                                            }

                                        })
                                } else {

                                    req.body.templatelist.forEach(function (newone) {
                                        var query = {
                                            _id: newone,
                                            is_deleted: false
                                        }

                                        typeOfRaObj.findOne(query)

                                            .exec(function (err, newresult) {

                                                if (err) {
                                                    next(createError( config.serverError, config.generalErrorMessage));
                                                } else {

                                                    var department_array = newresult.client_department.concat(department_id);



                                                    typeOfRaObj.update({
                                                        _id: newone,
                                                        is_deleted: false
                                                    }, {
                                                            $set: {
                                                                client_department: department_array
                                                            }
                                                        }, function (err, changeStatus) {
                                                            if (err) {
                                                                next(createError( config.serverError, config.generalErrorMessage));
                                                            }
                                                        })
                                                }

                                            })

                                    })

                                }


                            })

                            //Starting of updating Users

                            userTable.find({
                                department: department_id,
                                is_deleted: false,
                            }, function (err, alluser) {

                                if (alluser.length > 0) {

                                    alluser.forEach(function (alluser_result) {

                                        if (req.body.newusers.length > 0) {

                                            var indexval = -1;

                                            var filteredRes = req.body.newusers.find(function (item, i) {

                                                if (item == alluser_result._id) {
                                                    indexval = i;
                                                    return indexval;

                                                }
                                            })


                                            if (indexval == -1) {


                                                var query = {
                                                    _id: alluser_result._id,
                                                    is_deleted: false
                                                }

                                                userTable.findOne(query)

                                                    .exec(function (err, newresult) {
                                                        newresult.department = [];
                                                        if (err) {
                                                            next(createError(config.serverError, err));
                                                        } else {
                                                            var index = alluser_result.department.indexOf(department_id)
                                                            alluser_result.department.splice(index, 1);
                                                            userTable.update({
                                                                _id: alluser_result._id,
                                                                is_deleted: false
                                                            }, {
                                                                    $set: {
                                                                        department: alluser_result.department
                                                                    }
                                                                }, function (err, changeStatus) {
                                                                    if (err) {
                                                                        next(createError(config.serverError, err));
                                                                    }
                                                                })


                                                        }


                                                    })

                                            } else {

                                                req.body.newusers.forEach(function (newtemplateslist) {

                                                    var query = {
                                                        _id: newtemplateslist,
                                                        is_deleted: false
                                                    }

                                                    userTable.findOne(query)

                                                        .exec(function (err, newresult) {

                                                            if (err) {
                                                                next(createError(config.serverError, err));
                                                            } else {

                                                      var index = newresult.department.indexOf(department_id)

                                                      console.log(index)

                                                      if(index == -1){

                                                    var department_array = newresult.department.concat(department_id);

                                                    userTable.update({
                                                                        _id: newtemplateslist,
                                                                        is_deleted: false
                                                                    }, {
                                                                            $set: {
                                                                                department: department_array
                                                                            }
                                                                        }, function (err, changeStatus) {
                                                                            if (err) {
                                                                                next(createError(config.serverError, err));
                                                                            }
                                                                        })

                                                      }


                                                            }
                                                        })









                                                })
                                            }
                                        } else {



                                            var index = alluser_result.department.indexOf(department_id)
                                            alluser_result.department.splice(index, 1);


                                            userTable.update({
                                                _id: alluser_result._id,
                                                is_deleted: false
                                            }, {
                                                    $set: {
                                                        department: alluser_result.department
                                                    }
                                                }, function (err, changeStatus) {
                                                    if (err) {
                                                        next(createError(config.serverError, err));
                                                    }
                                                })


                                        }

                                    })
                                } else {
                                    req.body.newusers.forEach(function (newone) {

                                        var query = {
                                            _id: newone,
                                            is_deleted: false
                                        }

                                        userTable.findOne(query)

                                            .exec(function (err, newresult) {
                                                if (err) {
                                                    next(createError(config.serverError, err));
                                                } else {
                                                    var department_array = newresult.department.concat(department_id);


                                        userTable.update({
                                            _id: newone,
                                            is_deleted: false
                                        }, {
                                                $set: {
                                                    department: department_array
                                                }
                                            }, function (err, changeStatus) {
                                                if (err) {
                                                    next(createError(config.serverError, err));
                                                }
                                            })

                                        }
                                    })






                                    })

                                }


                            })





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
