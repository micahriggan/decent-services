import { Ticker } from 'ccxt';
import request = require('request-promise');
import { BaseClient } from 'service-registry-client';
import { buildSignature } from 'eth-monetize-middleware';

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

  async getArbitrageOpportunities() {
    const url = await this.getUrl();
    const privKey = 'ba0a15f4ce413164db6d8560653a6239e97446dd6992d6ef74314994ea44f4cf';
    const finalUrl = `${url}/arbitrage`;
    const sig = buildSignature(privKey, 'GET', finalUrl, {});
    const urlObj = { url: finalUrl, headers: { 'x-signature': sig } };
    const resp = await request.get(urlObj);
    return JSON.parse(resp) as ExchangeTicker[];
  }
}
