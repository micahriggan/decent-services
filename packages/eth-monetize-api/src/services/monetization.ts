import Web3 = require('web3');
import { EnvConstants } from 'decent-env-client';
const web3 = new Web3(new Web3.providers.WebsocketProvider(EnvConstants.web3.url));

import { CryptoMarketsClient } from 'crypto-markets-client';
import { ValidPaymentClient } from 'valid-payment-client';

export class MonetizationService {
  static async getQuoteForApiCalls(callCount: number, usdPerCall: number) {
    const priceClient = new CryptoMarketsClient();
    const paymentClient = new ValidPaymentClient();
    const totalUsd = usdPerCall * callCount;
    const [etherTicker] = await priceClient.getTickerForExchange('ETH_USD', 'bittrex');
    const usdPerEth = etherTicker.ticker.bid;
    const totalEther = totalUsd / usdPerEth;
    const totalWei = web3.utils.toWei(totalEther.toString(), 'ether');
    const signedQuote = await paymentClient.getQuote(totalWei, callCount);
    return { totalWei, totalEther, totalUsd, signedQuote };
  }
}
