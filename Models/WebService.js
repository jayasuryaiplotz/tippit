var Observable = require('FuseJS/Observable');
var _model = require('Models/GlobalModel');

_url = "https://api.tagcash.com/";
_serverurl = "https://api.tagcash.com/";

var client_id = "XXXX";
var client_secret = "XXXX";

function apiAuthenticate(email, password) {
    var data = "client_id="+client_id+"&client_secret="+client_secret+"&grant_type=password&user_email=" + encodeURIComponent(email) + "&user_password=" + encodeURIComponent(password);

    return fetch(_serverurl + "oauth/accesstoken", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();    // This returns a promise
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function apiUserRegistration(email, firstName, lastName, password) {
    var data = "client_id="+client_id+"&client_secret="+client_secret+"&user_email=" + encodeURIComponent(email) + "&user_firstname=" + firstName + "&user_lastname=" + lastName + "&user_password=" + encodeURIComponent(password);

    return fetch(_serverurl + "registration", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function apiForgotPassword(email, password) {
    var data = "client_id="+client_id+"&client_secret="+client_secret+"&user_email=" + encodeURIComponent(email);

    return fetch(_serverurl + "registration/resetpassword", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function apiLogout() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_serverurl + "oauth/logout", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    });

}

function request(url, options = {}, method = 'POST') {
    var data = "access_token=" + _model.accessToken;

    Object.keys(options).forEach(function (key) {
        data += "&" + key + "=" + options[key];
    });

    console.log(_serverurl + url);
    console.log(data);

    return fetch(_serverurl + url, {
        method: method,
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
        console.log(JSON.stringify(err))
        
    });

}







function apiActivePerspective() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "perspective", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiCommunityUserRoll() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "community/getpermissions", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiCommunityDetails() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "community/details/" + _model.nowCommunityID, {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiSwitchPerspective(switchTo) {
    var data = "access_token=" + _model.accessToken;

    var urlPath;
    if (switchTo == "me") {
        urlPath = "perspective/switch";
    } else {
        urlPath = "perspective/switch/" + _model.nowCommunityID;
    }

    return fetch(_url + urlPath, {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiStaffCommunities() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "user/staffof", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiMemberCommunities() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "user/memberof", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}








//Wallet

function apiWalletList() {
    var data = "access_token=" + _model.accessToken;
    console.log(data)

    //"sort", "categorize"  and accesstoken are the parameters
    // map.put("sort", "categorize");

    return fetch(_url + "wallet/list", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiWalletTypesList(walletType) {
    var data = "access_token=" + _model.accessToken + "&wallet_type=" + walletType;

    return fetch(_url + "wallet/types", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiWalletCreate(walletTypeId) {
    var data = "access_token=" + _model.accessToken + "&wallet_type_id=" + walletTypeId;

    return fetch(_url + "wallet/create", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}




function apiWalletDelete(walletId) {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "wallet/delete/" + walletId, {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}




function apiEnergyTotal(walletId) {
    var data = "access_token=" + _model.accessToken + "&wallet_type_id=" + walletId;

    return fetch(_url + "wallet/list", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiEnergyTransactions(walletId) {
    var data = "access_token=" + _model.accessToken + "&from_wallet_id=" + walletId;

    // variables.count =  count;
    // variables.offset =  offset;

    return fetch(_url + "wallet/transactions", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}


function apiTagcoinTransfer(amount, toType, toId, narration, fromWallet) {
    var data = "access_token=" + _model.accessToken + "&amount=" + amount + "&to_type=" + toType + "&from_wallet_id=" + fromWallet + "&to_wallet_id=" + fromWallet + "&narration=" + narration + "&to_id=" + toId;
    console.log(data)

    return fetch(_url + "wallet/transfer", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(JSON.stringify(err))
    });
}

function apiSearchUser(key) {
    var data = "access_token=" + _model.accessToken + "&name=" + key;

    return fetch(_url + "user/searchuser", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiUserValidate(toId, toEmail) {
    var data = "access_token=" + _model.accessToken;

    if (toId != "") {
        data += "&id=" + toId;
    } else {
        data += "&email=" + toEmail;
    }

    return fetch(_url + "user/searchuser", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiSearchCommunity(key) {
    var data = "access_token=" + _model.accessToken + "&name=" + key;

    return fetch(_url + "community/search", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiCommunityValidate(toId) {
    var data = "access_token=" + _model.accessToken + "&name=" + toId;

    return fetch(_url + "user/searchuser", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiWalletDeposit() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "wallet/GetTagcoinAddress", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}

function apiTagcoinWithdraw(amount, bitcoinAddress, narration) {
    var data = "access_token=" + _model.accessToken + "&amount=" + amount + "&bitcoin_address=" + bitcoinAddress + "&description=" + narration + "&bitcoin_rate=0.0" + "&withdraw_via=tagcoin" + "&wallet_id=7";

    return fetch(_url + "payment/bitcoin", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}





function apiBanksList() {
    var data = "access_token=" + _model.accessToken;

    return fetch(_url + "bank/list", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}


//calculate amount in Local Currency Bitcoin
function apiVskypeCalculateAmount(amount, from, to) {
    console.log("http://vskype.com/api/" + amount + "/" + from + "/" + to)
    //http://vskype.com/api/22/php/tag
    return fetch("http://vskype.com/api/" + amount + "/" + from + "/" + to, {
        method: 'GET'
    }).then(function (response) {
        console.log(response)
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
        console.log(JSON.stringify(err))
    });
}

function apiSevenDepositTransactions(Id, type) {
    var data = "access_token=" + _model.accessToken;

    // variables.count =  count;
    // variables.offset =  offset;

    return fetch(_url + "deposit/requests?id=" + Id + "&deposit=7connect&type=" + type, {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(err)
    });
}


function apiTagcoinTransferAddress(amount, address, narration, fromWallet) {
    var data = "access_token=" + _model.accessToken + "&amount=" + amount + "&to_crypto_address=" + address + "&from_wallet_id=" + fromWallet + "&to_wallet_id=" + fromWallet + "&narration=" + narration ;
    console.log(data)

    return fetch(_url + "wallet/transfer", {
        method: 'post',
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: data
    }).then(function (response) {
        return response.json();
    }).then(function (responseObject) {
        return new Promise(function (resolve, reject) {
            resolve(responseObject);
        });
    }).catch(function (err) {
        console.log(JSON.stringify(err))
    });
}


module.exports =
    {
        apiAuthenticate: apiAuthenticate,
        apiUserRegistration: apiUserRegistration,
        apiForgotPassword: apiForgotPassword,
        apiLogout:apiLogout,
        request: request,

        apiVskypeCalculateAmount: apiVskypeCalculateAmount,
        apiSevenDepositTransactions: apiSevenDepositTransactions,


        apiActivePerspective: apiActivePerspective,
        apiCommunityUserRoll: apiCommunityUserRoll,
        apiCommunityDetails: apiCommunityDetails,
        apiSwitchPerspective: apiSwitchPerspective,
        apiStaffCommunities: apiStaffCommunities,
        apiMemberCommunities: apiMemberCommunities,
        apiWalletList: apiWalletList,
        apiWalletTypesList: apiWalletTypesList,

        apiEnergyTotal: apiEnergyTotal,
        apiEnergyTransactions: apiEnergyTransactions,
        apiWalletCreate: apiWalletCreate,
        apiWalletDelete: apiWalletDelete,
        apiTagcoinTransfer: apiTagcoinTransfer,
        apiSearchUser: apiSearchUser,
        apiUserValidate: apiUserValidate,
        apiSearchCommunity: apiSearchCommunity,
        apiCommunityValidate: apiCommunityValidate,
        apiWalletDeposit: apiWalletDeposit,
        apiTagcoinWithdraw: apiTagcoinWithdraw,

        apiBanksList: apiBanksList,

        apiTagcoinTransferAddress:apiTagcoinTransferAddress,

    };