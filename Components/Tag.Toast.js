var Observable = require('FuseJS/Observable');
var Timer = require("FuseJS/Timer");

var showMessage = Observable(false);
var messageText = Observable("");

tagEvents.on("toastShow", function (arg) {
    console.log(JSON.stringify(arg));

    messageText.value = arg.message;
    showMessage.value = true;
    
    Timer.create(function() {
        showMessage.value = false;
    }, 3000, false);

});

module.exports = {
    messageText: messageText,
    showMessage: showMessage,
}


//  tagEvents.emit("alertEvent", {type:"info", title: "Test title", message: "Test message", callback: alertCallback });
//  function alertCallback() {
//     console.log("Call back------------------");
// }

//duration