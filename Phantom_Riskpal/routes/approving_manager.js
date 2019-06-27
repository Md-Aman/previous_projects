var express = require('express');
var router = express.Router();

var approvingManagerObj = require('./../modules/approving_manager/approving_manager.js'); // approving_manager controller
var resourceLibObj = require('./../modules/resource_library/resource_library.js');
var approvingManagerProfileObj = require('./../modules/approving_manager_profile/approving_manager_profile.js'); // approving_manager controller
var proofOfLifeObj = require('./../modules/proof_of_life/proof_of_life.js');
const authObj = require('./../helper/auth.helper');

router.post('/sms',approvingManagerObj.sms);
router.post('/voice',approvingManagerObj.voice);
router.post('/verify',approvingManagerObj.verify);
router.post('/checkonetouchstatus',approvingManagerObj.checkonetouchstatus);
router.post('/onetouch',approvingManagerObj.createonetouch);
router.post('/start',approvingManagerObj.requestPhoneVerification);
router.post('/verify',approvingManagerObj.verifyPhoneToken);
router.get('/getTravellerMapData', approvingManagerObj.getTravellerMapData); // to ger traveller information

router.get('/getClientDepartment', approvingManagerObj.getClientDepartment); // to ger traveller information
router.post('/verifyOtp', approvingManagerObj.verifyOtp); // admin login
router.post('/approvingManagerLogin', approvingManagerObj.approvingManagerLogin); // Login approving manager
router.get('/checkLogin', approvingManagerObj.checkLogin); // check login
router.get('/approvingManagerLogout', approvingManagerObj.approvingManagerLogout); // Logout approving manager
router.post('/approvingManagerForgetPass', approvingManagerObj.approvingManagerForgetPass); // forget password
router.post('/approvingManagerResetPass', approvingManagerObj.approvingManagerResetPass); // reset password
router.post('/getAlltravellers', approvingManagerObj.getAlltravellers); // to get all the traveller list for approving manager
router.get('/deleteTraveller/:traveller_id', approvingManagerObj.deleteTraveller); // to delete traveller
router.post('/changetravellerStatus', approvingManagerObj.changetravellerStatus); // to change traveller status 
router.post('/addTraveller', approvingManagerObj.addTraveller); // to add traveller
router.get('/getTravellerDetails/:traveller_id', approvingManagerObj.getTravellerDetails); // to get traveller details
router.post('/updateTraveller', approvingManagerObj.updateTraveller); // to update traveller details
router.post('/viewTravellerMedicalInfo', approvingManagerObj.viewTravellerMedicalInfo); // to view traveller's medical information
router.get('/getTravellerInfo/:traveller_id', approvingManagerObj.getTravellerInfo); // to ger traveller information

router.post('/travellerMedicalInformation', approvingManagerObj.travellerMedicalInformation); // to get all news ra
router.post('/getAllpendingnewsRa', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}
), approvingManagerObj.getAllpendingnewsRa); // to get all news ra
router.post('/getAllclientnewsRa', approvingManagerObj.getAllclientnewsRa); // to get all news ra based on clients only not dept

router.post('/approveNewsRa', approvingManagerObj.approveNewsRa); // to approve news ra
router.get('/getNewsRadetails/:news_ra_id', approvingManagerObj.getNewsRadetails); // to get news ra details
router.post('/rejectRa', approvingManagerObj.rejectRa); // to reject Ra
router.post('/wantMoreInfoRa', approvingManagerObj.wantMoreInfoRa);//  to send ra to traveller again for more information 
router.get('/getApprovingManagers', approvingManagerObj.getApprovingManagers); // to get approving manager list
router.get('/getTravellers/:traveller_id', approvingManagerObj.getTravellers); // to get traveller list
router.post('/approveRaByManager', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}
),  approvingManagerObj.approveRaByManager); // to approve ra by approving manager
router.post('/forwardToManager', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}
), approvingManagerObj.forwardToManager); // to approve news ra
router.post('/rejectRaByManager', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}
), approvingManagerObj.rejectRaByManager); // to reject ra by approving manager
router.post('/moreInfoRaByManager', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}
),  approvingManagerObj.moreInfoRaByManager); // to request more info about ra by approving manager
router.get('/getAllCountry/:country_id',approvingManagerObj.getAllCountry); // to gete threat matrix of country
router.get('/getMedicalInfoByRequest/:traveller_id', approvingManagerObj.getMedicalInfoByRequest); // to ger traveller information on basic of request by approving manager
router.post('/updateEditRa',approvingManagerObj.updateEditRa); // update Edit RA

router.post('/getResourceLibForApprovingManager', resourceLibObj.getResourceLibForApprovingManager); // to get all resource library for approving manager
router.get('/getResourceLibDetails/:resource_library_id', resourceLibObj.getResourceLibDetails); // to get resource library details

router.post('/updateMedicalInfo',approvingManagerProfileObj.updateMedicalInfo); // to update medical information of traveller
router.get('/getApprovingManagerDetails',approvingManagerProfileObj.getApprovingManagerDetails); // to get traveller information
router.get('/getCountries',approvingManagerProfileObj.getCountries); // to get all Countries
router.post('/updatePassportDetails',approvingManagerProfileObj.updatePassportDetails); // update passport details
router.post('/updatePersonalDetails',approvingManagerProfileObj.updatePersonalDetails); // update personal details
router.post('/uploadProfilePic',approvingManagerProfileObj.uploadProfilePic); // upload profile pic for traveller
router.get('/getProofOfLifeQuestions',proofOfLifeObj.getProofOfLifeQuestions);
router.post('/checkPassword',approvingManagerProfileObj.checkPassword); // checkPassword
router.post('/changePassword',approvingManagerProfileObj.changePassword); // changePassword

module.exports = router;