'use strict';

var mongoose = require('mongoose');

var CountrySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    code:{
    	type:String,
    },

    // common for all the news agencies

    specific_info:{
        type: String
    },
    country_info:{
       type: String  
    },
    color:{
        type: String
    },
     checked:{
        type: Boolean,
        default: false
    }
});

var Country = mongoose.model('Country', CountrySchema);
// make this available to our users in our Node applications
module.exports = Country;
