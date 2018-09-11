import Web3 = require('web3');
declare type Spec = {
    address: string;
    abi: any;
};
export declare const SmartContracts: {
    PaymentValidator: {
        getFor: typeof getFor;
        spec: any;
    };
    ApiMonetization: {
        getFor: typeof getFor;
        spec: any;
    };
};
declare function getFor(web3: Web3): Promise<Spec>;
export {};
