import { Ticker } from 'ccxt';
import request = require('request-promise');

export type ExchangeTicker = {
  exchange: string;
  ticker: Ticker;
};

export type SymbolTickers = {
  [symbol: string]: ExchangeTicker[];
};

export class CryptoMarketsClient {
  constructor(private url) {}

  async getExchanges() {
    const resp = await request(`${this.url}/exchanges`);
    return JSON.parse(resp) as string[];
  }

  async getTickers() {
    const resp = await request(`${this.url}/prices`);
    return JSON.parse(resp) as SymbolTickers;
  }

  async getTicker(pair) {
    const resp = await request(`${this.url}/prices/${pair}`);
    return JSON.parse(resp) as ExchangeTicker[];
  }

  async getTickerForExchange(pair, exchange) {
    const resp = await request(`${this.url}/prices/${pair}/${exchange}`);
    return JSON.parse(resp) as ExchangeTicker[];
  }
}
