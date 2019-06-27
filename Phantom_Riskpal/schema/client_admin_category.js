'use strict';

var mongoose = require('mongoose');

var ClientCategorySchema = new mongoose.Schema({
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    categoryName: {
        type: String,
        lowercase: true,
        required: true
    },
    client_admin_id: {
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
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    is_mandatory: {
        type: Boolean,
        default: false
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var ClientCategory = mongoose.model('ClientCategory', ClientCategorySchema);
// make this available to our users in our Node applications
module.exports = ClientCategory;
