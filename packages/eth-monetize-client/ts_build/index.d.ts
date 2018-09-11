import { BaseClient } from 'decent-env-client';
export declare type ApiPurchaseQuote = {
    totalWei: string;
    totalEther: string;
    totalUsd: string;
    signedQuote: string;
};
export declare class EthMonetizeClient extends BaseClient {
    constructor(url: string);
    getQuote(calls: number, costPerCall: number): Promise<ApiPurchaseQuote>;
}
