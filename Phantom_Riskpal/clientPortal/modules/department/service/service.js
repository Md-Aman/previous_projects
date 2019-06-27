"use strict"

angular.module('DepartmentService', [])

    .factory('Department', ['$http', function ($http) {
        return {

            //to get all approving managers 
            getUsers: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getUsers + '/' + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get all clients for super admin
            getClients: function(fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getAllClients,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            //to get all approving managers 
            getUsers_trackconnect: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getUsers_trackconnect + '/' + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             //to get all approving managers 
             getRelatedTemplate: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getRelatedTemplate + '/' + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            getRelatedUser: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getRelatedUser + '/' + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
              //to get all approving managers 
              getTemplates: function (client_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getTemplates + '/' + client_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            //to get all approving managers 
            getAllApprovingManagers: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllApprovingManagers,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            //to get all approving managers 
            getBasicAdminforDepartment: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetBasicAdminforDepartment,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save department
            saveDepartment: function (department, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SaveDepartment,
                    data: department
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all department
            getAllDepartment: function (department, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllDepartment,
                    data: department
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete department
            deleteDepartment: function (department_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteDepartment + "/" + department_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to change status of department
            changeDepartmentStatus: function (department, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeDepartmentStatus,
                    data: department
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get department details
            getDepartmentDetail: function (department_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetDepartmentDetail + "/" + department_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update department details
            updateDepartment: function (department, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateDepartment,
                    data: department
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get travelles 
            getTravellersForDepartment: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetTravellersForDepartment,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
        }


    }]);
