"use strict"

angular.module('DashboardService', [])

    .factory('Dashboard', ['$http', function ($http) {
        return {
            // get all client count for master admin 
            getClientCount: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetClientCount
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

              // get all types of ra
              getAllTypeOfRa: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllTypeOfRa,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
        }

    }])
  
    
    
    
    ;