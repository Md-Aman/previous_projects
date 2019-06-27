'use strict';

var mongoose = require('mongoose');

var CurrencySchema = new mongoose.Schema({
    currency: {
        type: String,
    },
    abbreviation:{
    	type:String,
    }
});

var Currency = mongoose.model('Currency', CurrencySchema);
// make this available to our users in our Node applications
module.exports = Currency;
