'use strict';

var mongoose = require('mongoose');

var NewsRaSchema = new mongoose.Schema({
    traveller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    authorcheck: {
        type: String
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    client_admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    types_of_ra_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeOfRa'
    },
    project_name: {
        type: String
    },
    project_code: {
        type: String
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId
    },
    department: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    // date_of_ra: {        
    startdate: { type: Date },        
    enddate: { type: Date }  ,  
    // },
    
    description_of_task: {
        type: String
    },
    travellerTeamArr: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    }],
    country: [{
        // name: String,
        // color:String
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    }],
    situation_report:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SituationReport'
    }],
    incident_report:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'IncidentReport'
    }],
    situationlog_report:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SituationLog'
    }],
    approvingManager: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    }],
    relevant_info: {
        type: String
    },
    risk_detailed: {
        type: String
    },
    supporting_docs:[],
    is_deleted: {
        type: Boolean,
        default: false
    },
    country_name: {
        type: String
    },
    is_submitted: {
        type: Boolean,
        default: false
    },
    is_approve: {
        type: Boolean,
        default: false
    },
    semi_approve: {
        type: Boolean,
        default: false
    },
    is_reject: {
        type: Boolean,
        default: false
    },
    is_more_info: {
        type: Boolean,
        default: false
    },
    is_modified: {
        type: Boolean,
        default: false
    },
    approvedBy: [],
    description_of_action: {
        type: String,
        default: null
    },
    adescription_of_action: {
        type: String,
        default: null

    },
    // itinearyArr: [],
    itineary_description: {
        type: String
    },
    // basic admin
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    rejectDate: {        
        type: Date    
    },
    is_send_mail_supp_rating: 
    {type: Boolean,default: false 

    },
    from_template: { // saving ra id for first time for supplier from ra template
        type: Boolean,
        default: false
    }
    //  quesArr:[],
}, {
        timestamps: true
    });

var NewsRa = mongoose.model('NewsRa', NewsRaSchema);
// make this available to our users in our Node applications
module.exports = NewsRa;
