"use strict"

angular.module('UserService', [])

    .factory('User', ['$http', function ($http) {
        return {

            

             //getUsergroup details with selection of user
             getDepartmentusers: function(client_id, fn){

                return $http({
                    method: 'GET',
                    url: webServices.getDepartmentusers+ '/' + client_id,
                  
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },  
            

            //getUsergroup details with selection of user
            getUsergroups: function(client_id, fn){

                return $http({
                    method: 'GET',
                    url: webServices.getUsergroups+ '/' + client_id,
                  
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },  

              // add approving manager 
              saveUser: function (userform, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.saveUser,
                    data: userform
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


              //list all users
              getAllUser: function (approving_manager, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getAllUser,
                    data: approving_manager
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },



            

            // add approving manager 
            addApprovingManager: function (approving_manager, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddApprovingManager,
                    data: approving_manager
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //list approving manager
            listApprovingManager: function (approving_manager, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ListApprovingManager,
                    data: approving_manager
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // change approving manager status
            changeUserStatus: function (user, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.changeUserStatus,
                    data: user
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

              // get approving manager details
              getUserDetails: function (user_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getUserDetails + '/' + user_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // delete approving manager
            deleteUsers: function (user_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.deleteUsers + '/' + user_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

            // get approving manager details
            getApprovalManagerDetails: function (approving_manager_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetApprovalManagerDetails + '/' + approving_manager_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // update user 
            updateUser: function (userdata, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateUser,
                    data: userdata
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get department list
            getDepartmentList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getDepartmentListuser,
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
