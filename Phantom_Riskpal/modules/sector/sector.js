var config = require('../../config/jwt_secret.js');
var sectorObj = require('./../../schema/sector.js'); // include sector schema file
var createError = require('http-errors');


/* @function : addSector
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To add sector.
 */
exports.addSector = function (req, res) {
    if (req.body) {
        sectorObj.find({
            sectorName: {
                $regex: new RegExp("^" + req.body.sectorName.toLowerCase(), "i")
            },
            is_deleted: false
        }, function (err, sectorArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (sectorArr.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'sector name already exist'
                });
            } else {
                var sectorData = new sectorObj(req.body);
                sectorData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'sector added successfully.'
                        });
                    }
                })
            }
        })
    }
}


/* @function : getAllSector
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To get all sector.
 */
exports.getAllSector = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false
    }
    if (req.body.sector_name)
        query.sectorName = {
            $regex: req.body.sector_name,
            $options: "$i"
        };

    sectorObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                sectorObj.count(query, function (err, count) {
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



/* @function : changeSectorStatus
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To change sector status.
 */
exports.changeSectorStatus = function (req, res) {
    if (req.body) {
        sectorObj.update({
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
                    'message': 'sector status updated successfully'
                });
            }
        })
    }
}


/* @function : deletesector
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To delete sector.
 */
exports.deletesector = function (req, res) {
    if (req.params.sector_id) {
        sectorObj.update({
            _id: req.params.sector_id,
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
                    'message': 'sector deleted successfully'
                });
            }
        })
    }
}


/* @function : getSectorData
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To get sector data.
 */
exports.getSectorData = function (req, res) {
    if (req.params.sector_id) {
        sectorObj.findOne({
            _id: req.params.sector_id,
            is_deleted: false
        }, function (err, sectorData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': sectorData
                });
            }
        })
    }
}


/* @function : updateSector
 *  @author  : MadhuriK 
 *  @created  : 12-July-17
 *  @modified :
 *  @purpose  : To update sector data.
 */
exports.updateSector = function (req, res) {
    if (req.body) { // prefix match
        sectorObj.find({
            sectorName: {
                $regex: new RegExp("^" + req.body.sectorName.toLowerCase(), "i")
            },
            _id: {
                $ne: req.body._id
            },
            is_deleted: false
        }, function (err, sectorArr) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (sectorArr.length > 0) {
                res.json({
                    'error': 'sector name already exist',
                    'code': config.error,
                    'err': 'sector name already exist'
                });
            } else {
                sectorObj.update({
                    _id: req.body._id,
                    is_deleted: false
                }, {
                    $set: {
                        sectorName: req.body.sectorName
                    }
                }, function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'sector updated successfully'
                        });
                    }
                })
            }
        })
    }
}