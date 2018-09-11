import express = require('express');
import { MonetizationService } from './services/monetization';

const api = express();

api.get('/quote-calls/:calls/:costPerCall', async (req, res) => {
  const { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
    req.params.calls,
    req.params.costPerCall
  );
  res.json({ totalEther, totalUsd, signedQuote });
});

const port = 3000;
api.listen(port, () => {
  console.info(`Api listening on port ${port}`);
});

export const SmartContracts = {
  PaymentValidator: require('../blockchain/build/contracts/PaymentValidator.json'),
  ApiMonetization: require('../blockchain/build/contracts/ApiMonetization.json')
}
