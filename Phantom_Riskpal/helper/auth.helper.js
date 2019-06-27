/**
 * Created by olyjosh on 29/06/2017.
 */
var createError = require('http-errors');
var config = require('../config/jwt_secret.js');

exports.saveSession = function ( req, params, user) {
    params.roles = user.roleId;
    const sessData = req.session;
    sessData.userData = params;
    console.log('sess',sessData);

};
exports.destroySession = function (req ) {
    req.session.destroy(function(err) {
        // cannot access session here
      });
};

exports.permission = function (permission) {
    return function(req, res, next) {
      const sessData = req.session.userData;
      if ( process.env.NODE_ENV == 'test' ) {
          console.log('hiiiisssssss');
          next();
          return;
      }
      if ( permission == 'super_admin' || sessData.super_admin ) {
        return exports.superAdmin(sessData, res, next);
      } else {
        const roles = sessData.roles;
        console.log('permission', permission);
        if ( Array.isArray(permission) ) {
            // its array of object
            return exports.checkArrayRole(roles, permission, next);
            
        } else {
            // its object
            return exports.checkRole(roles, permission.parent, permission.child, next);
        }
      }
      
      console.log('roles permi', roles);
    //   next();
    };
  }
  exports.checkArrayRole = function (roles, permission, next) {
      try {
        const allowed = permission.map(item => {
            const parent = item.parent;
            const childKey = item.child;
            if ( typeof roles[parent] === 'object' && ( roles[parent][childKey] === '1' || roles[parent][childKey] === 'true') ) {
                return "true";
              } else {
               return "false";
              }    
        });
        console.log('fffaf', allowed);
        if ( allowed.indexOf('true') > -1 ) {
            next();
        } else {
            next(createError(config.methodNotAllowed, 'You are not allowed.'));
        }
      } catch (e) {
        next(createError(config.methodNotAllowed, 'You are not allowed.'));
      }
    
  }
  exports.checkRole = function (roles, parent, childKey, next) {
      console.log('done', roles);
      try {
        if ( typeof roles[parent] === 'object' && ( roles[parent][childKey] === '1' || roles[parent][childKey] === 'true') ) {
          next();
        } else {
          next(createError(config.methodNotAllowed, 'You are not allowed.'));
        }
      } catch (e) {
        next(createError(config.methodNotAllowed, 'You are not allowed.'));
      }
  }
exports.superAdmin = function (sessData, res, next) {
  try {
    if ( sessData.super_admin || sessData.super_admin == 'true' ) {
      console.log('innn', sessData.super_admin);
      next();
  } else {
      console.log('sessData.super_admin', sessData.super_admin);
      next(createError(config.methodNotAllowed, 'You are not allowed.'));
  }
  } catch (e) {
    next(createError(config.methodNotAllowed, 'You are not allowed.'));
  }
    
}