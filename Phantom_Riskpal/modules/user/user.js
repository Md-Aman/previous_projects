var userObj = require('./../../schema/users.js'); // include user schema file
var basicAdminObj = require('./../../schema/basic_admin.js'); // include user schema file
var approvingManagerObj = require('./../../schema/approving_manager.js'); // include approving_manager schema file
var countryObj = require('./../../schema/country.js'); // to include country file
var currencyObj = require('./../../schema/currency.js'); // to include currency file
var categoryObj = require('./../../schema/category.js'); // to include category file
var proofOfLifeObj = require('./../../schema/proof_of_life.js'); // to include proof_of_life file
var typeOfRaObj = require('./../../schema/type_of_ra.js'); // to include type_of_ra file
var RaObj = require('./../../schema/news_ra.js'); // to include news_ra file
var newsRaAnsObj = require('./../../schema/news_ra_answer.js'); // to include news_ra_answer file
var QuesObj = require('./../../schema/questionnaire.js'); // to include questionnaire file
var supplierObj = require('./../../schema/supplier.js'); // to include supplier file
var communicationObj = require('./../../schema/communication.js'); // to include communication file
var contingencyObj = require('./../../schema/contingency.js'); // to include contingency file
var departmentObj = require('./../../schema/department.js'); // to include department file
var accessEmgInfoApprovalObj = require('./../../schema/access_emg_info_approval.js');
var config = require('../../config/jwt_secret.js'); // config 
var jwt = require('jsonwebtoken');
var async = require('async');
var mailer = require('../../config/mailer.js');
var constant = require('../../config/constants');
var crypto = require('crypto');
var jsrender = require('node-jsrender');
var htmlToPdf = require('html-to-pdf');
var fs = require('fs');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
var parseNumber = require('libphonenumber-js').parse;
var countryCode = require('libphonenumber-js').getPhoneCode;
var usergroupObj = require('./../../schema/roles.js'); // include roles schema 
var userTable = require('./../../schema/usertables.js'); //user table update 
var clientObj = require('./../../schema/clients.js');  //Clients schema 
var { deleteObject, encryptUserFields, searchByFields } = require('./../../helper/general.helper');
var emailHelper = require('./../../helper/email.helper');
var template = require('./../../helper/template');
var createError = require('http-errors');
var envConfig = require('../../config/config');

/* @function : addTraveller
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To add the users.
 */

exports.reSendUserActivationEmail = function (req, res, next) {
    if (req.body) {
        if (req.user.super_admin === true) {
            query = {
                _id: req.body.data._id,
                is_deleted: false
            };
        } else {
             query = {
                _id: req.body.data._id,
                is_deleted: false,
                client_id: req.user.client_id
            };
        }
        userTable.find(query, async function (err, user) {
            if (err) {
                res.json({
                    'code': config.error,
                    'message': 'User does not exist.',
                });
            } else {
                console.log("userss :", user);
                if(user.length > 0){
                var user = user[0];
                var baseUrl = envConfig.host;
                var url = baseUrl + '/activate-account/' + user.hashcode;
                var repalceData = {
                    userName: user.firstname,
                    urlText: config.emailTemplate.urlText,
                    url: url,
                    userEmail: user.email,
                    accountCreatedBy: req.body.data.client_id.company_name
                };
                try {
                    const body = await template.getBodyData(config.emailTemplate.newRiskPalAccount, repalceData);
                    if (body) {
                        const email = await emailHelper.sendEmailNodeMailer(
                            user.email, body.subject, body.html);
                        if (email) {
                            res.json({
                                'code': config.success,
                                'message': 'User activation email sent successfully.',
                                'data': user
                            });
                        }
                    }
                    

                } catch (err) {
                    next(createError(config.error, err));
                }
            } else {
                res.json({
                    'code': config.success,
                    'message': 'User status is deleted. So, we can not send email',
                    'data': user
                });
            }
            }
        });
    }
}


exports.deactivateUser = function (req, res, next) {
    if (req.body) {
        var isDeleted = true;
        var setStatus = "Expired";
        var msg = 'deactivated';
        if( req.body.is_deleted){
            isDeleted = false;
            setStatus = 'Active';
            msg = 'Activated';
        }
        if (req.user.super_admin === true) {
            query = {
                _id: req.body._id
            };
        } else {
             query = {
                _id: req.body._id,
                client_id: req.user.client_id
            };
        }
        userTable.update(query, {
                $set: {
                    is_deleted: isDeleted,
                    status: setStatus
                }
            }, function (err) {
                if (!err) {
                    res.json({
                        'code': 200,
                        'message': 'User ' + msg +' successfully',
                    });
                } else {
                    next(createError(config.serverError, err));
                }
            });
    };
}

exports.saveUser = function (req, res, next) {
    var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
    const email = req.body.email.toLowerCase();
    const encryptedFields = encryptUserFields(email);
    if (req.body) {
        userTable.find({
            email: encryptedFields.email,
            // is_deleted: false
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'error': 'Email already exists',
                    'code': config.error,
                    'message': 'Email already exists'
                });
            } else {
                try {
                    var number = pnumber;
                    var code = parseNumber(number);
                    console.log("country_code", code)
                    var phone = code.phone
                    var phoneCode = countryCode(code.country);

                    authy.register_user(email, phone, phoneCode, function (err, regRes) {
                        var text = email + " " + "email is not allowed."
                        if (err) {
                            next(createError(config.methodNotAllowed, text));
                        } else {
                            console.log("regRes", regRes)
                            var key = 'salt_from_the_user_document';
                            var cipher = crypto.createCipher('aes-256-cbc', key);
                            var randomPassword = config.randomToken(8);
                            cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                            var encryptedPassword = cipher.final('base64');

                            var cipher_hash = crypto.createCipher('aes-256-cbc', key);
                            var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            var token = '';
                            for (var i = 16; i > 0; --i) {
                                token += chars[Math.round(Math.random() * (chars.length - 1))];
                            }

                            cipher_hash.update(email, 'utf8', 'base64'); // genrate random password
                            var hashcode = token;
                            console.log("coming inside1");

                            if (req.user.super_admin === true) {
                                console.log("superadminn");
                                var client_id = req.body.clients;
                            } else {
                                console.log("nosuper" + req.user.client_id);
                                var client_id = req.user.client_id;
                            }
                            let imageUrl = '';
                            if (req.location) {
                                imageUrl = req.location[0].Location;
                            }
                            // const passport_details = req.body.passport_details;
                            const userObj = {
                                creator: req.user.id,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: email,
                                password: encryptedPassword,
                                mobile_number: pnumber,
                                // department: req.body.clientDepartment,
                                super_admin: false,
                                authyID: regRes.user.id,
                                first_login: true,
                                duoToken: "",
                                status: 'Inactive',
                                client_id: client_id,
                                roleId: req.body.usergroups._id,
                                hashcode: hashcode,
                                // dob: req.body.dob,
                                // gender: req.body.gender,
                                // proof_of_life_answer: req.body.proof_of_life_answer,
                                // passport_data: req.body.passport_data,
                                // passport_details: {
                                //     full_name: passport_details.full_name,
                                //     email: passport_details.email,
                                //     mobile_number: passport_details.mobile_number,
                                //     relationship_to_you: passport_details.relationship_to_you,
                                //     alternative_email: passport_details.alternative_email,
                                //     alternative_full_name: passport_details.alternative_full_name,
                                //     alternative_mobile_number: passport_details.alternative_mobile_number,
                                //     alternative_relationship_to_you: passport_details.alternative_relationship_to_you
                                // },
                                department: req.body.department,
                                image: imageUrl
                            };
                            // if (req.body.proof_of_life_question) {
                            //     userObj.proof_of_life_question = req.body.proof_of_life_question;
                            // } else {
                            //     userObj.proof_of_life_question = undefined;
                            // }
                            console.log('userobj', userObj);
                            var user = new userTable(userObj);
                            user.save(function (err, user) {
                                if (err) {
                                    next(createError(config.error, err));
                                } else {
                                    console.log("reeee");

                                    clientObj.findOne({
                                        _id: client_id,
                                        is_deleted: false


                                    }, async function (errclient, client) {
                                        if (errclient) {
                                            next(createError(config.serverError, errclient));
                                        } else {
                                            var created_by = client.company_name;

                                            var baseUrl = envConfig.host;

                                            var url = baseUrl + '/activate-account/' + hashcode;
                                            var repalceData = {
                                                userName: req.body.firstname,
                                                urlText: config.emailTemplate.urlText,
                                                url: url,
                                                userEmail: email,
                                                accountCreatedBy: created_by
                                            };
                                            try {
                                                const body = await template.getBodyData(config.emailTemplate.newRiskPalAccount, repalceData);
                                                if (body) {
                                                    const email12 = await emailHelper.sendEmailNodeMailer(
                                                        email, body.subject, body.html);
                                                    if (email12) {
                                                        res.json({
                                                            'code': config.success,
                                                            'message': 'User added successfully.',
                                                             user: user
                                                        });
                                                    }
                                                }

                                            } catch (err) {
                                                next(createError(config.error, err));
                                            }
                                        }
                                    });


                                }
                            });
                        }
                    });
                } catch (e) {
                    res.json({
                        'code': config.error,
                        'err': 'Your phone number is not correct.',
                        'message': 'Your phone number is not correct.'
                    });
                }
            }
        });
    }

}

/* @function : getAllUser
 *  @author  : Siroi 
 *  @created  : 26-Mar-18
 *  @modified :
 *  @purpose  : To list the getAllUser.
 */
exports.getAllUser = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    console.log('tokennn', req.user);
    if (req.user.super_admin == true) {
        var query = {
            // is_deleted: false,
            super_admin: false,
        }
    } else {
        var query = {
            // is_deleted: false,
            super_admin: false,
            client_id: req.user.client_id
        }
    }
    let skipSearch = 0;
    let limitSearch = 0;
    if (req.body.keyword) {
        skipSearch = skip;
        limitSearch = limit;
        limit = 0;
        skip = 0;
        // query['$or'] = [{ firstname: { $regex: req.body.keyword, $options: "$i" } },
        // { lastname: { $regex: req.body.keyword, $options: "$i" } },
        // { email: { $regex: req.body.keyword, $options: "$i" } }];
    }
        
    // query.firstname = {
    //     $regex: req.body.keyword,
    //     $options: "$i"
    // };
    userTable.find(query)
        .select('-password -authyID -hashcode')
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('roleId')
        .populate('client_id')
        .populate('department')
        .populate('creator')
        // .populate('proof_of_life_question')
        .exec(function (err, data) {
            if (data) {
                
                if (req.body.keyword) {
                    const searchResult = searchByFields(data, req.body.keyword, ["email", "firstname", "lastname"]);
                    const lim = limitSearch + skipSearch;
                    const sliced = searchResult.slice(skipSearch, lim);
                    res.json({
                        'code': config.success,
                        'data': sliced,
                        'count': searchResult.length
                    });
                } else {
                    userTable.count(query, function (err, count) {
                        res.json({
                            'code': config.success,
                            'data': data,
                            'count': count
                        });
                    })
                }
                
            } else {
                next(createError(config.serverError, err));
            }
        });
}


/* @function : changeUserStatus
 *  @author  : Siroi 
 *  @created  : 27-Mar-18
 *  @modified :
 *  @purpose  : To change user status.
 */
exports.changeUserStatus = function (req, res, next) {
    if (req.body) {
        userTable.update({
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
                        'message': 'Users status updated successfully'
                    });
                }
            })
    }
}


exports.getAccessEmergencyInfoApproval = function (req, res, next) {
    const reqFor = req.params.reqFor;
    accessEmgInfoApprovalObj.find({
        req_for: reqFor,
        req_by: req.user.id
    }).sort({ _id: -1 }).limit(1).exec(function (err, user) {
        if ( err ) {
            next(createError(config.serverError, err));
            return;
        }
        console.log('checkIfExists', user);
        const status = user.length > 0 ? user[0].status : '';
        if ( status === 'approve' ) {
            var time = getHourDiff(user[0].action_date, new Date());
            console.log('time', time);
            if ( time > config.accessEmergencyInfo.expireTime ) {
                res.json({
                    'code': config.success,
                    'message': 'Your time expired, please request again for Emergency Information Record.',
                    'data': []
                });
                return;
            }
            res.json({
                'code': config.success,
                'message': 'Users record found.',
                'data': user
            });
            return;
        } else if ( status === 'pending' ) {
            next(createError(config.error, 'You already have Pending request, please wait for a while.'));
            return;
        }
        
        res.json({
            'code': config.success,
            'message': 'Users record not found.',
            'data': []
        });
    });
}
// function for cron job to update status
exports.updateAccessEmergencyInfoStatus = async function (req, res, next) {
    const accessRec = await accessEmgInfoApprovalObj.find({
        status: 'approve'
    });
    if ( accessRec.length > 0 ) {
        try {
            accessRec.map( async item => {
                var time = getHourDiff(item.action_date, new Date());
                console.log('running cron', time);
                if ( time > config.accessEmergencyInfo.expireTime ) {
                    const statusUpdate = await accessEmgInfoApprovalObj.findOneAndUpdate({
                        _id: item._id
                    }, {
                            $set: {
                                status: 'expired'
                            }
                 });
                }
                
            });
        } catch (err) {

        }
    }
}
exports.execAccessEmgQuery = function (obj) {
    return accessEmgInfoApprovalObj.findOne(obj).exec().
    then ((access) => {return access}).
    catch((err) => err);
}
exports.saveEmergencyApprovingManager = async function (req, res, next) {
    const req_for = req.body.reqFor;
    const approvingManager = req.body.approvingManager;
    const user_id = req.user.id;
    const reason = req.body.reason;
    var accessSavedObj = new accessEmgInfoApprovalObj({
        req_for: req_for,
        req_by: user_id,
        reason: reason,
        approvingManager: approvingManager
    });
    try {
        const checkIfExists = await accessEmgInfoApprovalObj.findOne({req_for: req_for, req_by: user_id, status: 'pending'});
        // var time = getHourDiff(checkIfExists.createdAt, new Date());
        console.log('checkifexits', checkIfExists);
        if ( checkIfExists && checkIfExists != null) {
            next(createError(config.error, 'You already have Pending request, please wait for a while.'));
            return;
        }
        const accessSaved = await accessSavedObj.save();
        console.log('ffff accessave', accessSaved);
        if ( accessSaved ) {
            const reqForUser = await userTable.findOne({_id: req_for, client_id: req.user.client_id});
            const approvingManagerRec = await userTable.findOne({_id: approvingManager, client_id: req.user.client_id});
            const reqByUser = await userTable.findOne({_id: user_id, client_id: req.user.client_id});
            const email = approvingManagerRec.email;
            if ( email ) {
                var baseUrl = envConfig.host;
                var url = baseUrl + '/access-emergency/' + accessSaved._id;
                var repalceData = {
                    userName: approvingManagerRec.firstname + ' ' + approvingManagerRec.lastname,
                    reqFor: reqForUser.firstname + ' ' + reqForUser.lastname,
                    reason: reason,
                    url: url,
                    url1: url,
                    reqBy: reqByUser.firstname + ' ' + reqByUser.lastname,
                };
                
                const body = await template.getBodyData(config.emailTemplate.emgInfoApprover, repalceData);
                if (body) {
                    const email12 = await emailHelper.sendEmailNodeMailer(
                        email, body.subject, body.html);
                    }
                    res.json({
                        'code': config.success,
                        'message': 'Your request is in pending state, please wait for while.',
                    });
            }
        }
    } catch (err) {
        next(createError(config.serverError, err));
        return;
    }
    
}

exports.getEmergencyApprovingManager = function (req, res, next) {
    usergroupObj.find({
       client_id: req.user.client_id,
       is_deleted: false,
       "userinformation.emergencyRecordApproval": { $eq: 'true'}
    }, '_id').exec(async function (err, roles) {
        if ( err ) {
            next(createError(config.serverError, err));
            return;
        }
        console.log('testing', roles);
        try {
           const user = await userTable.find({
                client_id: req.user.client_id,
                roleId: {$in: roles}
            }, '_id firstname lastname __enc_firstname __enc_lastname');
            res.json({
                'code': config.success,
                'message': 'Users status updated successfully',
                'data': user
            });
        } catch (e) {
            next(createError(config.serverError, e));
            return;
        }

    //     userTable.aggregate([
    //         // {
    //         // "$match": {
    //         //     client_id: {$eq: req.user.client_id },
               
    //         // }},
    //         {
    //         $lookup: 
    //         {
    //             from: "roles",
    //             // localField: "roleId",
    //             // foreignField: "_id",
    //             pipeline: [
    //                 { "$match": { "userinformation.emergencyRecordApproval": {$eq: 'true' }       }}
    //             ],
    //             as: "roleId"
    //         }}, {"$match":{"roleId":{"$ne":null}}}
    // ]).exec(function(err, user) {
       
    });
}
var getHourDiff = function (dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
}
exports.changeEmergencyInformationStatus = async function (req, res, next) {
    const accessId = req.body.id;
    const status = req.body.status;
    console.log('status', status);
    const accessEmgInfoRec = await accessEmgInfoApprovalObj.findOne({_id: accessId, status: 'pending'})
        .populate('approvingManager', 'email __enc_email firstname __enc_firstname lastname __enc_lastname')
        .populate('req_by', 'email __enc_email firstname __enc_firstname lastname __enc_lastname')
        .populate('req_for', 'email __enc_email firstname __enc_firstname lastname __enc_lastname');
    
    if ( accessEmgInfoRec ) {
        var time = getHourDiff(accessEmgInfoRec.createdAt, new Date());
        console.log('checkIfExists', accessEmgInfoRec);
        if ( time > config.accessEmergencyInfo.approvingManagerExpireTime ) {
            const statusUpdate = await accessEmgInfoApprovalObj.findOneAndUpdate({
                    _id: accessId
                }, {
                        $set: {
                            status: 'expired'
                        }
            });
            next(createError(config.error, 'Your time has expired, please ask user to send request again.'));
            return;
        }
        try {
            const actionDateTime = new Date();
            const statusUpdate = await accessEmgInfoApprovalObj.findOneAndUpdate({
                _id: accessId
            }, {
                    $set: {
                        status: status,
                        action_date: actionDateTime
                    }
         });
         var emailTemplate = config.emailTemplate.emgInfoRejected;
         if ( status === 'approve' ) {
            emailTemplate = config.emailTemplate.emgInfoApproved;
         }
         var baseUrl = envConfig.host;
         var repalceData = {
             userName: accessEmgInfoRec.req_by.firstname + ' ' + accessEmgInfoRec.req_by.lastname,
             reqFor: accessEmgInfoRec.req_for.firstname + ' ' + accessEmgInfoRec.req_for.lastname,
             url: baseUrl
         };
         // send email to user who request about approval or rejection
         const body = await template.getBodyData(emailTemplate, repalceData);
         if (body) {
             const email12 = await emailHelper.sendEmailNodeMailer(
                accessEmgInfoRec.req_by.email, body.subject, body.html);
             }
             if ( status === 'approve' ) {
                // send email to traveller/req_for user
                var repalceDataTraveller = {
                    userName: accessEmgInfoRec.req_for.firstname + ' ' + accessEmgInfoRec.req_for.lastname,
                    reqBy: accessEmgInfoRec.req_by.firstname + ' ' + accessEmgInfoRec.req_by.lastname,
                    approvingManager: accessEmgInfoRec.approvingManager.firstname + ' ' + accessEmgInfoRec.approvingManager.lastname,
                    dateTime: actionDateTime
                };

                const body = await template.getBodyData(config.emailTemplate.emgInfoTraveller, repalceDataTraveller);
                if (body) {
                    const emailTraveller = await emailHelper.sendEmailNodeMailer(
                        accessEmgInfoRec.req_for.email, body.subject, body.html);
                    }
             }
             const statusText = status == 'approve' ? 'Approved' : 'Rejected';
            res.json({
                'code': config.success,
                'message': `Emergency Information Access request has been ${statusText}.`
            });
        } catch (e) {
            next(createError(config.ServerError, e));
            return;
        }
        

    } else {
        next(createError(config.error, 'No pending request has been made or you already approved/rejected the request.'));
        return;
    }
    
}

/* @function : getAllcoAdmins
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To list all the users.
 */
exports.getAllcoAdmins = function (req, res, next) {
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        _id: {
            $ne: req.user.id
        },
        admin: true,
        companyId: req.user.companyID
    }
    if (req.body.keyword)
        query['$or'] = [{
            firstname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            lastname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            email: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];
    basicAdminObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('department')
        .exec(function (err, data) {
            if (data) {
                basicAdminObj.count(query, function (err, count) {
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

/* @function : updateMedicalInfo
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To update traveller medical information.
 */
exports.updateUserMedicalInfo = function (req, res, next) {
    if (req.body.userId != '' || req.body.userId != undefined || req.body.userId != null) {
        updateMedicalInfo(req.body.userId, req, res, next);
    }
}
exports.updateProfileMedicalInfo = function (req, res, next) {
    if (req.user.id) {
        updateMedicalInfo(req.user.id, req, res, next);
    }
}


var updateMedicalInfo = function (userId, req, res, next) {
    var query = {};
    if (req.user.super_admin === true) {
        query = {
            _id: userId,
            is_deleted: false,
        };
    } else {
            query = {
            _id: userId,
            client_id: req.user.client_id,
            is_deleted: false,
        };
    }
    userTable.update(query, {
            $set: {
                medical_info: req.body
            }
        }, function (err, update) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    code: config.success,
                    data: req.body,
                    message: 'Traveller medical information updated successfully'
                });
            }
        })
}



exports.updateUserTrainingInfo = function (req, res, next) {
    if (req.body.userId != '' || req.body.userId != undefined || req.body.userId != null) {
        updateTrainingInfo(req.body.userId, req, res, next);
    }
}


exports.updateProfileTrainingInfo = function (req, res, next) {
    if(req.user.id){
        updateTrainingInfo(req.user.id, req, res, next )
    }
}

var updateTrainingInfo = function(user_id, req, res, next){
    var query = {};
    if (req.user.super_admin === true) {
        query = {
            _id: user_id,
            is_deleted: false,
        };
    } else {
            query = {
            _id: user_id,
            client_id: req.user.client_id,
            is_deleted: false,
        };
    }
    userTable.update(query, {
            $set: {
                training_info: req.body
            }
        }, function (err, update) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    code: config.success,
                    data: req.user,
                    message: 'Traveller training information updated successfully'
                });
            }
        })
}


exports.getUserMedicalInfo = function (req, res, next) {
    if (req.params.user_id != undefined || req.params.user_id != '') {
        getMedicalInfo(req.params.user_id, req, res, next);
    }
}

exports.getProfileMedicalInfo = function (req, res, next) {
    if(req.user.id){
        getMedicalInfo(req.user.id, req, res, next);
    }
}


var getMedicalInfo = function(user_id, req, res, next){
    userTable.findOne({
        _id: user_id 
    }, 'medical_info __enc_medical_info', function(err, data){
        if(err){
            next(createError(config.serverError, err));
        } else {
            res.json({
                code: config.success,
                data: data
            }); 
        }
    })
}
exports.getUserTrainingInfo = function(req, res, next){
    if(req.params.user_id != undefined || req.params.user_id != ''){
        getTrainingInfo(req.params.user_id, req, res, next);
    }
}

exports.getProfileTrainingInfo = function(req, res, next){
    if(req.user.id){
        getTrainingInfo(req.user.id, req, res, next);
    }
}

var getTrainingInfo = function(user_id, req, res, next){
    userTable.findOne({
        _id: user_id
    }, 'training_info __enc_training_info', function(err, data){
        if(err){
            next(createError(config.serverError, err));
        } else {
            res.json({
                code: config.success,
                data: data
            }); 
        }
    })
}


exports.updateUserEmergencyDetails = function(req, res, next){
    if(req.body.userId){
        updateEmergencyDetails(req.body.userId, req, res, next);
    }
}
exports.updateProfileEmergencyDetails = function(req, res, next){
    if(req.user.id){
        updateEmergencyDetails(req.user.id, req, res, next);
    }
}

var updateEmergencyDetails = function(userId, req, res, next){
    var data = req.body;
    var query = {};
    if (req.user.super_admin === true) {
        query = {
            _id: userId,
            is_deleted: false,
        };
    } else {
            query = {
            _id: userId,
            client_id: req.user.client_id,
            is_deleted: false,
        };
    }
    userTable.update(query, {
            $set: {
               communications: {
                    mobile1_imei: data.Mobile1IMEI,
                    phone_make_model: data.PhoneMakeModel,
                    meid_number: data.MEIDNumber,
                    misc_info: data.MiscInformation,
                    satellite_phone_number: data.SatellitePhoneNumber,
                    satellite_phone_imei: data.SatellitePhoneIMEI,
                    tracker_details: data.TrackerDetails,
                    secondary_email_address: data.SecondaryEmailAddress,
                },
                passport_data: data.passport_data,
                job_title: data.JobTitle,
                middle_name: data.MiddleName,
                other_name_used: data.OtherNameUsed,
                gender: data.Gender,
                home_address: data.HomeAddress,
                identifying_marks: data.IdentifyingMarks,
                press_pass_id: data.PressPassID,
                languages: data.languages,
                passport_details: {
                    title: data.Em1Title,
                    full_name: data.Em1Name,
                    relationship_to_you: data.Em1Relationship,
                    telephone_number: data.Em1TelephoneNumber,
                    mobile_number: data.Em1MobileNumber,
                    email: data.Em1EmailAddress,
                    home_address: data.Em1HomeAddress,
                    miscInfo_instruction: data.Em1MiscInformation,
                    alternative_title: data.Em2Title,
                    alternative_full_name: data.Em2Name,
                    alternative_relationship_to_you: data.Em2Relationship,
                    alternative_telephone_number: data.Em2TelephoneNumber,
                    alternative_mobile_number: data.Em2MobileNumber,
                    alternative_email: data.Em2EmailAddress,
                    alternative_home_address: data.Em2HomeAddress,
                    alternative_miscInfo_instruction: data.Em2MiscInformation
                },
                crisis_info:{
                    crisis_statement1: data.CrisisStatement1,
                    crisis_statement2: data.CrisisStatement2,
                    crisis_statement3: data.CrisisStatement3,
                    duress_word: data.DuressWord,
                    duress_action: data.DuressAction
                }
            }
        }, function (err, update) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    code: config.success,
                    data: req.body,
                    message: 'Traveller emergency details updated successfully'
                });
            }
        });
}

exports.getEmergencyDetails = function(req, res, next){
    if(req.params.user_id != undefined || req.params.user_id != ''){
        userEmergencyDetails(req.params.user_id, req, res, next);
    }
}

exports.getProfileEmergencyDetails = function(req, res, next){
    if(req.user.id){
        userEmergencyDetails(req.user.id, req, res, next);
    }
}

var userEmergencyDetails = function(user_id, req, res, next){
    userTable.findOne({
        _id: user_id
    }, '-medical_info -hashcode -authyID -duoToken -first_login -email -department -client_id -is_annonymised -is_deactivated -is_deleted', 
    function(err, data){
        if(err){
            next(createError(config.serverError, err));
        } else {
            res.json({
                code: config.success,
                data: data
            }); 
        }
    })
}

/* @function : addTraveller
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To add the users.
 */

exports.addTraveller = function (req, res, next) {
    var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = pnumber;
                var code = parseNumber(number);
                console.log("country_code", code)
                var phone = code.phone
                var phoneCode = countryCode(code.country);
                authy.register_user(req.body.email, phone, phoneCode, function (err, regRes) {
                    var text = req.body.email + " " + "email is not allowed."
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': text
                        });
                    } else {
                        console.log("regRes", regRes)
                        var key = 'salt_from_the_user_document';
                        var cipher = crypto.createCipher('aes-256-cbc', key);
                        var randomPassword = config.randomToken(8);
                        cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                        var encryptedPassword = cipher.final('base64');
                        var user = new userObj({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            password: encryptedPassword,
                            mobile_number: pnumber,
                            department: req.body.clientDepartment,
                            admin: false,
                            authyID: regRes.user.id,
                            first_login: true,
                            duoToken: "",
                            status: 'Active',
                            client_admin_id: req.user.id,
                            companyId: req.user.companyID,
                            passport_data: [{
                                passport_number: "",
                                nationality: ""
                            }]
                        });
                        user.save(function (err, user) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                var baseUrl = envConfig.host;
                                var userMailData = {
                                    firstname: req.body.firstname,
                                    usertype: 'Traveller',
                                    baseUrl: baseUrl,
                                    email: req.body.email,
                                    password: randomPassword,
                                    createdby: req.body.fullname
                                };
                                mailer.sendMail(req.body.email, constant.emailKeyword.NewRiskPalAccount, userMailData, function (err, resp) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Traveller added successfully'
                                        });
                                    }
                                });
                                // var smtpTransport = nodemailer.createTransport({
                                //     service: config.service,
                                //     auth: {
                                //         user: config.username,
                                //         pass: config.password
                                //     }
                                // });
                                // var mailOptions = {
                                //     from: 'noreply.riskpal@gmail.com',
                                //     to: req.body.email,
                                //     subject: 'successfully registration',
                                //     html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                                //     \n\ your account has been created by organization admin, please check the below credentials \n\
                                //     <br><br> Email :' + req.body.email + '<br>\n\
                                //     Password :' + randomPassword + '\n\
                                //     </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                // };
                                // smtpTransport.sendMail(mailOptions, function (err) {
                                //     if (err) {
                                //         res.json({
                                //             'code': config.error,
                                //             'err': err
                                //         });
                                //     } else {
                                //         res.json({
                                //             'code': config.success,
                                //             'message': 'Traveller added successfully'
                                //         });
                                //     }
                                // });

                            }
                        });
                    }
                });
            }
        });
    }

}

/* @function : addCoAdmin
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To add the co admin.
 */
exports.addCoAdmin = function (req, res, next) {
    var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
    if (req.body) {
        basicAdminObj.find({
            email: req.body.email,
            is_deleted: false
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = pnumber;
                var code = parseNumber(number);
                console.log("country_code", code)
                var phone = code.phone
                var phoneCode = countryCode(code.country);
                authy.register_user(req.body.email, phone, phoneCode, function (err, regRes) {
                    if (err) {
                        console.log("basic@yopmail.com", err)
                        next(createError(config.serverError, err));
                    } else {
                        console.log("regRes", regRes)
                        var key = 'salt_from_the_user_document';
                        var cipher = crypto.createCipher('aes-256-cbc', key);
                        var randomPassword = config.randomToken(8);
                        cipher.update(randomPassword, 'utf8', 'base64'); // genrate random password
                        var encryptedPassword = cipher.final('base64');
                        var user = new basicAdminObj({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            email: req.body.email,
                            password: encryptedPassword,
                            mobile_number: pnumber,
                            department: req.body.CoAdminDepartment,
                            admin: true,
                            authyID: regRes.user.id,
                            first_login: true,
                            duoToken: "",
                            status: 'Active',
                            client_admin_id: req.user.id,
                            companyId: req.user.companyID,
                            passport_data: [{
                                passport_number: "",
                                nationality: ""
                            }]
                        });
                        user.save(function (err, user) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                var baseUrl = envConfig.host;
                                var userMailData = {
                                    firstname: req.body.firstname,
                                    usertype: 'Traveller',
                                    baseUrl: baseUrl,
                                    email: req.body.email,
                                    password: randomPassword,
                                    createdby: req.body.fullname
                                };
                                mailer.sendMail(req.body.email, constant.emailKeyword.NewRiskPalAccount, userMailData, function (err, resp) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': 'Basic admin added successfully'
                                        });
                                    }
                                });
                                //      var smtpTransport = nodemailer.createTransport({
                                //          service: config.service,
                                //          auth: {
                                //              user: config.username,
                                //              pass: config.password
                                //          }
                                //      });
                                //      var mailOptions = {
                                //          from: 'noreply.riskpal@gmail.com',
                                //          to: req.body.email,
                                //          subject: 'successfully registration',
                                //          html: 'Hello, ' + req.body.firstname + '<br><br> \n\
                                //  \n\ your account has been created by organization admin, please check the below credentials \n\
                                //  <br><br> Email :' + req.body.email + '<br>\n\
                                //  Password :' + randomPassword + '\n\
                                // </p><br><br>Thanks,<br>  RiskPal Team' // html body
                                //      };
                                //      smtpTransport.sendMail(mailOptions, function(err) {
                                //          if (err) {
                                //              res.json({
                                //                  'code': config.error,
                                //                  'err': err
                                //              });
                                //          } else {
                                //              res.json({
                                //                  'code': config.success,
                                //                  'message': 'Basic admin added successfully'
                                //              });
                                //          }
                                //      });

                            }
                        });
                    }
                });
            }
        });
    }

}

/* @function : deleteUser
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To delete the users.
 */
exports.deleteUsers = async function (req, res, next) {
    if (req.body) {
        if (req.body.status !== 'Expired') {
            res.json({
                'code': config.success,
                'message': 'Please deactivate the user first to annonymised'
            });
        } else { 
            try {
                var email = await checkDuplication(req.body.email);
                var query = {};
                if (req.user.super_admin === true) {
                    query = {
                        _id: req.body._id
                    };
                } else {
                    query = {
                        _id: req.body._id,
                        client_id: req.user.client_id
                    };
                }
                userTable.findOneAndUpdate(query, {
                        $set: {
                            is_deleted: true,
                            is_annonymised: true,
                            firstname: "annon1",
                            lastname: "annon1",
                            email: email,
                            status: 'Annonymised'
                        }
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'User annonymised successfully'
                            });
                        }
                    })
            } catch (err) {
                next(createError(config.serverError, err));
            }
        }
    }

}

var checkDuplication = function (getEmail) {
    var getEmail = getEmail;
    return new Promise(function (resolve, reject) {
        var username = getEmail.substring(0, getEmail.indexOf('@'));

        var concatUserName = "annon1" + Math.floor(Date.now() / 1000).toString().substr(5, 10);
        var email = getEmail.replace(username, concatUserName);

        const searchEncryptedFields = new userTable({ email });
        searchEncryptedFields.encryptFieldsSync();
        var encrypEmail = searchEncryptedFields.email;

        userTable.findOne({
            email: { $regex: new RegExp("^" + encrypEmail, "i") },
        }, function (err, user) {
            if (err) {
                reject(err);
            } else if (!user) {
                // console.log("not user send return", email);
                resolve(email);
            } else {
                // console.log("Is user else", getEmail );
                return checkDuplication(getEmail);
            }
        });
    });
}



exports.deActivateRPStaffAccount = function (req, res, next) {
    if (req.body) {
        var data = req.body;
        var currentStatus = req.body.status;
        var setStatus = 'Active';
        if(currentStatus === 'Active'){
            setStatus = 'Inactive';
        } 
        userTable.update({
            _id: req.body.user_id,
            is_deleted: false
        }, {
                $set: {
                    status: setStatus
                }
            }, function (err) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'message': 'Something happend wrong. Please try again later.'
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'User account status is changed to '+ setStatus +'.'
                    });
                }
            });
    }
}

/* @function : deleteUser
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To delete the users.
 */
exports.deleteUser = function (req, res, next) {
    if (req.params.userId) {
        userObj.update({
            _id: req.params.userId,
            is_deleted: false
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
                        'message': 'User deleted successfully'
                    });
                }
            })
    }

}

/* @function : deleteBasciAmin
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To deleteBasciAmin
 */
exports.deleteBasciAmin = function (req, res, next) {
    if (req.params.userId) {
        basicAdminObj.update({
            _id: req.params.userId,
            is_deleted: false
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
                        'message': 'BasciAmin deleted successfully'
                    });
                }
            })
    }

}



/* @function : changeBasciAdminStatus
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To change the BasciAdminStatus .
 */
exports.changeBasciAdminStatus = function (req, res, next) {
    if (req.body) {
        basicAdminObj.update({
            _id: req.body.id,
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
                        'message': 'BasciAdmin status updated successfully'
                    });
                }
            })
    }

}

exports.getUserProfile = function(req, res, next){
    userProfile(req.user.id, req, res, next);
}

/* @function : getUserDetails
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :27-Mar-18
 *  @purpose  : To get the users detials.
 */
exports.getUserDetails = function (req, res, next) {
    userProfile(req.params.user_id, req, res, next);   
}

var userProfile = function(user_id, req, res, next){
    if (user_id) {
        var query = {};
        if (req.user.super_admin === true) {
            query = {
                _id: user_id
            };
        } else {
             query = {
                _id: user_id,
                client_id: req.user.client_id
            };
        }
        console.log('query in profile', query);
        userTable.findOne(query, '-authyID -duoVerified -random_email_token -hashcode -verified -password -reset_request_time')
        .populate('department')
        .populate('roleId')
        // .populate('proof_of_life_question')
        .exec(function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': user,
                    'message': 'user detials'
                });
            }
        })
    }
}

exports.updateProfile = function(req, res, next){
    if(req.body){
        updateUserProfile(req.user.id, req, res, next);
    }
}

exports.updateUser = function(req, res, next){
    if(req.body){
        updateUserProfile(req.body._id, req, res, next);
    }
}
/* @function : updateUser
 *  @author  : Siroi 
 *  @created  : 27-Mar-18
 *  @modified :
 *  @purpose  : To update the user details.
 */
var updateUserProfile = function (user_id, req, res, next) {
    let query = {
        _id: user_id
    };
    if (req.user.super_admin === true) {
        console.log("superadminn");
        var client_id = req.body.clients;
    } else {
        var client_id = req.user.client_id;
        query = {
            client_id: client_id,
            _id: user_id
        };
    }
    console.log('query', query);
        userTable.findOne(query, function (err, userRec) {
            if ( err) {
                next(createError(config.serverError, err));
                return;
            }
            if ( !userRec ) {
                next(createError(config.error, 'User record not found, please try with some other user.'));
                return;
            }
            try {

                var roleid = req.body.usergroups;
                var pnumber = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number.trim();
                var number = pnumber;
                var code = parseNumber(number);
                if (typeof code.phone == 'undefined') {
                    res.json({
                        'code': config.error,
                        'message': 'Phone Number is not correct'
                    });
                    return;
                }
                console.log("country_code", code, pnumber);
                var phone = code.phone
                var phoneCode = countryCode(code.country);
                authy.register_user(req.body.email, phone, phoneCode, function (err, regRes) {
                    var text = req.body.email + " " + "email is not allowed."
                    if (err) {
                        res.json({
                            'code': config.error,
                            'message': text
                        });
                        return;
                    } else {
                        // const passport_details = req.body.passport_details;
                        var user = {
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            // email: req.body.email,
                            mobile_number: number,
                            client_id: client_id,
                            authyID: regRes.user.id,
                            // dob: req.body.dob,
                            // gender: req.body.gender,
                            // proof_of_life_answer: req.body.proof_of_life_answer,
                            // passport_data: req.body.passport_data,
                            // passport_details: {
                            //     full_name: passport_details.full_name,
                            //     email: passport_details.email,
                            //     mobile_number: passport_details.mobile_number,
                            //     relationship_to_you: passport_details.relationship_to_you,
                            //     alternative_email: passport_details.alternative_email,
                            //     alternative_full_name: passport_details.alternative_full_name,
                            //     alternative_mobile_number: passport_details.alternative_mobile_number,
                            //     alternative_relationship_to_you: passport_details.alternative_relationship_to_you
                            // }
                        }
                        // check if user updating his/her profile then don't need to update department and role
                        if (req.user.id.toString() != user_id) {
                            user.roleId = roleid;
                            user.department = req.body.department;
                        }
                        // if (req.body.proof_of_life_question) {
                        //     user.proof_of_life_question = req.body.proof_of_life_question;
                        // } else {
                        //     user.proof_of_life_question = undefined;
                        // }
                        console.log('localtion', userObj);
                        if (req.location) {
                            const imageUrl = req.location[0].Location;
                            user.image = imageUrl;
                        }
                        userTable.findOneAndUpdate({
                            _id: user_id
                        }, {
                                $set: user
                            }, async function (err) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    // delete old image from S3
                                    if (userRec.image && typeof userRec.image != 'undefined' && req.location) {
                                        const deleted = await deleteObject(req, res, next, { name: userRec.image });
                                        console.log('deleteobjeckt', deleted);
                                    }

                                    res.json({
                                        'code': config.success,
                                        'message': 'User details updated successfully'
                                    });
                                }
                            })
                    }

                });
            } catch (err) {
                next(createError(config.serverError, err));
            }
            // }
        });
    // }
}





/* @function :getBasicAdminDetails
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To get the users detials.
 */
exports.getBasicAdminDetails = function (req, res, next) {
    if (req.params.userId) {
        basicAdminObj.findOne({
            _id: req.params.userId,
            is_deleted: false
        }, function (err, user) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': user,
                    'message': 'user detials'
                });
            }
        })
    }

}

/* @function : updateCoAdmin
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To update the co-admin detials.
 */
exports.updateCoAdmin = function (req, res, next) {
    if (req.body) {
        basicAdminObj.find({
            email: req.body.email,
            is_deleted: false,
            _id: {
                $ne: req.body.id
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
                var user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    mobile_number: number,
                    department: req.body.CoAdminDepartment
                }
                basicAdminObj.update({
                    _id: req.body.id,
                    is_deleted: false
                }, {
                        $set: user
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'basic admin detials updated successfully'
                            });
                        }
                    })

            }
        });
    }
}


/* @function : updateTraveller
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To update the traveller detials.
 */
exports.updateTraveller = function (req, res, next) {
    if (req.body) {
        userObj.find({
            email: req.body.email,
            is_deleted: false,
            _id: {
                $ne: req.body.id
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists'
                });
            } else {
                var number = req.body.mobile_number.charAt(0) == '+' ? req.body.mobile_number : '+' + req.body.mobile_number;
                var user = {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email,
                    mobile_number: number,
                    department: req.body.clientDepartment
                }
                userObj.update({
                    _id: req.body.id,
                    is_deleted: false
                }, {
                        $set: user
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'traveller detials updated successfully'
                            });
                        }
                    })

            }
        });
    }
}


/* @function : listUser
 *  @author  : MadhuriK 
 *  @created  : 03-Apr-17
 *  @modified :
 *  @purpose  : To list all the Traveller.
 */
exports.getAlltravellers = function (req, res, next) {
    console.log("req.user.companyID", req.user)
    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        admin: false,
        // client_admin_id: req.user.id,
        companyId: req.user.companyID
    }
    if (req.body.keyword)
        query['$or'] = [{
            firstname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            lastname: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }, {
            email: {
                $regex: req.body.keyword,
                $options: "$i"
            }
        }];
    userObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('department')
        .exec(function (err, data) {
            if (data) {
                userObj.count(query, function (err, count) {
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



/* @function : getTravellerList
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To list all the Traveller.
 */
exports.getTravellerList = function (req, res, next) {
    if (req.body && req.user) {
        basicAdminObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                var limit = req.body.count ? req.body.count : 10;
                var sortby = req.body.sortby ? req.body.sortby : {};
                var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
                var query = {
                    is_deleted: false,
                    admin: false,
                    // client_admin_id: basic_admin.client_admin_id
                    companyId: basic_admin.client_admin_id.companyId
                }
                if (req.body.keyword)
                    query['$or'] = [{
                        firstname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }, {
                        lastname: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }, {
                        email: {
                            $regex: req.body.keyword,
                            $options: "$i"
                        }
                    }];
                userObj.find(query)
                    .sort(sortby)
                    .limit(limit)
                    .skip(skip)
                    .exec(function (err, data) {
                        if (data) {
                            userObj.count(query, function (err, count) {
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
}



/* @function : getAllCountryList
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all country list.
 */
exports.getAllCountryList = function (req, res, next) {
    countryObj.find({}, function (err, country) {
        if (err) {
            next(createError(config.serverError, err));

        } else {
            res.json({
                'code': config.success,
                'data': country,
                'message': 'success'
            });
        }
    })
}



/* @function : getTravellerData
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get traveller data.
 */
exports.getTravellerData = function (req, res, next) {
    if (req.params.traveller_id) {
        userObj.findOne({
            _id: req.params.traveller_id,
            is_deleted: false
        }, function (err, travellerData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': travellerData,
                    'message': 'success'
                });
            }
        })
    }
}


/* @function : getProofOfLifeQue
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get proof of life questions.
 */
exports.getProofOfLifeQue = function (req, res, next) {
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                proofOfLifeObj.find({
                    // client_admin_id: basic_admin.client_admin_id,
                    companyId: basic_admin.client_admin_id.companyId,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, proofOfLife) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': proofOfLife,
                            'message': 'success'
                        });
                    }

                })
            }
        })
    }

}


/* @function : updateTravellerDetails
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To update traveller profile.
 */
exports.updateTravellerDetails = function (req, res, next) {
    if (req.body) {
        var traveller_id = req.body.traveller_id;
        delete req.body.traveller_id;

        userObj.update({
            _id: traveller_id,
            is_deleted: false
        }, {
                $set: req.body
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Traveller profile updated successfully'
                    });
                }
            })

    }
}


/* @function : getAllRa
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all types of ra.
 */
exports.getAllRa = function (req, res, next) {
    console.log("req.user.id", req.user.id)
    basicAdminObj.findOne({
        _id: req.user.id
    }).populate('client_admin_id').exec(function (err, basic_admin) {
        console.log("basic_admin", basic_admin)
        var limit = req.body.count ? req.body.count : 10;
        var sortby = req.body.sortby ? req.body.sortby : {};
        var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
        var query = {
            is_deleted: false,
            status: "Active",
            is_created_compleletely: true,
            $or: [{
                // client_id: basic_admin.client_admin_id._id
                companyId: basic_admin.client_admin_id.companyId
            }, {
                sector_id: basic_admin.client_admin_id.sector_id
            }]
        }
        if (req.body.keyword)
            query.ra_name = {
                $regex: req.body.keyword,
                $options: "$i"
            };
        typeOfRaObj.find(query)
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
    });
}



/* @function : getAllRaOfThisType
 *  @author  : MadhuriK 
 *  @created  : 14-Jun-17
 *  @modified :
 *  @purpose  : To get all ra of a traveller for particular type of ra.
 */
exports.getAllRaOfThisType = function (req, res, next) {
    console.log("req.body.traveller_id", req.body.traveller_id)
    console.log("req.body.typeOfRa_id", req.body.typeOfRa_id)

    var limit = req.body.count ? req.body.count : 10;
    var sortby = req.body.sortby ? req.body.sortby : {};
    var skip = req.body.count && req.body.page ? (req.body.count) * (req.body.page - 1) : {};
    var query = {
        is_deleted: false,
        traveller_id: req.body.traveller_id,
        types_of_ra_id: req.body.typeOfRa_id
    }
    if (req.body.keyword)
        query.project_name = {
            $regex: req.body.keyword,
            $options: "$i"
        };
    RaObj.find(query)
        .sort(sortby)
        .limit(limit)
        .skip(skip)
        .populate('department')
        .exec(function (err, data) {
            if (data) {
                RaObj.count(query, function (err, count) {
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



/* @function : getTravellers
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get all traveller.
 */
exports.getTravellers = function (req, res, next) {
    if (req.user.id && req.params.traveller_id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                userObj.find({
                    // client_admin_id: basic_admin.client_admin_id,
                    companyId: basic_admin.client_admin_id.companyId,
                    admin: false,
                    is_deleted: false,
                    status: 'Active',
                    _id: {
                        $ne: req.params.traveller_id
                    }
                }, function (err, travellerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': travellerArr,
                            'message': 'success'
                        });
                    }
                })

            }
        })
    }

}


/* @function : getApprovingMangers
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get all approving managers.
 */
exports.getApprovingMangers = function (req, res, next) {
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                approvingManagerObj.find({
                    // client_admin_id: basic_admin.client_admin_id,
                    companyId: basic_admin.client_admin_id.companyId,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, approvingManagerArr) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': approvingManagerArr,
                            'message': 'success'
                        });
                    }
                })
            }
        })
    }
}


/* @function : addNewsRa
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To add ra by basic admin on behalf of traveller.
 */
exports.addNewsRa = function (req, res, next) {
    if (req.body) {
        userObj.findOne({
            _id: req.body.traveller_id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, traveller) {
            var raArr = new RaObj(req.body);
            raArr.addedBy = req.user.id
            raArr.client_admin_id = traveller.client_admin_id;
            raArr.companyId = traveller.client_admin_id.companyId;
            raArr.save(function (err, data) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    var departArr = [],
                        countryArr = [];
                    data.department.forEach(function (depart) {
                        departArr.push(depart.department);
                    })

                    data.country.forEach(function (country) {
                        countryArr.push(country.name);
                    })

                    userObj.find({
                        _id: {
                            $in: data.travellerTeamArr
                        },
                        admin: false
                    }, {
                            email: 1
                        }, function (err, travellerArr) {
                            if (err) {
                                next(createError(config.serverError, err));
                            } else {
                                var smtpTransport = nodemailer.createTransport({
                                    service: config.service,
                                    auth: {
                                        user: config.username,
                                        pass: config.password
                                    }
                                });
                                var mailOptions = {
                                    to: travellerArr,
                                    from: 'noreply.riskpal@gmail.com',
                                    subject: 'Ra created by approving manager on behalf of' + traveller.firstname + " " + traveller.lastname,
                                    html: 'Hello traveller Ra has been created by approving manager on behalf of ' + traveller.firstname + " " + traveller.lastname + ', Please find the below Ra details <br> <br>  Project Name :-' + data.project_name + '<br>' + 'Date Of RA :- ' + data.date_of_ra + '<br>' + 'Department :-' + departArr.toString() + '<br> Country :-' + countryArr.toString() + '\n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                                };
                                smtpTransport.sendMail(mailOptions, function (err) {
                                    if (err) {
                                        next(createError(config.serverError, err));
                                    } else {
                                        res.json({
                                            'code': config.success,
                                            'message': "News RA details added successfully",
                                            'data': data
                                        });
                                    }
                                });
                            }
                        })
                }

            })
        })

    }

}


/* @function : getRaDetails
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To get ra details
 */
exports.getRaDetails = function (req, res, next) {
    if (req.params.ra_id) {
        RaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'message': "success",
                    'data': raData
                });
            }
        })
    }
}



/* @function : updateNewsRa
 *  @author  : MadhuriK 
 *  @created  : 15-Jun-17
 *  @modified :
 *  @purpose  : To update ra details
 */
exports.updateNewsRa = function (req, res, next) {
    if (req.body) {
        userObj.findOne({
            _id: req.body.traveller_id,
            is_deleted: false
        }, function (err, traveller) {
            var raData = {
                addedBy: req.user.id, // basic admin
                date_of_ra: req.body.date_of_ra,
                project_name: req.body.project_name,
                description_of_task: req.body.description_of_task,
                itinearyArr: req.body.itinearyArr,
                approvingManager: req.body.approvingManager,
                country: req.body.country,
                travellerTeamArr: req.body.travellerTeamArr,
                department: req.body.department
            }
            RaObj.findOneAndUpdate({
                _id: req.body._id
            }, {
                    $set: raData
                }, function (err, data) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        var departArr = [],
                            countryArr = [];
                        data.department.forEach(function (depart) {
                            departArr.push(depart.department);
                        })

                        data.country.forEach(function (country) {
                            countryArr.push(country.name);
                        })

                        userObj.find({
                            _id: {
                                $in: data.travellerTeamArr
                            },
                            admin: false
                        }, {
                                email: 1
                            }, function (err, travellerArr) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    var smtpTransport = nodemailer.createTransport({
                                        service: config.service,
                                        auth: {
                                            user: config.username,
                                            pass: config.password
                                        }
                                    });
                                    var mailOptions = {
                                        to: travellerArr,
                                        from: 'noreply.riskpal@gmail.com',
                                        subject: 'Ra updated by basic admin on behalf of ' + traveller.firstname + " " + traveller.lastname,
                                        html: 'Hello traveller Ra has been updated by basic admin on behalf of ' + traveller.firstname + " " + traveller.lastname + ', Please find the below Ra details <br> <br>  Project Name :-' + data.project_name + '<br>' + 'Date Of RA :- ' + data.date_of_ra + '<br>' + 'Department :-' + departArr.toString() + '<br> Country :-' + countryArr.toString() + '\n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                                    };
                                    smtpTransport.sendMail(mailOptions, function (err) {
                                        if (err) {
                                            next(createError(config.serverError, err));
                                        } else {
                                            res.json({
                                                'code': config.success,
                                                'message': 'news ra updated successfully'
                                            });
                                        }
                                    });
                                }
                            })
                    }

                })

        })
    }
}



/* @function : getAllCategoryList
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get categories for a ra
 */
exports.getAllCategoryList = function (req, res, next) {
    if (req.params.type_of_ra_id && req.user.id) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                categoryObj.find({
                    // client_admin_id: basic_admin.client_admin_id,
                    companyId: basic_admin.client_admin_id.companyId,
                    types_of_ra_id: req.params.type_of_ra_id,
                    is_deleted: false,
                    status: 'Active'
                }, function (err, categories) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'data': categories,
                            'message': 'success'
                        })
                    }
                })
            }
        })
    }
}


/* @function : getRaStatus
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get ra status (submit or not)
 */
exports.getRaStatus = function (req, res, next) {
    if (req.params.ra_id) {
        RaObj.findOne({
            _id: req.params.ra_id,
            is_deleted: false
        }, function (err, raData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': raData
                })
            }
        })

    }
}



/* @function : getRaAns
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get ra's category questions answers
 */
exports.getRaAns = function (req, res, next) {
    if (req.params.types_of_ra_id && req.params.newsRa_id) {
        newsRaAnsObj.find({
            news_ra_id: req.params.newsRa_id,
            is_deleted: false
        }, function (err, newsRa) {
            if (err) {
                next(createError(config.serverError, err));
            } else {

                res.json({
                    'code': config.success,
                    'data': newsRa,
                    'message': 'success',
                });

            }
        })
    }
}



/* @function : getCategoryQuestions
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get questions of category
 */
exports.getCategoryQuestions = function (req, res, next) {
    if (req.params.types_of_ra_id) {
        QuesObj.find({
            assigned_ra_id: req.params.types_of_ra_id,
            is_deleted: false,
            status: 'Active'
        }, function (err, questions) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': questions,
                    'message': 'success',
                });
            }

        })
    }
}



/* @function : addquestionDataRa
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add answers of category questions
 */
exports.addquestionDataRa = function (req, res, next) {
    var news_ra_id = req.body[0].ra_id;
    var category_id = req.body[0].category_id;
    var traveller_id = req.body[0].traveller_id;
    delete req.body[0].ra_id;
    delete req.body[0].category_id;
    delete req.body[0].traveller_id;
    var quesArr = [];

    req.body.forEach(function (que) {
        quesArr.push({
            traveller_id: traveller_id,
            news_ra_id: news_ra_id,
            questionnaire_id: que.questionnaire_id ? que.questionnaire_id : que._id,
            question: que.question,
            best_practice_advice: que.best_practice_advice,
            category_id: category_id,
            ticked: que.ticked ? que.ticked : false,
            specific_mitigation: que.specific_mitigation ? que.specific_mitigation : ""
        });
    })
    newsRaAnsObj.find({
        news_ra_id: news_ra_id,
        category_id: category_id,
        is_deleted: false,
        traveller_id: traveller_id
    }, function (err, newsRaAns) {
        if (err) {
            next(createError(config.serverError, err));

        } else if (newsRaAns.length > 0) {
            async.each(quesArr, function (que, callback) {
                newsRaAnsObj.update({
                    news_ra_id: news_ra_id,
                    category_id: category_id,
                    is_deleted: false,
                    traveller_id: traveller_id,
                    questionnaire_id: que.questionnaire_id
                }, {
                        $set: {
                            specific_mitigation: que.specific_mitigation,
                            ticked: que.ticked
                        }
                    }, function (err, success) {
                        callback();
                    })
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Fill specific mitigation for this category questionnaire are done successfully',
                    });
                }
            });

        } else {
            async.each(quesArr, function (que, fn) {
                var news_ra_ans = new newsRaAnsObj(que);
                news_ra_ans.save(function (err, success) {
                    fn();
                })
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Fill specific mitigation for this category questionnaire are done successfully',
                    });
                }
            });
        }
    })
}


/* @function : getAllCurrencies
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get all currencies
 */
exports.getAllCurrencies = function (req, res, next) {
    const sortBy = { currency: 1 };
    currencyObj.find({}).sort(sortBy).lean().exec(function (err, currencies) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'message': 'success',
                'data': currencies
            })
        }
    })
}


/* @function : addRaSupplier
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add ra supplier by basic admin on behalf of traveller
 */
exports.addRaSupplier = function (req, res, next) {
    if (req.body) {
        supplierObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, supplierData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (supplierData) {
                var supplierArr = {
                    supplier_name: req.body.supplier_name,
                    service_provided: req.body.service_provided,
                    sourced_by: req.body.sourced_by,
                    contact: req.body.contact,
                    cost: req.body.cost,
                    currency: req.body.currency,
                    city: req.body.city,
                    country: req.body.country,
                    rate: req.body.rate,
                    description: req.body.description

                }
                supplierObj.update({
                    _id: supplierData._id,
                    is_deleted: false
                }, {
                        $set: supplierArr
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'supplier for news ra updated successfully'
                            });
                        }
                    })
            } else {
                var supplierData = new supplierObj(req.body);
                supplierData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'supplier for news ra added successfully'
                        });
                    }
                })
            }
        })
    }
}



/* @function : getSupplierData
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get supplier details
 */
exports.getSupplierData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        supplierObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id
        }, function (err, supplier) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': supplier,
                    'message': 'success'
                })
            }
        })

    }
}


/* @function : addNewsRaCommunication
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To add news ra communication form.
 */
exports.addNewsRaCommunication = function (req, res, next) {
    if (req.body) {
        communicationObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (communicationData) {
                var communicationArr = {
                    call_in_schedule: req.body.call_in_schedule,
                    emergency_contact: req.body.emergency_contact,
                    details_of_team: req.body.details_of_team,
                    want_your_poc: req.body.want_your_poc,
                    reminder_before_checkIn: req.body.reminder_before_checkIn,
                    detail_an_overdue_procedure: req.body.detail_an_overdue_procedure
                }
                communicationObj.update({
                    _id: communicationData._id,
                    is_deleted: false
                }, {
                        $set: communicationArr
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'communication for news ra updated successfully'
                            });
                        }
                    })
            } else {
                var communicationData = new communicationObj(req.body);
                communicationData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'communication for news ra added successfully'
                        });
                    }
                })
            }
        })
    }
}


/* @function : getCommunicationData
 *  @author  : MadhuriK 
 *  @created  : 16-Jun-17
 *  @modified :
 *  @purpose  : To get news ra communication form.
 */
exports.getCommunicationData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        communicationObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id,
            is_deleted: false
        }, function (err, communicationData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'data': communicationData,
                    'code': config.success,
                    'message': 'success'
                });
            }
        })
    }
}



/* @function : addNewsRaContingencies
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To add contingency data.
 */
exports.addNewsRaContingencies = function (req, res, next) {
    if (req.body) {
        contingencyObj.findOne({
            traveller_id: req.body.traveller_id,
            news_ra_id: req.body.news_ra_id,
            is_deleted: false
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else if (contingencyData) {
                var contingencyArr = {
                    medical_provision: req.body.medical_provision,
                    method_of_evacuation: req.body.method_of_evacuation,
                    detail_nearest_hospital: req.body.detail_nearest_hospital,
                    medevac_company: req.body.medevac_company,
                    sat_phone_number: req.body.sat_phone_number,
                    tracker_id: req.body.tracker_id,
                    first_aid_kit: req.body.first_aid_kit,
                    personal_protective_equipment: req.body.personal_protective_equipment

                }
                contingencyObj.update({
                    _id: contingencyData._id,
                    is_deleted: false
                }, {
                        $set: contingencyArr
                    }, function (err) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'contingency for ra updated successfully'
                            });
                        }
                    })
            } else {
                var contingencyData = new contingencyObj(req.body);
                contingencyData.save(function (err) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'contingency for ra added successfully'
                        });
                    }
                })
            }
        })
    }

}


/* @function : getContingencyData
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To get news ra contingency form.
 */
exports.getContingencyData = function (req, res, next) {
    if (req.params.ra_id && req.params.traveller_id) {
        contingencyObj.findOne({
            traveller_id: req.params.traveller_id,
            news_ra_id: req.params.ra_id,
            is_deleted: false
        }, function (err, contingencyData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'data': contingencyData,
                    'code': config.success,
                    'message': 'success'
                });
            }
        })
    }
}


/* @function : addAnyOtherInfo
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To add any other relevant with news ra.
 */
exports.addAnyOtherInfo = function (req, res, next) {
    if (req.body) {
        RaObj.update({
            _id: req.body.news_ra_id
        }, {
                $set: {
                    relevant_info: req.body.relevant_info
                }
            }, function (err) {
                if (err) {
                    next(createError(config.serverError, err));
                } else {
                    res.json({
                        'code': config.success,
                        'message': 'Information relevant to news ra updated successfully'
                    });
                }
            })
    }

}

/* @function : getNewsRaDetails
 *  @author  : MadhuriK 
 *  @created  : 21-Jun-17
 *  @modified :
 *  @purpose  : To get details of news ra.
 */
exports.getNewsRaDetails = function (req, res, next) {
    if (req.params.newsRa_id) {
        RaObj.findOne({
            _id: req.params.newsRa_id,
            is_deleted: false
        }, function (err, newsRa) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': newsRa,
                });
            }
        })
    }

}


/* @function : submitRAToManager
 *  @author  : MadhuriK 
 *  @created  : 27-Apr-17
 *  @modified :
 *  @purpose  : To submit rews ra to approving manager.
 */
exports.submitRAToManager = function (req, res, next) {
    var news_ra_id = req.params.newsRa_id;
    var types_of_ra_id = req.params.types_of_ra_id;
    var traveller_id = req.params.traveller_id;
    categoryObj.find({
        is_mandatory: true,
        is_deleted: false,
        status: 'Active',
        types_of_ra_id: types_of_ra_id
    }, {
            _id: 1
        }, function (err, categories) {
            var catArr = [];
            categories.forEach(function (cat) {
                catArr.push(cat._id);
            })
            newsRaAnsObj.find({
                news_ra_id: news_ra_id,
                traveller_id: traveller_id,
                is_deleted: false,
                category_id: {
                    $in: catArr
                }
            }, function (err, quesArr) {
                if (quesArr.length == 0 && categories.length > 0) {
                    next(createError(config.serverError, err));
                } else {
                    createPdf(req, news_ra_id, function (newsRa, path1, approvingManager, fileData) {
                        // add code here
                        if (fileData) {
                            var smtpTransport = nodemailer.createTransport({
                                service: config.service,
                                auth: {
                                    user: config.username,
                                    pass: config.password
                                }
                            });
                            var mailOptions = {
                                to: approvingManager,
                                from: 'noreply.riskpal@gmail.com',
                                subject: 'News RA details',
                                html: 'Hello Approving Manager Please find the attachment, \n\ </p><br><br>Thanks,<br>  RiskPal Team', // html body
                                attachments: [{
                                    'filename': path1,
                                    'content': fileData
                                }]
                            };
                            smtpTransport.sendMail(mailOptions, function (err) {
                                if (err) {
                                    res.json({
                                        'code': config.error,
                                        'err': err
                                    });
                                } else {
                                    RaObj.update({
                                        _id: news_ra_id,
                                        traveller_id: traveller_id,
                                        is_deleted: false
                                    }, {
                                            $set: {
                                                is_submitted: true
                                            }
                                        }, function (err) {
                                            if (err) {
                                                res.json({
                                                    'code': config.error,
                                                    'message': 'Error in submition'
                                                });
                                            } else {

                                                res.json({
                                                    'data': newsRa,
                                                    'code': config.success,
                                                    'message': 'successfully submited'
                                                });
                                            }
                                        })
                                }
                            });
                        }

                    })
                }
            })
        })

}


/* @function : createPdf
 *  @author  : MadhuriK 
 *  @created  : 11-Jun-17
 *  @modified :
 *  @purpose  : To callback function for creating pdf.
 */
function createPdf(req, news_ra_id, callback) {
    var traveller_id = req.params.traveller_id;
    userObj.findOne({
        _id: traveller_id,
        is_deleted: false
    }, function (err, traveller) {
        if (traveller) {
            RaObj.findOne({
                _id: news_ra_id,
                traveller_id: traveller_id,
                is_deleted: false
            }).populate('travellerTeamArr')
                .populate('approvingManager')
                .exec(
                    function (err, newsRa) {
                        if (newsRa) {
                            var countryArr = [];
                            var travellerTeamArr = [];
                            var approvingManager = [];
                            var departmentArr = [];
                            newsRa.country.forEach(function (countryName) {
                                countryArr.push(countryName.name);
                            })

                            newsRa.travellerTeamArr.forEach(function (team) {
                                travellerTeamArr.push(team.firstname);
                            })

                            newsRa.approvingManager.forEach(function (manager) {
                                approvingManager.push(manager.email);
                            })

                            newsRa.department.forEach(function (departmentName) {
                                departmentArr.push(departmentName.department);
                            })

                            newsRaAnsObj.find({
                                news_ra_id: news_ra_id,
                                traveller_id: traveller_id,
                                is_deleted: false
                            })
                                .populate('category_id')
                                .exec(function (err, news_ra_ans) {
                                    var path = '../riskpal-client/pdf/form.html';
                                    jsrender.loadFile('#myTemplate', path, function (err, template) {

                                        if (!err) {
                                            var fields = {
                                                firstname: traveller.firstname,
                                                lastname: traveller.lastname,
                                                my_email: traveller.email,
                                                dob: traveller.dob ? traveller.dob.toISOString().substring(0, 10) : null,
                                                gender: traveller.gender ? traveller.gender : null,
                                                mobile_number: traveller.mobile_number ? traveller.mobile_number : null,
                                                nationality: traveller.nationality ? traveller.nationality : null,
                                                passport_number: traveller.passport_details ? traveller.passport_details.passport_number : null,
                                                full_name: traveller.passport_details ? traveller.passport_details.emergency_contact.full_name : null,
                                                email: traveller.passport_details ? traveller.passport_details.emergency_contact.email : null,
                                                relationship_to_you: traveller.passport_details ? traveller.passport_details.emergency_contact.relationship_to_you : null,
                                                alternative_full_name: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_full_name : null,
                                                alternative_mobile_number: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_mobile_number : null,
                                                alternative_email: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_email : null,
                                                alternative_relationship_to_you: traveller.passport_details ? traveller.passport_details.emergency_contact.alternative_relationship_to_you : null,
                                                notes_for_approving_manager: traveller.notes_for_approving_manager ? traveller.notes_for_approving_manager : null,
                                                project_name: newsRa.project_name ? newsRa.project_name : null,
                                                project_code: newsRa.project_code ? newsRa.project_code : null,
                                                department: departmentArr ? departmentArr.toString() : null,
                                                date_of_ra: newsRa.date_of_ra ? newsRa.date_of_ra.toISOString().substring(0, 10) : null,
                                                description_of_task: newsRa.description_of_task ? newsRa.description_of_task : null,
                                                country: countryArr ? countryArr.toString() : null,
                                                travellerTeamArr: travellerTeamArr ? travellerTeamArr.toString() : null
                                            }
                                        }
                                        var testfield = "";
                                        news_ra_ans.forEach(function (ans) {

                                            testfield += "<div style='left:254.47px;' class='cls_021'>" + "<b style='font-size=14px;'>Question</b> " + ans.question +

                                                "</div>" +
                                                "<div class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'>Best Practice </b>" + ans.best_practice_advice + "</div>" +
                                                "<div  class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'>Specific Mitigation </b>" + ans.specific_mitigation + "</div>" +
                                                // "<div class='cls_021' style='left:254.47px;'>" + "<b style='font-size=14px;'> Category </b>" + ans.category_id.categoryName + "</div>"
                                                +
                                                "<br><br><br><br>";

                                        })
                                        fields.testfield = testfield;
                                        var final_html = jsrender.render['#myTemplate'](fields);
                                        var path1 = '../riskpal-client/pdf/' + newsRa._id + '_traveller_newsRA.pdf';
                                        htmlToPdf.convertHTMLString(final_html, path1, function (err, success) {
                                            fs.readFile(path1, function (err, fileData) {
                                                if (fileData) {
                                                    callback(newsRa, path1, approvingManager, fileData);
                                                }
                                            })
                                        })

                                    })
                                })
                        }
                    })
        }

    })

}


/* @function : getDepartments
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get department list.
 */
exports.getDepartments = function (req, res, next) {
    console.log("$scope.departmentArr>>>>>>>>>>>>>>>>>>>>>")
    if (req.user.id) {
        userObj.findOne({
            _id: req.user.id
        }).populate('client_admin_id').exec(function (err, basic_admin) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                if (basic_admin.client_admin_id) {
                    departmentObj.find({
                        // client_admin_id: basic_admin.client_admin_id,
                        companyId: basic_admin.client_admin_id.companyId,
                        is_deleted: false,
                        status: "Active"
                    }, function (err, departArr) {
                        if (err) {
                            next(createError(config.serverError, err));
                        } else {
                            res.json({
                                'code': config.success,
                                'data': departArr
                            })
                        }
                    })
                }
            }
        })
    }
}



/* @function : getTypesOfRaDetails
 *  @author  : MadhuriK 
 *  @created  : 24-Aug-17
 *  @modified :
 *  @purpose  : To get types of ra details .
 */
exports.getTypesOfRaDetails = function (req, res, next) {
    if (req.params.type_of_ra_id) {
        typeOfRaObj.findOne({
            _id: req.params.type_of_ra_id
        }, function (err, typeOfRaData) {
            if (err) {
                next(createError(config.serverError, err));
            } else {
                res.json({
                    'code': config.success,
                    'data': typeOfRaData
                })
            }
        })
    }
}


/* @function : getUsergroups
 *  @author  : siroi 
 *  @created  : 26-Mar-18
 *  @modified :
 *  @purpose  : To get user group details based on client
 */

exports.getUsergroups = function (req, res, next) {
    // var client_id;  = req.user.client_id;
    if (req.user.super_admin === true) {
        client_id = req.params.client_id
    } else {
        client_id = req.user.client_id;
    }
    usergroupObj.find({
        $or: [
            { client_id: client_id },
            { type: "default" }
        ],
        is_deleted: false,
    }, '_id client_id group_name', function (err, countryData) {
        if (err) {
            // res.json({
            //     'code': config.error,
            //     'err': err,
            //     'message': 'Something went wrong please try again'
            // });
            next(createError(config.notFound, err));
        } else {
            res.json({
                'code': config.success,
                'data': countryData
            });
        }
    })
}


/* @function : get Depart ments
 *  @author  : siroi 
 *  @created  : 23-Apr-18
 *  @modified :
 *  @purpose  : To get department based on client selection
 */

exports.getDepartmentusers = function (req, res, next) {
    var client_id;
    if (req.user.super_admin === true) {
        client_id = req.params.client_id;
    } else {
        client_id = req.user.client_id;
    }
    departmentObj.find({
        client_id: client_id,
        is_deleted: false,
        status: "Active"
    }, function (err, department) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            res.json({
                'code': config.success,
                'data': department
            });
        }
    })
}


/* @function : importUsers
 *  @author  : siroi 
 *  @created  : 29-Mar-18
 *  @modified :
 *  @purpose  : To import users from csv file
 */



exports.importApprovingmanager = function (req, res, next) {
    var outputJSON = "";
    var saveData = {};
    var dataArray = [];
    var destinationFolder = './clientPortal/uploads/usercsv';
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
                                if (data.firstname != '' && data.lastname != '' && data.email != '' && data.mobile_number != '' && data.role != '') {
                                    approvingManagerObj.findOne({
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
                                            authy.register_user(data.email, phone, phoneCode, function (err3, regRes) {
                                                var test1 = data.email + " " + 'email is not allowed ';
                                                if (err3) {
                                                    callback(test1, null);
                                                } else {
                                                    var randomPassword = config.randomToken(10);
                                                    var key = 'salt_from_the_user_document';
                                                    var cipher = crypto.createCipher('aes-256-cbc', key);
                                                    cipher.update(randomPassword, 'utf8', 'base64');
                                                    var encryptedPassword = cipher.final('base64');
                                                    data.duoToken = "";
                                                    data.is_deleted = false;
                                                    data.admin = false;
                                                    data.authyID = regRes.user.id;
                                                    data.status = 'Active';
                                                    data.client_admin_id = req.user.id;
                                                    data.passport_data = [{
                                                        passport_number: "",
                                                        nationality: ""
                                                    }];
                                                    data.mobile_number = pnumber;
                                                    data.companyId = req.user.companyID;
                                                    data.client_admin = false;
                                                    data.password = encryptedPassword,
                                                        approvingManagerObj(data).save(function (err2, result1) {
                                                            if (err2) {
                                                                callback(err);
                                                            } else {
                                                                userObj(data).save(function (err5, userData) {
                                                                    if (err5) {
                                                                        callback(err5, null);
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
                                                                            html: 'Dear Approving Manager, ' + data.firstname + '<br><br> \n\
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
                                            })

                                        }
                                    });

                                } else {
                                    var txt = 'Invalid fields in csv file'
                                    callback(txt, null);
                                }
                            }, function (err) {
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


var uuid = '';
exports.createonetouch = function (req, res, next) {
    userTable.findOne({
        email: req.body.email,
        is_deleted: false,
        super_admin: false
    }).exec(function (err, user) {
        if (err) {
            next(createError(config.serverError, err));
        } else {
            var user_payload = {
                'message': 'Login requested for a Riskpal  account'
            };
            authy.send_approval_request(user.authyID, user_payload, {}, null, function (oneTouchErr, oneTouchRes) {
                if (oneTouchErr) {
                    res.json({
                        'err': 'Problem creating OneTouch request!',
                        'code': config.error
                    });
                } else {
                    uuid = oneTouchRes.approval_request.uuid;
                    res.json({
                        'code': config.success,
                        'data': oneTouchRes,
                        'message': 'OneTouch verification initialized!'
                    });
                }
            });
        }
    });
};

exports.checkonetouchstatus = function (req, res, next) {
    var options = {
        url: "https://api.authy.com/onetouch/json/approval_requests/" + uuid,
        form: {
            "api_key": config.API_KEY
        },
        headers: {},
        qs: {
            "api_key": config.API_KEY
        },
        json: true,
        jar: false,
        strictSSL: true
    };
    authy.check_approval_status(uuid, function (err, response) {
        if (err) {
            res.json({
                'err': 'error while checking onetouch status!',
                'code': config.error
            });
        } else {
            if (response.approval_request.status === "approved") {
                userTable.findOne({
                    email: req.body.email,
                    is_deleted: false,
                    super_admin: false
                }).exec(function (err, user) {
                    if (err) {
                        next(createError(config.serverError, err));
                    } else {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                        }
                        var jwtToken = jwt.sign(params, config.secret, {
                            expiresIn: expirationDuration
                        });
                        if (jwtToken) {
                            user.duoToken = jwtToken;
                            user.duoVerified = true;
                            user.save(function (err, result) {
                                if (err) {
                                    next(createError(config.serverError, err));
                                } else {
                                    user.duoToken = 'Bearer ' + jwtToken;
                                    res.json({
                                        'code': config.success,
                                        'token': response,
                                        'data': user,
                                        'status': 'approved',
                                        'message': 'login successfully'
                                    });
                                }
                            });
                        } else {
                            res.json({
                                'code': config.error,
                                'err': 'Invalid token'
                            });
                        }
                    }
                })
            } else if (response.approval_request.status === "pending") {
                res.json({
                    'status': 'pending',
                    'err': 'Please approve onetouch request!',
                    'code': config.error
                });
            } else {
                res.json({
                    'status': 'denied',
                    'err': 'onetouch request denied!',
                    'code': config.error
                });
            }
        }
    });
};
