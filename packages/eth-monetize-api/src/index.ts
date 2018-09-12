import express = require('express');
import { MonetizationService } from './services/monetization';
import { EthMonetizeClient} from 'eth-monetize-client';
const client = new EthMonetizeClient();
const api = express();

api.get('/quote-calls/:calls/:costPerCall', async (req, res) => {
  const { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
    req.params.calls,
    req.params.costPerCall
  );
  res.json({ totalEther, totalUsd, signedQuote });
});

client.register().then(service => {
  api.listen(service.port, () => {
    console.info(`Api listening on port ${service.port}`);
  });
});
