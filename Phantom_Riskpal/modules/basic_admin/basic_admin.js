var userObj = require('./../../schema/users.js'); // include category schema file
var jwt = require('jsonwebtoken');
var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
// var twilio = require('twilio');
var basicAdminObj = require('./../../schema/basic_admin.js'); // include user schema file
// var authy = require('../../config/authy.js');
var AWS = require('../../config/aws.js');
var configauthy = require('../../config/authy.js');
const authy = require('authy')(configauthy.API_KEY);
/* @function : createCategory
 *  @author  : MadhuriK 
 *  @created  : 28-Mar-17
 *  @modified :
 *  @purpose  : To admin login.
 */
exports.basicAdminLogin = function (req, res) {
    console.log("req.body", req.body)
    if (req.body) {
        var body = req.body;
        var email = body.email;
        var password = body.password;
        var jwtToken = null;
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        basicAdminObj.findOne({
            email: email,
            
            is_deleted: false,
            status: 'Active',
            admin: true,
            $or: [{
                "client_admin_id": {
                    $exists: true,
                    $ne: null
                }
            }, {
                "client_admin_id": {
                    $exists: false
                }
            }]
        }, function (err, user) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Invalid email or password'
                });
            } else {
                user.save(function (err, result) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': '2 factor varifiacation initialized!'
                        });
                    }
                });
            }
        });
    }
}


/* @function : checkLogin
 *  @author  : MadhuriK 
 *  @created  : 29-Mar-17
 *  @modified :
 *  @purpose  : To check admin login.
 */
exports.checkLogin = function (req, res) {
    if (req.headers["authorization"]) {
        var bearer = req.headers["authorization"].split(' ');
        var bearerToken = bearer[1];
        jwt.verify(bearerToken, config.secret, function (err, decoded) {
            req.basicadmin = decoded;
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Your Session Expired, Please login Again.'
                });
            } else {
                if (bearer.length == 2) {
                    basicAdminObj.findOne({
                        duoToken: bearer[1],
                        is_deleted: false,
                        status: 'Active',
                        admin: true
                    }, function (err, user) {
                        if (err) {
                            res.json({
                                'code': config.error,
                                'err': 'err',
                            });
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


/* @function : adminLogout
 *  @author  : MadhuriK 
 *  @created  : 29-Mar-17
 *  @modified :
 *  @purpose  : To admin logout.
 */

exports.basicAdminLogout = function (req, res) {
    if (req.headers.authorization) {
        var parts = req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : "";
        if (parts.length == 2) {
            basicAdminObj.findOne({
                _id: req.basicadmin.id,
                duoToken: parts[1],
                duoVerified: true,
                admin: true
            }, function (err, user) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'err': err
                    });
                } else if (user) {
                    user.duoToken = '';
                    user.duoVerified = false;
                    user.save(function (err, data) {
                        if (err) {
                            res.json({
                                'code': config.error,
                                'err': err
                            });
                        } else {
                            res.json({
                                'code': config.success,
                                'message': 'Logout successfully'
                            });
                        }
                    });
                } else {
                    res.json({
                        'code': config.error,
                        'err': 'Authentication failed'
                    });
                }
            });
        } else {
            res.json({
                'code': config.error,
                'err': 'Authentication failed'
            });
        }
    } else {
        res.json({
            'code': config.error,
            'err': 'Authentication failed'
        });
    }

}



/* @function : adminActiveAccount
 *  @author  : MadhuriK 
 *  @created  : 30-Mar-17
 *  @modified :
 *  @purpose  : To active admin account.
 */
exports.basicAdminActiveAccount = function (req, res) {
    var key = 'salt_from_the_user_document';
    var cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.update(req.body.password, 'utf8', 'base64');
    var encryptedPassword = cipher.final('base64');
    if (req.body) {
        basicAdminObj.findOneAndUpdate({
            _id: req.body.userId,
            status: 'Inactive',
            password: encryptedPassword,
            is_deleted: false
        }, {
            $set: {
                status: 'Active'
            }
        }, function (err, user) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Either you have entered wrong password or you have already activated your account'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Admin account activated successfully'
                });
            }
        })

    }
}


/* @function : adminActiveAccount
 *  @author  : MadhuriK 
 *  @created  : 30-Mar-17
 *  @modified :
 *  @purpose  : To send forget password link to admin.
 */
exports.basicAdminForgetPass = function (req, res) {
    if (req.body.email) {
        basicAdminObj.findOne({
            email: req.body.email,
            is_deleted: false,
            admin: true
        }, function (err, user) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
                });
            } else if (!user) {
                res.json({
                    'code': config.error,
                    'err': 'Email does not exist'
                });
            } else {
                var smtpTransport = nodemailer.createTransport({
                    service: config.service,
                    auth: {
                        user: config.username,
                        pass: config.password
                    }
                });
                var userName = user.firstname ? user.firstname : user.ceo_name;
                var mailOptions = {
                    to: req.body.email,
                    from: 'noreply.riskpal@gmail.com',
                    subject: 'Forget Password',
                    html: 'Hello, ' + userName + '<br><br> \n\
                            Please click on the below link to reset your password: <br><br> \n\ \n\
                            <p><a target="_blank" href="' + config.baseUrl + '/admin/#/reset-password/' + user._id + '">Click Here</a>\n\
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
                            'message': 'Reset password link sent to your email please check'
                        });
                    }
                });
            }
        })
    }
}



/* @function : adminResetPass
 *  @author  : MadhuriK 
 *  @created  : 30-Mar-17
 *  @modified :
 *  @purpose  : To reset password.
 */
exports.basicAdminResetPass = function (req, res) {
    if (req.body) {
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        basicAdminObj.update({
            _id: req.body.userId,
            is_deleted: false,
            admin: true
        }, {
            $set: {
                password: encryptedPassword
            }
        }, function (err) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err
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


var uuid = '';
exports.createonetouch = function (req, res) {
    basicAdminObj.findOne({
        email: req.body.email,
        is_deleted: false,
        admin: true
    }).exec(function (err, user) {
        if (err) {
            res.json({
                'err': err,
                'code': config.error,
                'message': 'Create OneTouch User Error!'
            });
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
                        'message': 'OneTouch verification  initialized!'
                    });
                }
            });
        }
    });
};

exports.checkonetouchstatus = function (req, res) {
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
                basicAdminObj.findOne({
                    email: req.body.email,
                    is_deleted: false,
                    admin: true
                }).exec(function (err, user) {
                    if (err) {
                        res.json({
                            'err': err,
                            'code': config.error,
                            'message': 'create onetouch user error!'
                        });
                    } else {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id
                        }
                        jwtToken = jwt.sign(params, config.secret, {
                            expiresIn: expirationDuration
                        });
                        if (jwtToken) {
                            user.duoToken = jwtToken;
                            user.duoVerified = true;
                            user.save(function (err, result) {
                                if (err) {
                                    res.json({
                                        'code': config.error,
                                        'err': err
                                    });
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

exports.requestPhoneVerification = function (req, res) {
    var phone_number = req.body.phone_number;
    var country_code = req.body.country_code;
    var via = req.body.via;
    console.log("body: ", req.body);
    var info = {
        via: 'sms',
        locale: 'es',
        custom_message: 'Here is your custom message {{code}}',
        custom_code: '0051243'
    };
    if (phone_number && country_code && via) {
        authy.phones().verification_start(phone_number, country_code, info, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Success register phone API call: ', response);
                res.status(200).json(response);
            }
        });
    } else {
        console.log('Failed in register phone API call', req.body);
        res.status(500).json({
            error: "Missing fields"
        });
    }

};

exports.verifyPhoneToken = function (req, res) {
    var country_code = req.body.country_code;
    var phone_number = req.body.phone_number;
    var token = req.body.token;

    if (phone_number && country_code && token) {

        authy.phones().verification_check(phone_number, country_code, token, function (err, response) {
            if (err) {
                console.log('error creating phone reg request', err);
                res.status(500).json(err);
            } else {
                console.log('Confirm phone success confirming code: ', response);
                if (response.success) {
                    req.session.ph_verified = true;
                }
                res.status(200).json(err);
            }
        });
    } else {
        console.log('Failed in confirm phone request : ', req.body);
        res.status(500).json({
            error: "Missing fields"
        });
    }
};

exports.verify = function (req, res) {
    console.log("token", req.body)
    basicAdminObj.findOne({
        email: req.body.email,
        is_deleted: false,
        admin: true
    }).exec(function (err, user) {
        if (err) {
            res.json({
                'code': config.error,
                'err': 'user not found'
            });
        } else {
            authy.verify(user.authyID, req.body.smstoken, function (err, tokenRes) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'err': 'Something went wrong please try again!'
                    });
                } else {
                    console.log("Verify Token Response: ", tokenRes);
                    if (tokenRes.success) {
                        var expirationDuration = 60 * 60 * 24 * 1; // expiration duration 1 day.
                        var params = {
                            id: user._id,
                        }
                        jwtToken = jwt.sign(params, config.secret, {
                            expiresIn: expirationDuration
                        });
                        if (jwtToken) {
                            user.duoToken = jwtToken;
                            user.duoVerified = true;
                            user.save(function (err, result) {
                                if (err) {
                                    res.json({
                                        'code': config.error,
                                        'err': err
                                    });
                                } else {
                                    user.duoToken = 'Bearer ' + jwtToken;
                                    res.json({
                                        'code': config.success,
                                        'data': user,
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
                }
            });
        }
    });
};

exports.voice = function (req, res) {
    basicAdminObj.findOne({
        email: req.body.email,
        is_deleted: false,
        admin: true
    }).exec(function (err, user) {
        if (err) {
            res.json({
                'code': config.error,
                'err': 'err'
            });
        } else {
            /**
             * If the user has the Authy app installed, it'll send a text
             * to open the Authy app to the TOTP token for this particular app.
             *
             * Passing force: true forces an voice call to be made
             */
            authy.request_call(user.authyID, true, function (err, callRes) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'err': 'Problem making voice call user has requested too many phone calls in the last hour'
                    });
                } else {
                    console.log("requestCall response: ", callRes);
                    res.json({
                        'code': config.success,
                        'data': callRes,
                        'message': 'Phone call initialized'
                    });
                }
            });
        }
    });
};

exports.sms = function (req, res) {
    console.log("req.body.email", req.body.email)
    basicAdminObj.findOne({
        email: req.body.email,
        is_deleted: false,
        admin: true
    }).exec(function (err, user) {
        console.log("Send SMS");
        if (err) {
            res.json({
                'code': config.error,
                'err': err
            });

        } else {
            /**
             * If the user has the Authy app installed, it'll send a text
             * to open the Authy app to the TOTP token for this particular app.
             *
             * Passing force: true forces an SMS send.
             */
            authy.request_sms(user.authyID, true, function (err, smsRes) {
                if (err) {
                    res.json({
                        'code': config.error,
                        'err': err
                    });
                } else {
                    res.json({
                        'code': config.success,
                        'data': smsRes,
                        'message': 'SMS token sent successfully!'
                    });
                }
            });
        }
    });
};