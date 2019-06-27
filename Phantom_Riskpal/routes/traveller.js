var express = require('express');
var router = express.Router();

var travellerObj = require('./../modules/traveller/traveller.js');
var travellerProfileObj = require('./../modules/traveller_profile/travellerProfile.js');
var newsRaObj = require('./../modules/news_ra/newsRa.js');
var resourceLibObj = require('./../modules/resource_library/resource_library.js');
var proofOfLifeObj = require('./../modules/proof_of_life/proof_of_life.js');
var validationMiddleware = require('./../middleware/validation.js');
const { uploadFileOnS3 , attachBodyAndFiles, bucketFolderName, checkMultipleFileType}  = require('../helper/general.helper');
const authObj = require('./../helper/auth.helper');

router.post('/verifyOtp', travellerObj.verifyOtp); // admin login
router.get('/getAllCountry/:country_id',travellerObj.getAllCountry); // getAllCountry
router.post('/travellerRegister', travellerObj.travellerRegister); // to register traveller 
router.post('/travellerActiveAccount',travellerObj.travellerActiveAccount); // to traveller account activation
router.post('/travellerLogin',travellerObj.travellerLogin); // to traveller login
router.get('/checkLogin',travellerObj.checkLogin); // check login
router.get('/travellerLogout',travellerObj.travellerLogout); // traveller logout
router.post('/travellerForgetPass',travellerObj.travellerForgetPass); // traveller forget password
router.post('/travellerResetPass',travellerObj.travellerResetPass); // traveller reset password
router.post('/attach_supporting_docs',travellerObj.attach_supporting_docs); // to upload multiple supporting docs

router.post('/sms', validationMiddleware.validateEmail, travellerObj.sms);
router.post('/voice', validationMiddleware.validateEmail, travellerObj.voice);
router.post('/verify', validationMiddleware.validateEmail, travellerObj.verify);
router.post('/checkonetouchstatus', validationMiddleware.validateEmail, travellerObj.checkonetouchstatus); // ***
router.post('/onetouch', validationMiddleware.validateEmail, travellerObj.createonetouch);
router.post('/start',travellerObj.requestPhoneVerification);
router.post('/verify',travellerObj.verifyPhoneToken);






router.post('/updateMedicalInfo',travellerProfileObj.updateMedicalInfo); // to update medical information of traveller
router.get('/getTravellerDetails',travellerProfileObj.getTravellerDetails); // to get traveller information
router.get('/getCountries',travellerProfileObj.getCountries); // to get all Countries
router.post('/updatePassportDetails',travellerProfileObj.updatePassportDetails); // update passport details
router.post('/updatePersonalDetails',travellerProfileObj.updatePersonalDetails); // update personal details
router.post('/uploadProfilePic',travellerProfileObj.uploadProfilePic); // upload profile pic for traveller
router.post('/checkPassword',travellerProfileObj.checkPassword); // checkPassword
router.post('/changePassword',travellerProfileObj.changePassword); // changePassword

router.get('/getTimerSetting',newsRaObj.getTimerSetting); //  getTimerSetting
router.post('/setcron',newsRaObj.setcron); //  setcron
router.post('/updateCron',newsRaObj.updateCron)// updateCron
router.get('/getCountries',newsRaObj.getCountries); // get all countries
router.get('/getAllTravellers',newsRaObj.getAllTravellers); // get all traveller
router.get('/getAllApprovingManger',newsRaObj.getAllApprovingManger); // get all approving managers
router.post('/getDeptRelatedUsers',newsRaObj.getDeptRelatedUsers); // getusers list based on department
router.get('/getOthertraveller/:traveller_id',newsRaObj.getOthertraveller); // getusers list based on department

router.get('/getDeptRelatedUsersAprovingmanger/:types_of_ra_id', authObj.permission(
    [{parent: 'trackmanage', child: 'riskassessments'},
    {parent: 'mytravel', child: 'riskassessment'}]), newsRaObj.getDeptRelatedUsersAprovingmanger); // getusers list based on department

router.post('/addNewsRa', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), validationMiddleware.validateAddNewsRa, newsRaObj.addNewsRa); // to add news ra for a traveller
router.post('/getAllNewsRa', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getAllNewsRa); // to get all news ra for a particular traveller
router.get('/getCategories/:types_of_ra_id',newsRaObj.getCategories); // to get all categories
router.get('/getNewsRaDetails/:newsRa_id', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getNewsRaDetails); // to get news ra details
router.post('/updateNewsRa', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), validationMiddleware.validateAddNewsRa, newsRaObj.updateNewsRa); // to update news ra details
router.get('/deleteNewsRa/:newsRa_id',newsRaObj.deleteNewsRa); // to delete news ra
router.get('/getRasPreviewData/:newsRa_id',newsRaObj.getRasPreviewData); // to get ra preview data




router.post('/copyNewsRa',newsRaObj.copyNewsRa); // to copy news ra
router.post('/addNewsRaCommunication', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.addNewsRaCommunication); // to add news ra communication form
router.post('/updateNewsRaCommunication', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.updateNewsRaCommunication);
router.post('/updateNewsRaCommunicationApprovingManager',newsRaObj.updateNewsRaCommunicationApprovingManager);
router.get('/getCommunicationData/:newsRa_id/:types_of_ra_id', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getCommunicationData); // to get news ra communication data
router.post('/addNewsRaContingencies',newsRaObj.addNewsRaContingencies);// to add news ra contingencies data 
router.post('/updateNewsRaContingencies',newsRaObj.updateNewsRaContingencies);//to update news ra contingencies data 
router.post('/updateNewsRaContigencyApprovingManager',newsRaObj.updateNewsRaContigencyApprovingManager);//to update news ra contingencies data 
router.get('/getContingencyData/:newsRa_id/:types_of_ra_id', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getContingencyData); // to get news ra Contingency data
router.post('/addAnyOtherInfo', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), bucketFolderName('otherDetails'), attachBodyAndFiles, checkMultipleFileType, uploadFileOnS3, newsRaObj.addAnyOtherInfo); // to save any other relevant information with news ra
router.post('/generateGraph', travellerObj.generateGraph);
router.post('/addNewsRaSupplier',newsRaObj.addNewsRaSupplier); // to save supplier for news ra
router.post('/updateNewsRaSupplier', newsRaObj.updateNewsRaSupplier);
router.post('/updateNewsRaSupplierApprovingManager',newsRaObj.updateNewsRaSupplierApprovingManager);
router.post('/updateNewsRaApprovingManager',newsRaObj.updateNewsRaApprovingManager);
router.post('/removeDoc', bucketFolderName('otherDetails'), newsRaObj.removeDoc); // to remove doc

router.get('/getSupplierData/:newsRa_id',newsRaObj.getSupplierData); // to get supplier data
// router.get('/getAllCountries',newsRaObj.getAllCountries); // to get all countries
router.get('/getAllCurrencies',newsRaObj.getAllCurrencies); // to get all currencies
router.get('/getDepartmentList',newsRaObj.getDepartmentList); // to get all department added by client super admin
router.get('/getRaDetails/:raId',newsRaObj.getRaDetails); // to get type of ra details 

router.get('/GetCategoryQuestionnaire/:category_id',newsRaObj.getCategoryQuestionnaire); // to get questionnaire of a category
router.post('/addQuestionnaireRa',newsRaObj.addQuestionnaireRa); //To add specific mitigation by traveller at questionnaire of a particular category 
router.get('/getNewsRa/:newsRa_id/:category_id',newsRaObj.getNewsRa); //To get news ra details
router.post('/submitRAToManager', authObj.permission(
    {parent: 'mytravel', child: 'riskassessment'}
), validationMiddleware.validateSubmitRaToManager, newsRaObj.submitRAToManager); // To submit news ra to approving managers
router.post('/generatePDF', authObj.permission(
    {parent: 'trackmanage', child: 'riskassessments'}), newsRaObj.generatePDF); // To submit news ra to approving managers
router.get('/getNewsRaStatus/:newsRa_id',newsRaObj.getNewsRaStatus); // To check news ra submit status
router.get('/getAllTypeOfRa', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getAllTypeOfRa); //to get all types of ra
router.get('/getRaQuestions/:ra_id',newsRaObj.getRaQuestions); // to get questions of selected ra
router.post('/addQuestionToRa', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.addQuestionToRa); // to save specific mitigation 
router.post('/addQuestionToRaupdate',newsRaObj.addQuestionToRaupdate); // to save specific mitigation 
router.post('/insertquestiontora',newsRaObj.insertquestiontora); // to save specific mitigation 

router.get('/getRaAnswers/:newsRa_id/:types_of_ra_id', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getRaAnswers); // to get specific mitigation of questions filled by traveller 
router.get('/getSupplierDetailsOfRa/:newsRa_id/:types_of_ra_id',newsRaObj.getSupplierDetailsOfRa); // to get supplier details of particular ra before submit
router.get('/getSupplierDetailsOfRaLocalContact/:newsRa_id/:types_of_ra_id',newsRaObj.getSupplierDetailsOfRaLocalContact); // to get supplier details of particular ra before submit
router.get('/getSupplierDetailsOfRaLocalDriver/:newsRa_id/:types_of_ra_id',newsRaObj.getSupplierDetailsOfRaLocalDriver); // to get supplier details of particular ra before submit
router.get('/getSupplierDetailsOfRaAccomadation/:newsRa_id/:types_of_ra_id',newsRaObj.getSupplierDetailsOfRaAccomadation); // to get supplier details of particular ra before submit
router.get('/getSupplierDetailsOfRaOther/:newsRa_id/:types_of_ra_id', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getSupplierDetailsOfRaOther); // to get supplier details of particular ra before submit
router.get('/deleteOthersuppliers/:user_id',newsRaObj.deleteOthersuppliers); // to get supplier details of particular ra before submit

router.post('/getSupplierRaData',newsRaObj.getSupplierRaData);//Shubham
router.post('/getRaCommunicationData', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getRaCommunicationData);
router.post('/getRaContingencyData', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), newsRaObj.getRaContingencyData);
router.post('/insertToRa',newsRaObj.insertToRa);


router.post('/getResourceLibForTraveller',resourceLibObj.getResourceLibForTraveller); // to get all resource library for traveller
router.get('/getResourceLibDetails/:resource_library_id',resourceLibObj.getResourceLibDetails); // to get resource library details

router.get('/getProofOfLifeQuestions',proofOfLifeObj.getProofOfLifeQuestions);

// supplier
router.get('/getAllCountries',travellerObj.getAllCountries); // to get all countries
router.get('/getAllCurrencies',travellerObj.getAllCurrencies); // to get all currencies
router.post('/uploadAttachment',travellerObj.uploadAttachment); // upload attachment
router.post('/addSupplier',travellerObj.addSupplier); // to add supplier
router.post('/getAllSupplier',travellerObj.getAllSupplier); // to get all supplier
router.get('/deleteSupplier/:supplier_id',travellerObj.deleteSupplier); // to delete supplier
router.get('/getSupplierDetails/:supplier_id',travellerObj.getSupplierDetails); // to get details of supplier
router.post('/updateSupplier',travellerObj.updateSupplier); // to update supplier details


// country page
router.get('/getCountryList',travellerObj.getCountryList); // *** to get all countries
router.get('/getCategoriesList',travellerObj.getCategoriesList); // to get all categories
router.post('/getCountryThreatMatrix',travellerObj.getCountryThreatMatrix); // to gete threat matrix of country

var matrix = require('../helper/country-matrix.helper');
router.get('/getCountryThreatMatrixCron', matrix.getCountryThreatMatrixCron); // to gete threat matrix of country

// report section
router.get('/getCountriesVisited',travellerObj.getCountriesVisited); // To get how many times country visited by traveller.
router.get('/getTripsByYear', travellerObj.getTripsByYear); // To get yearly trips of a traveller
router.get('/getTripsByMonth', travellerObj.getTripsByMonth); //To get monthly trips of a traveller
router.get('/getTodaysTrips', travellerObj.getTodaysTrips); // To get todays trips of a traveller
router.get('/getNoOfTrips',travellerObj.getNoOfTrips); // To get country visited by traveller with red amber green rating.
router.get('/downloadCountriesVisitedReport',travellerObj.downloadCountriesVisitedReport); // to get download countries visited by traveller report
router.get('/downloadNoOfTripsReport',travellerObj.downloadNoOfTripsReport); // to get download number of trips done by traveller under red amber and green zone.
router.get('/downloadTripsReport',travellerObj.downloadTripsReport); // to get download trip report of traveller on yearly monthly weekly and daily basis


module.exports = router;
