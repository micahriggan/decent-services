import * as request from "request-promise";
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
  async getQuote(wei) {
    const resp = await request.get(`${this.url}/quote/${wei}`);
    return resp as QuoteResponse;
  }
}
