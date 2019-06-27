'use strict';

var mongoose = require('mongoose');

var CountryMatrixSchema = new mongoose.Schema({
    security: {
        type: String,
    },
    code:{
    	type:String,
    },
    description:{
        type: String
    },
    country_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }
}, {
        timestamps: true
    });

var CountryMatrix = mongoose.model('CountryMatrix', CountryMatrixSchema);
// make this available to our users in our Node applications
module.exports = CountryMatrix;
