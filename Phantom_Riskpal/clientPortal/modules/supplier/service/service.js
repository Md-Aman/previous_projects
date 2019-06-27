"use strict"

angular.module('SupplierService', [])

    .factory('Supplier', ['$http', function ($http) {
        return {

            //add addSupplier 
            addSupplier: function (supplier, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddSupplier,
                    data: supplier
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // list supplier
            getAllSupplier: function (supplier, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllSupplier,
                    data: supplier
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get DepartmentList
           getDepartmentList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetDepartmentList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get supplier details
            getSupplierDetails: function (supplier_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetSupplierDetails + '/' + supplier_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //update supplier
            updateSupplier: function (supplier, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateSupplier,
                    data: supplier
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            //change supplier status
            changeSupplierStatus: function (supplier, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeSupplierStatus,
                    data: supplier
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // delete supplier
            deleteSupplier: function (supplier_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteSupplier + '/' + supplier_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get all currencies list 
            getAllCurrencies: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllCurrencies,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

        }


    }]);
