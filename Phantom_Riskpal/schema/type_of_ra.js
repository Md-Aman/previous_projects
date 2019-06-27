'use strict';

var mongoose = require('mongoose');

var TypeOfRaSchema = new mongoose.Schema({
    ra_name: {
        type: String,
    },
    sector_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector'
    },
    sector_name: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector'
    }],
    is_generic: {        // visible for particular sector like media, oil 
        type: Boolean
    },
    is_individual: {     // visible for particular client's selected department
        type: Boolean
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    client_name:{
        type: String
    },
    client_department: [{   // if length is 0 than ra belogns to all department of a client
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    country: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }],
    country_name: {
        type: String
    },
    communicationRequired: {
          type: Boolean,
          default: false
    },
    contingenciesRequired:{
          type: Boolean,
          default: false
    },
    supplierRequired:{
          type: Boolean,
          default: false
    },
    questionRequired:{
          type: Boolean,
          default: false
    },
    countryrequired:{
          type: Boolean,
          default: false
    },
    status: {
        type: String,
        default: 'Active'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_created_compleletely: {
        type: Boolean,
     //   default: false
    },
    created_by_master_admin: {
        type: Boolean
    },
    created_by_client_admin: {
        type: Boolean
    },
}, {
        timestamps: true
    });

var TypeOfRa = mongoose.model('TypeOfRa', TypeOfRaSchema);
// make this available to our users in our Node applications
module.exports = TypeOfRa;
