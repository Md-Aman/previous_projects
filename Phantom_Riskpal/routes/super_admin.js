var express = require('express');
var router = express.Router();
var superAdminObj = require('./../modules/super_admin/super_admin.js');
var newsAgencyObj = require('./../modules/news_agencies/news_agencies.js');
var businessTravelRaObj = require('./../modules/business_travel_ra/business_travel_ra.js');
var typeOfRaObj = require('./../modules/type_of_ra/type_of_ra.js');
var sectorObj = require('./../modules/sector/sector.js');
var superadminprofileObj = require('./../modules/masteradmin_profile/masteradmin_profile.js');
var userGroupobj = require('./../modules/usergroup/usergroup.js');
var userObj =require('./../modules/user/user.js');
var departmentObj =require('./../modules/department/department.js');
var validationMiddleware = require('./../middleware/validation.js');
const { uploadFileOnS3 , attachBodyAndFiles, bucketFolderName, checkSingleFileType }  = require('../helper/general.helper');
const authObj = require('./../helper/auth.helper');
// app.use("*", upload.none());
router.get('/healthCheck', function (req, res) {
    res.status(200).json({status: true, message: 'Router is healthy'});
});
router.post('/superAdminLogin', validationMiddleware.validateUrlParams, superAdminObj.superAdminLogin); // ***
router.get('/checkLogin', superAdminObj.checkLogin); // check login
router.get('/superAdminLogout', superAdminObj.superAdminLogout); // super admin logout
router.post('/superAdminForgetPass', validationMiddleware.validateEmail, superAdminObj.superAdminForgetPass); // *** to send forget password link on email to super admin
router.post('/superAdminResetPass', superAdminObj.superAdminResetPass); // *** to reset password
router.post('/userActivate', superAdminObj.userActivate); // to reset password
router.post('/reSendUserActivationEmail', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userObj.reSendUserActivationEmail); // to re send activation email to user
router.post('/deactivateUser', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userObj.deactivateUser);
router.post('/checkUserstatus', superAdminObj.checkUserstatus); // to check user verified already 

router.get('/getAllCountries', newsAgencyObj.getAllCountries); // to get all country list\
router.post('/saveNewRPstaff', authObj.permission('super_admin'), validationMiddleware.validateRPstaff, newsAgencyObj.saveNewRPstaff); // to create new RPstaff
router.post('/getAllRPstaff', authObj.permission('super_admin'), newsAgencyObj.getAllRPstaff); // to create new RPstaff
router.get('/deleteRpstaff/:news_agency_id', authObj.permission('super_admin'), newsAgencyObj.deleteRpstaff); // to deleteRpstaff

router.post('/saveNewClient', authObj.permission('super_admin'), validationMiddleware.validateSaveClient, newsAgencyObj.saveNewClient); // *** to create news agency
router.post('/getAllNewsAgencies', authObj.permission('super_admin'), newsAgencyObj.getAllNewsAgencies); // ** to get all news agency
router.get('/deleteNewsAgency/:news_agency_id', authObj.permission('super_admin'), validationMiddleware.validateDeleteClient, newsAgencyObj.deleteNewsAgency); // ** to delete news agency
router.get('/getNewsAgencyDetails/:news_agency_id', authObj.permission('super_admin'), newsAgencyObj.getNewsAgencyDetails); // ** to get news agency details
router.post('/updateNewsAgency', authObj.permission('super_admin'), validationMiddleware.validateSaveClient, newsAgencyObj.updateNewsAgency); // *** to update news agency

router.post('/changeNewsAgencyStatus', newsAgencyObj.changeNewsAgencyStatus); // to change news agency
router.post('/changeStatusrpsatff', newsAgencyObj.changeStatusrpsatff); // to change rpstaff


router.get('/countryRiskLevel/:news_agency_id', newsAgencyObj.countryRiskLevel); // to get risk level of country 
router.post('/saveCountrySpecificInfo', newsAgencyObj.saveCountrySpecificInfo); //to save country specific info for particular news agency by super admin
router.post('/saveCountryColor', newsAgencyObj.saveCountryColor); //to save country color for particular news agency by super admin 
router.get('/countryRiskLevelForAllAgencies', newsAgencyObj.countryRiskLevelForAllAgencies); // to get risk level for all news agencies 
router.post('/saveCountryColorForAllNewsAgency', newsAgencyObj.saveCountryColorForAllNewsAgency); // to save color code of country for all news agencies
router.post('/countrySpecificInfoForAllAgency', newsAgencyObj.countrySpecificInfoForAllAgency); // to save country specific information for all agency
router.get('/getAllSectors', newsAgencyObj.getAllSectors); // *** to get all sector
router.post('/getDepartmentList',newsAgencyObj.getDepartmentList); // to get all DepartmentList
router.post('/addInformation', superAdminObj.addInformation); //save country Specific Info
router.post('/getMasterAdminDetails', superadminprofileObj.getMasterAdminDetails); //to get Master Admin Details
router.post('/updateAdminDetails',bucketFolderName('profile'), attachBodyAndFiles, uploadFileOnS3, superadminprofileObj.updateAdminDetails); //Update Admin Details
router.post('/checkPassword',superadminprofileObj.checkPassword); // checkPassword
router.post('/changePassword',superadminprofileObj.changePassword); // changePassword
router.post('/loginAsClient',newsAgencyObj.loginAsClient); // changePassword


// category section
router.post('/getAllCategories', authObj.permission({parent: 'managesystem', child: 'risklabels'}), superAdminObj.getAllCategories); // to get all categories for super admin
router.get('/deleteCategory/:category_id', authObj.permission({parent: 'managesystem', child: 'risklabels'}), superAdminObj.deleteCategory); // to delete category
router.post('/changeCategoryStatus', superAdminObj.changeCategoryStatus); // to change category status
router.get('/getCountries', superAdminObj.getCountries); // to get all countries
router.get('/getLanguages', superAdminObj.getLanguages); // to get all countries
router.post('/addCategory', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateCategory, superAdminObj.addCategory); // to add category
router.get('/getCategoryDetails/:category_id', authObj.permission({parent: 'managesystem', child: 'risklabels'}), superAdminObj.getCategoryDetails); // to get category details
router.post('/updateCategory', authObj.permission({parent: 'managesystem', child: 'risklabels'}),  validationMiddleware.validateCategory, superAdminObj.updateCategory); // to update category
router.get('/getTypesOfRa',superAdminObj.getTypesOfRa); // to get all types of ra


// risk associated categories
router.post('/getAllRiskAssociatedCategories', superAdminObj.getAllRiskAssociatedCategories); // to get all risk associated categories
router.get('/deleteRiskAssociatedCategory/:risk_associated_category_id',superAdminObj.deleteRiskAssociatedCategory); // to delete risk associated categories
router.post('/changeRiskCategoryStatus', superAdminObj.changeRiskCategoryStatus); // to change risk associated categories status
router.post('/addRiskAssociatedCategory', superAdminObj.addRiskAssociatedCategory); // to add risk associated categories
router.get('/getRiskAssociatedCategoryDetails/:risk_associated_category_id',superAdminObj.getRiskAssociatedCategoryDetails); // to get risk associated category details
router.post('/updateRiskAssociatedCategory',superAdminObj.updateRiskAssociatedCategory); // to update risk associated category
router.post('/markAsMandatory',superAdminObj.markAsMandatory); // to mark category as mandatory and not mandatory
router.get('/getClientCount', superAdminObj.getClientCount); // to get client count for super admin dashboard


// questionnaire
router.post('/addQuestionnaire', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateQuestion, superAdminObj.addQuestionnaire); // add questionnaire
router.post('/getAllQuestionnaire', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateGetQuestion, superAdminObj.getAllQuestionnaire); // get all questionnaires of selected category
router.get('/deleteQuestionnair/:questionnaire_id', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateDeleteQuestion, superAdminObj.deleteQuestionnair); // delete questionnair
router.get('/getQuestionnairDetail/:questionnaire_id', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateDeleteQuestion, superAdminObj.getQuestionnairDetail);
router.post('/updateQuestionnaire', authObj.permission({parent: 'managesystem', child: 'risklabels'}), validationMiddleware.validateQuestion, superAdminObj.updateQuestionnaire); // update questionnaire
router.post('/changeQuestionnaireStatus', validationMiddleware.validateStatus, superAdminObj.changeQuestionnaireStatus); // change questionnaire status
router.post('/changeOrderOfQuestion', superAdminObj.changeOrderOfQuestion); // change order of questionnaires
router.post('/getCategories',superAdminObj.getCategories); // to get all categories
router.get('/getAllRa',superAdminObj.getAllRa); // to get all type of ra's
router.get('/getRaCategories/:typeOfRaId',superAdminObj.getRaCategories); // to get categories of selected ra
router.post('/getQueOfSelectedRiskLabel', validationMiddleware.validateGetQuestion, superAdminObj.getQueOfSelectedRiskLabel); // to get questions of selected risk labels

// business travel ra categories and questions 
router.get('/getCountriesName',businessTravelRaObj.getCountriesName); // to get all countries
router.post('/addBizTravelCategory',businessTravelRaObj.addBizTravelCategory); // to add categories for business travel ra
router.post('/getAllBizCategories',businessTravelRaObj.getAllBizCategories); // to get all business travel ra categories


// for type of ra 
router.post('/createTypesOfRa', typeOfRaObj.createTypesOfRa); // to create type of ra
router.post('/getAllTypesOfRa',typeOfRaObj.getAllTypesOfRa); // to get all types of ra
router.get('/deleteTypeOfRa/:type_of_ra_id',typeOfRaObj.deleteTypeOfRa); // to delete types of ra
router.post('/changeTypeOfRaStatus',typeOfRaObj.changeTypeOfRaStatus); // to change status of type of ra
router.get('/getRaDetails/:type_of_ra_id',typeOfRaObj.getRaDetails); // to get ra details
router.post('/updateTypesOfRa',typeOfRaObj.updateTypesOfRa); // to update ra details
router.get('/getRaPreviewData/:type_of_ra_id',typeOfRaObj.getRaPreviewData); // to get ra details with categories and questions associated with it.
router.get('/getAllSectorList',typeOfRaObj.getAllSectorList); // to get ra list for creating generic ra



// country threat matrix
router.get('/getAllCategoryList',superAdminObj.getAllCategoryList); // to get categories
router.get('/getCountriesForThreatMatrix',superAdminObj.getCountriesForThreatMatrix); // to get country threat matrix
router.post('/saveCountryThreatMatrix',superAdminObj.saveCountryThreatMatrix); // to save country threat matrix

router.put('/saveCountryThreatMatrixAndRating', superAdminObj.saveCountryThreatMatrixAndRating);
router.get('/country/threat-rating/:id', superAdminObj.getCountryThreatMatrixAndRating); // to get all countries


// sector
router.post('/addSector', authObj.permission('super_admin'), validationMiddleware.ValidateAddSector, sectorObj.addSector); //*** */ to create sector
router.post('/getAllSector', authObj.permission('super_admin'), sectorObj.getAllSector); //*** */ to get all sector
router.post('/changeSectorStatus', authObj.permission('super_admin'), sectorObj.changeSectorStatus); // to change sector status
router.get('/deletesector/:sector_id', authObj.permission('super_admin'), sectorObj.deletesector); // **to delete sector
router.get('/getSectorData/:sector_id', authObj.permission('super_admin'), sectorObj.getSectorData); // ***to get sector data
router.post('/updateSector', authObj.permission('super_admin'), sectorObj.updateSector); // ***to update sector data


// generic ra section
router.post('/createGenericRa',typeOfRaObj.createGenericRa); // to create generic ra
router.get('/getAllClientList',typeOfRaObj.getAllClientList); // to get all client list to create individual ra
router.get('/getDepartment/:client_id',typeOfRaObj.getDepartment); // to get department of selected client
router.post('/createIndividualRa',typeOfRaObj.createIndividualRa); // to create individual ra 
router.get('/getAllCountryList',typeOfRaObj.getAllCountryList); // to get country list
router.post('/assignQuesToRa',typeOfRaObj.assignQuesToRa); // to assign question to ra
router.post('/updateGenericRa',typeOfRaObj.updateGenericRa); // to update generic ra
router.post('/updateIndividualRa', typeOfRaObj.updateIndividualRa); // to update individual ra details
router.get('/submitGenericRa/:generic_ra_id', typeOfRaObj.submitGenericRa); // to submit generic ra
router.get('/getRaToView/:ra_id',typeOfRaObj.getRaToView); // to get ra details to view
router.post('/getAllRiskLabels',typeOfRaObj.getAllRiskLabels); // to get risk labels
router.post('/getAllRiskQuestionnaire', typeOfRaObj.getAllRiskQuestionnaire); // to get all question of selected risk label
router.get('/getRiskQueDetail/:que_id',typeOfRaObj.getRiskQueDetail); // to get question details 
router.get('/saveAndSubmitLater/:ra_id',typeOfRaObj.saveAndSubmitLater); // to save ra and not submitted yet
router.post('/getAllUnderConstructionRA',typeOfRaObj.getAllUnderConstructionRA); // to get all ra which are save but not submitted by master admin
router.post('/getAllRiskLableOfQue', typeOfRaObj.getAllRiskLableOfQue); // to get(search) all risk labels of a question


//User group
router.post('/saveUsergroup',authObj.permission({parent: 'userinformation', child: 'editusergroup'}), validationMiddleware.validateSaveUserGroup, userGroupobj.saveUsergroup); // *** to save new user group
router.post('/getAllusergroup', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userGroupobj.getAllusergroup); // *** toget all user group

router.post('/userRole', superAdminObj.userRole); // to save new user group
router.get('/getUsergroupDetails/:usergroup_id', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userGroupobj.getUsergroupDetails); // to get user group details 
router.post('/updateUsergroup', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userGroupobj.updateUsergroup); // *** to update user group details
router.get('/deleteUsergroup/:usergroup_id', authObj.permission({parent: 'userinformation', child: 'editusergroup'}), userGroupobj.deleteUsergroup); // *** to delete user group

//user

router.get('/getUsergroups/:client_id', userObj.getUsergroups); // *** to getusergroups for client creation
router.post('/saveUser', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), bucketFolderName('profile'), attachBodyAndFiles,checkSingleFileType, validationMiddleware.validateSaveUser, uploadFileOnS3, userObj.saveUser); // *** to save the user details
router.post('/updateUserMedicalInfo', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.updateUserMedicalInfo); // *** to update the user medical information
router.post('/updateProfileMedicalInfo', userObj.updateProfileMedicalInfo); // *** to update the user profile medical information
router.post('/updateUserTrainingInfo', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.updateUserTrainingInfo); // *** to update the user training information
router.post('/updateProfileTrainingInfo', userObj.updateProfileTrainingInfo); // *** to update the user profile training information
router.post('/updateUserEmergencyDetails', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.updateUserEmergencyDetails); // *** to update the user emergency details
router.post('/updateProfileEmergencyDetails', userObj.updateProfileEmergencyDetails); // *** to update the user profile emergency details
router.get('/getUserMedicalInfo/:user_id', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.getUserMedicalInfo); // *** to get the user medical information
router.get('/getProfileMedicalInfo', userObj.getProfileMedicalInfo); // *** to get the user profile medical information
router.get('/getUserTrainingInfo/:user_id', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.getUserTrainingInfo); // *** to get the user training information
router.get('/getProfileTrainingInfo', userObj.getProfileTrainingInfo); // *** to get the user profile training information
router.get('/getEmergencyDetails/:user_id', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.getEmergencyDetails); // *** to get the user emergency details
router.get('/getProfileEmergencyDetails', userObj.getProfileEmergencyDetails); // *** to get the user emergency details
router.post('/getAllUser', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), validationMiddleware.validateGetAllUser, userObj.getAllUser); // *** to get the user details
router.post('/changeUserStatus', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.changeUserStatus); // to change the user status
router.get('/getUserDetails/:user_id', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), validationMiddleware.validateGetUserDetails, userObj.getUserDetails); // *** get user detail for update 
router.get('/accessEmergencyInfoApproval/:reqFor', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.getAccessEmergencyInfoApproval);
router.post('/accessEmergencyInfoApproval', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), validationMiddleware.validateSaveEmergencyApprovingManager, userObj.saveEmergencyApprovingManager)
router.patch('/accessEmergencyInfoApprovalStatus', validationMiddleware.validateUpdateEmergencyApprovingManager, userObj.changeEmergencyInformationStatus);
router.get('/emgApprovingManager', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), userObj.getEmergencyApprovingManager)
router.get('/getUserProfile', userObj.getUserProfile); // get user profile
router.post('/updateUser', authObj.permission({parent: 'userinformation', child: 'createeditusers'}), bucketFolderName('profile'), attachBodyAndFiles, checkSingleFileType, validationMiddleware.validateSaveUser, uploadFileOnS3, userObj.updateUser); // *** updating userdetails 
router.post('/updateProfile', bucketFolderName('profile'), attachBodyAndFiles, checkSingleFileType, validationMiddleware.validateSaveUser, uploadFileOnS3, userObj.updateProfile); // update user profile
router.post('/deleteUsers', authObj.permission('super_admin'),  validationMiddleware.validateDeleteUser, userObj.deleteUsers); // *** delete users
router.put('/deActivateRPStaffAccount', authObj.permission('super_admin'), validationMiddleware.validateDeleteUser, userObj.deActivateRPStaffAccount); // *** deactivate RP staff account 
router.get('/getDepartmentusers/:client_id', userObj.getDepartmentusers); // *** to getusergroups for client creation
router.get('/getAllClients', authObj.permission([
    {parent: 'userinformation', child: 'createeditusers'},
    {parent: 'managesystem', child: 'departments'}]), userGroupobj.getAllClients); //*** */ to get client details for dropdown option inuser and department

//Department section services 
router.get('/getUsers/:client_id', departmentObj.getUsers); //get user detail for update
router.post('/getUsers_trackconnect', authObj.permission({parent: 'managesystem', child: 'departments'}), departmentObj.getUsers_trackconnect); //get user detail for update
router.get('/getTemplates', authObj.permission({parent: 'managesystem', child: 'departments'}), departmentObj.getTemplates); //get user detail for update
router.get('/getRelatedTemplate/:client_id', authObj.permission({parent: 'managesystem', child: 'departments'}), departmentObj.getRelatedTemplate); //get user detail for update
router.get('/getRelatedUser/:client_id', authObj.permission({parent: 'managesystem', child: 'departments'}), departmentObj.getRelatedUser); //get user detail for update

router.post('/saveDepartment', authObj.permission({parent: 'managesystem', child: 'departments'}), validationMiddleware.validateDepartment, departmentObj.saveDepartment); // to save department 
router.post('/getAllDepartment', authObj.permission({parent: 'managesystem', child: 'departments'}), departmentObj.getAllDepartment); // to get all department
router.post('/country/matrix/log', superAdminObj.getCountryMatrixLog); // to get all department
module.exports = router;
