'use strict';

var mongoose = require('mongoose');

var SituationReportSchema = new mongoose.Schema({
    report_name: {
        type: String,
    },
    country: {
        type: String
    },
    summary_of_report: {
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
    tags: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    report: {
        type: String
    },
    supporting_docs:[],
    supporting_media:[],
    client_super_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

var SituationReport = mongoose.model('SituationReport', SituationReportSchema);
// make this available to our users in our Node applications
module.exports = SituationReport;
