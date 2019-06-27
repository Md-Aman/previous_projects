var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;
// var encrypt = require('mongoose-encryption');

mongoose.Promise = require('bluebird');
// set up a mongoose model
const usertableSchema = new mongoose.Schema({
    authyID:  {
        type: String,
    },
    firstname: {
        type: String,
        //     required: true
    },
    lastname: {
        type: String,
        //     required: true
    },
    image: {
        type: String
    },
    hashcode: {
        type: String,
        //     required: true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    email: {          
        type: String,
       
    },
    password: String,
    
    super_admin: Boolean,
    created_by: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    
    is_deleted: {
        type: Boolean,
        default: false
    },
    is_deactivated: {
        type: Boolean,
        default: false
    },
    is_annonymised : {
        type: Boolean,
        default: false
    },
    first_login: {
        type: Boolean
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    department:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department'
    }],
    
    status: {
        type: String,
        default: 'Inactive'
    },
    duoToken: String,
    duoVerified: {
        type: Boolean,
        default: false
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
  
    profile_pic: {
        type: String
    },
    
   
    proof_of_life_question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProofOfLife',
        default: undefined,
        null: true
    },
    proof_of_life_answer: {
        type: String
    },
    mobile_number: {
        type: String
    },
    random_email_token:{
        type: String
    },
    reset_request_time:{
        type: Date
    },
    medical_info: {},
    training_info: {},
    passport_details: {
        title:{
            type: String,
            default: ''
        },
        full_name:{
            type: String,
            default: ''
        },
        relationship_to_you:{
            type: String,
            default: ''
        },
        telephone_number:{
            type: String,
            default: ''
        },
        mobile_number:{
            type: String,
            default: ''
        },
        email:{
            type: String,
            default: ''
        },
        home_address:{
            type: String,
            default: ''
        },
        miscInfo_instruction:{
            type: String,
            default: ''
        },
        alternative_title:{
            type: String,
            default: ''
        },
        alternative_full_name:{
            type: String,
            default: ''
        },
        alternative_relationship_to_you:{
            type: String,
            default: ''
        },
        alternative_telephone_number:{
            type: String,
            default: ''
        },
        alternative_mobile_number:{
            type: String,
            default: ''
        },
        alternative_email:{
            type: String,
            default: ''
        },
        alternative_home_address:{
            type: String,
            default: ''
        },
        alternative_miscInfo_instruction:{
            type: String,
            default: ''
        }
    },
    communications:{
        mobile1_imei:{
            type: String,
            default: ''
        },
        phone_make_model:{
            type: String,
            default: ''
        },
        meid_number:{
            type: String,
            default: ''
        },
        misc_info:{
            type: String,
            default: ''
        },
        satellite_phone_number:{
            type: String,
            default: ''
        },
        satellite_phone_imei:{
            type: String,
            default: ''
        },
        tracker_details:{
            type: String,
            default: ''
        },
        secondary_email_address:{
            type: String,
            default: ''
        }
    },
    crisis_info:{
        crisis_statement1:{
            type: String,
            default: ''
        },
        crisis_statement2:{
            type: String,
            default: ''
        },
        crisis_statement3:{
            type: String,
            default: ''
        },
        duress_word:{
            type: String,
            default: ''
        },
        duress_action:{
            type: String,
            default: ''
        }
    },
    job_title:{
        type: String,
        default: ''
    },
    middle_name:{
        type: String,
        default: ''
    },
    other_name_used:{
        type: String,
        default: ''
    },
    gender:{
        type: String,
        default: ''
    },
    home_address:{
        type: String,
        default: ''
    },
    identifying_marks:{
        type: String,
        default: ''
    },
    press_pass_id:{
        type: String,
        default: ''
    },
    languages:[],
    passport_data: [],
    Medical_request_by_approving_manager:[{
        approving_manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usertable'
    },
    status: {
    type: Number,
    enum: [1, 2, 3], // pending, active, suspend
    default: 1
}
}]
  
   
    
}, {
    timestamps: true,
    'versionKey': false
});

usertableSchema.plugin(mongooseFieldEncryption, { fields: [
        "firstname", "lastname", "email",
        "mobile_number", "passport_data", "gendar", "proof_of_life_answer",
        "passport_details", "communications", "crisis_info"
    ], 
    secret: "encrypt1RiskPal3Project5For4Security0For1CNN6And2ItN1",
    saltGenerator: function(secret) {
    return "iA3da4s2asglPcC3"; // should ideally use the secret to return a string of length 16
    }
});
// var encKey = "LuiMAofL1dpwfpAshYzispUbItbZUAeSv+2E2ASCWAc=";// process.env.SOME_32BYTE_BASE64_STRING;
// var sigKey = "i8asmgNjDrOg3eM/0UzB25qh3TaPRyBbLE05fu4k9LYZbOthWgJZR2UFU00FiSYSeIY207ApgIHyuq29jf9xtg=="; // process.env.SOME_64BYTE_BASE64_STRING;
// const secret = "i8asmgNjDrOg3eM/0UzB25qh3TaPRyBbLE05fu4k9LYZbOthWgJZR2UFU00FiSYSeIY207ApgIHyuq29jf9xtg==";
// usertableSchema.plugin(encrypt, { 
//     // encryptionKey: encKey,
//     // signingKey: sigKey,
//     secret: secret,
//     requireAuthenticationCode: false,
//     excludeFromEncryption: [
//         'authyID', 'password', 'super_admin', 'status', 'is_deleted', 'verified',
//         'updatedAt', 'createdAt', 'duoVerified'
//     ] });
module.exports = mongoose.model('usertable', usertableSchema);