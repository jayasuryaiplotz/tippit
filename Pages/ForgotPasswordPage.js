var Observable = require('FuseJS/Observable');

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');

var emailValue = Observable("");

var busyAnimShow = Observable(false);

function resetButton_clickHandler() {
    callReset();
}

function callReset() {
    if (emailValue.value !== "") {

        if (isValidEmail(emailValue.value)) {
            busy.activate();

            _WebService.apiForgotPassword(emailValue.value).then(function (result) {
                gotForgotPasswordResult(result);
            }).catch(function (error) {
                busy.deactivate();
                showNetworkErrorMessage();
            });

        }

    }
}

function isValidEmail(email) {
    var emailExpression = /([a-z0-9._-]+?)@([a-z0-9.-]+)\.([a-z]{2,4})/;
    return emailExpression.test(email);
}

function gotForgotPasswordResult(rawData) {
    console.log("gotForgotPasswordResult")
    busy.deactivate();

    var arr = rawData;
    console.log(arr.status)

    if (arr.status == "success") {
        var resultObj = arr.result;
        // MessageAlert.info(resourceManager.getString('resources', 'forgot_link_sent_success'), resourceManager.getString('resources', 'reset_password'), alertClosedHandler);

    } else {
        if (arr.result == "noNetwok") {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.network_error_message });
        } else {
            tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.forgot_not_registered_user });
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
    resetButton_clickHandler: resetButton_clickHandler,
    cancel_clickHandler: cancel_clickHandler
}