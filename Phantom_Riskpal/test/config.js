var request = require('./node_modules/request');
var constant = require('./constant');
var url = constant.url;

exports.authenticateUser = function () {
    return new Promise((resolve, reject) => {
        request.post({
            url : url + 'super_admin/superAdminLogin',
            json: {
                email: constant.userName,
                password: constant.password,
            }
        },
        function(error, response, body) {
            if ( error ) {
                reject(error);
            }
             resolve(body.data.duoToken);
        });
    });

}