'use strict';

var mongoose = require('mongoose');

var SendEmailSchema = new mongoose.Schema({
    from: {
        type: String,
    },
    to: [{
        type: String,
    }],
    subject: {
        type: String
    },
    content: {
        type: String
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

var SendEmail = mongoose.model('SendEmail', SendEmailSchema);
// make this available to our users in our Node applications
module.exports = SendEmail;
