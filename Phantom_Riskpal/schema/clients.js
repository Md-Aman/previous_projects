

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Client', new Schema({
  
  
    company_name: {
        type: String
    },
    country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country'
    },
    type_of_client: {
        type: String
    },
    email: {            // primary email for client admin created by master admin
        type: String,
        
       
    },
   
    no_of_approving_manager_account: {
        type: Number
    },
    no_of_co_admin_account: {
        type: Number
    },
    no_of_traveller_account: {
        type: Number
    },
    no_of_client_admin_account: {
        type: Number
    },
    address: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    mobile_number: {
        type: String
    },
    zip_code: {
        type: String
    },
    sector_name: {
        type: String
    },
      is_deleted: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        default: 'Inactive'
    },
    sector_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sector'
    },
    Medical_request_by_approving_manager:[{
            approving_manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ApprovingManager'
        },
       
   }]

    
}, {
        timestamps: true
    }));