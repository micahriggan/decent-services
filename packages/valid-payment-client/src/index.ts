import { BaseClient } from 'decent-env-client';
import * as request from 'request-promise';
type QuoteResponse = {
  hash: string;
  signedHash: string;
  amount: number;
  expiration: number;
  payload: string;
  payloadHash: string;
  v: string;
  r: string;
  s: string;
};

export class ValidPaymentClient extends BaseClient {
  constructor(url?: string) {
    super('valid-payment-api', url);
  }
  async getQuote(wei, data?) {
    const base = await this.getUrl();
    let url = `${base}/quote/${wei}`;
    if (data) {
      url += `/${data}`;
    }
    const resp = await request.get(url);
    return JSON.parse(resp) as QuoteResponse;
  }
}
