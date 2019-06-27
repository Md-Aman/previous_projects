/*
 * Constant messages are declared here
 * Constants - Constants.js
 * Author: smartData Enterprises
 * Created by Sunny
 * Date: 8 June 2017
 */
const config = {
    "cryptoAlgorithm": "aes-256-ctr",
    "cryptoPassword": 'd6F3Efeq'
}

const messages = {
    "loginSuccess": "Logged in successfully",
    "signupSuccess": "Signup successfully, please check you email to activate your account",
    "dataRetrievedSuccess": "Data retrieved successfully",
    "errorRetreivingData": "Error in retrieving data",
    "noDataFound": "No Data Found",
    "logoutSuccess": "Successfully logout",
    "successInChangePassword": "Password changed successfully",
    "forgotPasswordSuccess": "Password sent successfully, please check your mail",
}

const validationMessages = {
    "emailAlreadyExist": "Email Id already exist, try with another",
    "diseaseAlreadyExist": "Disease already exist, try with another",
    "usernameAlreadyExist": "Username already exist, try with another",
    "emailRequired": "Email is required",
    "firstnameRequired": "First name is required",
    "passwordRequired": "Password is required",
    "invalidEmail": "Invalid Email Given",
    "invalidEmailOrPassword": "Invalid email or password",
    "internalError": "Internal error",
    "requiredFieldsMissing": "Required fields missing",
    "emailNotExist": "Email doesn't exist",
    "userNotFound": "User not found",
    "passwordNotMatch": "New password should not be same as old password",
    "noRecordFound": "No record found",
}

const emailSubjects = {
    "forgotPassword": "Forgot password"
}

const emailKeyword = {
    "WelComeEmail": "WelComeEmail",
    "NewsRADetails": "NewsRADetails",
    "WelComeEmailTowing": "WelComeEmailTowing",
    "SendAppointmnetByPatient": "SendAppointmnetByPatient",
    "ConfirmAppointmnetByClinician": "ConfirmAppointmnetByClinician",
    "ForgotPassword": "ForgotPassword",
    "NewClient":"NewClient",
    "NewRiskPalAccount":"NewRiskPalAccount",

}

const smtpConfig = {
    "service": "Gmail",
    "host": "smtp.gmail.com",
    "username": "dineshdazzler93@gmail.com",
    "password": "dineshdazzler93"
}

var obj = {
    config: config,
    messages: messages,
    validationMessages: validationMessages,
    emailSubjects: emailSubjects,
    emailKeyword: emailKeyword,
    smtpConfig: smtpConfig

}

module.exports = obj;
