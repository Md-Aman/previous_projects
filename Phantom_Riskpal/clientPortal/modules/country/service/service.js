"use strict"

angular.module('CountryService', [])

  .factory('Country', ['$http', function ($http) {
    return {

      // get all country 
      getAllCountries: function (fn) {
        return $http({
          method: 'GET',
          url: webServices.GetAllCountries,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      // get country matrix logs
      getCountryMatrixLogs: function (payload, fn) {
        return $http({
          method: 'POST',
          url: webServices.getCountryMatrixLogs,
          data: payload
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      
      // get all country threat matrix
      getCountriesForThreatMatrix: function (fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCountriesForThreatMatrix,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      // to save country specification
      saveCountrySpecificInfo: function (countryData, fn) {
        return $http({
          method: 'POST',
          url: webServices.SaveCountrySpecificInfo,
          data: countryData
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },


      // to save country color 
      saveCountryColor: function (countryData, fn) {
        return $http({
          method: 'POST',
          url: webServices.SaveCountryColor,
          data: countryData
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      // to get all categories
      getAllCategories: function (fn) {
        return $http({
          method: 'GET',
          url: webServices.GetAllCategories,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      // to save country threat matrix
      saveCountryThreatMatrix: function (countryThreatMatrixData, fn) {
        return $http({
          method: 'POST',
          url: webServices.SaveCountryThreatMatrix,
          data: countryThreatMatrixData
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      getCountryList: function (fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCountryList,
          //   data: data
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },


      // to get all categories list
      getCategoriesList: function (fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCategoriesList,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },


      // to get threat matrix of a Country
      getCountryThreatMatrix: function (country_id, fn) {
        return $http({
          method: 'GET',
          url: webServices.GetCountryThreatMatrix + "/" + country_id,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },

      // get all countries for specfic information 
      getAllCountry: function (country_id, fn) {
        return $http({
          method: 'GET',
          url: webServices.GetAllCountry + "/" + country_id,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },
      getSupplierForCountry: function (country_id, fn) {
        return $http({
          method: 'GET',
          url: webServices.GetSupplierForCountry + "/" + country_id,
        }).success(function (data, status, headers, config) {
          fn(data);
        }).error(function (err) {
          fn(err);
        });
      },
      //  addInformation: function(countryData, fn) {
      //   return $http({
      //     method: 'POST',
      //     url: webServices.AddInformation,
      //     data: countryData
      //   }).success(function(data, status, headers, config) {
      //     fn(data);
      //   }).error(function(err) {
      //     fn(err);
      //   });
      // },
    }
  }])
