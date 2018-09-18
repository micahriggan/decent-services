import { Ticker } from 'ccxt';
import request = require('request-promise');
import { BaseClient } from 'service-registry-client';

export type ExchangeTicker = {
  exchange: string;
  ticker: Ticker;
};

export type SymbolTickers = {
  [symbol: string]: ExchangeTicker[];
};

export class CryptoMarketsClient extends BaseClient {
  static serviceName = 'crypto-markets-api';

  constructor(url?: string) {
    super(CryptoMarketsClient.serviceName, url);
  }

  async getExchanges() {
    const url = await this.getUrl();
    const resp = await request.get(`${url}/exchanges`);
    return JSON.parse(resp) as string[];
  }

  async getTickers() {
    const url = await this.getUrl();
    const resp = await request.get(`${url}/prices`);
    return JSON.parse(resp) as SymbolTickers;
  }

  async getTicker(pair) {
    const url = await this.getUrl();
    const resp = await request.get(`${url}/prices/${pair}`);
    return JSON.parse(resp) as ExchangeTicker[];
  }

  async getTickerForExchange(pair, exchange) {
    const url = await this.getUrl();
    const resp = await request.get(`${url}/prices/${pair}/${exchange}`);
    return JSON.parse(resp) as ExchangeTicker[];
  }
}
