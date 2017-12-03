var Observable = require('FuseJS/Observable');
var qrEncoder = require("Utils/QrEncoder");
var QrScanner = require("QrScanner");
var Validator = require('Utils/Validator');

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');

var balanceText = Observable(0);
var fiatChainData = Observable();
var fiatChainQrData = Observable();

function onViewActivate() {
    fiatChainQrData.clear();
    var phpFiatChainStr = _model.phpFiatChain.toString();
    var userIdStr = _model.userId.toString();
    fiatChainData.value = phpFiatChainStr;

    //var bitMatrix = qrEncoder.encode(phpFiatChainStr, 1);
    var bitMatrix = qrEncoder.encode(userIdStr, 1);
    fiatChainQrData.addAll(bitMatrix);

    loadUserWalletTotalCall();
}

function loadUserWalletTotalCall() {
    busy.activate();

    _WebService.apiEnergyTotal(1).then(function (result) {
        gotLoadEnergyTotalResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });
}

function gotLoadEnergyTotalResult(result) {
    busy.deactivate();

    var arr = result;

    if (arr.status == "success") {
        var resultObj = arr.result;
        if (resultObj) {
            balanceText.value = resultObj[0].balance_amount;
        } else {
            balanceText.value = 0;
        }

    }
}


var giftSendPopupShow = Observable(false);
var sendAddressPopupShow = Observable(false);
var amountInputGift = Observable();
var giftQrData = Observable();
function giftSendClicked() {
    giftSendPopupShow.value = true;
    amountInputGift.value = "";
    giftQrData.clear();

}

function giftQRHandler() {
    if (!Validator.amount(amountInputGift.value)) {
        tagEvents.emit("toastShow", { message: "Amount should not be empty" });
        return;
    }

    var bitMatrix = qrEncoder.encode(amountInputGift.value, 1);
    giftQrData.addAll(bitMatrix);
}


function qrScanClicked() {
    QrScanner.Init("QRCODE", false, true);
    QrScanner.Launch();
}


QrScanner.on("QRECEIVED", function (message) {
    var scanData = message.result;

    console.log(scanData);
    scannedQRAddress = scanData;

    amountSendAddress.value = "";
    sendAddressPopupShow.value = true;
});

var scannedQRAddress;
var amountSendAddress = Observable();

function transferAamoundToAddress() {
    var toType = "user";
    
    var amountValue = amountSendAddress.value;
    if (!Validator.amount(amountValue)) {
        tagEvents.emit("toastShow", { message: "Amount should not be empty" });
        return;
    }
    sendAddressPopupShow.value = false;

    busy.activate();

    _WebService.apiTagcoinTransferAddress(amountValue, toType, scannedQRAddress, "", 1).then(function (result) {
        gotTransferTagcoinAddressResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });

}


function gotTransferTagcoinAddressResult(result) {
    console.log("gotTransferTagcoinResult")
    busy.deactivate();

    var arr = result;
    console.log(JSON.stringify(arr))

    if (arr.status == "success") {
        var resultObj = arr.result;
        loadUserWalletTotalCall();
    } else {
        tagEvents.emit("alertEvent", { type: "info", title: "Error", message: "Unable to process your request at this time. Please try again later." });
    }
}


var sendBankPopupShow = Observable(false);
var sendEmailPopupShow = Observable(false);
var amountInputEmail = Observable();
var userEmailInput = Observable();

function emailSendClicked() {
    amountInputEmail.value = "";
    userEmailInput.value = "";
    sendEmailPopupShow.value = true;

}
function transferButton_clickHandler() {
    var amountValue = amountInputEmail.value;
    var useridInputValue = userEmailInput.value;

    if (!isValidEmail(useridInputValue)) {
        return;
    }

    if (!Validator.amount(amountValue)) {
        tagEvents.emit("toastShow", { message: "Amount should not be empty" });
        return;
    }

    busy.activate();

    _WebService.apiUserValidate("", useridInputValue).then(function (result) {
        gotValidateUserResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });
}

function isValidEmail(email) {
    var emailExpression = /([a-z0-9._-]+?)@([a-z0-9.-]+)\.([a-z]{2,4})/;
    return emailExpression.test(email);
}

var toTransferId;
var toTransferName;

function gotValidateUserResult(result) {
    console.log("gotValidateUserResult")
    busy.deactivate();

    var arr = result;
    console.log(JSON.stringify(arr))

    if (arr.status == "success") {
        sendEmailPopupShow.value = false;
        var resultArr = arr.result;
        toTransferId = resultArr[0].id;
        toTransferName = resultArr[0].name;
        confirmAlertShow();
    } else {
        if (arr.error == "no_users") {
            tagEvents.emit("alertEvent", { type: "info", title: "Error", message: "The email that you entered is not valid." });
        }
    }
}

function confirmAlertShow() {
    var messageText = "Are you sure you want to send %@1 to %@2.";

    messageText = messageText.replace("%@1", amountInputEmail.value + " PHP ");
    messageText = messageText.replace("%@2", toTransferName);
    tagEvents.emit("alertEvent", { type: "confirm", title: "TRANSFER", message: messageText, callback: confirmSendAlertClosedHandler });
}

function confirmSendAlertClosedHandler(args) {
    if (args === "yes") {
        transferAamoundToId(amountInputEmail.value);
    }
}

function transferAamoundToId(amountValue) {
    var toType = "user";

    busy.activate();

    _WebService.apiTagcoinTransfer(amountValue, toType, toTransferId, "", 1).then(function (result) {
        gotTransferTagcoinResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });

}

function gotTransferTagcoinResult(result) {
    console.log("gotTransferTagcoinResult")
    busy.deactivate();

    var arr = result;
    console.log(JSON.stringify(arr))

    if (arr.status == "success") {
        var resultObj = arr.result;
        loadUserWalletTotalCall();
    } else {
        tagEvents.emit("alertEvent", { type: "info", title: "Error", message: "Unable to process your request at this time. Please try again later." });
    }
}

var amountInputEleven = Observable();
var amountInputBank = Observable();

function bankSendClicked() {
    sendBankPopupShow.value = true;
    amountInputEleven.value = "";
    amountInputBank.value = "";

}

function bankTransferHandler() {

}


function popupCloseClicked() {
    giftSendPopupShow.value = false;
    sendAddressPopupShow.value = false;
    sendEmailPopupShow.value = false;
    sendBankPopupShow.value = false;

}

module.exports = {
    onViewActivate: onViewActivate,
    balanceText: balanceText,
    fiatChainData: fiatChainData,
    fiatChainQrData: fiatChainQrData,

    giftSendClicked: giftSendClicked,
    qrScanClicked: qrScanClicked,
    emailSendClicked: emailSendClicked,
    bankSendClicked: bankSendClicked,

    sendAddressPopupShow: sendAddressPopupShow,


    giftSendPopupShow: giftSendPopupShow,
    amountInputGift: amountInputGift,
    giftQRHandler: giftQRHandler,
    giftQrData: giftQrData,

    sendEmailPopupShow: sendEmailPopupShow,
    amountInputEmail: amountInputEmail,
    userEmailInput: userEmailInput,
    transferButton_clickHandler: transferButton_clickHandler,

    sendBankPopupShow: sendBankPopupShow,
    amountInputEleven: amountInputEleven,
    amountInputBank: amountInputBank,
    bankTransferHandler: bankTransferHandler,
    popupCloseClicked: popupCloseClicked,

    transferAamoundToAddress:transferAamoundToAddress,
    amountSendAddress:amountSendAddress,
    loadUserWalletTotalCall:loadUserWalletTotalCall,

}