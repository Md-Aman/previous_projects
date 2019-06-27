'use strict';

var mongoose = require('mongoose');

var SupplierSchema = new mongoose.Schema({
    supplier_name: {
        type: String,
    },
    preparence: {
        type: String,
    },
    service_provided: {
        type: String,
    },
    sourced_by: {
        type: String
    },
    contact: {
        type: String
    },
    address:{
        type: String
    },
    number:{
        type: String
    },
    email:{
        type: String
    },
    //  cost:[],
    cost: {
        type: String
    },
    currency: {
        type: String
    },
    
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    local_contect: [],
    local_driver: [],
    accomodation: [],
    number_of_review: {
        type: Number
    },
    rating_with_star: {
        type: Number
    },
    // rating_with_star: [
    //     {
    //         rating_given_by: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'User'
    //         },
    //         rating: { type: String }
    //     }
    // ],
    investigate_report: {
        type: Boolean
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    traveller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    news_ra_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsRa'
    }],
    
    // country: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Country'
    // },
    department: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
    }],
    city: {
        type: String
    },
    country: {
        type: String,
    },
     website: {
        type: String,
    },
    rate: {
        type: String
    },
    description: {
        type: String
    },
    incompleteform: {
        type: String
    },
    attachment: {
        type: String
    },
    other_service: {
        type: String
    },
    sourcing: {
        type: String
    },
    more_info:{
        type: String

    },
    who_recommended: {
        type: String
    },
  
    is_deleted: {
        type: Boolean,
        default: false
    },
    supplier_preview: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Active'
    },
    types_of_ra_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    }],
    client_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    }],

}, {
        timestamps: true
    });

var Supplier = mongoose.model('Supplier', SupplierSchema);
// make this available to our users in our Node applications
module.exports = Supplier;
