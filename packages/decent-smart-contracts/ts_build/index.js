"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContracts = {
    PaymentValidator: {
        getFor: getFor,
        spec: require('../blockchain/build/contracts/PaymentValidator.json')
    },
    ApiMonetization: {
        getFor: getFor,
        spec: require('../blockchain/build/contracts/ApiMonetization.json')
    }
};
function getFor(web3) {
    var _this = this;
    return new Promise(function (resolve, reject) {
        web3.eth.net.getId(function (err, resp) {
            if (err)
                reject(err);
            if (!_this.spec.networks[resp])
                reject();
            resolve({ address: _this.spec.networks[resp].address, abi: _this.spec.abi });
        });
    });
}
//# sourceMappingURL=index.js.map