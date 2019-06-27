'use strict';

var mongoose = require('mongoose');

var LogSchema = new mongoose.Schema({
    approving_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    }, // traveller's medical infomation viewed by
    traveller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    view_medical_info: {
        type: Boolean,
        default: false
    },
    view_date: {
        type: Date,
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var Log = mongoose.model('Log', LogSchema);
// make this available to our users in our Node applications
module.exports = Log;
