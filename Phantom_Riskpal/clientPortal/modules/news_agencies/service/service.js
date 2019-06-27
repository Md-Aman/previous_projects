"use strict"

angular.module('NewsAgenciesService', [])

    .factory('NewsAgencies', ['$http', function ($http) {
        return {
            // get all country list
            getAllCountries: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllCountries
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create news agencies
            saveNewClient: function (news_agency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.saveNewClient,
                    data: news_agency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get all news agencies
            getAllNewsAgencies: function (news_agency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllNewsAgencies,
                    data: news_agency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // delete news agencies
            deleteNewsAgency: function (news_agency_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteNewsAgency + '/' + news_agency_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

             // delete rpstaff
             deleteRpstaff: function (news_agency_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.deleteRpstaff + '/' + news_agency_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

            // change rpstaff status
            changeNewsAgencyStatus: function (NewsAgency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeNewsAgencyStatus,
                    data: NewsAgency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             // change news agencies status
             changeStatusrpsatff: function (NewsAgency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.changeStatusrpsatff,
                    data: NewsAgency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get news agency details
            getNewsAgencyDetails: function (news_agency_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetNewsAgencyDetails + '/' + news_agency_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

            // update news agency
            updateNewsAgency: function (NewsAgency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateNewsAgency,
                    data: NewsAgency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get country risk level of a news news_agency
            countryRiskLevel: function (news_agency_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.CountryRiskLevel + "/" + news_agency_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save country specific info for particular news agency by super admin
            saveCountrySpecificInfo: function (NewsAgency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SaveCountrySpecificInfo,
                    data: NewsAgency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to save country color for particular news agency by super admin
            saveCountryColor: function (NewsAgency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SaveCountryColor,
                    data: NewsAgency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            getDepartmentList: function (client_id, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetDepartmentList,
                    data: client_id
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get all sectors 
            getAllSectors: function (category,fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllSectors,
                    data:category
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             loginAsClient: function (client_id, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.LoginAsClient,
                    data: client_id
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to create new rpstaff
            saveNewRPstaff: function (new_rpstaff, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.saveNewRPstaff,
                    data: new_rpstaff
                }).success(function (data, status, headers, config) {
                   
                    fn(data);
                }).error(function (err) {
                    console.log(err);
                    fn(err);
                });
            },

              // to get rpstaff details
              getAllRPstaff: function (new_rpstaff, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getAllRPstaff,
                    data: new_rpstaff
                }).success(function (data, status, headers, config) {
                  
                    fn(data);
                }).error(function (err) {
                   
                    console.log(err);
                    fn(err);
                });
            },



        }

    }]);