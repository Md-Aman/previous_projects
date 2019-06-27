'use strict';

var mongoose = require('mongoose');

var IncidentReportSchema = new mongoose.Schema({
    incident_type: {
        type: String,
    },
    country: {
        type: String
    },
    label: {
        type: String
    },
    address_of_incident: {
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
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    manager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ApprovingManager'
    }],
    description: {
        type: String
    },
    incident_avoided: {
        type: String
    },
    detail: {
        type: String
    },
    injuries_sustained: {
        type: String
    },
    body_part: {
        type: String
    },
    medical_treatment_required: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    type_of_treatment: {
        type: String
    },
    other_info: {
        type: String
    },
    follow_up_action: {
        type: String
    },
    comments_by_witness: {
        type: String
    },
    comments_by_investigator: {
        type: String
    },
    incident_resolved: {
        type: String
    },
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

var IncidentReport = mongoose.model('IncidentReport', IncidentReportSchema);
// make this available to our users in our Node applications
module.exports = IncidentReport;
