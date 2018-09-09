import { Ticker } from 'ccxt';
export declare type ExchangeTicker = {
    exchange: string;
    ticker: Ticker;
};
export declare type SymbolTickers = {
    [symbol: string]: ExchangeTicker[];
};
export declare class CryptoMarketsClient {
    private url;
    constructor(url: any);
    getExchanges(): Promise<string[]>;
    getTickers(): Promise<SymbolTickers>;
    getTicker(pair: any): Promise<ExchangeTicker[]>;
    getTickerForExchange(pair: any, exchange: any): Promise<ExchangeTicker[]>;
}
