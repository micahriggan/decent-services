import { CryptoMarketsClient } from 'crypto-markets-client';
import { ValidPaymentClient } from 'valid-payment-client';
import express = require('express');

const api = express();

api.get('/quote-calls/:calls/:costPerCall', async (req, res) => {
  const callCount = req.params.calls;
  const priceClient = new CryptoMarketsClient('http://localhost:4000');
  const paymentClient = new ValidPaymentClient('http://localhost:5000');
  const usdPerCall = req.params.costPerCall;
  const totalUsd = usdPerCall * callCount;
  const [ etherTicker ] = await priceClient.getTickerForExchange('ETH_USD', 'bittrex');
  const usdPerEth = etherTicker.ticker.bid;
  const totalEther = totalUsd / usdPerEth;

  const signedQuote = await paymentClient.getQuote(totalEther, callCount);
  res.json({ totalEther, totalUsd, signedQuote });
});


const port = 3000;
api.listen(port, () => {
  console.info(`Api listening on port ${port}`);
});
