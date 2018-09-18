import request = require('request-promise');
import { BaseClient } from 'decent-service-registry-client';

export type ApiPurchaseQuote = {
  totalWei: string;
  totalEther: string;
  totalUsd: string;
  signedQuote: string;
};

export class EthMonetizeClient extends BaseClient {
  static serviceName = 'eth-monetize-api';
  constructor(url?: string) {
    super(EthMonetizeClient.serviceName, url);
  }

  async getQuote(calls: number, costPerCall: number) {
    const url = await this.getUrl();
    const resp = await request.get(url + `/quote-calls/${calls}/${costPerCall}`, {
      json: true
    });
    return resp as ApiPurchaseQuote;
  }
}
