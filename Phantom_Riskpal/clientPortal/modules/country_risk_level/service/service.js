"use strict"

angular.module('CountryRiskLevelService', [])

  .factory('CountryRiskLevel', ['$http', function($http) {
    return {
      // get all country list with risk levels of news agency
      countryRiskLevelForAllAgencies: function(fn) {
        return $http({
          method: 'GET',
          url: webServices.CountryRiskLevelForAllAgencies
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      // to save color code for a country to all news agency
      saveCountryColorForAllNewsAgency: function(countryData, fn) {
        return $http({
          method: 'POST',
          url: webServices.SaveCountryColorForAllNewsAgency,
          data: countryData
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      // to save country specific information for all news agency
      countrySpecificInfoForAllAgency: function(countryData, fn) {
        return $http({
          method: 'POST',
          url: webServices.CountrySpecificInfoForAllAgency,
          data: countryData
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      // to get all category list
      getAllCategoryList: function(fn) {
        return $http({
          method: 'GET',
          url: webServices.GetAllCategoryList
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      // to get all country threat matrix
      getCountriesForThreatMatrix: function(fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCountriesForThreatMatrix
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      // to save country threat matrix common for all client admins by master admins
      saveCountryThreatMatrix: function(threatMatrix, fn) {
        return $http({
          method: 'POST',
          url: webServices.SaveCountryThreatMatrix,
          data: threatMatrix
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },
      
      getCountryList: function(fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCountryList,
          //   data: data
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },


      // to get all categories list
      getCategoriesList: function(fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCategoriesList,
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },
      // to get threat matrix of a Country
      getCountryThreatMatrix: function(country_id, fn) {
        console.log('in rikslevel');
        return $http({
          method: 'POST',
          url: webServices.GetCountryThreatMatrix ,
          data: country_id
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

      addInformation: function(countryData, fn) {
        return $http({
          method: 'POST',
          url: webServices.AddInformation,
          data: countryData
        }).success(function(data, status, headers, config) {
          fn(data);
        }).error(function(err) {
          fn(err);
        });
      },

    }

  }]);
