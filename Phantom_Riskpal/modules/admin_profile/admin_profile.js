var userObj = require('./../../schema/users.js'); // include category schema file
var countryObj = require('./../../schema/country.js'); // include category schema file
var config = require('../../config/jwt_secret.js');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './riskpal-client/uploads');
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '_' + file.originalname);
    }
});
var upload = multer({
    storage: storage
}).single('file');
var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');
/* @function : updateMedicalInfo
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To update traveller medical information.
 */
exports.updateMedicalInfo = function (req, res) {
    if (req.user && req.body) {
        console.log(req.body)
        .update({
            _id: req.user.id,
            is_deleted: false,
        }, {
            $set: {
                medical_info: req.body
            }
        }, function (err, update) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Something went wrong please try again'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Traveller medical information updated successfully'
                });
            }
        })
    }

}


/* @function : getTravellerDetails
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To get traveller information.
 */
exports.getAdminDetails = function (req, res) {
    console.log("req.user", req.user)
    if (req.user) {
        userObj.findOne({
            _id: req.user.id,
            is_deleted: false,
            admin: true,
            client_admin: true
        }, function (err, user) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Something went wrong please try again'
                });
            } else {
                res.json({
                    'code': config.success,
                    'data': user
                });
            }
        })
    }
}


/* @function : getCountries
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To get all Countries.
 */
exports.getCountries = function (req, res) {
    countryObj.find({}, function (err, country) {
        if (err) {
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong please try again'
            });
        } else {
            res.json({
                'code': config.success,
                'data': country
            });
        }
    })
}


/* @function : updatePassportDetails
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To update passport details.
 */
exports.updatePassportDetails = function (req, res) {
    var userId = req.user.id;
    console.log("req.body", req.body)
    if (req.body && userId) {
        userObj.find({
            email: req.body.email,
            is_deleted: false,
            admin: true,
            client_admin: true,
            _id: {
                $ne: userId
            }
        }, function (err, user) {
            if (user.length > 0) {
                res.json({
                    'code': config.error,
                    'err': 'Email already exists',
                });
            } else {
                req.body.first_login = false;
                userObj.update({
                    _id: userId,
                    is_deleted: false,
                    admin: true,
                    client_admin: true
                }, {
                    $set: req.body
                }, function (err, update) {
                    if (err) {
                        res.json({
                            'code': config.error,
                            'err': err,
                            'message': 'Something went wrong please try again'
                        });
                    } else {
                        res.json({
                            'code': config.success,
                            'message': 'Traveller passport details updated successfully'
                        });
                    }
                })
            }
        })
    }

}


/* @function : updatePersonalDetails
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To update personal details.
 */
exports.updatePersonalDetails = function (req, res) {
    var userId = req.user.id;
    if (req.body && userId) {
        userObj.update({
            _id: userId,
            is_deleted: false,
            admin: true,
            client_admin: true
        }, {
            $set: req.body
        }, function (err, update) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Something went wrong please try again'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Traveller personal details updated successfully'
                });
            }
        })
    }
}


/* @function : uploadProfilePic
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To upload traveller profile pic.
 */
exports.uploadProfilePic = function (req, res) {
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

exports.checkPassword = function (req, res) {
    console.log("checkPassword>>>>>>>", req.body)
    var key = 'salt_from_the_user_document';
    var cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.update(req.body.password, 'utf8', 'base64');
    var encryptedPassword = cipher.final('base64');
    userObj.findOne({
        _id: req.user.id,
        password: encryptedPassword
    }, function (err, data) {
        if (err) {
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong please try again'
            });
        } else {
            if (data) {
                res.json({
                    'code': config.success,
                    'message': 'Old password is correct'
                });
            } else {
               var outputJson = {
                    "code": config.error,
                    "message": "Old password in not correct"
                }
                res.json(outputJson)
            }
        }
    })
}

exports.changePassword = function (req, res) {
    console.log("req.body.password", req.body.password)
    var userId = req.user.id;
    if (req.body && userId) {
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        userObj.update({
            _id: userId,
            is_deleted: false,
            admin: true,
            client_admin: true
        }, {
            $set: {
                password: encryptedPassword
            }
        }, function (err, update) {
            if (err) {
                res.json({
                    'code': config.error,
                    'err': err,
                    'message': 'Something went wrong please try again'
                });
            } else {
                res.json({
                    'code': config.success,
                    'message': 'Password updated successfully'
                });
            }
        })
    }
}