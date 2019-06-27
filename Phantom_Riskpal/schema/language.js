'use strict';

var mongoose = require('mongoose');

var LanguageSchema = new mongoose.Schema({
    name: {
        type: String
    },
    code:{
    	type:String
    }
});

var Country = mongoose.model('Language', LanguageSchema);
// make this available to our users in our Node applications
module.exports = Country;
