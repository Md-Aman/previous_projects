'use strict';

var mongoose = require('mongoose');

var SystemLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    eventTypes: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    code: {
        type: Number,
        required: true
    },
    dataIn: {
        type: String,
        required: true
    },
    dataOut: {
        type: String,
        required: true
    },
    browser: {
        type: String,
        required: true
    },
    version: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }

})

var SystemLog = mongoose.model('SystemLog', SystemLogSchema);
// make this available to our users in our Node applications
module.exports = SystemLog;
