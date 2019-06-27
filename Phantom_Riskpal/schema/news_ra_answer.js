'use strict';

var mongoose = require('mongoose');

var NewsRaAnswerSchema = new mongoose.Schema({
    news_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NewsRa'
    },
    traveller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    questionnaire_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Questionnaire'
    },
    question: {
        type: String,
    },
    best_practice_advice: {
        type: String
    },
    category_id: [],
    types_of_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    },
    ticked: {
        type: Boolean,
        default: false
    },
    specific_mitigation: {
        type: String
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

var NewsRaAnswer = mongoose.model('NewsRaAnswer', NewsRaAnswerSchema);
// make this available to our users in our Node applications
module.exports = NewsRaAnswer;
