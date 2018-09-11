"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isPaid = {};
var Monitor = (function () {
    function Monitor(contract) {
        this.contract = contract;
    }
    Monitor.prototype.watchForPayment = function (cb) {
        var event = this.contract.events.PaymentAccepted({}, function (err, resp) {
            if (err)
                return cb(err);
            if (!err) {
                return cb(null, resp);
            }
        });
    };
    Monitor.prototype.isValidPayment = function (_a) {
        var hash = _a.hash, signedHash = _a.signedHash, amount = _a.amount, expiration = _a.expiration, nonce = _a.nonce, v = _a.v, r = _a.r, s = _a.s;
        var isValid = this.contract.methods.isValidPayment(amount, expiration, nonce, hash, v, r, s).call();
        return isValid;
    };
    return Monitor;
}());
exports.Monitor = Monitor;
//# sourceMappingURL=monitor.js.map