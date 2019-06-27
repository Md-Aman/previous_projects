'use strict';

var mongoose = require('mongoose');

var ResourceLibrarySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    category_image: {
        type: String
    },
    status: {
        type: String,
        default: 'Active'
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    grant_access: {
        approving_manager: {
            type: Boolean,
            default: false
        },
        traveller: {
            type: Boolean,
            default: false
        },
        basic_admin: {
            type: Boolean,
            default: false
        }
    },
    department: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
    }],
    resource_library_doc: [],
    description: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var ResourceLibrary = mongoose.model('ResourceLibrary', ResourceLibrarySchema);
// make this available to our users in our Node applications
module.exports = ResourceLibrary;
