'use strict';

var mongoose = require('mongoose');

var AccessEmgInfoApprovalSchema = new mongoose.Schema({
    req_for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    req_by: { // requested by. who is requesting to view emergnecy details section
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    approvingManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    reason:{
        type: String
    },
    status: {
        type: String,
        default: 'pending'
    },
    action_date: {
        type: Date
    },
    time_end: {
        type: Date
    },
}, {
        timestamps: true
    });

var AccessEmgInfoApproval = mongoose.model('AccessEmgInfoApproval', AccessEmgInfoApprovalSchema);
// make this available to our users in our Node applications
module.exports = AccessEmgInfoApproval;
