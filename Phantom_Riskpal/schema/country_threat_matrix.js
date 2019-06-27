'use strict';

var mongoose = require('mongoose');

var CountryThreatMatrixSchema = new mongoose.Schema({
    countryname: {
        type: String
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RiskAssociatedCategory'
    },
    country_risk: {
        type: String,
    },
    category_name: {
        type: String,
    }, 
    client_admin: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
});

var CountryThreatMatrix = mongoose.model('CountryThreatMatrix', CountryThreatMatrixSchema);
// make this available to our users in our Node applications
module.exports = CountryThreatMatrix;
