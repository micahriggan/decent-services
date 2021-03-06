import { BaseClient } from 'service-registry-client';
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
  static serviceName = 'valid-payment-api';
  constructor(url?: string) {
    super(ValidPaymentClient.serviceName, url);
  }
  async getQuote(wei, params?: {data?: string, tokenContract?: string}) {
    const { data, tokenContract} = params;
    const base = await this.getUrl();
    let url = `${base}/quote/${wei}?`;
    if (data) {
      url += `data=${data}&`;
    }
    if (tokenContract) {
      url += `data=${data}`;
    }
    const resp = await request.get(url, { json: true });
    return resp as QuoteResponse;
  }
}
