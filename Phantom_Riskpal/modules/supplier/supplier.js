var config = require('../../config/jwt_secret.js'); // config 
var supplierObj = require('./../../schema/supplier.js'); // include supplier schema file
var currencyObj = require('./../../schema/currency.js'); // include currency schema file
var multer = require('multer');
var createError = require('http-errors');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './clientPortal/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('file');
var _ = require('underscore');


/* @function : addSupplier
 *  @author  : MadhuriK 
 *  @created  : 10-Apr-17
 *  @modified :
 *  @purpose  : To add supplier.
 */
exports.addSupplier = function (req, res, next) {
    if (req.body) {
       // req.body.client_admin_id = req.user.id;
       //req.body.client_id = req.body.client_id;
        let imageUrl = '';
        if ( req.location ) {
            imageUrl = req.location[0].Location;
        }
        req.body.attachment = imageUrl;
        req.body.rate = req.body.rate ? req.body.rate.replace(/'/g, '') : "";
        req.body.client_id = req.user.client_id;
        var supplier = new supplierObj(req.body);
        supplierObj.findOne({
            $or: [{ "number": req.body.number }, {
                                "email": req.body.email
                            }]
        }, function (err, usergroup) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (usergroup) {
                res.json({
                    'error': 'Mobile number or Email id already exists',
                    'code': config.error,
                    'message': 'Mobile number or Email id already exists'
                });
            } else {
        supplier.save(function (err, data) {
            if (err) {
                next(createError(config.serverError, err));

            } else {
                res.json({
                    'code': config.success,
                    'data': data,
                    'message': 'supplier added successfully'
                });
            }
        })
    }
})
}
   
}



/* @function : uploadAttachment
 *  @author  : MadhuriK 
 *  @created  : 10-Apr-17
 *  @modified :
 *  @purpose  : To upload attachment of supplier.
 */
exports.uploadAttachment = function (req, res, next) {
    upload(req, res, function (err) {
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



/* @function : getAllSupplier
 *  @author  : MadhuriK 
 *  @created  : 10-Apr-17
 *  @modified :
 *  @purpose  : To add get all supplier.
 */
exports.getAllSupplier = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    if(req.user.super_admin == true){
        var query = {
            is_deleted: false,
        }
       }else{
         query = {
            is_deleted: false,
            client_id:req.user.client_id
        }
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
        console.log("string normal");
    supplierObj.find(query)
        .populate('department')
        .populate('types_of_ra_id')
        .populate('client_id')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        //  .populate('country')
        .exec(function (err, data) {
            if (data) {
                supplierObj.count(query, function (err, count) {
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

// Assign RA to supplier 

exports.assignSupplierToRa = function (req, res, next) {
    console.log("req.body :", req.body);
    if (req.body) {
        if (req.body.assign == true) {
            supplierObj.update({
                _id: req.body._id
            }, {
                    $push: {
                        types_of_ra_id: req.body.assignRaId
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Supplier assigned to risk assessment',
                        });
                    }
                })
        } else if (req.body.assign == false) {
            supplierObj.update({
                _id: req.body._id
            }, {
                    $pull: {
                        types_of_ra_id: req.body.assignRaId
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Supplier removed from risk assessment',
                        });
                    }
                })
        }

    }
}

exports.assignSupplierToRiskAssessment = function (req, res, next) {
    console.log("req.body :", req.body);
    if (req.body) {
        if (req.body.assign == true) {
            supplierObj.findOneAndUpdate({
                _id: req.body._id
            }, {
                    $push: {
                        news_ra_id: req.body.assignRaId
                    }
                },{upsert:true}, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Supplier assigned to risk assessment',
                        });
                    }
                })
        } else if (req.body.assign == false) {
            supplierObj.findOneAndUpdate({
                _id: req.body._id
            }, {
                    $pull: {
                        news_ra_id: req.body.assignRaId
                    }
                }, {upsert:true}, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Supplier removed from risk assessment',
                        });
                    }
                })
        }

    }
}
/* @function : getSupplierDetails
 *  @author  : MadhuriK 
 *  @created  : 11-Apr-17
 *  @modified :
 *  @purpose  : To get supplier details.
 */
exports.getSupplierDetails = function (req, res, next) {
    var supplier_id = req.params.supplier_id;
    if (supplier_id) {
        supplierObj.findOne({
            _id: supplier_id,
            is_deleted: false
        }, function (err, supplier) {
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
 *  @created  : 11-Apr-17
 *  @modified :
 *  @purpose  : To update supplier.
 */
exports.updateSupplier = function (req, res, next) {
    if (req.body._id) {
        var supplier_id = req.body._id;
        delete req.body._id;
        var client_id = req.user.client_id;
        var supplier = {
            supplier_name: req.body.supplier_name,
            rating_with_star: req.body.rating_with_star,
            service_provided: req.body.service_provided,
            sourced_by: req.body.sourced_by,
            contact: req.body.contact,
            cost: req.body.cost,
            currency: req.body.currency,
            address: req.body.address,
            number: req.body.number,
            email: req.body.email,
            preparence: req.body.preparence,
            city: req.body.city,
            country: req.body.country,
            client_id:client_id,
            //rate: req.body.rate.replace(/'/g, ''),
            description: req.body.description,
            other_service: req.body.other_service,
            department: req.body.department,
            website:req.body.website
        }
        if ( req.location ) {
            supplier.attachment = req.location[0].Location;
        }
        
        supplierObj.update({
            _id: supplier_id,
            is_deleted: false
        }, {
            $set: supplier
        },async function (err, data) {
            console.log('dataaaaaaa', data);
            // delete old image from S3
            if ( data.attachment && typeof userRec.attachment != 'undefined' && req.location ) {
                const deleted = await deleteObject(req, res, next, { name: data.attachment });
                console.log('deleteobjeckt', deleted);
            }
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


/* @function : changeSupplierStatus
 *  @author  : MadhuriK 
 *  @created  : 11-Apr-17
 *  @modified :
 *  @purpose  : To change supplier status.
 */
exports.changeSupplierStatus = function (req, res, next) {
    if (req.body) {
        supplierObj.update({
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


/* @function : deleteSupplier
 *  @author  : MadhuriK 
 *  @created  : 11-Apr-17
 *  @modified :
 *  @purpose  : To delete supplier.
 */
exports.deleteSupplier = function (req, res, next) {
    if (req.params.supplier_id) {
        supplierObj.update({
            _id: req.params.supplier_id,
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
                    'message': 'Supplier deleted successfully'
                });
            }
        })
    }
}


/* @function : getAllCurrencies
 *  @author  : MadhuriK 
 *  @created  : 11-Apr-17
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