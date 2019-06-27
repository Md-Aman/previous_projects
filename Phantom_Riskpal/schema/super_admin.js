'use strict';

var mongoose = require('mongoose');

var SuperAdminSchema = new mongoose.Schema({
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
    password: String,
    super:String,
    super_admin: Boolean,
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Inactive'
    },
    roles:{
        manageclients:{
           type:String
         }
                 
    },
    duoToken: String,
       profile_pic: {
        type: String
    },
    duoVerified: {
        type: Boolean,
        default: false
    },

}, {
        timestamps: true
    });


var SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);
// make this available to our users in our Node applications
module.exports = SuperAdmin;
