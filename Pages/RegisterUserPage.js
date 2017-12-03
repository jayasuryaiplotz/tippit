var Observable = require('FuseJS/Observable');
var Preferences = require('Utils/Preferences');

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');

var emailValue = Observable("");
var firstNameValue = Observable("");
var lastNameValue = Observable("");
var passwordValue = Observable("");

function registerButton_clickHandler() {
    callRegister();
}

function callRegister() {
    if (emailValue.value !== "" && firstNameValue.value !== "" && lastNameValue.value !== "" && passwordValue.value !== "") {

        if (passwordValue.value.length < 6) {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.password_too_short });
        } else {
            if (isValidEmail(emailValue.value)) {
                busy.activate();

                _WebService.apiUserRegistration(emailValue.value, firstNameValue.value, lastNameValue.value, passwordValue.value).then(function (result) {
                    gotRegisterResult(result);
                }).catch(function (error) {
                    busy.deactivate();
                    showNetworkErrorMessage();
                });

            }

        }
    }
}

function isValidEmail(email) {
    var emailExpression = /([a-z0-9._-]+?)@([a-z0-9.-]+)\.([a-z]{2,4})/;
    return emailExpression.test(email);
}


function gotRegisterResult(rawData) {
    console.log("gotRegisterResult")
    busy.deactivate();

    var arr = rawData;
    console.log(arr.status)

    if (arr.status == "success") {
        var resultObj = arr.result;

        Preferences.write("email", resultObj.user_email);
        router.goBack();
    } else {
        if (arr.error[0] == "email_exists") {
            emailValue.value = "";
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.email_already_taken });
        } else {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.network_error_message });
        }
    }

}

function cancel_clickHandler() {
    router.goBack();
}

function showNetworkErrorMessage() {
    busy.deactivate();
    tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.network_error_message });
}


module.exports = {
    emailValue: emailValue,
    firstNameValue: firstNameValue,
    lastNameValue: lastNameValue,
    passwordValue: passwordValue,
    registerButton_clickHandler: registerButton_clickHandler,
    cancel_clickHandler: cancel_clickHandler
}