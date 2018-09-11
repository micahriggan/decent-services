export declare class Monitor {
    private contract;
    constructor(contract: any);
    watchForPayment(cb: any): void;
    isValidPayment({ hash, signedHash, amount, expiration, nonce, v, r, s }: {
        hash: any;
        signedHash: any;
        amount: any;
        expiration: any;
        nonce: any;
        v: any;
        r: any;
        s: any;
    }): any;
}
