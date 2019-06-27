var userObj = require('./../../schema/users.js'); // include category schema file
var countryObj = require('./../../schema/country.js'); // include category schema file
var config = require('../../config/jwt_secret.js');
var multer = require('multer');
var masteradminObj = require('./../../schema/super_admin.js'); // include super_admin schema file
var userTable= require('./../../schema/usertables.js');

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
var config = require('../../config/jwt_secret.js');
var crypto = require('crypto');


/* @function : getMasterAdminDetails
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To get traveller information.
 */
exports.getMasterAdminDetails = function (req, res) {
    console.log("req.super_admin",req.body.id);
    // if (req.user) {
    userTable.findOne({
        _id:req.body.id,
        is_deleted: false,

    }, function (err, super_admin) {
        if (err) {
            res.json({
                'code': config.error,
                'err': err,
                'message': 'Something went wrong please try again'
            });
        } else {
            res.json({
                'code': config.success,
                'data': super_admin
            });
        }
    })
    // }
}


/* @function : updateAdminDetails
 *  @author  : MadhuriK 
 *  @created  : 18-Apr-17
 *  @modified :
 *  @purpose  : To update personal details.
 */
exports.updateAdminDetails = function (req, res) {
    console.log("reqname", req.body.firstname);
    req.body = JSON.parse(req.body.info);
    if (req.body) {
        let imageUrl = '';
        if ( req.location ) {
            imageUrl = req.location[0].Location;
        }
        userTable.update({
            _id:req.body._id,
            is_deleted: false
        }, {
            $set: {
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                dob:req.body.dob,
                gender:req.body.gender,
                proof_of_life_question:req.body.proof_of_life_question,
                proof_of_life_answer:req.body.proof_of_life_answer,
                passport_data:req.body.passport_data,
                passport_details:req.body.passport_details,
                image: imageUrl
             
            
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
                    'message': 'Profile details updated successfully'
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
    var key = 'salt_from_the_user_document';
    var cipher = crypto.createCipher('aes-256-cbc', key);
    cipher.update(req.body.password, 'utf8', 'base64');
    var encryptedPassword = cipher.final('base64');
    userTable.findOne({
        _id:req.body.id,
        password: encryptedPassword,
        is_deleted:false
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
    if (req.body) {
        var key = 'salt_from_the_user_document';
        var cipher = crypto.createCipher('aes-256-cbc', key);
        cipher.update(req.body.password, 'utf8', 'base64');
        var encryptedPassword = cipher.final('base64');
        userTable.update({
            _id:req.body.id,
            is_deleted: false
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