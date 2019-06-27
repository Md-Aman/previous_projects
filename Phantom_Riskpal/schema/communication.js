'use strict';

var mongoose = require('mongoose');

var CommunicationSchema = new mongoose.Schema({
    traveller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    news_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsRa'
    },
    types_of_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    },
    
    call_intime: [],
    emergency_contact: [],
    details_of_team: [],
    want_your_poc: {
        type: Boolean,
        default: false
    },
    reminder_before_checkIn: {
        type: Boolean,
        default: false
    },
    incompleteform: {
        type: String
    },
    no_of_checkin: {
        type: String
    },
    timezone: {
        type: String
    },
    point_of_contact: {
        type: String
    },
    number: {
        type: String
    },
    email: {
        type: String
    },
    detail_an_overdue_procedure: {
        type: String
    },
    communication_preview: {
        type: Boolean,
        default: false
    },
    detail_an_overdue_procedure: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
}, {
        timestamps: true
    });

var Communication = mongoose.model('Communication', CommunicationSchema);
// make this available to our users in our Node applications
module.exports = Communication;
