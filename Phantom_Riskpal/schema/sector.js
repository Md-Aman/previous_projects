'use strict';

var mongoose = require('mongoose');

var SectorSchema = new mongoose.Schema({
    sectorName: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active'
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
}, {
        timestamps: true
    });

var Sector = mongoose.model('Sector', SectorSchema);
// make this available to our users in our Node applications
module.exports = Sector;
