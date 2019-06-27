"use strict"

angular.module('UsergroupService', [])

    .factory('Usergroup', ['$http', function ($http) {
        return {
            // save user groups 
            saveUsergroup: function (usergroup,fn) {
                return $http({
                    method: 'POST',
                    url: webServices.saveUsergroup,
                    data:usergroup
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

              // get all usergroups
              getAllusergroup: function (usergroup, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getAllusergroup,
                    data: usergroup
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

             // get all usergroups
             getAllClients: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getAllClients,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            
             // get usergroup details
             getUsergroupDetails: function (usergroup_id,fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getUsergroupDetails+ '/' + usergroup_id,
                   
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log(err);
                    fn(err);
                });
            },

            // Update usergroup details
            updateUsergroup: function (usergroups,fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateUsergroup,
                    data:usergroups
                   
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    console.log(err);
                    fn(err);
                });
            },

             // delete usergroup_id
             deleteUsergroup: function (usergroup_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.deleteUsergroup + '/' + usergroup_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },













            
        }

    }])
  
    
    
    
    ;