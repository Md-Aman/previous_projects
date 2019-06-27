'use strict';


const AWS = require('aws-sdk');
const ResponseHandler = require('./handle-response.helper');
const _ = require('lodash');
const multer = require('multer');
const multerS3 = require('multer-s3');

const formidable = require('formidable');
const fs = require('fs');
var config = require('../config/config');
var path = require('path');
var userTable= require('./../schema/usertables.js'); //user table update 

AWS.config.update({
    "accessKeyId": process.env.accessKeyId || config.AWS.S3.AWS_S3_IAM_USER_KEY,
    "secretAccessKey": process.env.secretAccessKey || config.AWS.S3.AWS_S3_IAM_USER_SECRET,
    "region": process.env.region || config.AWS.REGION,
  });
  
const s3 = new AWS.S3({
    signatureVersion: 'v4'
});

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: config.AWS.AWS_BUCKET_NAME,
//         acl: 'public-read',
//         serverSideEncryption: 'AES256',
//         metadata: (req, file, cb) => {
//             cb(null, {fieldName: file.fieldname});
//         },
//         contentType: (req, file, cb) => {
//             cb(null, file.mimetype);
//         },
//         key: function (req, file, cb) {
//             cb(null, Date.now().toString())
//         }
//     })
// });
function encryptUserFields (email) {
    const searchEncryptedFields = new userTable({email});
    searchEncryptedFields.encryptFieldsSync();
    return searchEncryptedFields;
}
function searchByFields(data, keyword, fields) {
    
   return data.filter(item => {
        const searchedResult = fields.map(f => {
            const matchKeyword = item[f] ? item[f].toLowerCase().search(keyword.toLowerCase()) : -1;
            if ( matchKeyword > -1 ) {
                return true;
            } else {
                return false;
            }
        });
        console.log('ffffff', searchedResult);
        if ( searchedResult.indexOf(true) > -1 ) {
            return item;
        }
    });
}
function uploadFile(file) {
    console.log('file.pathfile.path', file.path);
    return new Promise(function (fullfill, reject) {
        var stream = fs.createReadStream(file.path);
        var name = Date.now().toString() + '_' + file.name;
        var data = {
            Key:  file.folderName + name,
            ACL: 'public-read',
            Body: stream,
            ContentType: file.type,
            Bucket: config.AWS.AWS_BUCKET_NAME
        };
        if ( file.type != 'image/jpeg' && file.type != 'image/jpg' && file.type != 'image/png' 
            && file.type != 'image/jpeg' && file.type != 'application/pdf' && file.type != 'application/docx' ) {
            reject('File Type is not correct.');
        }
        s3.upload(data, function (err, data) {
            if (err) {
                reject(err);
            } else {
                fullfill(data);
            }
        })
    });
}

function bucketFolderName(folder) {
    return function(req, res, next) {
      const folderLink = folder ? config.AWS.bucketEnvFolder + folder + '/' : '';
      res.locals.folderName = folderLink;
      next();
    };
  }
const attachBodyAndFiles = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.multiples = true;
    // console.log('formmmm', form);
    form.parse(req, function (err, fields, files) {
        req.body = fields;
        req.files = files;
        next();
    });

}

const uploadFileOnS3 = (req, res, next) => {
    const allFiles = [];
    if ( _.isEmpty(req.files) ) return next();
    if ( Array.isArray(req.files.file) ) {
        for (let key in req.files.file) {
            if (req.files.file.hasOwnProperty(key)) {
                req.files.file[key].folderName = res.locals.folderName;
                allFiles.push(req.files.file[key]);
            }
        }
    } else {
        req.files.file.folderName = res.locals.folderName;
        allFiles.push(req.files.file);
    }
    
    if (allFiles.length === 0) return next();
    console.log('allfiles', req.files.file.length);
    console.log('allfilesssssss', allFiles);
    let filesUploadPromises = _.map(allFiles, uploadFile);
    return Promise.all(filesUploadPromises).then(function (data) {
        req.location = data;
        next();
    }).catch((err) => {
        // winston.info(err);
        console.log('errrrr', err);
        return ResponseHandler.ResponseMiddlewareError(res, "An error occurred in uploading image try again latter",
            "An error occurred in uploading image try again later");
    });
}

function deleteObject(req, res, next, data) {
    let deleteObjectKeys = [];
   
    return new Promise(function (fullfill, reject) { 
        if ( !data.name ) {
            reject('Image is not defined');
        }
        console.log('data', data);
        if ( Array.isArray(data) ) {
            data.map(item => {
                const fileArray = item.name.split('/');
                const file = fileArray[fileArray.length - 1];
                deleteObjectKeys.push({ Key: res.locals.folderName + file });
            });
            
        } else {
            const fileArray = data.name.split('/');
            const file = fileArray[fileArray.length - 1];
            deleteObjectKeys.push({ Key: res.locals.folderName + file });
        }
        var params = {
            Bucket: config.AWS.AWS_BUCKET_NAME, 
            Delete: { // required
            Objects: deleteObjectKeys,
            },
        };
      
        s3.deleteObjects(params, function(err, data) {
            if (err) reject(err); // an error occurred
            else     fullfill(data);           // successful response
          });
      });
      
}

function checkSingleFileType(req, res, next) {  
    var fileTypeWhiteList = ['.pdf', '.jpeg', '.jpg', '.png'];
    if(res.locals.folderName.split("/")[1] === 'profile'){
        fileTypeWhiteList.shift();
    }
    if (Object.keys(req.files).length > 0) {
        const fileName = req.files.file.name;
        const fileSize = req.files.file.size;
        // check for mutiple dots (.) in file name
        if ((fileName.split(".").length - 1 > 1)) {
            res.json({
                'code': 400,
                'message': 'You are not allowed to upload this file'
            });
        } else {
            const splitedFileName = fileName.split(".")[0];
            const fileType = path.extname(fileName).toLowerCase();
            // check for file type. Accepted files types are in fileTypeWhiteList
            if (fileTypeWhiteList.includes(fileType) === true) {
                 //  check file size in byte. Max allowed size is 8mb
                if (fileSize > 8000000) {
                    res.json({
                        'code': 400,
                        'message': 'The uploaded file is too large. The maximum file size is set to 8mb'
                    });
                } else {
                    var regex = /^[A-Za-z0-9 ]+$/;
                    //  check for special characters in file name.
                    if (regex.test(splitedFileName)) {
                        next();
                    } else {
                        res.json({
                            'code': 400,
                            'message': "File name can't contain special characters"
                        });
                    }
                }
            } else {
                res.json({
                    'code': 400,
                    'message': 'You are not allowed to upload this file.'
                });
            }
        }
    } else {
        next();
    }
}


function checkMultipleFileType(req, res, next) {
    const fileTypeWhiteList = ['.pdf', '.jpeg', '.jpg', '.png'];
    var count = 0;
    if (Object.keys(req.files).length > 0) {
        var files = [].concat(req.files.file);
        for (let i = 0; i < files.length; i++) {
            var fileName = files[i].name;
            var fileSize = files[i].size;
            // check for mutiple dots (.) in file name
            if ((fileName.split(".").length - 1 > 1)) {
                res.json({
                    'code': 400,
                    'message': 'You are not allowed to upload this file'
                });
                break;
            } else {
                var splitedFileName = fileName.split(".")[0];
                var fileType = path.extname(fileName).toLowerCase();
                // check for file type. Accepted files types are in fileTypeWhiteList
                if (fileTypeWhiteList.includes(fileType) === true) {
                    //  check file size in byte. Max allowed size is 8mb
                    if (fileSize > 8000000) {
                        res.json({
                            'code': 400,
                            'message': 'The uploaded file is too large. The maximum file size is set to 8mb '
                        });
                        break;
                    } else {
                        var regex = /^[A-Za-z0-9 ]+$/;
                        //  check for special characters in file name.
                        if (regex.test(splitedFileName)) {
                            // have to check for counting;
                            count++;
                            while (files.length === count) {
                                next();
                                break;
                            }
                        } else {
                            res.json({
                                'code': 400,
                                'message': "File name can't contain special characters."
                            });
                            break;
                        }
                    }
                } else {
                    res.json({
                        'code': 400,
                        'message': 'You are not allowed to upload this file.'
                    });

                    break;
                }
            }
        }
    } else {
        next();
    }
}



// module.exports.upload = upload;
module.exports.deleteObject = deleteObject;
module.exports.bucketFolderName = bucketFolderName;
module.exports.attachBodyAndFiles = attachBodyAndFiles;
module.exports.uploadFileOnS3 = uploadFileOnS3;
module.exports.checkSingleFileType = checkSingleFileType;
module.exports.checkMultipleFileType = checkMultipleFileType;
module.exports.encryptUserFields = encryptUserFields;
module.exports.searchByFields = searchByFields;

