"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContracts = {
    PaymentValidator: {
        address: process.env.PaymentValidator || '',
        abi: require('../blockchain/build/contracts/PaymentValidator.json')
    },
    ApiMonetization: {
        address: process.env.ApiMonetization || '',
        abi: require('../blockchain/build/contracts/ApiMonetization.json')
    }
};
//# sourceMappingURL=index.js.map