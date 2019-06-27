'use strict';

var mongoose = require('mongoose');

var RiskAssociatedCategorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active'
    },
    position: {
        type: String,
        default: "z"
    },
    country: [{}],
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

var RiskAssociatedCategory = mongoose.model('RiskAssociatedCategory', RiskAssociatedCategorySchema);
// make this available to our users in our Node applications
module.exports = RiskAssociatedCategory;
