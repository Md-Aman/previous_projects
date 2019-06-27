'use strict';

var mongoose = require('mongoose');


var EmailTemplateSchema = mongoose.Schema({
    title: { type: String },
    unique_keyword: { type: String },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false }
}, {
    timestamps: true
});

var EmailTemplates = mongoose.model('EmailTemplates', EmailTemplateSchema);
module.exports = EmailTemplates;
