"use strict"

angular.module('BusinessTravelRaService', [])

    .factory('BusinessTravelRa', ['$http', function ($http) {
        return {
            // get all countries
            getCountriesName: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCountriesName,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to add categories for business travel ra
            addBizTravelCategory: function (bizCatData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddBizTravelCategory,
                    data: bizCatData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all business travel categories
            getAllBizCategories: function (bizCatData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllBizCategories,
                    data: bizCatData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            }
        }

    }]);