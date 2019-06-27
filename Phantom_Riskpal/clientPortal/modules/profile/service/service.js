"use strict"

angular.module('MasterAdminProfileService', [])

    .factory('MasterAdminProfile', ['$http', function ($http) {
        return {
            // update medical information of traveller
            updateMedicalInfo: function (medical_info, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateMedicalInfo,
                    data: medical_info
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get traveller information
            getMasterAdminDetails: function (userdata,fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetMasterAdminDetails,
                    data:userdata
                }).success(function (data, status, headers, config) {
              // console.log("MasterAdminProfile",data)
                    fn(data);
                }).error(function (err) {
                    console.log('>>>>>>>>>.',err)
                    fn(err);
                });
            },

            //get all countries
            // getCountries: function (fn) {
            //     return $http({
            //         method: 'GET',
            //         url: webServices.GetCountries,
            //     }).success(function (data, status, headers, config) {
            //         fn(data);
            //     }).error(function (err) {
            //         fn(err);
            //     });
            // },

            // update passport details
            // updatePassportDetails: function (passport_details, fn) {
            //     return $http({
            //         method: 'POST',
            //         url: webServices.UpdatePassportDetails,
            //         data: passport_details
            //     }).success(function (data, status, headers, config) {
            //         fn(data);
            //     }).error(function (err) {
            //         fn(err);
            //     });
            // },

            // update personal details
            updateAdminDetails: function (personal_details, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateAdminDetails,
                    data: personal_details
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get proof of life questions 
            // getProofOfLifeQuestions: function (fn) {
            //     return $http({
            //         method: 'GET',
            //         url: webServices.GetProofOfLifeQuestions,
            //     }).success(function (data, status, headers, config) {
            //         fn(data);
            //     }).error(function (err) {
            //         fn(err);
            //     });
            // },
             checkPassword: function (password, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CheckPassword,
                    data: password
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             changePassword: function (password, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangePassword,
                    data: password
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

              //get all countries
              getCountries: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCountries,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

              // to get proof of life questions 
              getProofOfLifeQuestions: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetProofOfLifeQuestions,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },



            
        }

    }]);