"use strict"

angular.module('CategoryService', [])

    .factory('Category', ['$http', function ($http) {
        return {
            // get all categories
            getAllCategories: function (categoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllCategories,
                    data: categoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete category
            deleteCategory: function (category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteCategory + "/" + category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // change category status
            changeCategoryStatus: function (categoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeCategoryStatus,
                    data: categoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all countries
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

            // to add categories
            addCategory: function (categoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddCategory,
                    data: categoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get category details 
            getCategoryDetails: function (category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCategoryDetails + "/" + category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to udpate category
            updateCategory: function (categoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateCategory,
                    data: categoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all risk associated categories
            getAllRiskAssociatedCategories: function (riskCategoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllRiskAssociatedCategories,
                    data: riskCategoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete risk associated categories
            deleteRiskAssociatedCategory: function (risk_associated_category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteRiskAssociatedCategory + "/" + risk_associated_category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to change status of risk associated categories
            changeRiskCategoryStatus: function (riskCategoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeRiskCategoryStatus,
                    data: riskCategoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // add risk associated categories
            addRiskAssociatedCategory: function (riskCategoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddRiskAssociatedCategory,
                    data: riskCategoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get risk associated category details
            getRiskAssociatedCategoryDetails: function (risk_associated_category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRiskAssociatedCategoryDetails + "/" + risk_associated_category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update risk associated Category
            updateRiskAssociatedCategory: function (riskCategoryData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateRiskAssociatedCategory,
                    data: riskCategoryData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to mark category as mandatory and non mandatory
            markAsMandatory: function (category, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.MarkAsMandatory,
                    data: category
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all type of ra
            getTypesOfRa: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetTypesOfRa,
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
                    data: category
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            }

        }

    }]);