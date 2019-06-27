'use strict';

var mongoose = require('mongoose');

var roleSchema = new mongoose.Schema({
group_name: {
        type: String
    },
    type:{
        type: String
    },
    client_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        default: undefined
    },
    client_name:{
        type: String
    },

   trackmanage:{
         
       parentId:{
           type:String
       },
       riskassessments:{
        type:String

       },
   
       riskassessmentsoverride:{
        type:String

       },
   
    currenttravel:{
        type:String

       },
    communicate:{
        type:String
    },
    taccidents:{
        type:String
    },
    medicalinfo:{
        type:String
    }


   },

   mytravel:{
         
    parentId:{
        type:String
    },
    riskassessment:{
     type:String

    },
    riskassessmentothers:{
        type:String
   
       },
checkinlog:{
     type:String

    },
contact:{
     type:String
 },
 accidents:{
     type:String
 },
 countrylist:{
    type:String

   },
suppliers:{
    type:String
},
reports:{
    type:String
}


},

   resourcelib:{
         
    parentId:{
        type:String
    },
    resourcelibview:{
     type:String

    },
    resourcelibedit:{
        type:String
   
       }
 
    },

    userinformation:{
         
        parentId:{
            type:String
        },
        createeditusers:{
         type:String
 
        },
        editusergroup:{
            type:String
        },
        bulkupload:{
            type:String
        },
        emergencyRecordApproval: {
            type: String
        },
 
 
    },

    managesystem:{
         
        parentId:{
            type:String
        },
        departments:{
         type:String
 
        },
        riskassessmenttemplates:{
            type:String
        },
        risklabels:{
            type:String
        },
        //  risktimer:{
        //     type:String
        // },
        // riskcontent:{
        //     type:String
        // },
        // activitytype:{
        //     type:String
        // },
        csuppliers:{
            type:String
        },
        // resourcelib:{
        //     type:String
        // },
        emailtemplates:{
            type:String
        },
        editcontent:{
            type:String
        },
        countryinfo:{
            type:String
        },
        countrythreatcategories:{
            type:String
        },

 
 
    },
    analytics:{
         
        parentId:{
            type:String
        },
        traveldata:{
         type:String
 
        },
        supplierdata:{
         type:String
        },
        accidentdata:{
            type:String
        },
        managementdata:{
            type:String
        },
        analyticsresoucre:{
            type:String
        },
        training:{
            type:String
        },
        appusage:{
            type:String
        },
        userdata:{
            type:String
        },
   

 
 
    },

    myprofile:{
        parentId:{
            type:String
        },
        myprofileemrgncy:{
            type:String
        },
        myprofilemedical:{
            type:String
        },
        myprofiletraining:{
            type:String
        },

    },


 






   is_deleted: {
    type: Boolean,
    default: false
},


 }, {
    timestamps: true
 });

 var Role = mongoose.model('Role', roleSchema);
// // make this available to our users in our Node applications
 module.exports = Role;