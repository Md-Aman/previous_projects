// var baseURI = 'https://' + window.location.host + '/';
var baseURI = '';

if(window.location.host === 'localhost:3000'){
  baseURI = 'http://' + window.location.host + '/';
} else {
  baseURI = 'https://' + window.location.host + '/'
}


var webServices = {
  "SuperAdminLogin": baseURI + "super_admin/superAdminLogin", // login super admin
  "SuperAdminLogout": baseURI + "super_admin/superAdminLogout", // logout super admin
  "SuperAdminForgetPass": baseURI + "super_admin/superAdminForgetPass", // send forget password link on email to super admin
  "SuperAdminResetPass": baseURI + "super_admin/superAdminResetPass", // reset password 
  "userActivate": baseURI + "super_admin/userActivate", // user activation 
  "checkUserstatus": baseURI + "super_admin/checkUserstatus", // user activation 

  // news agency section
  "GetAllCountries": baseURI + "super_admin/getAllCountries", // get all country list
  "saveNewClient": baseURI + "super_admin/saveNewClient", // create news agency
  "saveNewRPstaff": baseURI + "super_admin/saveNewRPstaff", // create newstaff
  "getAllRPstaff": baseURI + "super_admin/getAllRPstaff", // get all  newstaff
  "GetAllNewsAgencies": baseURI + "super_admin/getAllNewsAgencies", // get all news agency
  "DeleteNewsAgency": baseURI + "super_admin/deleteNewsAgency", // to delete news agency
  "deleteRpstaff": baseURI + "super_admin/deleteRpstaff", // to deleteRpstaff
  "ChangeNewsAgencyStatus": baseURI + "super_admin/changeNewsAgencyStatus", // to change status of news agency
  "changeStatusrpsatff": baseURI + "super_admin/changeStatusrpsatff", // to change status of news agency
  "GetNewsAgencyDetails": baseURI + "super_admin/getNewsAgencyDetails", // to get news agency details 
  "UpdateNewsAgency": baseURI + "super_admin/updateNewsAgency", // to update news agency details 
  "CountryRiskLevel": baseURI + "super_admin/countryRiskLevel", // to get country risk level of news agency details 
  "SaveCountrySpecificInfo": baseURI + "super_admin/saveCountrySpecificInfo", // to save country specific info for particular news agency by super admin 
  "SaveCountryColor": baseURI + "super_admin/saveCountryColor", // to save country color for particular news agency by super admin 
  "GetAllSectors": baseURI + "super_admin/getAllSectors", // to get all sector list
  "GetDepartmentList": baseURI + "super_admin/getDepartmentList", // To get all department 
  "GetMasterAdminDetails": baseURI + "super_admin/getMasterAdminDetails", // To get Master Admin Details
  "UpdateAdminDetails": baseURI + "super_admin/updateAdminDetails", // To get Master Admin Details
  "CheckPassword": baseURI + "super_admin/checkPassword", // to update personal details
  "ChangePassword": baseURI + "super_admin/changePassword", // to update personal details
  "LoginAsClient": baseURI + "super_admin/loginAsClient", // to login as client
  // to set risk level for all news agencies

  "CountryRiskLevelForAllAgencies": baseURI + "super_admin/countryRiskLevelForAllAgencies", // to get risk level for all news agencies
  "SaveCountryColorForAllNewsAgency": baseURI + "super_admin/saveCountryColorForAllNewsAgency", // to save country color code for all news agencies 
  "CountrySpecificInfoForAllAgency": baseURI + "super_admin/countrySpecificInfoForAllAgency", // to save country specific information 


  // country threat matrix
  "GetAllCategoryList": baseURI + "super_admin/getAllCategoryList", // to get all categories
  "GetCountriesForThreatMatrix": baseURI + "super_admin/getCountriesForThreatMatrix", // to get country threat matrix
  "SaveCountryThreatMatrix": baseURI + "super_admin/saveCountryThreatMatrix", // to save country threat matrix
  "AddInformation": baseURI + "super_admin/addInformation", // to get countrythreadmatrix data


  // category section
  "GetAllCategories": baseURI + "super_admin/getAllCategories", // to get all categories 
  "DeleteCategory": baseURI + "super_admin/deleteCategory", // to delete categories 
  "ChangeCategoryStatus": baseURI + "super_admin/changeCategoryStatus", // to change category status 
  "GetCountries": baseURI + "super_admin/getCountries", // to get all countries
  "AddCategory": baseURI + "super_admin/addCategory", // to add categories
  "GetCategoryDetails": baseURI + "super_admin/getCategoryDetails", // to get category details
  "UpdateCategory": baseURI + "super_admin/updateCategory", // to update category details
  "GetTypesOfRa": baseURI + "super_admin/getTypesOfRa", // to get all types of ra to add category


  // risk associated category section
  "GetAllRiskAssociatedCategories": baseURI + "super_admin/getAllRiskAssociatedCategories", // to get all risk associated categories 
  "DeleteRiskAssociatedCategory": baseURI + "super_admin/deleteRiskAssociatedCategory", // to delete risk associated categories 
  "ChangeRiskCategoryStatus": baseURI + "super_admin/changeRiskCategoryStatus", // to change risk associated categories status
  "AddRiskAssociatedCategory": baseURI + "super_admin/addRiskAssociatedCategory", // to add risk associated category 
  "GetRiskAssociatedCategoryDetails": baseURI + "super_admin/getRiskAssociatedCategoryDetails", // to get risk associated category details
  "UpdateRiskAssociatedCategory": baseURI + "super_admin/updateRiskAssociatedCategory", // to update risk associated category 
  "MarkAsMandatory": baseURI + "super_admin/markAsMandatory", // to mark category as mandatory and not mandatory 

  "GetClientCount": baseURI + "super_admin/getClientCount", // to get client count for super admin dashboard 


  // questionnaire

  "AddQuestionnaire": baseURI + "super_admin/addQuestionnaire", // add questionnaire
  "GetAllQuestionnaire": baseURI + "super_admin/getAllQuestionnaire", // get all questionnaires of selected category
  "DeleteQuestionnair": baseURI + "super_admin/deleteQuestionnair", // delete questionnaire
  "GetQuestionnairDetail": baseURI + "super_admin/getQuestionnairDetail", // get questionnaire detail 
  "UpdateQuestionnaire": baseURI + "super_admin/updateQuestionnaire", //update questionnaire
  "ChangeQuestionnaireStatus": baseURI + "super_admin/changeQuestionnaireStatus", //change questionnaire status
  "ChangeOrderOfQuestion": baseURI + "super_admin/changeOrderOfQuestion", //change order of questionnaires
  "GetCategories": baseURI + "super_admin/getCategories", // to get all categories
  "GetAllRa": baseURI + "super_admin/getAllRa", // to get all types of ra 
  "GetRaCategories": baseURI + "super_admin/getRaCategories", // to get categories of selected ra
  "GetRaPreviewData": baseURI + "admin/getRaPreviewData", // to get ra details with categories and questions associated with it.
  "GetQueOfSelectedRiskLabel": baseURI + "super_admin/getQueOfSelectedRiskLabel", // to get questions of selected risk label


  // business travel ra categories and questions
  "GetCountriesName": baseURI + "super_admin/getCountriesName", // to get all countries
  "AddBizTravelCategory": baseURI + "super_admin/addBizTravelCategory", // to add categories for business travel ra
  "GetAllBizCategories": baseURI + "super_admin/getAllBizCategories", // to get all business travel ra categories 


  //types of ra
  "CreateTypesOfRa": baseURI + "super_admin/createTypesOfRa", // to crate types of ra
  "GetAllTypesOfRa": baseURI + "super_admin/getAllTypesOfRa", // to get all types of ra
  "DeleteTypeOfRa": baseURI + "super_admin/deleteTypeOfRa", // to delete types of ra
  "ChangeTypeOfRaStatus": baseURI + "super_admin/changeTypeOfRaStatus", // to change status of types of ra
  "GetRaDetails": baseURI + "super_admin/getRaDetails", // to get details of ra
  "UpdateTypesOfRa": baseURI + "super_admin/updateTypesOfRa", // to update types of ra


  // sector section
  "AddSector": baseURI + "super_admin/addSector", // to add sector 
  "GetAllSector": baseURI + "super_admin/getAllSector", // to get all sector
  "ChangeSectorStatus": baseURI + "super_admin/changeSectorStatus", // to change sector status
  "Deletesector": baseURI + "super_admin/deletesector", // to delete sector
  "GetSectorData": baseURI + "super_admin/getSectorData", // to get sector data
  "UpdateSector": baseURI + "super_admin/updateSector", // to update sector data


  // // generic ra section
  // "GetAllSectorList": baseURI + "super_admin/getAllSectorList", // to get all sector list to create generic ra
  // "CreateGenericRa": baseURI + "super_admin/createGenericRa", // create generic ra
  // "GetAllClientList": baseURI + "super_admin/getAllClientList", // to get all client list
  // "GetDepartment": baseURI + "super_admin/getDepartment", // to get department of selected client
  // "CreateIndividualRa": baseURI + "super_admin/createIndividualRa", // to create individual ra 
  // "GetAllCountryList": baseURI + "super_admin/getAllCountryList", // to get country list
  // "AssignQuesToRa": baseURI + "super_admin/assignQuesToRa", // to assign question to ra
  // "UpdateGenericRa": baseURI + "super_admin/updateGenericRa", // to update generic ra
  // "UpdateIndividualRa": baseURI + "super_admin/updateIndividualRa", // to update individual ra details 
  // "SubmitGenericRa": baseURI + "super_admin/submitGenericRa", // to submit generic ra
  // "GetRaToView": baseURI + "super_admin/getRaToView", // to get ra details to view
  // "GetAllRiskLabels": baseURI + "super_admin/getAllRiskLabels", // to get all risk labels
  // "GetAllRiskQuestionnaire": baseURI + "super_admin/getAllRiskQuestionnaire", // to get all questions of selected risk label
  // "GetRiskQueDetail": baseURI + "super_admin/getRiskQueDetail", // to get question details 
  // "SaveAndSubmitLater": baseURI + "super_admin/saveAndSubmitLater", // to save ra and not submitted yet
  // "GetAllUnderConstructionRA": baseURI + "super_admin/getAllUnderConstructionRA", // to get all ra which are save but not submitted by master admin
  // "GetAllRiskLableOfQue": baseURI + "super_admin/getAllRiskLableOfQue", // to search risk lables of a question

  // for country page
  "GetCountryList": baseURI + "traveller/getCountryList", // To get all countries
  "GetCategoriesList": baseURI + "traveller/getCategoriesList", // To get all category
  "GetCountryThreatMatrix": baseURI + "traveller/getCountryThreatMatrix", // To get threat matrix of a country


  //User group oprations 
  "saveUsergroup": baseURI + "super_admin/saveUsergroup",
  "getAllusergroup": baseURI + "super_admin/getAllusergroup",
  "getAllClients": baseURI + "super_admin/getAllClients",
  "userRole": baseURI + "super_admin/userRole",
  "getUsergroupDetails": baseURI + "super_admin/getUsergroupDetails",
  "updateUsergroup": baseURI + "super_admin/updateUsergroup",
  "deleteUsergroup": baseURI + "super_admin/deleteUsergroup",

  //user 
  "getUsergroups": baseURI + "super_admin/getUsergroups",
  "saveUser": baseURI + "super_admin/saveUser",
  "getAllUser": baseURI + "super_admin/getAllUser",
  "changeUserStatus": baseURI + "super_admin/changeUserStatus",
  "getUserDetails": baseURI + "super_admin/getUserDetails",
  "updateUser": baseURI + "super_admin/updateUser",
  "deleteUsers": baseURI + "super_admin/deleteUsers",
  "getDepartmentusers": baseURI + "super_admin/getDepartmentusers",

  //Authy verification siroi
  //2 factor authentication 
  "Sms": baseURI + "traveller/sms", // to send sms
  "Verify": baseURI + "traveller/verify", // to varify requests
  "Voice": baseURI + "traveller/voice", // to voice request
  "Onetouch": baseURI + "traveller/onetouch", // to onetouch request
  "Checkonetouchstatus": baseURI + "traveller/checkonetouchstatus", // to checkonetouchrequest
  "VerifyOtp": baseURI + "traveller/verifyOtp", // for varifyOtp 

   // for department section
   "GetAllApprovingManagers": baseURI + "admin/getAllApprovingManagers", // to get all approving manager 
   "GetBasicAdminforDepartment": baseURI + "admin/getBasicAdminforDepartment", // to get all BasicAdmin for Department
   "GetTravellersForDepartment": baseURI + "admin/getTravellersForDepartment", // to get all travellers 
   "SaveDepartment": baseURI + "super_admin/saveDepartment", // to save department 
   "GetAllDepartment": baseURI + "super_admin/getAllDepartment", // to get all department 
   "DeleteDepartment": baseURI + "admin/deleteDepartment", // to delete department 
   "ChangeDepartmentStatus": baseURI + "admin/changeDepartmentStatus", // to change department 
   "GetDepartmentDetail": baseURI + "admin/getDepartmentDetail", // to change department 
   "UpdateDepartment": baseURI + "admin/updateDepartment", // to update department 
   "getUsers": baseURI + "super_admin/getUsers", // to update department 
   "getUsers_trackconnect": baseURI + "super_admin/getUsers_trackconnect", // to update department 
   "getTemplates": baseURI + "super_admin/getTemplates", // to update department 
   "getRelatedTemplate": baseURI + "super_admin/getRelatedTemplate", // to update department 
   "getRelatedUser": baseURI + "super_admin/getRelatedUser", // to update department 


   "GetProofOfLifeQuestions": baseURI + "admin/getProofOfLifeQuestions", //get proof of questions

  
  // Risk Assessment
  
  "GetAllRiskAssessmentByMA": baseURI + "admin/getAllRiskAssessmentByMA", // to get all risk assessments created by  super admin
  "GetAllRiskAssessment": baseURI + "admin/getAllRiskAssessment", // to get all risk assessments created by client super admin
  "GetCountryListForRa": baseURI + "admin/getCountryListForRa", // to get all country list
  "GetAllDepartmentOfClient": baseURI + "admin/getAllDepartmentOfClient", // to get all department of client super admin
  "CreateIndividualRa": baseURI + "admin/createIndividualRa", // to create ra by client super admin
  "UpdateIndividualRa": baseURI + "admin/updateIndividualRa", // to update ra by client super admin
  "GetAllQuestionnaireForRa": baseURI + "admin/getAllQuestionnaireForRa", // to get all questions
  "AssignQuesToRa": baseURI + "admin/assignQuesToRa", // to assign questions to ra
  "GetRaDetailsCreatedByClient": baseURI + "admin/getRaDetailsCreatedByClient", // to get ra details 
  "SubmitRaCreatedByClient": baseURI + "admin/submitRaCreatedByClient", // to submit ra created by client super admin
  "GetCategoriesForQue": baseURI + "admin/getCategoriesForQue", // to get categories 
  "AddQuestionByClient": baseURI + "admin/addQuestionByClient", // to add questions
  "AddCategoryByClient": baseURI + "admin/addCategoryByClient", // to add category by client super admin
  "ChangeStatus": baseURI + "admin/changeStatus", // to change status of ra
  "DeleteRa": baseURI + "admin/deleteRa", // to delete ra
  "GetRaToView": baseURI + "admin/getRaToView", // to view ra details with assign questions
  "GetAllRiskLabels": baseURI + "admin/getAllRiskLabels", // to get all risk labels
  "GetAllRiskQuestionnaire": baseURI + "admin/getAllRiskQuestionnaire", // to get all questions of selected risk label
  "GetRiskQueDetail": baseURI + "admin/getRiskQueDetail", // to get question details
  "GetAllSubmittedRiskAssessment": baseURI + "admin/getAllSubmittedRiskAssessment", // to get all submitted ra
  "GetAllRejectedRiskAssessment": baseURI + "admin/getAllRejectedRiskAssessment", // to get all rejected ra

  "GetRadetailsForAdmin": baseURI + "admin/getRadetailsForAdmin", // to get ra details for admin
  "GetCurrencyList": baseURI + "admin/getCurrencyList", // to get currencies
  "AddRaSupplierByClientAdmin": baseURI + "admin/addRaSupplierByClientAdmin", // to save supplier
  "UpdateRaSupplierByClientAdmin": baseURI + "admin/updateRaSupplierByClientAdmin", // to update supplier
  "GetRaSupplierData": baseURI + "admin/getRaSupplierData", // to get supplier detail
  "AddRaCommunicationByClientAdmin": baseURI + "admin/addRaCommunicationByClientAdmin", // to add communication data
  "UpdateRaCommunicationByClientAdmin": baseURI + "admin/updateRaCommunicationByClientAdmin", // to update communication data 
  "GetRaCommunicationData": baseURI + "admin/getRaCommunicationData", // to get communication details
  "AddRaContingencyByClientAdmin": baseURI + "admin/addRaContingencyByClientAdmin", // to add contingency data,
  "UpdateRaContingencyByClientAdmin": baseURI + "admin/updateRaContingencyByClientAdmin", // to update contingency data
  "GetContingencyData": baseURI + "admin/getContingencyData", // to get contingency data
 
  "GetAllCountry": baseURI + "admin/getAllCountry", // to get countrythreadmatrix data
  "GetSupplierForCountry": baseURI + "admin/getSupplierForCountry", // to get countrythreadmatrix data
  // "AddInformation": baseURI + "admin/addInformation" // to get countrythreadmatrix data


  //Suppliers list

  "AddSupplier": baseURI + "admin/supplier/addSupplier", // to add supplier
  "GetAllSupplier": baseURI + "admin/supplier/getAllSupplier", // to list all supplier
  "GetSupplierDetails": baseURI + "admin/supplier/getSupplierDetails", // to get supplier detail
  "UpdateSupplier": baseURI + "admin/supplier/updateSupplier", // to update supplier
  "ChangeSupplierStatus": baseURI + "admin/supplier/changeSupplierStatus", // to change supplier status
  "DeleteSupplier": baseURI + "admin/supplier/deleteSupplier", // to delete supplier
  "GetAllCurrencies": baseURI + "admin/getAllCurrencies", // to get all currencies


  // Dashboard action
  "GetAllTypeOfRa": baseURI + "traveller/getAllTypeOfRa", // to get all type of ra for traveller
  "TravellerRegister": baseURI + "traveller/travellerRegister", // for traveller registration
  "TravellerActiveAccount": baseURI + "traveller/travellerActiveAccount", // for traveller accont activation
  "TravellerLogin": baseURI + "traveller/travellerLogin", // for traveller login
  "TravellerLogout": baseURI + "traveller/travellerLogout", // for traveller login
  "TravellerForgetPass": baseURI + "traveller/travellerForgetPass", // for traveller forget password
  "TravellerResetPass": baseURI + "traveller/travellerResetPass", // for reset traveller passport


  "UpdateMedicalInfo": baseURI + "traveller/updateMedicalInfo", // to update medical information of traveller
  "GetTravellerDetails": baseURI + "traveller/getTravellerDetails", // to get traveller information
  "UpdatePassportDetails": baseURI + "traveller/updatePassportDetails", // to update passport details
  "UpdatePersonalDetails": baseURI + "traveller/updatePersonalDetails", // to update personal details


  "GetAllCountry": baseURI + "traveller/getAllCountry", // to get all countries
  "GetRasPreviewData": baseURI + "traveller/GetRasPreviewData", // to get ra preview data
  "GetAllTravellers": baseURI + "traveller/getAllTravellers", // to get all traveller
  "GetAllApprovingManger": baseURI + "traveller/getAllApprovingManger", // to get all approving manager
  "getDeptRelatedUsers": baseURI + "traveller/getDeptRelatedUsers", // to get user list based departments
  "getOthertraveller": baseURI + "traveller/getOthertraveller", // to get user list based departments
  "AddNewsRa": baseURI + "traveller/addNewsRa", // to add news ra of a traveller
  "GetAllNewsRa": baseURI + "traveller/getAllNewsRa", // to get all news ra of a particular traveller
  //"GetCategories": baseURI + "traveller/getCategories", // to get all categories
  "GetNewsRaDetails": baseURI + "traveller/getNewsRaDetails", // to get all categories
  "UpdateNewsRa": baseURI + "traveller/updateNewsRa", // to update news ra
  "GetCategoryQuestionnaire": baseURI + "traveller/GetCategoryQuestionnaire", // to get questionnaire of a category
  "AddQuestionnaireRa": baseURI + "traveller/addQuestionnaireRa", // To add specific mitigation by traveller at questionnaire of a particular category 
  "GetNewsRa": baseURI + "traveller/getNewsRa", // To get news ra details 
  "SubmitRAToManager": baseURI + "traveller/submitRAToManager", // To submit news ra to approving manager
  "generatePDF": baseURI + "traveller/generatePDF", // To submit news ra to approving manager
  "GetNewsRaStatus": baseURI + "traveller/getNewsRaStatus", // To get news ra submit status
  "CopyNewsRa": baseURI + "traveller/copyNewsRa", // To copy news ra
  "DeleteNewsRa": baseURI + "traveller/deleteNewsRa", // To delete news ra
  "AddNewsRaCommunication": baseURI + "traveller/addNewsRaCommunication", // To add news ra communication form
  "updateNewsRaCommunication": baseURI + "traveller/updateNewsRaCommunication",
  "updateNewsRaCommunicationApprovingManager": baseURI + "traveller/updateNewsRaCommunicationApprovingManager",
  "GetCommunicationData": baseURI + "traveller/getCommunicationData", // To get news ra communication data 
  "AddNewsRaContingencies": baseURI + "traveller/addNewsRaContingencies", // To add news ra communication data 
  "updateNewsRaContingencies": baseURI + "traveller/updateNewsRaContingencies",
  "updateNewsRaContigencyApprovingManager": baseURI + "traveller/updateNewsRaContigencyApprovingManager",
  "getContingencyDatatraveller": baseURI + "traveller/getContingencyData", // To get news ra Contingency data 
  "AddAnyOtherInfo": baseURI + "traveller/addAnyOtherInfo", // To add any other relevant information with news ra
  "AddNewsRaSupplier": baseURI + "traveller/addNewsRaSupplier",
  "updateNewsRaSupplier": baseURI + "traveller/updateNewsRaSupplier", // To add supplier for news ra 
  "updateNewsRaSupplierApprovingManager": baseURI + "traveller/updateNewsRaSupplierApprovingManager", // To update supplier for news ra  from approving manager
  "updateNewsRaApprovingManager": baseURI + "traveller/updateNewsRaApprovingManager", // To update supplier for news ra  from approving manager

  "GetSupplierData": baseURI + "traveller/getSupplierData", // To get supplier for news ra 
  "GetRaDetails": baseURI + "traveller/getRaDetails", // To get type of ra details 
  "GetRADepartmentList": baseURI + "traveller/getDepartmentList", // To get type of ra details
  "getDeptRelatedUsersAprovingmanger": baseURI + "traveller/getDeptRelatedUsersAprovingmanger", // To get type of ra details
  "RemoveDoc": baseURI + "traveller/removeDoc", // to remove Doc

  /** New flow for ra creation and question */
  "GetRaQuestions": baseURI + "traveller/getRaQuestions", // To get questions of selected ra
  "AddQuestionToRa": baseURI + "traveller/addQuestionToRa", // To save specific mitigation for questions by traveller
  "addQuestionToRaupdate": baseURI + "traveller/addQuestionToRaupdate", // To save specific mitigation for questions by traveller
  "insertquestiontora": baseURI + "traveller/insertquestiontora", // To insert question to RA first time specific mitigation for questions by traveller

  "GetRaAnswers": baseURI + "traveller/getRaAnswers", // To get specific mitigation of questions filled by traveller
  "GetSupplierDetailsOfRa": baseURI + "traveller/getSupplierDetailsOfRa", // To get supplier details for particular ra before submit
  "getSupplierDetailsOfRaLocalContact": baseURI + "traveller/getSupplierDetailsOfRaLocalContact", // To get supplier details for particular ra before submit
  "getSupplierDetailsOfRaLocalDriver": baseURI + "traveller/getSupplierDetailsOfRaLocalDriver", // To get supplier details for particular ra before submit
  "getSupplierDetailsOfRaAccomadation": baseURI + "traveller/getSupplierDetailsOfRaAccomadation", // To get supplier details for particular ra before submit
  "getSupplierDetailsOfRaOther": baseURI + "traveller/getSupplierDetailsOfRaOther", // To get supplier details for particular ra before submit
  "deleteOthersuppliers": baseURI + "traveller/deleteOthersuppliers", // To get supplier details for particular ra before submit

  "getSupplierRaData": baseURI + "traveller/getSupplierRaData",
  "getRaCommunicationData": baseURI + "traveller/getRaCommunicationData",
  "getRaContingencyData": baseURI + "traveller/getRaContingencyData",

  /** end */

  "GetResourceLibForTraveller": baseURI + "traveller/getResourceLibForTraveller", // To get all resource library for traveller
  "GetResourceLibDetails": baseURI + "traveller/getResourceLibDetails", // To get resource details 



  /**Approving manger and pendig risk assessment  */

  "GetClientDepartment": baseURI + "approving_manager/getClientDepartment", // to checkonetouchrequest
  "TravellerMedicalInformation": baseURI + "approving_manager/travellerMedicalInformation", //  to request for travellers medical information
  "getAllpendingnewsRa": baseURI + "approving_manager/getAllpendingnewsRa", //  get all news ra  
  "getAllclientnewsRa": baseURI + "approving_manager/getAllclientnewsRa", //  get all news ra based on clients

  "ApproveNewsRa": baseURI + "approving_manager/approveNewsRa", //  to approve news ra   
  "GetNewsRadetails": baseURI + "approving_manager/getNewsRadetails", //  to approve news ra  
  "RejectRa": baseURI + "approving_manager/rejectRa", //  to reject  ra  
  "WantMoreInfoRa": baseURI + "approving_manager/wantMoreInfoRa", //  to send ra to traveller again for more information  
  "GetApprovingManagers": baseURI + "approving_manager/getApprovingManagers", // to get approving manager list
  "GetTravellers": baseURI + "approving_manager/getTravellers", // to get traveller list
  "ApproveRaByManager": baseURI + "approving_manager/approveRaByManager", // to approve ra by manager
  "forwardToManager": baseURI + "approving_manager/forwardToManager", //  to approve news ra   
  "RejectRaByManager": baseURI + "approving_manager/rejectRaByManager", // to reject ra by approving manager
  "MoreInfoRaByManager": baseURI + "approving_manager/moreInfoRaByManager", // to request more info by approving manager
  "GetMedicalInfoByRequest": baseURI + "approving_manager/getMedicalInfoByRequest", // To get traveller info 

  "GetResourceLibForApprovingManager": baseURI + "approving_manager/getResourceLibForApprovingManager", //  to approve news ra
  "ViewTravellerMedicalInfo": baseURI + "approving_manager/viewTravellerMedicalInfo", // To view traveller's medical information
  "GetTravellerInfo": baseURI + "approving_manager/getTravellerInfo", // To get traveller info 
  "updateEditRa": baseURI + "approving_manager/updateEditRa", // To get traveller info 
  "inserttora": baseURI + "traveller/inserttora", // to insert etc question to RA 
  "getCountryMatrixLogs": baseURI + "super_admin/country/matrix/log"



}
