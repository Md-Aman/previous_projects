"use strict"

angular.module('NewsRaService', [])

    .factory('NewsRa', ['$http', function ($http) {
        return {



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

            // get all countries
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

            // get all travellers
            getAllTravellers: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllTravellers,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get all approving manager
            getAllApprovingManger: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetAllApprovingManger,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get users list 
            getDeptRelatedUsers: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getDeptRelatedUsers,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             // get users list 
             getOthertraveller: function (traveller_id,fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getOthertraveller+"/"+traveller_id,

                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // get users list based on  
            getDeptRelatedUsersAprovingmanger: function (types_of_ra_id,fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getDeptRelatedUsersAprovingmanger+ "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to add news ra for traveller 
            addNewsRa: function (news_ra, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddNewsRa,
                    data: news_ra
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all news ra of a particular traveller
            getAllNewsRa: function (news_ra, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetAllNewsRa,
                    data: news_ra
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all categories
            getCategories: function (types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCategories + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get news ra details 
            getNewsRaDetails: function (newsRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetNewsRaDetails + '/' + newsRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update news ra 
            updateNewsRa: function (news_ra, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.UpdateNewsRa,
                    data: news_ra
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get questionnaire of category
            getCategoryQuestionnaire: function (category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCategoryQuestionnaire + '/' + category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // To add specific mitigation by traveller at questionnaire of a particular category.
            addQuestionnaireRa: function (questionnaire, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddQuestionnaireRa,
                    data: questionnaire,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // To get news ra details
            getNewsRa: function (newsRa_id, category_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetNewsRa + '/' + newsRa_id + '/' + category_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to submit news ra to approving manager
            submitRAToManager: function (radetails, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.SubmitRAToManager,
                    data:radetails,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to Genereate pdf from  approving manager side
            generatePDF: function (radetails, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.generatePDF,
                    data:radetails,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to check news ra submit status
            getNewsRaStatus: function (newsRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetNewsRaStatus + '/' + newsRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to delete news ra
            deleteNewsRa: function (newsRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.DeleteNewsRa + '/' + newsRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to copy news ra
            copyNewsRa: function (news_ra, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.CopyNewsRa,
                    data: news_ra
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save news ra communication form
            addNewsRaCommunication: function (communicationData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddNewsRaCommunication,
                    data: communicationData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to update news ra communication form
            updateNewsRaCommunication: function (communicationData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaCommunication,
                    data: communicationData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //to get news ra communication data
            getCommunicationData: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetCommunicationData + '/' + newsRa_id + '/' + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save news ra Contingencies
            addNewsRaContingencies: function (contingenciesData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddNewsRaContingencies,
                    data: contingenciesData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to update news ra Contingencies
            updateNewsRaContingencies: function (contingenciesData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaContingencies,
                    data: contingenciesData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            //to get news ra Contingency data
            getContingencyData: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getContingencyDatatraveller + '/' + newsRa_id + '/' + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save any other relevant info of news ra
            addAnyOtherInfo: function (otherInfo, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddAnyOtherInfo,
                    data: otherInfo
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update supplier for news ra
            updateNewsRaSupplier: function (otherInfo, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaSupplier,
                    data: otherInfo
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update supplier for news ra from approving manager
            updateNewsRaApprovingManager: function (newsradata, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaApprovingManager,
                    data: newsradata
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update supplier for news ra from approving manager
            updateNewsRaSupplierApprovingManager: function (supplier, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaSupplierApprovingManager,
                    data: supplier
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update communication for news ra from approving manager
            updateNewsRaCommunicationApprovingManager: function (communication, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaCommunicationApprovingManager,
                    data: communication
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to update contigency for news ra from approving manager
            updateNewsRaContigencyApprovingManager: function (contigency, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateNewsRaContigencyApprovingManager,
                    data: contigency
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to save supplier for news ra
            addNewsRaSupplier: function (otherInfo, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddNewsRaSupplier,
                    data: otherInfo
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get supplier data
            getSupplierData: function (newsRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetSupplierData + '/' + newsRa_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get all countries
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


            // to get all currencies
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

            // to get department list
            getDepartmentList: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRADepartmentList,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra details to check type of ra (genetic or individual)
            getRaDetails: function (raId, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaDetails + "/" + raId,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get questions of selected ra
            getRaQuestions: function (raId, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaQuestions + "/" + raId,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to save specific mitigation for ra by traveller
            addQuestionToRa: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.AddQuestionToRa,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             // to save specific mitigation for ra by traveller
             addQuestionToRaupdate: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.addQuestionToRaupdate,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

             // to save specific mitigation for ra by traveller
             insertquestiontora: function (questionData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.insertquestiontora,
                    data: questionData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get ra specific mitigation fill by traveller
            getRaAnswers: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRaAnswers + "/" + newsRa_id + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get supplier details of particular ra before submit
            getSupplierDetailsOfRaLocalContact: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getSupplierDetailsOfRaLocalContact + "/" + newsRa_id + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to get supplier details of particular ra before submit
            getSupplierDetailsOfRaLocalDriver: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getSupplierDetailsOfRaLocalDriver + "/" + newsRa_id + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get supplier details of particular ra before submit
            getSupplierDetailsOfRaAccomadation: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getSupplierDetailsOfRaAccomadation + "/" + newsRa_id + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
             // delete approving manager
             deleteOthersuppliers: function (user_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.deleteOthersuppliers + '/' + user_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });

            },
            // to get supplier details of particular ra before submit
            getSupplierDetailsOfRaOther: function (newsRa_id, types_of_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.getSupplierDetailsOfRaOther + "/" + newsRa_id + "/" + types_of_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            getSupplierRaData: function (ra_id, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getSupplierRaData,
                    data: ra_id
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            getRaCommunicationData: function (types_of_ra_id, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getRaCommunicationData,
                    data: types_of_ra_id
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            getRaContingencyData: function (types_of_ra_id, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getRaContingencyData,
                    data: types_of_ra_id
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get ra preview data
            getRaPreviewData: function (newsRa_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetRasPreviewData + "/" + newsRa_id,
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
            getCountryThreatMatrix: function (country, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.GetCountryThreatMatrix ,
                    data: country
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // get all news ra list for pending risk assessment for Approving Manager
            getAllpendingnewsRa: function (newsRa, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getAllpendingnewsRa,
                    data: newsRa
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // get all news ra list for pending risk assessment for Approving Manager based client not dept
            getAllclientnewsRa: function (newsRa, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.getAllclientnewsRa,
                    data: newsRa
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to approve news ra
            approveNewsRa: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ApproveNewsRa,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },




            // get news ra details
            getNewsRadetails: function (news_ra_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetNewsRadetails + "/" + news_ra_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to reject ra
            rejectRa: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.RejectRa,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to send ra to traveller again for more information
            wantMoreInfoRa: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.WantMoreInfoRa,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get approving managers 
            getApprovingManagers: function (fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetApprovingManagers,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to get travellers list
            getTravellers: function (traveller_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetTravellers + "/" + traveller_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to approved ra by approving manager
            approveRaByManager: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ApproveRaByManager,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to forward RA to other managers
            forwardToManager: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.forwardToManager,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to reject ra by approving manager
            rejectRaByManager: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.RejectRaByManager,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            // to request traveller MedicalInformation 
            travellerMedicalInformation: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.TravellerMedicalInformation,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },


            // to request more info for ra by approving manager
            moreInfoRaByManager: function (raData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.MoreInfoRaByManager,
                    data: raData,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            // to get details of traveller
            getMedicalInfoByRequest: function (traveller_id, fn) {
                return $http({
                    method: 'GET',
                    url: webServices.GetMedicalInfoByRequest + "/" + traveller_id,
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
            viewTravellerMedicalInfo: function (travellerData, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.ViewTravellerMedicalInfo,
                    data: travellerData
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            updateEditRa: function (RaDataNew, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.updateEditRa,
                    data: RaDataNew
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },

            inserttora: function (newsranswers, fn) {
                return $http({
                    method: 'POST',
                    url: webServices.inserttora,
                    data: newsranswers
                }).success(function (data, status, headers, config) {
                    fn(data);
                }).error(function (err) {
                    fn(err);
                });
            },
                //removeDoc
                removeDoc: function (doc, fn) {
                    return $http({
                        method: 'POST',
                        url: webServices.RemoveDoc,
                        data: doc
                    }).success(function (data, status, headers, config) {
                        fn(data);
                    }).error(function (err) {
                        fn(err);
                    });
                },



        }
    }]);