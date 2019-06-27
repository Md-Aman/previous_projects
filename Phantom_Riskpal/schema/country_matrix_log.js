'use strict';

var mongoose = require('mongoose');

var CountryMatrixLogSchema = new mongoose.Schema({
    code:{
    	type:String,
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    success: {
        type: Boolean,
        default: true
    },
    error: {
        type: String
    }
}, {
    timestamps: true
});

var CountryMatrixLog = mongoose.model('CountryMatrixLog', CountryMatrixLogSchema);
// make this available to our users in our Node applications
module.exports = CountryMatrixLog;
