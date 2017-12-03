
/**
* read
* @param value, data to validate
* return true/false
*/
function amount(value) {
    var status = true;

    if (isNaN(value)) {
        status = false;
    } else {
        if (value <= 0) {
            status = false;
        }
    }

    return status;
}


function email(email) {
    var emailExpression = /([a-z0-9._-]+?)@([a-z0-9.-]+)\.([a-z]{2,4})/;
    return emailExpression.test(email);
}


module.exports = {
    amount: amount,
};