'use strict';

var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    age: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);
