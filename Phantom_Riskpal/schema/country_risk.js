'use strict';

var mongoose = require('mongoose');

var CountryRiskSchema = new mongoose.Schema({
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    code: {
        type: String,
    },
    specific_info: {
        type: String
    },
    color: {
        type: String
    },
    checked: {
        type: Boolean,
        default:false
    }
});

var CountryRisk = mongoose.model('CountryRisk', CountryRiskSchema);
// make this available to our users in our Node applications
module.exports = CountryRisk;
