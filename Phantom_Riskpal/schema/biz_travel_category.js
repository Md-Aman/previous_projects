'use strict';

var mongoose = require('mongoose');

var BizTravelCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        lowercase: true,
        required: true
    },
    // client_admin_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    status: {
        type: String,
        default: 'Active'
    },
    country: [{
    }],
      companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    is_mandatory: {
        type: Boolean,
        default: false
    },
    // risk_associated: {
    //     type: Boolean,
    //     default: false
    // },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var BizTravelCategory = mongoose.model('BizTravelCategory', BizTravelCategorySchema);
// make this available to our users in our Node applications
module.exports = BizTravelCategory;
