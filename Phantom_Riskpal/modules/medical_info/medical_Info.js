var config = require('../../config/jwt_secret.js'); // config 
var medicalObj = require('./../../schema/medical_info.js');
var userObj = require('./../../schema/users.js'); // include users schema file
var config = require('../../config/jwt_secret.js'); // config 
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var moment = require("moment");
var async = require('async');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/* @function : getAllMedicalInfoRequest
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To show list of all medical information requests
 */
exports.getAllMedicalInfoRequest = function (req, res) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        // client_admin_id: req.user.id
        companyId: req.user.companyID
    }
    if (req.body.keyword)
        query['$or'] = [{
            firstname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            email: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            role: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            threat_level: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];
    medicalObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('approving_manager')
        .populate('traveller')
        .exec(function (err, data) {
            if (data) {
                medicalObj.count(query, function (err, count) {
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
/* @function : approveMedicalInfo
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To approve medical information requet
 */
exports.approveMedicalInfo = function (req, res) {
    if (req.body) {
        medicalObj.findOneAndUpdate({
                _id: req.body.id._id
            }, {
                $set: {
                    accept_request: true
                }
            })
            .populate('approving_manager')
            .populate('traveller')
            .populate('client_admin_id')
            .exec(function (err, medical_info) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else {
                    var Medical_request_by_approving_manager = [{
                        "status": 1
                    }]
                    userObj.findOneAndUpdate({
                            _id: req.body.id.traveller._id,
                            "Medical_request_by_approving_manager.approving_manager": req.body.id.approving_manager._id
                        }, {
                            $set: {
                                "Medical_request_by_approving_manager.$.status": 3
                            }
                        }, {
                            upsert: true
                        })
                        .populate('approving_manager')
                        .populate('traveller')
                        .populate('client_admin_id')
                        .exec(function (err, userdata) {
                            if (err) {
                                res.json({
                                    'error': err,
                                    'code': config.error,
                                    'message': 'Something went wrong please try again!'
                                });
                            } else {
                                console.log("userdata", userdata)
                                if (medical_info.approving_manager) {
                                    var smtpTransport = nodemailer.createTransport({
                                        service: config.service,
                                        auth: {
                                            user: config.username,
                                            pass: config.password
                                        }
                                    });
                                    var mailOptions = {
                                        from: 'noreply.riskpal@gmail.com',
                                        to: medical_info.approving_manager.email,
                                        subject: 'Request acceptence',
                                        html: 'Hello, ' + medical_info.approving_manager.firstname + '<br><br>' +
                                            'your Request for travellers medical information has been accepted by client' + '\n\ </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                    };
                                    var mailOptions1 = {
                                        from: 'noreply.riskpal@gmail.com',
                                        to: medical_info.traveller.email,
                                        subject: 'Request acceptence',
                                        html: 'Hello, ' + medical_info.traveller.firstname + ' ' + medical_info.traveller.lastname + '<br><br>' +
                                            'The Client Super Admin' + ' ' + medical_info.client_admin_id.firstname + ' ' + medical_info.client_admin_id.lastname + ' ' + 'have approved to access to medical records to be accessed by Approving Manager' + ' ' + medical_info.approving_manager.firstname +
                                            '\n\
                                         </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                    };
                                    smtpTransport.sendMail(mailOptions,
                                        function (err) {
                                            if (err) {
                                                res.json({
                                                    'code': config.error,
                                                    'err': err
                                                });
                                            } else {
                                                smtpTransport.sendMail(mailOptions1,
                                                    function (err) {
                                                        if (err) {
                                                            res.json({
                                                                'code': config.error,
                                                                'err': err
                                                            });
                                                        } else {
                                                            res.json({
                                                                'code': config.success,
                                                                'message': 'Request for travellers medical information has been accepted'
                                                            });
                                                        }
                                                    });
                                            }
                                        });
                                }
                            }
                        })
                }
            })
    }
}

/* @function : rejectMedicalInfo
 *  @author  : MadhuriK 
 *  @created  : 12-May-17
 *  @modified :
 *  @purpose  : To reject medical information requet
 */

exports.rejectMedicalInfo = function (req, res) {
    if (req.body) {
        medicalObj.findOneAndUpdate({
                _id: req.body.id._id
            }, {
                $set: {
                    reject_request: true
                }
            })
            .populate('approving_manager')
            .exec(function (err, medical_info) {
                if (err) {
                    res.json({
                        'error': err,
                        'code': config.error,
                        'message': 'Something went wrong please try again!'
                    });
                } else {
                    userObj.findOneAndUpdate({
                            _id: req.body.id.traveller._id,
                            "Medical_request_by_approving_manager.approving_manager": req.body.id.approving_manager._id
                        }, {
                            $set: {
                                "Medical_request_by_approving_manager.$.status": 1,
                                "Medical_request_by_approving_manager.$.approving_manager": null
                            }
                        }, {
                            upsert: true
                        })
                        .populate('approving_manager')
                        .populate('traveller')
                        .populate('client_admin_id')
                        .exec(function (err, userdata) {
                            if (err) {
                                res.json({
                                    'error': err,
                                    'code': config.error,
                                    'message': 'Something went wrong please try again!'
                                });
                            } else {
                                if (medical_info.approving_manager) {
                                    var smtpTransport = nodemailer.createTransport({
                                        service: config.service,
                                        auth: {
                                            user: config.username,
                                            pass: config.password
                                        }
                                    });
                                    var mailOptions = {
                                        from: 'noreply.riskpal@gmail.com',
                                        to: medical_info.approving_manager.email,
                                        subject: 'Request acceptence',
                                        html: 'Hello, ' + medical_info.approving_manager.firstname + '<br><br>' +
                                            'your Request for travellers medical information has been rejected by client' +
                                            '\n\
                                        </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                    };
                                    smtpTransport.sendMail(mailOptions, function (err) {
                                        if (err) {
                                            res.json({
                                                'code': config.error,
                                                'err': err
                                            });
                                        } else {
                                            res.json({
                                                'code': config.success,
                                                'message': 'Request for travellers medical information has been rejected'
                                            });
                                        }
                                    });
                                }

                            }
                        })

                }
            })
    }
}