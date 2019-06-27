'use strict';

var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true
    },
    // types_of_ra_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'TypeOfRa'
    // },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment:{
            type:String,
    },
    status: {
        type: String,
        default: 'Active'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    country: [{
    }],
    is_mandatory: {
        type: Boolean,
        default: false
    },
    risk_associated: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    created_by_client_admin: {
        type: Boolean
    },
    sector_name: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector'
    }],
     created_by_master_admin: {
        type: Boolean
    },
}, {
        timestamps: true
    });

var Category = mongoose.model('Category', CategorySchema);
// make this available to our users in our Node applications
module.exports = Category;
