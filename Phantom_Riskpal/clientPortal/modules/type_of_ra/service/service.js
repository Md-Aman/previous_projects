"use strict"

angular.module('TypeOfRaService', [])

    .factory('TypeOfRa', ['$http', function ($http) {
        return {
            // create type of ra
            createTypesOfRa: function (typeOfRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CreateTypesOfRa,
                    data: typeOfRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get all type of ra
            getAllTypesOfRa: function (typeOfRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllTypesOfRa,
                    data: typeOfRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete type of ra
            deleteTypeOfRa: function (typeOfRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteTypeOfRa + "/" + typeOfRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to change status of type of ra
            changeTypeOfRaStatus: function (typeOfRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeTypeOfRaStatus,
                    data: typeOfRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get details of ra
            getRaDetails: function (typeOfRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaDetails + "/" + typeOfRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update ra details
            updateTypesOfRa: function (typeOfRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateTypesOfRa,
                    data: typeOfRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra data for preview
            getRaPreviewData: function (typeOfRaId, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaPreviewData + "/" + typeOfRaId,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all sector list
            getAllSectorList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllSectorList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create generic ra 
            createGenericRa: function (genericRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CreateGenericRa,
                    data: genericRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all client list
            getAllClientList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllClientList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get department list of selected client
            getDepartment: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetDepartment + "/" + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create individual ra 
            createIndividualRa: function (individualRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CreateIndividualRa,
                    data: individualRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get country list
            getAllCountryList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllCountryList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to assign questions to ra
            assignQuesToRa: function (queData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AssignQuesToRa,
                    data: queData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to update generic ra details 
            updateGenericRa: function (genericRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateGenericRa,
                    data: genericRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // update individual ra details
            updateIndividualRa: function (individualRaData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateIndividualRa,
                    data: individualRaData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // submit generic ra
            submitGenericRa: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.SubmitGenericRa + "/" + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra details to view 
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

            // to get all the questions of selected risk label
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
                    url: webServices.GetRiskQueDetail + '/' + que_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to save ra but not submitted yet
            saveAndSubmitLater: function (ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.SaveAndSubmitLater + '/' + ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all ra which are save but not submitted by master admin
            getAllUnderConstructionRA: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllUnderConstructionRA,
                    data: raData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to search risk lables of a question
            getAllRiskLableOfQue: function (quesData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskLableOfQue,
                    data: quesData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            }

        }

    }]);
