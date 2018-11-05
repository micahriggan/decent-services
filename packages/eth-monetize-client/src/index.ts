import request = require('request-promise');
import { BaseClient } from 'service-registry-client';

export type ApiPurchaseQuote = {
  totalWei: string;
  totalEther: string;
  totalUsd: string;
  signedQuote: string;
};

export type MonetizedApp = {
  costPerCall: number;
  appName: string;
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

  async monetizeApp(app: string, costPerCall: number) {
    const url = await this.getUrl();
    return request.post({
      url: url + `/apps/${app}/`,
      body: {
        costPerCall
      },
      json: true
    });
  }

  async getMonetizedApp(app: string) {
    const url = await this.getUrl();
    const resp = await request.get(url + `/apps/${app}`, {
      json: true
    });
    return resp as MonetizedApp;
  }

  async getQuoteForApp(app: string, calls: number) {
    const url = await this.getUrl();
    const resp = await request.get(url + `/apps/${app}/quote/${calls}`, {
      json: true
    });
    return resp as ApiPurchaseQuote;
  }

  async getAllMonetizedApps() {
    const url = await this.getUrl();
    const resp = await request.get(url + `/apps`, {
      json: true
    });
    return resp as MonetizedApp[];
  }
}
