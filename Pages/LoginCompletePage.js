var Observable = require('FuseJS/Observable');
var QrScanner = require("QrScanner");
var Validator = require('Utils/Validator');
var Preferences = require('Utils/Preferences');

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');

var balanceText = Observable(0);
var fiatChainData = Observable();
var fiatChainQRData = Observable();

function onViewActivate() {
    var phpFiatChainStr = _model.phpFiatChain.toString();
    var userIdStr = _model.userId.toString();
    console.log(phpFiatChainStr);

    var qrDataObj = {};
    qrDataObj.tagqr = true;
    qrDataObj.type = "address";
    qrDataObj.address = phpFiatChainStr;
    console.log(JSON.stringify(qrDataObj))

    fiatChainQRData.value = JSON.stringify(qrDataObj);
    fiatChainData.value = phpFiatChainStr;

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


var transactionListData = Observable();

function loadTransactions() {
    console.log("loadTransactions")
    transactionListData.clear();
    busy.activate();

    var apiBodyObj = {};
    apiBodyObj.from_wallet_id = 1;

    _WebService.request("wallet/transactions", apiBodyObj).then(function (result) {
        gotLoadTransactionsResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });

    // @Query("offset") int offset,
    // @Query("count") int count);-

}

function gotLoadTransactionsResult(result) {
    console.log("gotLoadTransactionsResult")
    busy.deactivate();

    var arr = result;
    console.log(JSON.stringify(arr))

    if (arr.status == "success") {
        var resultArr = arr.result;
        if (resultArr !== null) {
            transactionListData.addAll(resultArr);
        }

    }
}

var giftSendPopupShow = Observable(false);
var sendAddressPopupShow = Observable(false);
var amountInputGift = Observable();
var giftQrData = Observable("");
function giftSendClicked() {
    giftSendPopupShow.value = true;
    amountInputGift.value = "";
    giftQrData.value = "";
}

function generateVoucherHandler() {
    if (!Validator.amount(amountInputGift.value)) {
        tagEvents.emit("toastShow", { message: "Amount should not be empty" });
        return;
    }

    busy.activate();

    var apiBodyObj = {};

    apiBodyObj.amount = amountInputGift.value;
    // 1, hour , 2 day ,  3 seconds
    apiBodyObj.expiration_type = 3;
    apiBodyObj.expires_at = 60;
    apiBodyObj.open = 1;
    apiBodyObj.wallet_id = 1;
    apiBodyObj.voucher_count = 1;

    _WebService.request("voucher/generate", apiBodyObj).then(function (result) {
        gotGenerateVoucherResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });
}

function gotGenerateVoucherResult(result) {
    busy.deactivate();

    var arr = result;

    if (arr.status == "success") {
        var resultObj = arr.result;

        var qrDataObj = {};
        qrDataObj.tagqr = true;
        qrDataObj.type = "voucher";
        qrDataObj.voucher = resultObj.codes;
        console.log(JSON.stringify(qrDataObj))

        giftQrData.value = JSON.stringify(qrDataObj);
    }
}


function qrScanClicked() {
    QrScanner.Init("QRCODE", false, true);
    QrScanner.Launch();
}


QrScanner.on("QRECEIVED", function (message) {
    var scanData = message.result;

    console.log(scanData);
    if (!Validator.isJson(scanData)) {
        tagEvents.emit("toastShow", { message: "This is not a valid QR code" });
        return;
    } else {
        var qrParsed = JSON.parse(scanData);

        if (qrParsed.tagqr) {
            if (qrParsed.type === "address") {
                scannedQRAddress = qrParsed.address;
                amountSendAddress.value = "";
                sendAddressPopupShow.value = true;
            } else if (qrParsed.type === "voucher") {
                voucherRedeem(qrParsed.voucher);
            }
        }
    }

});

function voucherRedeem(voucher) {
    busy.activate();

    var apiBodyObj = {};
    apiBodyObj.voucher = voucher;

    _WebService.request("voucher/redeem", apiBodyObj).then(function (result) {
        gotVoucherRedeemResult(result);
    }).catch(function (error) {
        console.log("Couldn't get data: " + error);
        showNetworkErrorMessage();
    });
}

function gotVoucherRedeemResult(result) {
    busy.deactivate();

    var arr = result;
    console.log(JSON.stringify(arr))

    if (arr.status == "success") {
        var resultObj = arr.result;

        loadUserWalletTotalCall();

    }
}


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

    _WebService.apiTagcoinTransferAddress(amountValue, scannedQRAddress, "", 1).then(function (result) {
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

function logoutClicked() {

    tagEvents.emit("alertEvent", { type: "confirm", title: "Logout", message: "Are you sure you want to log out?", callback: confirmAlertHandler });
}

function confirmAlertHandler(args) {
    if (args === "yes") {
        Preferences.write("email", null);
        Preferences.write("access_token", null);
        router.goto("loginPage");

        _WebService.apiLogout();
    }
}

function gotLogoutResult(result) {
    console.log("gotLogoutResult")
    busy.deactivate();

}

function showNetworkErrorMessage() {
    busy.deactivate();
    tagEvents.emit("alertEvent", { type: "info", title: loc.value.error, message: loc.value.network_error_message });
}

module.exports = {
    onViewActivate: onViewActivate,
    balanceText: balanceText,
    fiatChainData: fiatChainData,
    fiatChainQRData: fiatChainQRData,

    giftSendClicked: giftSendClicked,
    qrScanClicked: qrScanClicked,
    emailSendClicked: emailSendClicked,
    bankSendClicked: bankSendClicked,

    sendAddressPopupShow: sendAddressPopupShow,


    giftSendPopupShow: giftSendPopupShow,
    amountInputGift: amountInputGift,
    generateVoucherHandler: generateVoucherHandler,
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

    transferAamoundToAddress: transferAamoundToAddress,
    amountSendAddress: amountSendAddress,
    loadUserWalletTotalCall: loadUserWalletTotalCall,

    logoutClicked: logoutClicked,
    loadTransactions: loadTransactions,
    transactionListData: transactionListData,
}