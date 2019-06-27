'use strict';

var mongoose = require('mongoose');

var DepartmentSchema = new mongoose.Schema({
    final_approving_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable',
        default: undefined
    },
    alternative_final_approving_manager:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable',
        default: undefined
    
    }],
    
    intermediate_approving_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    basic_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable',
        default: undefined
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    // TravellersForDepartment: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }],
    department_name: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Active'
    },
}, {
        timestamps: true
    });

var Department = mongoose.model('Department', DepartmentSchema);
// make this available to our users in our Node applications
module.exports = Department;
