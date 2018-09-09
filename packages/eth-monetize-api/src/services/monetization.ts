import Web3 = require('web3');
const web3Config = require('../../constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));

import { CryptoMarketsClient } from '../../../crypto-markets-client/ts_build';
import { ValidPaymentClient } from '../../../valid-payment-client/ts_build';

export class MonetizationService {
  static async getQuoteForApiCalls(callCount: number, usdPerCall: number) {
    const priceClient = new CryptoMarketsClient('http://localhost:4000');
    const paymentClient = new ValidPaymentClient('http://localhost:5000');
    const totalUsd = usdPerCall * callCount;
    const [etherTicker] = await priceClient.getTickerForExchange('ETH_USD', 'bittrex');
    const usdPerEth = etherTicker.ticker.bid;
    const totalEther = totalUsd / usdPerEth;
    const totalWei = web3.utils.toWei(totalEther.toString(), 'ether');
    const signedQuote = await paymentClient.getQuote(totalWei, callCount);
    return { totalWei, totalEther, totalUsd, signedQuote };
  }
}
