'use strict';

var mongoose = require('mongoose');
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;


var uuuSchema = new mongoose.Schema({
    first_name: {
        type: String,
    },
    last_name: {
        type: String,
    },
    title: {
        type: String,
    },
    name: {
        type: String,
    },
}, {
    timestamps: true
});
uuuSchema.plugin(mongooseFieldEncryption, {
    fields: ["name", "title"],
    secret: "some secret key",
    saltGenerator: function (secret) {
        return "1234567890123456"; // should ideally use the secret to return a string of length 16
    }
});

module.exports = mongoose.model('Test', uuuSchema);
