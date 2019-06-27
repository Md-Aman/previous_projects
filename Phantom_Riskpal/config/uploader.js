'use strict';
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
var config = require('../config/config');


const s3Config = new AWS.S3({
    accessKeyId: config.AWS.S3.AWS_S3_IAM_USER_KEY,
    secretAccessKey: config.AWS.S3.AWS_S3_IAM_USER_SECRET,
    region: config.AWS.REGION
  });

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

// this is just to test locally if multer is working fine.
const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'src/api/media/profiles')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const multerS3Config = multerS3({
    s3: s3Config,
    bucket: config.AWS.AWS_BUCKET_NAME,
    acl: 'public-read',
    serverSideEncryption: 'AES256',
    metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
        console.log(file)
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: multerS3Config,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 20 // we are allowing only 20 MB files
    }
})

exports.upload = upload; 