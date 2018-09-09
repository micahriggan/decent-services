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

export class ValidPaymentClient {
  constructor(private url) {}
  async getQuote(wei, data?) {
    let url = `${this.url}/quote/${wei}`;
    if (data) {
      url += `/${data}`;
    }
    const resp = await request.get(url);
    return JSON.parse(resp) as QuoteResponse;
  }
}
