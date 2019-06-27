'use strict';

var mongoose = require('mongoose');

var QuestionnaireSchema = new mongoose.Schema({
    question: {
        type: String
    },
    // specific_mitigation:{
    //     type: String
    // },
    best_practice_advice: {
        type: String
    },
    category_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    // types_of_ra_id: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'TypeOfRa'
    // },
    assigned_ra_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    }],
    status: {
        type: String,
        default: 'Active'
    },
    is_deleted: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    // created_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // },
    created_by_client_admin: {
        type: Boolean
    },
     created_by_master_admin: {
        type: Boolean
    },

}, {
        timestamps: true
    });

var Questionnaire = mongoose.model('Questionnaire', QuestionnaireSchema);
// make this available to our users in our Node applications
module.exports = Questionnaire;
