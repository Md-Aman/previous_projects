var DB = require('./db.js'),
    config = require('./config'),
    fs = require('fs'),
    jwt = require('jsonwebtoken'),
    gcm = require('node-gcm'),
    sender = gcm.Sender('AIzaSyChUPtDA1rYeDqG-vz4t06ccYg9Vbk4W0g'),
    apn = require("apn");

var apnError = function(err) {
    console.log("APN Error:", err);
}

var options = {
    "cert": "cert.pem",
    "key": "key.pem",
    "passphrase": null,
    "gateway": "gateway.sandbox.push.apple.com",
    "port": 2195,
    "enhanced": true,
    "cacheLength": 5
};
options.errorCallback = apnError;

/* @function : sendMail
 * @param    : req {object}, res {object}
 * @created  : 04022016
 * @modified : 04022016
 * @purpose  : Send email AWS SES
 * @return   : err or data
 * @private
 */
exports.sendMail = function(mailer, callback) {
    mailer.to.forEach(function(address) {
        console.log('Email sending to :: ->>', address);
        SES.sendEmail({
            Source: mailer.from,
            Destination: {
                ToAddresses: address
            },
            Message: {
                Subject: {
                    Data: mailer.subject
                },
                Body: {
                    Html: {
                        Data: mailer.body,
                    }
                }
            }
        }, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    });
}

/* @function : get role id by name
 * @param    : req {object}, res {object}
 * @created  : 17022016
 * @modified : 17022016
 * @purpose  : Get roleId by role name
 * @return   : err or data
 * @private
 */

/* @function : set jwt sign token
 * @param    : req {object}, res {object}
 * @created  : 22022016
 * @modified : 22022016
 * @purpose  : Get encrypted Token
 * @return   : encoded token
 * @private
 */

exports.jwtSign = function(data) {
    // sign with RSA SHA256
    //var cert = fs.readFileSync('/private.key');  // get private key

    try {
        var expiresIn;
        if (data.roleId[0] == "2") {
            expiresIn = 300;
        } else {
            expiresIn = 900;
        }
        var options = {
            'expiresIn': expiresIn
        };
        //return jwt.sign(data, config.privateKey,options);
        return jwt.sign(data, config.privateKey);
    } catch (err) {
        return err;
    }
}


exports.decodeBase64Image = function(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    //console.log("dataString", dataString)
    var response = {};
    if (matches) {
        if (matches.length !== 3) {
            res.json({
                "code": 401,
                "message": "Invalid input string"
            });
            //return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    } else {
        return "err";
        //return new Error('Invalid base64 input string');
    }

}

exports.verifyBucket = function(name, callback) {
    S3.createBucket({
        Bucket: name
    }, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, true);
        }
    })
}

exports.uploadFile = function(file, BUCKET_NAME, callback) {
    console.log("uploadFile");
    var fileBuffer = fs.readFileSync(file.path);
    // Create upload file object
    S3.putObject({
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: file.name,
        Body: fileBuffer,
        ContentType: file.type
    }, function(err, data) {
        if (err) {
            console.log(err);
            callback(err);
        } else {
            console.log(data);
            callback(null, data);
        }
    });

}


