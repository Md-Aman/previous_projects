'use strict';

var mongoose = require('mongoose');

var SituationLogSchema = new mongoose.Schema({
    log_name: {
        type: String,
    },
    country: {
        type: String
    },
    description_of_situation: {
        type: String
    },
    traveller: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    riskAssessment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsRa'
    }],
    manager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApprovingManager'
    }],
    log: {
        type: String
    },
    client_super_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        default: 'Active'
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var SituationLog = mongoose.model('SituationLog', SituationLogSchema);
// make this available to our users in our Node applications
module.exports = SituationLog;
