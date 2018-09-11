export declare class SignerUtil {
    private web3;
    private signingAddress;
    constructor(web3: any, signingAddress: any);
    createMessage({ amount, expiration, payloadHash }: {
        amount: any;
        expiration: any;
        payloadHash: any;
    }): {
        t: string;
        v: any;
    }[];
    createPayloadMessage({ nonce, dataStr }: {
        nonce: any;
        dataStr: any;
    }): {
        t: string;
        v: any;
    }[];
    hashMessage(messageArr: any): any;
    signHash(hash: any): any;
    makeInvoice(wei: any, data?: string): Promise<{
        hash: any;
        signedHash: any;
        amount: any;
        expiration: number;
        payload: {
            nonce: number;
            dataStr: string;
        };
        payloadHash: any;
        v: any;
        r: string;
        s: string;
    }>;
}
