'use strict';

var mongoose = require('mongoose');

var ContingencySchema = new mongoose.Schema({
    traveller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    news_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsRa'
    },
    types_of_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    },
    medical_provision: {
        type: String
    },
    method_of_evacuation: {
        type: String
    },
    incompleteform: {
        type: String
    },
    detail_nearest_hospital: [],
    medevac_company: [],
    embassy_location:[],
    additional_item:{
        type: String
    },
    sat_phone_number: {
        type: Boolean,
        default: false
    },
    tracker_id: {
        type: Boolean,
        default: false
    },
    first_aid_kit: {
        type: Boolean,
        default: false
    },    
    personal_protective_equipment: {
        type: Boolean,
        default: false
    },
    no_of_satellite_phone: {
        type: String
    },
    no_of_tracker: {
        type: String
    },
    first_aid_kit_details:{
        type: String
    },
    personal_protective_equipment_details: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    contingency_preview: {
        type: Boolean,
        default: false
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
        timestamps: true
    });

var Contingency = mongoose.model('Contingency', ContingencySchema);
// make this available to our users in our Node applications
module.exports = Contingency;
