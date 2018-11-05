import { expect } from 'chai';
import 'mocha';
import { ValidPaymentClient } from 'valid-payment-client';

describe('ValidPaymentApi', () => {
  it('should be able to get a quote', async () => {
    const client = new ValidPaymentClient();
    const quote = await client.getQuote(1000);
    expect(quote.amount).to.be.eq('1000');
  });
});
