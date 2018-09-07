import { Ticker } from 'ccxt';
import * as request from 'request-promise';

export type ExchangeTicker = {
  exchange: string;
  ticker: Ticker;
};

export type SymbolTickers = {
  [symbol: string]: ExchangeTicker[];
};

export type StorageTicker = { type: string; date: Date; tickers: SymbolTickers };

export class CryptoMarketsApi {
  constructor(private url) {}

  async getExchanges() {
    const resp = await request(`${this.url}/exchanges`);
    return resp as string[];
  }

  async getTickers() {
    const resp = await request(`${this.url}/prices`);
    return resp as SymbolTickers;
  }

  async getTicker(pair) {
    const resp = await request(`${this.url}/prices/${pair}`);
    return resp as ExchangeTicker[];
  }

  async getTickerForExchange(pair, exchange) {
    const resp = await request(`${this.url}/prices/${pair}/${exchange}`);
    return resp as ExchangeTicker[];
  }
}
