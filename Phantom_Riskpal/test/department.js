var config = require('./config');
var expect  = require('chai').expect;
var request = require('request');
var constant = require('./constant');
var url = constant.url;
var urlDept = constant.url + constant.dept;
var authUser = {};

describe('Department', function() {

    before((done) => {
       config.authenticateUser()
        .then(data => {
            authUser.token = data;
            return done();
        }).catch(error => {
            console.log('error', error);
        });
        
    });

    describe ('Get Department list', function() {
        it('status', function(done){
            request.post({
                    url : urlDept,
                    headers : {
                        "Authorization" : authUser.token
                    }
                },
                function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });


        it('content', function(done) {
            request.post({
                url : urlDept,
                headers : {
                    "Authorization" : authUser.token
                },
                json: {
                    "client_id": constant.clientId,
                    "count": constant.count,
                    "page": constant.page,
                    "sortby": constant.sortBy
                }
            }, function(error, response, body) {
                expect(body.data).to.have.lengthOf.above(0);
                done();
            });
        });

        // add department
        it('Add department', function(done) {
            var data = {
                department_name: "testing dept 1" + Math.random(),
                status: 'Active',
                client_id: constant.clientId,
                finalam: constant.finalApprovingManager,
                alternative_final_approving_manager: constant.alternativeFinalApprovingManager,
                basic_admin: constant.basicAdmin,
                newusers: constant.assignUser
            };
        
            request.post({
                url : url + 'super_admin/saveDepartment',
                    headers : {
                        "Authorization" : authUser.token
                    },
                    json: data
                }, function(error, response, body) {
                    console.log('response', response);
                    console.log('bodyyy', body);
                    expect(body.code).to.equal(200);
                    done();
                });
        });

        // add department
        it('Update department', function(done) {
            var data = {
                _id: '5bfe2798c85c574830301413',
                department_name: "testing dept 122",
                status: 'Active',
                client_id: constant.clientId,
                finalam: constant.finalApprovingManager,
                alternative_final_approving_manager: constant.alternativeFinalApprovingManager,
                basic_admin: constant.basicAdmin,
                newusers: constant.assignUser
            };
            request.post({
                url : url + 'admin/updateDepartment',
                    headers : {
                        "Authorization" : authUser.token
                    },
                    json: data
                }, function(error, response, body) {
                    console.log('bodyyy update', body);
                    expect(body.code).to.equal(200);
                    done();
                });
        });

    });

    
});



