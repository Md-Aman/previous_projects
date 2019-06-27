'use strict';
const minLength = 2;
const maxLength = 100;
const responseHelper = require('../helper/handle-response.helper');
const _ = require('lodash');
const validateUrlParams = (req, res, done) => {
  req.check('email', 'Email field required.').notEmpty().isEmail().withMessage('Invalid Email address.').normalizeEmail();
  req.check('password', 'invalid password').notEmpty().isLength({ min: 6 }).withMessage('Min length sould be 6.');
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Email or password cannot be empty.',
                result.array()
              );
      }
      return done();
  });
}

const validateEmail = (req, res, done) => {
  req.check('email', 'invalid type').notEmpty().isEmail().normalizeEmail();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid email required.',
                result.array()
              );
      }
      return done();
  });
}

const validateDepartment = (req, res, done) => {
  req.check('department_name', 'Department name required.').notEmpty().trim().escape().isLength({ min: minLength,  max:maxLength })
    .withMessage(`Length should be from ${minLength} to ${maxLength}.`);
  // req.check('client_id', 'invalid url').notEmpty().trim();
  if ( typeof req.body.finalam != 'undefined') {
    req.check('finalam', 'Approving manager required').optional({checkFalsy: true}).notEmpty().trim();
  } else {
    req.check('final_approving_manager', 'Approving manager required').optional({checkFalsy: true}).notEmpty().trim();
  }
  
  req.check('basic_admin', 'Basic Admin required').optional({checkFalsy: true}).notEmpty().trim();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Fields are required.',
                result.array()
              );
      }
      return done();
  });
}

const validateCategory = (req, res, done) => {
  req.check('categoryName', 'invalid type').notEmpty().trim().escape();
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid client id').notEmpty().trim();
  }
  
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateQuestion = (req, res, done) => {
  req.check('best_practice_advice', 'invalid type').notEmpty().trim();
  req.check('question', 'invalid question').notEmpty().trim();
  req.check('category_id.*._id', 'invalid Category ID').notEmpty().trim();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateDeleteQuestion = (req, res, done) => {
  req.checkParams('questionnaire_id', 'invalid question Id type').notEmpty().trim()
    .escape().isAlphanumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid fields are required.',
                result.array()
              );
      }
      return done();
  });
}
// using in supplier change status as well, change ra status, question status
const validateStatus = (req, res, done) => {
  req.check('id', 'invalid id').notEmpty().trim().isAlphanumeric();
  req.check('status', 'invalid status').notEmpty().trim().escape();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateGetQuestion = (req, res, done) => {
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid id').notEmpty().trim().isAlphanumeric();
  }
  req.check('questionnaire_name', 'invalid string').trim().escape();
  if ( typeof req.body.category_id != 'undefined' ) {
    req.check('category_id', 'invalid category id').trim();
  }
  req.check('count', 'invalid count').notEmpty().trim().isNumeric();
  req.check('page', 'invalid page').notEmpty().trim().isNumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateAddSupplier = (req, res, done) => {
  req.body = JSON.parse(req.body.info);
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid id').notEmpty().trim().isAlphanumeric();
  }
  req.check('supplier_name', 'invalid supplier name').trim().escape();
  req.check('service_provided', 'invalid service provider').notEmpty().
    withMessage('Service provider required').trim();
  req.check('preparence', 'invalid preparence').notEmpty().trim();
  req.check('number', 'invalid phone number').notEmpty().
    withMessage('Phone Number required').trim();
  req.check('email', 'invalid email address').notEmpty().
    withMessage('Email required').trim().escape()
    .isEmail().withMessage('Valid email address required.');
  req.check('cost', 'invalid Cost.').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Cost field is required.').
    isNumeric().withMessage('Only digits are allowed.');
  req.check('address', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.check('website', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.check('sourced_by', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}

module.exports.validateAssignSupplier = (req, res, done) => {
  req.check('assignRaId', 'Invalid RA id').notEmpty().trim().isAlphanumeric();
  req.check('_id', 'Invalid supplier id').notEmpty().trim().isAlphanumeric();
  req.check('assign', 'data type is invalid').notEmpty().isBoolean();
 
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}

const validateUpdateSupplier = (req, res, done) => {
  req.body = JSON.parse(req.body.info);
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid id').notEmpty().trim().isAlphanumeric();
  }
  req.check('supplier_name', 'invalid supplier name').trim().escape();
  req.check('service_provided', 'invalid service provider').notEmpty().
    withMessage('Service provider required').trim();
  req.check('preparence', 'invalid preparence').notEmpty().trim();
  req.check('number', 'invalid phone number').notEmpty().
    withMessage('Phone Number required').trim();
  req.check('email', 'invalid email address').notEmpty().
    withMessage('Email required').trim().escape()
    .isEmail().withMessage('Valid email address required.');
  req.check('cost', 'invalid Cost.').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Cost field is required.').
    isNumeric().withMessage('Only digits are allowed.');
  req.check('address', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.check('website', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.check('sourced_by', 'invalid Address.').optional({ checkFalsy: true }).trim().escape();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateDeleteSupplier = (req, res, done) => {
  req.checkParams('supplier_id', 'invalid supplier Id').notEmpty().trim()
    .escape().isAlphanumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateRPstaff = (req, res, done) => {
  req.check('firstname', 'First Name is required.').notEmpty().
    withMessage('First name required').trim().isAlphanumeric()
    .withMessage('Please Enter Only Alphanumeric character allowed First Name Field.');

  req.check('lastname', 'Last name is required.').notEmpty().
    withMessage('Last name required').trim().isAlphanumeric()
    .withMessage('Please Enter Only Alphanumeric character allowed in Last Name Field.');

  req.check('password', 'invalid preparence').notEmpty().trim().isLength({ min: 6 }).withMessage('Password Min length sould be 6.');
  req.check('mobile_number', 'invalid phone number').notEmpty().
    withMessage('Phone Number required').trim();

  req.check('email', 'Email field is required.').notEmpty().
    withMessage('email required').trim().escape()
    .isEmail().withMessage('Valid email address required.');
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateIndividualRA = (req, res, done) => {
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid client id').notEmpty().
      withMessage('Client Id required').trim().isAlphanumeric()
      .withMessage('Only Alphanumeric character allowed.');
  }
  req.check('ra_name', 'invalid RA name').notEmpty().
    withMessage('RA name required').trim();

  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateAssignQuestionsToRa = (req, res, done) => {
  req.check('assignRaId', 'invalid assign id').notEmpty().
  withMessage('Assign Id required').trim().isAlphanumeric()
  .withMessage('Only Alphanumeric character allowed.');

  req.check('_id', 'invalid id').notEmpty().
  withMessage('Id required').trim().isAlphanumeric()
  .withMessage('Only Alphanumeric character allowed.');
 
req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
        return responseHelper.ResponseMiddlewareBadParamError(
              res, {}, 'Valid Fields are required.',
              result.array()
            );
    }
    return done();
});
}
const validateRaCommunicationByClientAdmin = (req, res, done) => {
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid client id').notEmpty().
      withMessage('Client Id required').trim().isAlphanumeric()
      .withMessage('Only Alphanumeric character allowed.');
  }
  req.check('types_of_ra_id', 'invalid type of ra id').notEmpty().
  withMessage('Type Of RA Id required').trim().isAlphanumeric()
  .withMessage('Only Alphanumeric character allowed.');

  if ( req.body._id ) {
    req.check('_id', 'invalid id').notEmpty().
    withMessage('Id required').trim().isAlphanumeric()
    .withMessage('Only Alphanumeric character allowed.');
  }
  
 
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateSubmitRaTemplate = (req, res, done) => {
  req.checkParams('ra_id', 'invalid ra Id type').notEmpty().trim()
  .escape().isAlphanumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateGetSupplier = (req, res, done) => {
  req.checkParams('supplier_id', 'invalid supplier Id type').notEmpty().trim()
  .escape().isAlphanumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateRiskLabels = (req, res, done) => {
  if ( typeof req.body.client_id != 'undefined' && req.body.client_id != '' ) {
    req.check('client_id', 'invalid id').notEmpty().trim().isAlphanumeric();
  }
  req.check('count', 'invalid count').notEmpty().trim().isNumeric();
  req.check('page', 'invalid page').notEmpty().trim().isNumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
} 
const validateAddNewsRa = (req, res, done) => {
  req.check('approvingManager', 'invalid client id').notEmpty().
  withMessage('Approving Id required').trim().isAlphanumeric()
  .withMessage('Only Alphanumeric character allowed.');

  req.check('country', 'invalid country').custom((item) => _.isArray(item) && item.length > 0)
  .withMessage('At least one department is required.');

  req.check('department', 'invalid department').notEmpty().
  withMessage('Department is required').trim();

  req.check('types_of_ra_id', 'invalid type of ra id').notEmpty().
  withMessage('Type of RA Id required').trim();
  // if not updating
  if ( typeof req.body._id == 'undefined' ) {
    req.check('date_of_ra', 'invalid end date').notEmpty().
    withMessage('End date required').trim();
  } else {
    req.check('enddate', 'invalid end date').notEmpty().
    withMessage('End date required').trim();
  }

  req.check('startdate', 'invalid start date').notEmpty().
  withMessage('Start date required').trim();

  req.check('description_of_task', 'invalid description.').notEmpty().
  withMessage('Description required').trim().escape();

  req.check('itineary_description', 'invalid itineary description.').notEmpty().
  withMessage('Itineary Description required').trim().escape();

  req.check('project_name', 'invalid project name.').notEmpty().
  withMessage('Project name required').trim().escape();
 
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
const validateSubmitRaToManager = (req, res, done) => {
  req.check('news_ra_id', 'invalid new ra id').notEmpty().trim().isAlphanumeric();
  req.check('types_of_ra_id', 'invalid type of ra id').notEmpty().trim().isAlphanumeric();
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}

module.exports.validateGetUserDetails = (req, res, done) => {
  req.check('user_id', 'Invalid User Id').notEmpty().trim().isAlphanumeric();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
        return responseHelper.ResponseMiddlewareBadParamError(
              res, {}, 'Valid Fields are required.',
              result.array()
            );
    }
    return done();
});
}
module.exports.validateSaveEmergencyApprovingManager = (req, res, done) => {
  req.check('reqFor', 'Invalid request for Id').notEmpty().trim().isAlphanumeric();
  req.check('approvingManager', 'Please Select Approving Manager from dropdown.').notEmpty().trim().isAlphanumeric();
  req.check('reason', "Please enter Reason for Emergency Information Approval.").notEmpty().trim().escape();
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
        return responseHelper.ResponseMiddlewareBadParamError(
              res, {}, 'Valid Fields are required.',
              result.array()
            );
    }
    return done();
});
}
module.exports.validateUpdateEmergencyApprovingManager = (req, res, done) => {
  req.check('id', 'Invalid User Id').notEmpty().trim().isAlphanumeric();
  req.check('status', "Invalid Status.").notEmpty().trim().escape().isIn(['pending', 'approve', 'reject']);
  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
        return responseHelper.ResponseMiddlewareBadParamError(
              res, {}, 'Valid Fields are required.',
              result.array()
            );
    }
    return done();
});
}
const validateSaveUser = (req, res, done) => {
  req.body = JSON.parse(req.body.info);
  req.check('client_id', 'Invalid new ra id').optional({ checkFalsy: true }).notEmpty().trim().isAlphanumeric();
  req.check('firstname', 'Invalid first name').notEmpty().trim().escape().isLength({ min: minLength, max: maxLength });
  req.check('lastname', 'Invalid last name').notEmpty().trim().escape().isLength({ min: minLength, max: maxLength });
  // req.check('gender', 'Invalid Gender').notEmpty().trim().escape().isIn(['male', 'female']);
  // req.check('dob', 'Invalid DOB').notEmpty().trim();
  req.check('email', 'Email is required.').notEmpty().trim().normalizeEmail().isEmail()
    .withMessage('Invalid Email.');
  req.check('mobile_number', 'Mobile number is required.').notEmpty().trim().escape();
  console.log('req.user.id', req.user.id);
  if ( req.user.id.toString() != req.body._id ) { // if user not updating profile
    req.check('usergroups', 'User group is required.').custom((item) => {
      return item._id != ''
     });
     req.check('department', 'Invalid Department ID').custom((item) => _.isArray(item) && item.length > 0)
      .withMessage('At least one department is required.');
  }
  
  
  // optional fields

  req.check('passport_data[*].nationality', 'Invalid Passport Nationality').optional({ checkFalsy: true }).trim().escape();
  req.check('passport_data[*].passport_number', 'Invalid Passort Number').optional({ checkFalsy: true }).trim().escape().isAlphanumeric()
  .isLength({ min: minLength, max: maxLength }).withMessage(`Passport Number Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_data[*].issuedate', 'Invalid Issue Date').optional({ checkFalsy: true }).trim().toDate();
  req.check('passport_data[*].expirydate', 'Invalid Expiry Date').optional({ checkFalsy: true }).trim().toDate();

  req.check('passport_details.full_name', 'Invalid Emergency Full Name').optional({ checkFalsy: true }).trim().escape()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.email', 'Invalid Emergency Email').optional({ checkFalsy: true }).trim().isEmail()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Emergency email Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.mobile_number', 'Invalid Mobile Number').optional({ checkFalsy: true }).trim().escape()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Emergency Mobile number Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.relationship_to_you', 'Invalid Emergency Relationship to You').optional({ checkFalsy: true }).trim().escape().isLength({ min: minLength, max: maxLength })
    .withMessage(`Emergency Relationship to you field Length should be from ${minLength} to ${maxLength}.`);

  req.check('passport_details.alternative_full_name', 'Invalid Alternative Full Name').optional({ checkFalsy: true }).trim().escape().isLength({ min: minLength, max: maxLength })
  .withMessage(`Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.alternative_email', 'Invalid Alternative Email').optional({ checkFalsy: true }).trim().isEmail()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.alternative_mobile_number', 'Invalid Alternative Mobile Number').optional({ checkFalsy: true }).trim().escape()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Length should be from ${minLength} to ${maxLength}.`);
  req.check('passport_details.alternative_relationship_to_you', 'Invalid Alternative Relationship to You').optional({ checkFalsy: true }).trim().escape()
    .isLength({ min: minLength, max: maxLength }).withMessage(`Alertnative relationship to you's field Length should be from ${minLength} to ${maxLength}.`);

  req.check('proof_of_life_answer', 'Invalid Proof Of Life Answer').optional({ checkFalsy: true }).trim().escape().isLength({ min: minLength, max: maxLength })
    .withMessage(`Proof of life answer Length should be from ${minLength} to ${maxLength}.`);

  req.check('proof_of_life_question', 'Invalid Proof Of Life Question').optional({ checkFalsy: true }).trim().escape()
    .isAlphanumeric().withMessage('Proof of life question should be Alphanumeric.');

    

  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateDeleteUser = (req, res, done) => {
  
  req.check('_id', 'Invalid new ra id').notEmpty({ checkFalsy: true }).notEmpty().trim().isAlphanumeric();
  req.check('firstname', 'Invalid first name').notEmpty().trim().escape().isLength({ min: minLength, max: maxLength });
  req.check('lastname', 'Invalid last name').notEmpty().trim().escape().isLength({ min: minLength, max: maxLength });
  req.check('email', 'Email is required.').notEmpty().trim().normalizeEmail().isEmail()
    .withMessage('Invalid Email.');
  
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateGetAllUser = (req, res, done) => {
  
  req.check('client_id', 'invalid id').optional({ checkFalsy: true }).notEmpty().trim().isAlphanumeric();
  req.check('keyword', 'invalid count').optional({ checkFalsy: true }).notEmpty().trim().escape();
  req.check('count', 'invalid count').notEmpty().trim().isNumeric();
  req.check('page', 'invalid page').notEmpty().trim().isNumeric();
  
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateSaveUserGroup = (req, res, done) => {
  
  req.check('groupname', 'invalid group name').notEmpty().trim().escape();
  req.check('typeof_group', 'invalid type of group').notEmpty().trim().isIn(['default', 'client']);
  // if ( req.body.typeof_group == "client" ) {
  //   req.check('clients', 'invalid client id').notEmpty().trim().isAlphanumeric();
  // }
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateSaveClient = (req, res, done) => {
  req.check('company_name', 'invalid company name.').notEmpty().trim().escape();
  req.check('type_of_client', 'invalid type of client.').notEmpty().trim().isIn(['basic', 'enhanced']);
  req.check('country', 'invalid country id.').notEmpty().trim().isAlphanumeric()
    .withMessage('Country should be Alphanumeric.');
  req.check('sector', 'invalid sector id.').notEmpty().trim().isAlphanumeric()
    .withMessage('Sector should be Alphanumeric.');
  req.check('no_of_approving_manager_account', 'invalid approving manager account.').notEmpty().trim().escape().isInt()
    .withMessage('Appoving Manager Account should be numeric.');
  req.check('no_of_client_admin_account', 'invalid client admin account.').notEmpty().trim().escape().isInt()
    .withMessage('Client Admin Account should be numeric.');
  req.check('no_of_co_admin_account', 'invalid admin account.').notEmpty().trim().escape().isInt()
    .withMessage('Admin Account should be numeric.');
  req.check('no_of_traveller_account', 'Invalid traveller account.').notEmpty().trim().escape().isInt()
  .withMessage('Traveller Account should be numeric.');
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateDeleteClient = (req, res, done) => {
  
  req.check('news_agency_id', 'invalid id.').notEmpty().trim().isAlphanumeric()
    .withMessage('ID should be Alphanumeric.');
  
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.ValidateAddSector = (req, res, done) => {
  req.check('sectorName', 'Invalid Passort Number').trim().escape()
  .isLength({ min: minLength, max: maxLength }).withMessage(`Sector name Length should be from ${minLength} to ${maxLength}.`);
  
  req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
          return responseHelper.ResponseMiddlewareBadParamError(
                res, {}, 'Valid Fields are required.',
                result.array()
              );
      }
      return done();
  });
}
module.exports.validateUrlParams = validateUrlParams;
module.exports.validateEmail = validateEmail;
module.exports.validateDepartment = validateDepartment;
module.exports.validateCategory = validateCategory;
module.exports.validateQuestion = validateQuestion;
module.exports.validateDeleteQuestion = validateDeleteQuestion;
module.exports.validateStatus = validateStatus;
module.exports.validateGetQuestion = validateGetQuestion;
module.exports.validateAddSupplier = validateAddSupplier;
module.exports.validateRPstaff = validateRPstaff;
module.exports.validateUpdateSupplier = validateUpdateSupplier;
module.exports.validateDeleteSupplier = validateDeleteSupplier;
module.exports.validateIndividualRA = validateIndividualRA;
module.exports.validateAssignQuestionsToRa = validateAssignQuestionsToRa;
module.exports.validateRaCommunicationByClientAdmin = validateRaCommunicationByClientAdmin;
module.exports.validateSubmitRaTemplate = validateSubmitRaTemplate;
module.exports.validateGetSupplier = validateGetSupplier;
module.exports.validateRiskLabels = validateRiskLabels;
module.exports.validateAddNewsRa = validateAddNewsRa;
module.exports.validateSubmitRaToManager = validateSubmitRaToManager;
module.exports.validateSaveUser = validateSaveUser;