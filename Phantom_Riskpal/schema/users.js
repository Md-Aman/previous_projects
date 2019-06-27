/*'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        lowercase: true,
        required: true
    },
    password: String,
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: Number,
        default: 0
    },
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var User = mongoose.model('User', UserSchema);
// make this available to our users in our Node applications
module.exports = User;


*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
    authyID:  {
        type: String,
    },
    firstname: {
        type: String,
        //     required: true
    },
    lastname: {
        type: String,
        //     required: true
    },
    email: {            // primary email for client admin created by master admin
        type: String,
        unique: true,
        required: true
    },
    password: String,
    otp:String,
    admin: Boolean,
    created_by: {
        type: String,
    },
    client_admin: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approving_manager_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApprovingManager'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    first_login: {
        type: Boolean
    },

    parent: {
        type: Boolean,
        default: false
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
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    profile_pic: {
        type: String
    },
        parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes_for_approving_manager: {
        type: String
    },
    proof_of_life_question: {
        type: String
    },
    proof_of_life_answer: {
        type: String
    },
    medical_info: {},
    passport_details: {},
    passport_data: [],
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    company_name: {
        type: String
    },
    country: {
        type: String
    },
    type_of_client: {
        type: String
    },
    no_of_approving_manager_account: {
        type: Number
    },
    no_of_co_admin_account: {
        type: Number
    },
    no_of_traveller_account: {
        type: Number
    },
    no_of_client_admin_account: {
        type: Number
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
    zip_code: {
        type: String
    },
    sector_name: {
        type: String
    },
    sector_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector'
    },
    Medical_request_by_approving_manager:[{
            approving_manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ApprovingManager'
        },
        status: {
        type: Number,
        enum: [1, 2, 3], // pending, active, suspend
        default: 1
    }
   }]

    
}, {
        timestamps: true
    }));