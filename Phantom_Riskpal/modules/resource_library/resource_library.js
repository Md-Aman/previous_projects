var resourceLibObj = require('./../../schema/resource_library'); // include resource_library schema file
var config = require('../../config/jwt_secret.js');
var multer = require('multer');
var userObj = require('./../../schema/users.js'); // include user schema file
var storage = multer.diskStorage({
    destination: function (req, files, callback) {
        callback(null, './riskpal-client/uploads');
    },
    filename: function (req, files, callback) {
        callback(null, Date.now() + '_' + files.originalname);
    }
});
var approvingManagerObj = require('./../../schema/approving_manager.js'); // include approving manager schema file
//   fileFilter: function (req, file, cb) {
//     if (path.extension(file.originalname) !== '.pdf') {
//       return cb(null, false)
//     }

//     cb(null, true)
//   }
var upload = multer({
    storage: storage
}).any();
var fs = require('fs');

/* @function : uploadProfilePic
 *  @author  : MadhuriK 
 *  @created  : 09-May-17
 *  @modified :
 *  @purpose  : To upload traveller profile pic.
 */
exports.uploadResourceLibDoc = function (req, res) {
    pathArr = [];
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else if (req.files !== undefined) {
            req.files.forEach(function (file) {
                var filePath = file.path.split("/");
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


/* @function : saveResourceLib
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To save resource library.
 */
exports.saveResourceLib = function (req, res) {
    if (req.body) {
        req.body.client_admin_id = req.user.id;
        req.body.companyId = req.user.companyID;
        var resourceLib = new resourceLibObj(req.body);
        resourceLib.save(function (err) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Something went wrong please try again'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Your resource library has been added successfully'
                });
            }
        })
    }
}



/* @function : getAllResourceLibrary
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To get all resource library.
 */
exports.getAllResourceLibrary = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        // client_admin_id: req.user.id
        companyId: req.user.companyID
    }
    if (req.body.category_name)
        query.categoryName = {
            $regex: req.body.category_name,
            $options: "$i"
        };

    resourceLibObj.find(query)
        .sort(sortby)
        .limit(limit)
        .populate('department')
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                resourceLibObj.count(query, function (err, count) {
                    res.json({
                        'code': config.success,
                        'data': data,
                        'count': count
                    });
                })
            } else {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            }
        });
}


/* @function : deleteResourceLib
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To delete resource library.
 */
exports.deleteResourceLib = function (req, res) {
    if (req.params.resource_library_id) {
        resourceLibObj.update({
            _id: req.params.resource_library_id,
            is_deleted: false
        }, {
            $set: {
                is_deleted: true
            }
        }, function (err, update) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'resource library deleted successfully'
                });
            }
        })
    }
}


/* @function : changeResourceLibStatus
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To change resource library status.
 */
exports.changeResourceLibStatus = function (req, res) {
    if (req.body) {
        resourceLibObj.update({
            _id: req.body.id,
            is_deleted: false
        }, {
            $set: {
                status: req.body.status
            }
        }, function (err, changeStatus) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Resource library status updated successfully'
                });
            }
        })
    }
}


/* @function : uploadCategoryImage
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To upload category image.
 */
exports.uploadCategoryImage = function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Error uploading file.");
        } else if (req.files !== undefined) {
            var filePath = req.files[0].path.split("/");
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


/* @function : getResourceLibForTraveller
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To get all resource library for traveller.
 */
exports.getResourceLibForTraveller = function (req, res) {
    userObj.findOne({
        _id: req.traveller.id,
        is_deleted: false,
        admin: false,
        client_admin: false
    }).populate('client_admin_id').exec(function (err, user) {
        if (err) {
            console.log("err")
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong please try again'
            });
        } else {
            var query = {
                is_deleted: false,
                companyId: user.client_admin_id.companyId,
                $or: [{ department: { $in: user.department } }, { 'grant_access.traveller': true }],
            }
            if (req.body.category_name)
                query.categoryName = {
                    $regex: req.body.category_name,
                    $options: "$i"
                };
            resourceLibObj.find(query)
                .exec(function (err, data) {
                    if (data) {
                        resourceLibObj.count(query, function (err, count) {
                            res.json({
                                'code': config.success,
                                'data': data,
                                'count': count
                            });
                        })
                    } else {
                        res.json({
                            'error': err,
                            'code': config.error,
                            'message': 'Something went wrong please try again!'
                        });
                    }
                });
        }
    })
}
/* @function : getResourceLibDetails
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To get resource library details.
 */
exports.getResourceLibDetails = function (req, res) {
    if (req.params.resource_library_id) {
        resourceLibObj.findOne({
            _id: req.params.resource_library_id,
            is_deleted: false
        }, function (err, resource_library) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': resource_library,
                });
            }
        })
    }
}


/* @function : getResourceLibForApprovingManager
 *  @author  : MadhuriK 
 *  @created  : 10-May-17
 *  @modified :
 *  @purpose  : To all resource library for approving manager.
 */
exports.getResourceLibForApprovingManager = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    approvingManagerObj.findOne({
        _id: req.approving_manager.id,
        is_deleted: false
    }).populate('client_admin_id').exec(function (err, user) {
        if (err) {
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong please try again'
            });
        } else {
            var query = {
                is_deleted: false,
                companyId: user.client_admin_id.companyId,
                $or: [{ department: { $in: user.department } }, { 'grant_access.approving_manager': true }],
            }
            if (req.body.category_name)
                query.categoryName = {
                    $regex: req.body.category_name,
                    $options: "$i"
                };
            resourceLibObj.find(query)
                .sort(sortby)
                .limit(limit)
                .skip(skip)
                .exec(function (err, data) {
                    if (data) {
                        resourceLibObj.count(query, function (err, count) {
                            res.json({
                                'code': config.success,
                                'data': data,
                                'count': count
                            });
                        })
                    } else {
                        res.json({
                            'error': err,
                            'code': config.error,
                            'message': 'Something went wrong please try again!'
                        });
                    }
                });
        }
    })
}


/* @function : getResourceLibData
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To get resource library data for orginization admin.
 */
exports.getResourceLibData = function (req, res) {
    if (req.params.resource_library_id) {
        resourceLibObj.findOne({
                _id: req.params.resource_library_id,
                is_deleted: false
            })
            // .populate('department')
            .exec(function (err, resource_library) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'data': resource_library,
                    });
                }

            })
    }

}


/* @function : getResourceLibData
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To get resource library data for orginization admin.
 */
exports.updateResourceLib = function (req, res) {
    if (req.body) {
        var resource_library_id = req.body._id;
        var resourceData = {
            categoryName: req.body.categoryName,
            grant_access: req.body.grant_access,
            description: req.body.description,
            department: req.body.department
        }
        if (req.body.resource_library_doc.length > 0) {
            resourceData.resource_library_doc = req.body.resource_library_doc
        }
        if (req.body.category_image) {
            resourceData.category_image = req.body.category_image
        }
        resourceLibObj.update({
            _id: resource_library_id,
            is_deleted: false
        }, {
            $set: resourceData
        }, function (err) {
            if (err) {
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Resource library updated successfully'
                });
            }
        })

    }
}
/* @function : removeDoc
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : to remove docs
 */
exports.removeDoc = function (req, res) {
    console.log("req.body????", req.body)
    var docs = req.body.data.split('/')[2]
    if (req.body) {
        fs.unlink('./riskpal-client/uploads/' + docs, function (err) {
            if (err) {
                console.log(err, ">>>>>>>>>>")
                res.json({
                    'error': err,
                    'code': config.error,
                    'message': 'Something went wrong please try again!'
                });
            } else {
                resourceLibObj.update({
                    _id: req.body.id,
                    is_deleted: false
                }, {
                    $pull: {
                        "resource_library_doc": req.body.data
                    }
                }, function (err) {
                    if (err) {
                        console.log(err, "<<<<<<<<<<<<<<<<")
                        res.json({
                            'error': err,
                            'code': config.error,
                            'message': 'Something went wrong please try again!'
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Document removed successfully!'
                        });
                    }
                })
            }
        });
    }
}