var Observable = require('FuseJS/Observable');
var Preferences = require('Utils/Preferences');

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');


var emailValue = Observable("");
var passwordValue = Observable("");

var status = 0;
var response_ok = false;

function onViewActivate() {
    console.log("onLoginViewStart readTextFromFile");

    var emailStored = Preferences.read("email", false);
    console.log("emailStored " + emailStored);
    if (emailStored) {
        emailValue.value = emailStored;
    }

}

function login_clicked() {
    busy.activate();

    _WebService.apiAuthenticate(emailValue.value, passwordValue.value).then(function (loginResult) {
        gotLoginResult(loginResult);
    }).catch(function (error) {
        busy.deactivate();
        console.log("Couldn't get data: " + error);
    });
}

function gotLoginResult(loginResult) {
    busy.deactivate();
    var arr = loginResult;

    if (arr.status == "success") {
        Preferences.write("email", emailValue.value);

        var resultObj = arr.result;
        logedInDataProcess(resultObj);
    } else {

        if (arr.error == "noNetwok") {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.network_error_message });
        } else {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.invalid_username_password });
        }
    }

}

function logedInDataProcess(resultObj) {
    console.log("logedInDataProcess")
    console.log(JSON.stringify(resultObj))

    _model.accessToken = resultObj.access_token;
    Preferences.write("access_token", resultObj.access_token);

    _model.phpFiatChain = resultObj.crypto_addresses.managed.php_fiat_chain;
    _model.userId = resultObj.id;
    router.goto("loginCompletePage");

}


function forgotPassword_clickHandler() {
    router.push("forgotPasswordPage");
}

function registerButton_clickHandler() {
    router.push("registerUserPage");
}


module.exports = {
    onViewActivate: onViewActivate,
    login_clicked: login_clicked,
    emailValue: emailValue,
    passwordValue: passwordValue,
    forgotPassword_clickHandler: forgotPassword_clickHandler,
    registerButton_clickHandler: registerButton_clickHandler
}