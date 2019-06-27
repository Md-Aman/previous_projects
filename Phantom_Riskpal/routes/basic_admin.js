var express = require('express');
var router = express.Router();

var CatObj = require('./../modules/category/category.js'); // category controller
var basicAdminObj = require('./../modules/basic_admin/basic_admin.js'); // login controller
var userObj = require('./../modules/user/user.js'); // user controller
var countryObj = require('./../modules/country/country.js'); // country controller
var supplierObj = require('./../modules/supplier/supplier.js'); // supplier controller
var approvingManagerObj = require('./../modules/approving_manager/approving_manager.js'); // approving_manager controller
var resourceLibObj = require('./../modules/resource_library/resource_library.js'); // resource_library controller
var logObj = require('./../modules/log/logs.js'); // logs controller
var proofOfLifeObj = require('./../modules/proof_of_life/proof_of_life.js'); // proof_of_life controller
var departmentObj = require('./../modules/department/department.js'); // proof_of_life controller
var reportObj = require('./../modules/report/report.js'); // reports controller
var trackManageObj = require('./../modules/track_and_manage/track_and_manage.js'); // track_and_manage controller
var riskAssessmentObj = require('./../modules/risk_assessment/risk_assessment.js'); // risk_assessment controller 
var emailTemplateObj = require('./../modules/email_template/email_template.js'); // email template controller 
var medicalObj = require('./../modules/medical_info/medical_Info.js');
var adminProfileObj = require('./../modules/admin_profile/admin_profile.js');


router.post('/sms',basicAdminObj.sms);
router.post('/voice',basicAdminObj.voice);
router.post('/verify',basicAdminObj.verify);
router.post('/checkonetouchstatus',basicAdminObj.checkonetouchstatus);
router.post('/onetouch',basicAdminObj.createonetouch);
router.post('/start',basicAdminObj.requestPhoneVerification);
router.post('/verify',basicAdminObj.verifyPhoneToken);

router.post('/basicAdminLogin', basicAdminObj.basicAdminLogin); // admin login
router.get('/checkLogin', basicAdminObj.checkLogin); // check login
router.get('/basicAdminLogout', basicAdminObj.basicAdminLogout); // admin logout
// router.post('/basicAdminActiveAccount', adminObj.basicAdminActiveAccount); //active admin account
// router.post('/basicAdminForgetPass', adminObj.basicAdminForgetPass); //for send forget password link to admin
// router.post('/basicAdminResetPass', adminObj.basicAdminResetPass); // for reset password

// router.post('/updateMedicalInfo',adminProfileObj.updateMedicalInfo); // to update medical information of admin
// router.get('/getAdminDetails',adminProfileObj.getAdminDetails); // to get traveller information
// router.post('/updatePassportDetails',adminProfileObj.updatePassportDetails); // update passport details
// router.post('/updatePersonalDetails',adminProfileObj.updatePersonalDetails); // update personal details
// router.post('/uploadProfilePic',adminProfileObj.uploadProfilePic); // upload profile pic for admin
// router.get('/getProofOfLifeQuestions',proofOfLifeObj.getProofOfLifeQuestions);
// router.post('/checkPassword',adminProfileObj.checkPassword); // checkPassword
// router.post('/changePassword',adminProfileObj.changePassword); // changePassword

module.exports = router;
