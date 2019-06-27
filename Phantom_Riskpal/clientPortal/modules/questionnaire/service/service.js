"use strict"

angular.module('QuestionService', [])

    .factory('Question', ['$http', function ($http) {
        return {

            //add questionnaire
            addQuestionnaire: function (questionnaire, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddQuestionnaire,
                    data: questionnaire
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // change order of questions 
            changeOrderOfQuestion: function (questionnair, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeOrderOfQuestion,
                    data: questionnair
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get all questionnairs of selected category
            getAllQuestionnaire: function (category, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllQuestionnaire,
                    data: category
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //delete questionnairs of a category
            deleteQuestionnair: function (questionnair_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteQuestionnair + '/' + questionnair_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

            // get questionnair details based on id
            getQuestionnairDetail: function (questionnair_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetQuestionnairDetail + '/' + questionnair_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // update questionnaire
            updateQuestionnaire: function (questionnaire, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateQuestionnaire,
                    data: questionnaire
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // change questionnaire status 
            changeQuestionnaireStatus: function (questionnaire, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ChangeQuestionnaireStatus,
                    data: questionnaire
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all category
            getCategories: function (question,fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetCategories,
                    data:question
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },

            // to get all types of ra
            getAllRa: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllRa,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get categories of selected ra
            getRaCategories: function (typeOfRaId, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaCategories + "/" + typeOfRaId,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get questions of selected risk label
            getQueOfSelectedRiskLabel: function (quesData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetQueOfSelectedRiskLabel,
                    data: quesData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            }
        }


    }]);