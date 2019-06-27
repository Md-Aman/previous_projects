'use strict';

var mongoose = require('mongoose');

var medicalSchema = new mongoose.Schema({ 
    approving_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    traveller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    accept_request : {type:Boolean, default : false},
    reject_request : {type:Boolean, default : false},
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    request_date: {
        type: Date,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    is_deleted: {
        type: Boolean, 
        default: false
    }
},{
        timestamps: true
    });

var MedicalInformation = mongoose.model('MedicalInformation', medicalSchema);
module.exports = MedicalInformation;
