'use strict';

var mongoose = require('mongoose');

var approvingManagerSchema = new mongoose.Schema({
    name: {
        type: String
    },
     authyID:  {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    created_by: {
        type: String,
    },
    email: {
        type: String
    },
    newemail: {
        type: String
    },
    password: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    mobile_number: {
        type: String
    },
    dob: {
        type: Date
    },
    otp:String,
    role: {
        type: String
    },
        first_login: {
        type: Boolean
    },

    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    project: [],
    reportsTo: [],
    threat_level_amber: {
        type: Boolean,
        default: false
    },
    medical_request:[{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    }],
    threat_level_green: {
        type: Boolean,
        default: false
    },
    threat_level_red: {
        type: Boolean,
        default: false
    },
    approval_status: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Active'
    },
    duoToken: String,
    duoVerified: {
        type: Boolean,
        default: false
    },
    proof_of_life_question: {
        type: String
    },
    profile_pic: {
        type: String
    },
     gender: {
        type: String
    },
    proof_of_life_answer: {
        type: String
    },
    medical_info: {},
    passport_details: {},
    passport_data: [],
}, {
        timestamps: true
    });

var ApprovingManager = mongoose.model('ApprovingManager', approvingManagerSchema);
// make this available to our users in our Node applications
module.exports = ApprovingManager;
