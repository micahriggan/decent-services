import request = require('request-promise');
import { BaseClient } from 'decent-env-client';

export type ApiPurchaseQuote = {
  totalWei: string;
  totalEther: string;
  totalUsd: string;
  signedQuote: string;
};

export class EthMonetizeClient extends BaseClient {
  constructor(url: string) {
    super('eth-monetize-api', url);
  }

  async getQuote(calls: number, costPerCall: number) {
    const url = await this.getUrl();
    const resp = await request.get(url + `/quote-calls/${calls}/${costPerCall}`, {
      json: true
    });
    return JSON.parse(resp) as ApiPurchaseQuote;
  }
}
