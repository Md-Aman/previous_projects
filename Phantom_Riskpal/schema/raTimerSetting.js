'use strict';

var mongoose = require('mongoose');

var timerSchema = new mongoose.Schema({ 
    uncomplete_ra: {
        type: Number
    },
     reject_ra: {
        type: Number
    },
    isDelete : {type:Boolean, default : false}
}, {
        timestamps: true
    });

var RaTimerSetting = mongoose.model('RaTimerSetting', timerSchema);
module.exports = RaTimerSetting;
