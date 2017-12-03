var Observable = require('FuseJS/Observable');
var qrEncoder = require("Utils/QrEncoder");

var _model = require('Models/GlobalModel');
var _WebService = require('Models/WebService');

var balanceText = Observable(0);
var fiatChainData = Observable();
var fiatChainQrData = Observable();

function onViewActivate() {
    var phpFiatChainStr = _model.phpFiatChain.toString();
    fiatChainData.value = phpFiatChainStr;

    var bitMatrix = qrEncoder.encode(phpFiatChainStr, 1);
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


function giftSendClicked() {

}
function qrScanClicked() {

}
function emailSendClicked() {

}
function bankSendClicked() {

}

module.exports = {
    onViewActivate: onViewActivate,
    balanceText: balanceText,
    fiatChainData: fiatChainData,
    fiatChainQrData: fiatChainQrData,




}