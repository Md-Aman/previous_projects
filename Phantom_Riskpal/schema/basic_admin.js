
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('BasicAdmin', new Schema({
    authyID:  {
        type: String,
    },
    email: {            // primary email for client admin created by master admin
        type: String,
        unique: true,
        required: true
    },
    password: String,
    admin: Boolean,
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    first_login: {
        type: Boolean
    },
    status: {
        type: String,
        default: 'Inactive'
    },
    duoToken: String,
    duoVerified: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    created_by: {
        type: String,
    },
    profile_pic: {
        type: String
    },
        parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    medical_info: {},
    passport_details: {},
    passport_data: [],
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    country: {
        type: String
    },
    address: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    mobile_number: {
        type: String
    },
}, {
        timestamps: true
    }));