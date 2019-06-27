"use strict"

angular.module('RiskAssessmentService', [])

    .factory('RiskAssessment', ['$http', function ($http) {
        return {

            // get all risk assessments created by client super admin 
            getAllRiskAssessment: function (assessmentData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskAssessment,
                    data: assessmentData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get country list 
            getCountryListForRa: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCountryListForRa,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get country list 
            getAllDepartmentOfClient: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllDepartmentOfClient,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create ra by client super admin
            createIndividualRa: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CreateIndividualRa,
                    data: raData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to update ra by client super admin
            updateIndividualRa: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateIndividualRa,
                    data: raData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get all questions 
            getAllQuestionnaireForRa: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllQuestionnaireForRa,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra preview data
            getRaPreviewData: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaPreviewData + '/' + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to assigned questions to ra
            assignQuesToRa: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AssignQuesToRa,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra details 
            getRaDetailsCreatedByClient: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaDetailsCreatedByClient + '/' + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to submit ra created by client super admin
            submitRaCreatedByClient: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.SubmitRaCreatedByClient + '/' + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get categories of for creating questions
            getCategoriesForQue: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCategoriesForQue,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create questions
            addQuestionByClient: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddQuestionByClient,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to add categories by client super admin
            addCategoryByClient: function (categoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddCategoryByClient,
                    data: categoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to change ra status
            changeStatus: function (typeOfRa, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeStatus,
                    data: typeOfRa
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete ra 
            deleteRa: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteRa + "/" + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to view ra
            getRaToView: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaToView + "/" + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all risk labels 
            getAllRiskLabels: function (catData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskLabels,
                    data: catData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all questions of selected risk label
            getAllRiskQuestionnaire: function (quesData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskQuestionnaire,
                    data: quesData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get question details 
            getRiskQueDetail: function (que_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRiskQueDetail + "/" + que_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all submitted ra
            getAllSubmittedRiskAssessment: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllSubmittedRiskAssessment,
                    data: raData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all rejected ra
            getAllRejectedRiskAssessment: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRejectedRiskAssessment,
                    data: raData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra details
            getRadetailsForAdmin: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRadetailsForAdmin + "/" + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get currency list
            getCurrencyList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCurrencyList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create supplier
            addRaSupplierByClientAdmin: function (supplierData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddRaSupplierByClientAdmin,
                    data: supplierData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update supplier
            updateRaSupplierByClientAdmin: function (supplierData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateRaSupplierByClientAdmin,
                    data: supplierData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra details
            getRaSupplierData: function (supplier_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaSupplierData + '/' + supplier_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to add communication data by client super admin 
            addRaCommunicationByClientAdmin: function (communicationData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddRaCommunicationByClientAdmin,
                    data: communicationData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update communication data by client super admin
            updateRaCommunicationByClientAdmin: function (communicationData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateRaCommunicationByClientAdmin,
                    data: communicationData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get communication data
            getRaCommunicationData: function (communication_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaCommunicationData + '/' + communication_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to add contingency data
            addRaContingencyByClientAdmin: function (contingencyData, fn) {
                console.log('*******************************',contingencyData);
                return $http({
                    method: 'POST',
                    url: webServices.AddRaContingencyByClientAdmin,
                    data: contingencyData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to update contingency data
            updateRaContingencyByClientAdmin: function (contingencyData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateRaContingencyByClientAdmin,
                    data: contingencyData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get contingency data
            getContingencyData: function (contingency_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetContingencyData + '/' + contingency_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get CountryThreatMatrix
             getCountryThreatMatrix: function (country, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetCountryThreatMatrix ,
                    data: country
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get all categories list
            getCategoriesList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCategoriesList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },   

               // to update contingency data
            setCron: function (days, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SetCron,
                    data: days
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
               // to update updateCron 
            updateCron: function (days, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateCron,
                    data: days
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get getTimerSetting  
            getTimerSetting: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetTimerSetting,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
           // get all risk assessments created by client super admin 
            getAllRiskAssessmentByMA: function (assessmentData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskAssessmentByMA,
                    data: assessmentData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

     }


    }]);