var Observable = require('FuseJS/Observable');

// var Dialog = require("DialogModule");

var titleTxt = Observable("");
var messageTxt = Observable("");
var showAlert = Observable(false);
var showConfirm = Observable(false);

var callbackFunction = null;

tagEvents.on("alertEvent", function (arg) {
    //console.log("anEvent emitted+++++++++++++++++++" + arg);
    // console.log(JSON.stringify(arg));

    titleTxt.value = arg.title;
    messageTxt.value = arg.message;

    if (arg.type === "confirm") {
        showConfirm.value = true;
    } else if (arg.type === "info") {
        showConfirm.value = false;
    }

    if (arg.callback) {
        console.log("123456");
        callbackFunction = arg.callback;
    } else {
        callbackFunction = null;
    }

    showAlert.value = true;
});







    // Dialog.show({
    //     title: "TRANSFER",
    //     message: messageText,
    //     positiveButton: {
    //         text: "OK",
    //         callback: function () {
    //             console.log("OK clicked!");
    //             confirmSendAlertClosedHandler();
    //         }
    //     },
    //     negativeButton: {
    //         text: "CANCEL",
    //         callback: function () { console.log("CANCEL clicked!"); }
    //     },
    // });
    

function yesClickHandler() {
    showAlert.value = false;

    if (callbackFunction) {
        callbackFunction("yes");
    }
}

function noClickHandler() {
    showAlert.value = false;

    if (callbackFunction) {
        callbackFunction("no");
    }
}

function alertClose() {
    showAlert.value = false;
}

module.exports = {
    titleTxt: titleTxt,
    messageTxt: messageTxt,
    showConfirm: showConfirm,
    yesClickHandler: yesClickHandler,
    noClickHandler: noClickHandler,
    showAlert: showAlert,
}


//  tagEvents.emit("alertEvent", {type:"info", title: "Test title", message: "Test message", callback: alertCallback });
//  function alertCallback() {
//     console.log("Call back------------------");
// }