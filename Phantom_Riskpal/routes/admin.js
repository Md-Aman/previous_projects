var express = require('express');
var router = express.Router();
const authObj = require('./../helper/auth.helper');

var CatObj = require('./../modules/category/category.js'); // category controller
var adminObj = require('./../modules/login/login.js'); // login controller
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
var validationMiddleware = require('./../middleware/validation.js');
const { uploadFileOnS3 , attachBodyAndFiles, bucketFolderName, checkSingleFileType}  = require('../helper/general.helper');

router.post('/sms',adminObj.sms);
router.post('/voice',adminObj.voice);
router.post('/verify',adminObj.verify);
router.post('/checkonetouchstatus',adminObj.checkonetouchstatus);
router.post('/onetouch',adminObj.createonetouch);
router.post('/start',adminObj.requestPhoneVerification);
router.post('/verify',adminObj.verifyPhoneToken);


router.post('/category/create', CatObj.createCategory); // add category 
router.post('/category/list', CatObj.listCategory); // list category
router.post('/category/addQuestionnaire', CatObj.addQuestionnaire); // add questionnaire
router.get('/category/deleteCategory/:category_id', CatObj.deleteCategory); // delete category
router.get('/category/getCategoryDetails/:category_id', CatObj.getCategoryDetails); // get category details 
router.post('/category/updateCategory', CatObj.updateCategory); // update category
router.post('/category/changeCategoryStatus', CatObj.changeCategoryStatus); // change category status 
router.post('/category/getAllQuestionnaire', CatObj.getAllQuestionnaire); // get all questionnaires of selected category
router.get('/category/deleteQuestionnair/:questionnaire_id', CatObj.deleteQuestionnair); // delete questionnair
router.get('/category/getQuestionnairDetail/:questionnaire_id', CatObj.getQuestionnairDetail);
router.get('/category/getQuestionDetail/:questionnaire_id', CatObj.getQuestionDetail);

router.post('/category/updateQuestionnaire', CatObj.updateQuestionnaire); // update questionnaire
router.post('/category/changeQuestionnaireStatus', CatObj.changeQuestionnaireStatus); // change questionnaire status
router.post('/category/changeOrderOfQuestion', CatObj.changeOrderOfQuestion); // change order of questionnaires

router.get('/category/getCountries', CatObj.getCountries); // get Countries
router.post('/category/markAsMandatory', CatObj.markAsMandatory); //to mark Mandatory category for traveller
router.post('/category/riskAssociated', CatObj.riskAssociated); //to mark risk associated to country or not 
router.post('/category/addRiskAssociatedCategory', CatObj.addRiskAssociatedCategory); // to add risk associated category
router.post('/category/listRiskAssociatedCategories', CatObj.listRiskAssociatedCategories); // to list risk associated category
router.get('/category/deleteRiskAssociatedCategory/:risk_associated_category_id', CatObj.deleteRiskAssociatedCategory); // to delete risk associated category
router.get('/category/getRiskAssociatedCategoryDetails/:risk_associated_category_id', CatObj.getRiskAssociatedCategoryDetails); // to get risk associated category details
router.post('/category/updateRiskAssociatedCategory', CatObj.updateRiskAssociatedCategory); // update risk associated category
router.post('/category/changeRiskCategoryStatus', CatObj.changeRiskCategoryStatus); // change risk associated category status
router.get('/category/getCategories', CatObj.getCategories); // get all categories


router.post('/adminLogin', adminObj.adminLogin); // admin login
router.get('/checkLogin', adminObj.checkLogin); // check login
router.get('/adminLogout', adminObj.adminLogout); // admin logout
router.post('/adminRegister', adminObj.adminRegister); // admin registration
router.post('/adminActiveAccount', adminObj.adminActiveAccount); //active admin account
router.post('/adminForgetPass', adminObj.adminForgetPass); //for send forget password link to admin
router.post('/verifyOtp', adminObj.verifyOtp); // admin login
router.post('/adminResetPass', adminObj.adminResetPass); // for reset password

router.post('/user/getAllcoAdmins', userObj.getAllcoAdmins); // list user
router.post('/user/addTraveller', userObj.addTraveller) // add user
router.post('/user/addCoAdmin', userObj.addCoAdmin); // add co-admin
router.get('/user/deleteUser/:userId', userObj.deleteUser); // delete user

router.get('/user/deleteBasciAmin/:userId', userObj.deleteBasciAmin); // delete user


router.post('/user/changeUserStatus', userObj.changeUserStatus); // change user status
router.get('/user/getUserDetails/:userId', userObj.getUserDetails); // delete user

router.post('/user/changeBasciAdminStatus', userObj.changeBasciAdminStatus); // change user status
router.get('/user/getBasicAdminDetails/:userId', userObj.getBasicAdminDetails); // delete user

router.post('/user/updateCoAdmin', userObj.updateCoAdmin); // update co-admin details
router.post('/user/updateTraveller', userObj.updateTraveller); // update traveller details
router.post('/user/getAlltravellers', userObj.getAlltravellers); // list traveller


// for basic admin
router.post('/getTravellerList', userObj.getTravellerList); // to get all traveller list for basic admin
router.get('/getAllCountryList', userObj.getAllCountryList); // to get all country list
router.get('/getTravellerData/:traveller_id', userObj.getTravellerData); // to get traveller data
router.get('/getProofOfLifeQue', userObj.getProofOfLifeQue); // to get proof of questions 
router.post('/updateTravellerDetails', userObj.updateTravellerDetails); // to update traveller profile
router.post('/getAllRa', userObj.getAllRa); // to get all types of ra
router.post('/getAllRaOfThisType', userObj.getAllRaOfThisType); // to get all RAs of traveller for particular type of ra
router.get('/getTravellers/:traveller_id', userObj.getTravellers); // to get travellers
router.get('/getApprovingMangers', userObj.getApprovingMangers); // to get all approving manager
router.post('/addNewsRa', userObj.addNewsRa); // to add ra by basic admin
router.get('/getRaDetails/:ra_id', userObj.getRaDetails); // to get ra details 
router.post('/updateNewsRa', userObj.updateNewsRa); // to update ra details 
router.get('/getAllCategoryList/:type_of_ra_id', userObj.getAllCategoryList); // to get all categories for type of ra
router.get('/getRaStatus/:ra_id', userObj.getRaStatus); // to get ra status
router.get('/getRaAns/:types_of_ra_id/:newsRa_id', userObj.getRaAns); // to get ra's category questions answers
router.get('/getCategoryQuestions/:types_of_ra_id', userObj.getCategoryQuestions); // to get questions of category
router.post('/addquestionDataRa', userObj.addquestionDataRa); // to add answers of category questions
router.get('/getAllCurrencies', userObj.getAllCurrencies); // to get all currenices
router.post('/addRaSupplier', userObj.addRaSupplier); // to add supplier for news ra by basic admin on behalf of traveller
router.get('/getSupplierData/:ra_id/:traveller_id', userObj.getSupplierData); // to get supplier details
router.post('/addNewsRaCommunication', userObj.addNewsRaCommunication); // to add communication for ra by basic admin on behalf of traveller
router.get('/getCommunicationData/:ra_id/:traveller_id', userObj.getCommunicationData); // to get communication data
router.post('/addNewsRaContingencies', userObj.addNewsRaContingencies); // to add contingency data
router.get('/getContingencyData/:ra_id/:traveller_id', userObj.getContingencyData); // to get contingency data
router.post('/addAnyOtherInfo', userObj.addAnyOtherInfo); // to add other info of ra
router.get('/getNewsRaDetails/:newsRa_id', userObj.getNewsRaDetails); // to get other info of ra
router.get('/submitRAToManager/:newsRa_id/:types_of_ra_id/:traveller_id', userObj.submitRAToManager); // To submit news ra to approving managers
router.get('/getDepartments', userObj.getDepartments); // to get department list
router.get('/getTypesOfRaDetails/:type_of_ra_id',userObj.getTypesOfRaDetails); // to get types of ra details 


router.get('/getCountryList',countryObj.getCountryList); // to get all countries
router.get('/country/getAllCountries', countryObj.getAllCountries); //get all country list
router.post('/country/saveCountrySpecificInfo', countryObj.saveCountrySpecificInfo); //save country Specific Info
router.post('/country/saveCountryColor', countryObj.saveCountryColor); // save country color
router.get('/country/getAllCategories', countryObj.getAllCategories); // get all category
router.post('/country/saveCountryThreatMatrix', countryObj.saveCountryThreatMatrix); // save country threat matrix
router.get('/country/getCountriesForThreatMatrix', countryObj.getCountriesForThreatMatrix); // to get country threat matrix
// router.post('/addInformation', countryObj.addInformation); //save country Specific Info

router.post('/supplier/addSupplier', authObj.permission([
    {parent: 'managesystem', child: 'csuppliers'},
    {parent: 'mytravel', child: 'suppliers'}]), bucketFolderName('supplier'), attachBodyAndFiles, checkSingleFileType, validationMiddleware.validateAddSupplier, uploadFileOnS3, supplierObj.addSupplier); // add supplier
router.put('/supplier/assignSupplierToRa', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateAssignSupplier,supplierObj.assignSupplierToRa); // assign ra template to supplier
router.put('/supplier/assignSupplierToRiskAssessment', authObj.permission([
    {parent: 'mytravel', child: 'riskassessment'},
    {parent: 'trackmanage', child: 'riskassessments'}
]), validationMiddleware.validateAssignSupplier,supplierObj.assignSupplierToRiskAssessment);
router.post('/supplier/uploadAttachment', supplierObj.uploadAttachment); // upload attachment
router.post('/supplier/getAllSupplier', authObj.permission([
    {parent: 'managesystem', child: 'csuppliers'},
    {parent: 'mytravel', child: 'suppliers'}]), supplierObj.getAllSupplier); // get all supplier
router.get('/supplier/getSupplierDetails/:supplier_id', authObj.permission([
    {parent: 'managesystem', child: 'csuppliers'},
    {parent: 'mytravel', child: 'suppliers'}]), supplierObj.getSupplierDetails); // get supplier details
router.post('/supplier/updateSupplier', authObj.permission([
    {parent: 'managesystem', child: 'csuppliers'},
    {parent: 'mytravel', child: 'suppliers'}]), bucketFolderName('supplier'), attachBodyAndFiles, checkSingleFileType, validationMiddleware.validateUpdateSupplier, uploadFileOnS3, supplierObj.updateSupplier); // update supplier
router.post('/supplier/changeSupplierStatus', validationMiddleware.validateStatus, supplierObj.changeSupplierStatus); // change supplier status 
router.get('/supplier/deleteSupplier/:supplier_id', authObj.permission([
    {parent: 'managesystem', child: 'csuppliers'},
    {parent: 'mytravel', child: 'suppliers'}]), validationMiddleware.validateDeleteSupplier, supplierObj.deleteSupplier); // delete supplier
router.get('/getAllCurrencies', supplierObj.getAllCurrencies); // get all currenices

router.post('/approving_manager/addApprovingManager', approvingManagerObj.addApprovingManager); // add approving manager
router.post('/approving_manager/listApprovingManager', approvingManagerObj.listApprovingManager); // list approving manager
router.post('/approving_manager/changeApprovingManagerStatus', approvingManagerObj.changeApprovingManagerStatus); // change approving manager status
router.get('/approving_manager/deleteApprovingManager/:approving_manager_id', approvingManagerObj.deleteApprovingManager); //delete approving manager
router.get('/approving_manager/getApprovalManagerDetails/:approving_manager_id', approvingManagerObj.getApprovalManagerDetails); // get details of approving manager
router.post('/approving_manager/updateApprovingManager', approvingManagerObj.updateApprovingManager); // update approving manager
router.get('/approving_manager/getDepartmentList', approvingManagerObj.getDepartmentList); // to get all department list


router.post('/uploadResourceLibDoc', resourceLibObj.uploadResourceLibDoc); // upload resource lib documents
router.post('/saveResourceLib', resourceLibObj.saveResourceLib); // to save resource library
router.post('/getAllResourceLibrary', resourceLibObj.getAllResourceLibrary); // to get all resource library
router.get('/deleteResourceLib/:resource_library_id', resourceLibObj.deleteResourceLib); // to delete resource library
router.post('/changeResourceLibStatus', resourceLibObj.changeResourceLibStatus); // to change res library status
router.post('/uploadCategoryImage', resourceLibObj.uploadCategoryImage); // to upload image
router.get('/getResourceLibData/:resource_library_id', resourceLibObj.getResourceLibData); // to get resource lib data
router.post('/updateResourceLib', resourceLibObj.updateResourceLib); // to update resource library
router.post('/removeDoc', resourceLibObj.removeDoc); // to remove doc
router.post('/getAllLogs', logObj.getAllLogs); // to get all logs


router.post('/getAllMedicalInfoRequest', medicalObj.getAllMedicalInfoRequest); // to get all medical information requests
router.post('/approveMedicalInfo', medicalObj.approveMedicalInfo); // to approve medical information request
router.post('/rejectMedicalInfo', medicalObj.rejectMedicalInfo); // to reject medical information request

router.post('/saveProofOfLife', proofOfLifeObj.saveProofOfLife); // save proof of life
router.post('/getAllProofOfLife', proofOfLifeObj.getAllProofOfLife); // get proof of life
router.post('/changeProofOfLifeStatus', proofOfLifeObj.changeProofOfLifeStatus); // to change proof of life question status
router.get('/deleteProofOfLife/:proof_life_id', proofOfLifeObj.deleteProofOfLife); // to delete proof of life question
router.get('/getProofOfData/:proof_life_id', proofOfLifeObj.getProofOfData); // to get details of proof of life
router.post('/updateProofOfLife', proofOfLifeObj.updateProofOfLife); // to update proof of life details 


// department

router.get('/getAllApprovingManagers', departmentObj.getAllApprovingManagers); // to get all approving manager
router.get('/getBasicAdminforDepartment', departmentObj.getBasicAdminforDepartment); // to get all BasicAdmin for Department
router.get('/getTravellersForDepartment', departmentObj.getTravellersForDepartment); // to get all Travellers For Department
router.post('/saveDepartment', departmentObj.saveDepartment); // to save department 
router.post('/getAllDepartment', departmentObj.getAllDepartment); // to get all department
router.get('/deleteDepartment/:department_id', departmentObj.deleteDepartment); // to delete department
router.post('/changeDepartmentStatus', departmentObj.changeDepartmentStatus); // to change department status
router.get("/getDepartmentDetail/:department_id", departmentObj.getDepartmentDetail); // to get department details
router.post('/updateDepartment', validationMiddleware.validateDepartment, departmentObj.updateDepartment); // to update department

// Email Template
router.post('/emailTemplate', authObj.permission('super_admin'), emailTemplateObj.getAllEmailTemplate); // to get all Email Template
router.get("/emailTemplate/:email_template_id", authObj.permission('super_admin'), emailTemplateObj.getEmailTemplateDetail); // to get Email Template details
router.put('/emailTemplate', authObj.permission('super_admin'), emailTemplateObj.updateEmailTemplate); // to update Email Template
router.post('/emailTemplate/save', authObj.permission('super_admin'), emailTemplateObj.saveEmailTemplate); // to save Email Template

// reports section
// trips 
router.get('/getTripsByDate', reportObj.getTripsByDate); // to get no of trips by year to genrate report
router.get('/getTripsByMonth', reportObj.getTripsByMonth); // to get no of trips by month to genrate report
router.get('/getWeeklyTrips', reportObj.getWeeklyTrips); // to get no of trips by week to genrate report
router.get('/getTodaysTrips', reportObj.getTodaysTrips); // to get no of trips of todays to genrate report
router.get('/getTripsByCountry', reportObj.getTripsByCountry); // to get no of trips by country
router.get('/getCountryRiskReport', reportObj.getCountryRiskReport); // to get no of trips based on country risk levels
router.get('/downloadTripsByCountryReport', reportObj.downloadTripsByCountryReport); // to get download report of trips by Countries 
router.get('/downloadCountryRiskReport', reportObj.downloadCountryRiskReport); // to get download report of trips by country risk levels
router.get('/downloadTripsReport', reportObj.downloadTripsReport); // to get download report of traveller trips by yearly monthly weekly and daily. 
router.get('/getTripsByDepartment', reportObj.getTripsByDepartment); // to create trip report for client super admin by department 


// suppliers
router.get('/getSupplierByCountries', reportObj.getSupplierByCountries); // to get supplier by countries
router.get('/getSupplierByCost', reportObj.getSupplierByCost); // to get supplier by cost
router.get('/getSupplierByRating', reportObj.getSupplierByRating); // to get supplier by rating
router.get('/downloadSupplierCostReport', reportObj.downloadSupplierCostReport); // to download supplier list by cost
router.get('/downloadSupplierRatingReport', reportObj.downloadSupplierRatingReport); // to download supplier list by rating red amber green
router.get('/downloadSupplierCountryReport', reportObj.downloadSupplierCountryReport); // to download supplier list by countries


// track and manager
router.get('/getAllCountry', trackManageObj.getAllCountry); // to get all country list
router.get('/getCurrentTravellerBarData', trackManageObj.getCurrentTravellerBarData); // to get current travellers to genrate bar chart
router.get('/getCurrentTravellerMapData', trackManageObj.getCurrentTravellerMapData); // to get current travellers locations to show in map
router.get('/getFutureTravellerBarData', trackManageObj.getFutureTravellerBarData); //  to get future travellers to generate bar chart
router.get('/getFutureTravellerMapData', trackManageObj.getFutureTravellerMapData); // to get future travellers locations to show in map 
router.post('/getSelectedCountryTraveller', trackManageObj.getSelectedCountryTraveller); // to get all current travellers of selected country
router.post('/sendMailToAllTraveller', trackManageObj.sendMailToAllTraveller); // to send mail to all travellers
router.post('/getSelectedCountryFutureTraveller',trackManageObj.getSelectedCountryFutureTraveller); // to get all future travellers of selected country
router.post('/getSelectedCountryallTraveller', trackManageObj.getSelectedCountryallTraveller); // to get all travellers of selected country
router.get('/getAllTravellerList', trackManageObj.getAllTravellerList); // to get all traveller list
router.get('/getRiskAssessmentList',trackManageObj.getRiskAssessmentList); // to get all risk assessments 
router.get('/getManagers',trackManageObj.getManagers); // to get all manager list
router.post('/createSituationLog',trackManageObj.createSituationLog); // to save situation log
router.post('/getAllSituationLog',trackManageObj.getAllSituationLog); // to get all situation logs
router.get('/getDepartment', trackManageObj.getDepartment); // to get all department
router.post('/createIncidentReport',trackManageObj.createIncidentReport); // to create incident report
router.post('/getAllIncidentReport', trackManageObj.getAllIncidentReport); // to get list of incident report
router.post('/createSituationReport', trackManageObj.createSituationReport); // to create situation report
router.post('/getAllSituationReport',trackManageObj.getAllSituationReport); // to get all situation reports
router.post('/attachment_supporting_docs',trackManageObj.attachment_supporting_docs); // to upload multiple supporting docs with situation report
router.post('/getCountryTraveller',trackManageObj.getCountryTraveller); // to get traveller list (current, future, all)
router.post('/getAllCountryAllTraveller',trackManageObj.getAllCountryAllTraveller); // to get all travellers of all countries
router.get('/getRiskAssessmentDetails/:ra_id',trackManageObj.getRiskAssessmentDetails); // to get ra details 
router.post('/getAllSentMail',trackManageObj.getAllSentMail); // to list sent mail 
router.get('/getEmailDetails/:mail_id',trackManageObj.getEmailDetails); // to get email details


// risk assessments
router.post('/importCSV', riskAssessmentObj.importCSV); //  import traveller csv file  
router.post('/importApprovingmanager', approvingManagerObj.importApprovingmanager); //  import approving manager file
router.post('/getAllRiskAssessment', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), riskAssessmentObj.getAllRiskAssessment); // to get all risk assessments created by client super admin 
router.get('/getCountryListForRa', riskAssessmentObj.getCountryListForRa); // to get all country list
router.get('/getAllDepartmentOfClient', riskAssessmentObj.getAllDepartmentOfClient); // to get all department list of client super admin
router.post('/createIndividualRa', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateIndividualRA, riskAssessmentObj.createIndividualRa); // to create ra by client super admin
router.post('/updateIndividualRa', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateIndividualRA, riskAssessmentObj.updateIndividualRa); // to update ra by client super admin
router.post('/getAllQuestionnaireForRa', riskAssessmentObj.getAllQuestionnaireForRa); // to get all questions
router.get('/getRaPreviewData/:ra_id',riskAssessmentObj.getRaPreviewData); // to get ra preview data
router.post('/assignQuesToRa', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateAssignQuestionsToRa, riskAssessmentObj.assignQuesToRa); // to assign questions to ra
router.get('/getRaDetailsCreatedByClient/:ra_id', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateSubmitRaTemplate, riskAssessmentObj.getRaDetailsCreatedByClient); // to get ra details
router.get('/submitRaCreatedByClient/:ra_id', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateSubmitRaTemplate, riskAssessmentObj.submitRaCreatedByClient); // to submit ra created by client super admin
router.get('/getCategoriesForQue', riskAssessmentObj.getCategoriesForQue); // to get categories
router.post('/addQuestionByClient', validationMiddleware.validateQuestion, riskAssessmentObj.addQuestionByClient); // to add question
router.post('/addCategoryByClient', riskAssessmentObj.addCategoryByClient); // to add category
router.post('/changeStatus', validationMiddleware.validateStatus, riskAssessmentObj.changeStatus); // to change status of ra
router.get('/deleteRa/:ra_id', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateSubmitRaTemplate, riskAssessmentObj.deleteRa); // to delete ra
router.get('/getRaToView/:ra_id', validationMiddleware.validateSubmitRaTemplate, riskAssessmentObj.getRaToView); // to view ra details with assign questions
router.post('/getAllRiskLabels', validationMiddleware.validateRiskLabels, riskAssessmentObj.getAllRiskLabels); // to get all risk labels
router.post('/getAllRiskQuestionnaire',riskAssessmentObj.getAllRiskQuestionnaire); // to get all questions of selected ra
router.get('/getRiskQueDetail/:que_id',riskAssessmentObj.getRiskQueDetail); // to get question details
router.post('/getAllSubmittedRiskAssessment',riskAssessmentObj.getAllSubmittedRiskAssessment); // to get all submitted ra
router.post('/getAllRejectedRiskAssessment',riskAssessmentObj.getAllRejectedRiskAssessment); // to get all submitted ra
router.get('/getRadetailsForAdmin/:ra_id', validationMiddleware.validateSubmitRaTemplate, riskAssessmentObj.getRadetailsForAdmin); // to get ra details for admin
router.get('/getCurrencyList', riskAssessmentObj.getCurrencyList); // to get currenices
router.post('/addRaSupplierByClientAdmin',  riskAssessmentObj.addRaSupplierByClientAdmin); // to save supplier
router.post('/updateRaSupplierByClientAdmin',  riskAssessmentObj.updateRaSupplierByClientAdmin); // to update supplier
router.get('/getRaSupplierData/:supplier_id', validationMiddleware.validateGetSupplier, riskAssessmentObj.getRaSupplierData); // to get supplier details
router.post('/addRaCommunicationByClientAdmin',  authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), riskAssessmentObj.addRaCommunicationByClientAdmin); // to add communication 
router.post('/updateRaCommunicationByClientAdmin', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), riskAssessmentObj.updateRaCommunicationByClientAdmin); // to update communication
router.get('/getRaCommunicationData/:communication_id', riskAssessmentObj.getRaCommunicationData); // to get communication details
router.post('/addRaContingencyByClientAdmin', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateRaCommunicationByClientAdmin, riskAssessmentObj.addRaContingencyByClientAdmin); // to add contingency data
router.post('/updateRaContingencyByClientAdmin', authObj.permission({parent: 'managesystem', child: 'riskassessmenttemplates'}), validationMiddleware.validateRaCommunicationByClientAdmin, riskAssessmentObj.updateRaContingencyByClientAdmin); // to update contingency data
router.get('/getContingencyData/:contingency_id', riskAssessmentObj.getContingencyData); // to get contingency data
router.get('/getCountryThreatMatrix/:country_id', riskAssessmentObj.getCountryThreatMatrix); // to get getCountryThreatMatrix
router.get('/getCategoriesList', riskAssessmentObj.getCategoriesList); // to get contingency data
router.get('/getAllCountry/:country_id', riskAssessmentObj.getAllCountry); // to get contingency data
router.get('/getSupplierForCountry/:country_id', riskAssessmentObj.getSupplierForCountry); // to get contingency data
router.get('/getSupplierForCountry/:country_id', riskAssessmentObj.getSupplierForCountry); // to get contingency data
router.post('/getAllRiskAssessmentByMA', riskAssessmentObj.getAllRiskAssessmentByMA); // to get all risk assessments created by  super admin 



router.post('/updateMedicalInfo',adminProfileObj.updateMedicalInfo); // to update medical information of admin
router.get('/getAdminDetails',adminProfileObj.getAdminDetails); // to get traveller information
router.get('/getCountries',adminProfileObj.getCountries); // to get all Countries
router.post('/updatePassportDetails',adminProfileObj.updatePassportDetails); // update passport details
router.post('/updatePersonalDetails',adminProfileObj.updatePersonalDetails); // update personal details
router.post('/uploadProfilePic',adminProfileObj.uploadProfilePic); // upload profile pic for admin
router.get('/getProofOfLifeQuestions', proofOfLifeObj.getProofOfLifeQuestions);
router.post('/checkPassword',adminProfileObj.checkPassword); // checkPassword
router.post('/changePassword',adminProfileObj.changePassword); // changePassword

module.exports = router;
