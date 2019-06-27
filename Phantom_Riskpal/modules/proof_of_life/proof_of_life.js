var proofOfLifeObj = require('./../../schema/proof_of_life.js'); // include proof_of_life schema file
var config = require('../../config/jwt_secret.js');

var createError = require('http-errors');


/* @function : saveProofOfLife
 *  @author  : MadhuriK 
 *  @created  : 16-May-17
 *  @modified :
 *  @purpose  : To save proof of life.
 */
exports.saveProofOfLife = function (req, res) {
    if (req.body) {
        req.body.client_admin_id = req.user.id;
        req.body.companyId = req.user.companyID;
        var proof_of_life = new proofOfLifeObj(req.body);
        proof_of_life.save(function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Proof of life has been added successfully'
                });
            }
        })
    }
}


/* @function : getAllProofOfLife
 *  @author  : MadhuriK 
 *  @created  : 16-May-17
 *  @modified :
 *  @purpose  : To get proof of life.
 */
exports.getAllProofOfLife = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        // client_admin_id: req.user.id
        companyId: req.user.companyID


    }
    if (req.body.question_name)
        query = {
            question: req.body.question_name
        };

    proofOfLifeObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .exec(function (err, data) {
            if (data) {
                proofOfLifeObj.count(query, function (err, count) {
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



/* @function : changeProofOfLifeStatus
 *  @author  : MadhuriK 
 *  @created  : 17-May-17
 *  @modified :
 *  @purpose  : To change proof of life question status.
 */
exports.changeProofOfLifeStatus = function (req, res) {
    if (req.body) {
        proofOfLifeObj.update({
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
                    'message': 'Proof of life question status updated successfully'
                });
            }
        })
    }
}


/* @function : deleteProofOfLife
 *  @author  : MadhuriK 
 *  @created  : 17-May-17
 *  @modified :
 *  @purpose  : To delete proof of life.
 */
exports.deleteProofOfLife = function (req, res) {
    if (req.params.proof_life_id) {
        proofOfLifeObj.update({
            _id: req.params.proof_life_id,
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
                    'message': 'Proof of life question deleted successfully'
                });
            }
        })
    }
}


/* @function : getProofOfData
 *  @author  : MadhuriK 
 *  @created  : 17-May-17
 *  @modified :
 *  @purpose  : To get proof of life.
 */
exports.getProofOfData = function (req, res) {
    if (req.params.proof_life_id) {
        proofOfLifeObj.findOne({
            _id: req.params.proof_life_id,
            is_deleted: false
        }, function (err, proofOfLife) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': proofOfLife
                });
            }
        })
    }
}


/* @function : updateProofOfLife
 *  @author  : MadhuriK 
 *  @created  : 17-May-17
 *  @modified :
 *  @purpose  : To update proof of life.
 */
exports.updateProofOfLife = function (req, res) {
    if (req.body) {
        proofOfLifeObj.update({
            _id: req.body._id,
            is_deleted: false
        }, {
            $set: {
                question: req.body.question,
                description: req.body.description
            }
        }, function (err) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Proof of life updated successfully'
                });
            }
        })
    }

}


/* @function : getProofOfLifeQuestions
 *  @author  : MadhuriK 
 *  @created  : 17-May-17
 *  @modified :
 *  @purpose  : To get proof of life questions.
 */
exports.getProofOfLifeQuestions = function (req, res) {
    proofOfLifeObj.find({
        is_deleted: false,
        status: 'Active'
    }, function (err, proofOfLife) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': proofOfLife
            });
        }
    })
}