'use strict';

var mongoose = require('mongoose');

var ProofOfLifeSchema = new mongoose.Schema({
    question: {
        type: String
    },
    description:{
        type: String
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    status:{
    	type:String,
        default: 'Active'
    },
    is_deleted:{
    	type:Boolean,
        default: false
    }
}, {
    timestamps: true
});

var ProofOfLife = mongoose.model('ProofOfLife', ProofOfLifeSchema);
// make this available to our users in our Node applications
module.exports = ProofOfLife;
