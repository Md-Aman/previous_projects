'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
// app.set('env', 'production');
const express = require('express');
const app = express();
// const config = require("./settings")[app.get("env")];
var config = require('../config/config');

var dbURI = config.db.dbUri;

var options = {
    server:{auto_reconnect:true},
    reconnectTries: 100000,
    reconnectInterval: 1000
    
}
console.log('URI', dbURI);
var db = mongoose.connection;
db.on('connecting', function() {
    console.log('connecting to MongoDB...');
  });

  db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
  });
  db.on('connected', function() {
    console.log('MongoDB connected!');
  });
  db.once('open', () => {
    console.log('MongoDB connection opened!');
  });
  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
    // mongoose.connect(dbURI, {server:{auto_reconnect:true}});
  });

mongoose.connect(dbURI, options);

// db.on('error', console.error.bind(console, "connection failed"));
// db.once('open', function () {
//     console.log("Database conencted successfully!");
// });
mongoose.set('debug', true);

var normalizedPath = require("path").join(__dirname, "../schema");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("../schema/" + file);
});

var SystemLogSchema = require('../schema/systemLog.js');


module.exports = {
    generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },
    validPassword: function (password, comparePassword) {
        return bcrypt.compareSync(password, comparePassword);
    },
    encryptText: function (text) {
        var cipher = crypto.createCipher('aes-256-ctr', 'taecout@2016') //(algorithm,password)
        var crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decryptText: function (text, callback) {
        var decipher = crypto.createDecipher('aes-256-ctr', 'taecout@2016')
        var dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return callback(null, dec);
    }
}