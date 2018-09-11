import express = require('express');
import { MonetizationService } from './services/monetization';
import { DecentEnvClient } from 'decent-env-client';
const env = new DecentEnvClient();
const api = express();

api.get('/quote-calls/:calls/:costPerCall', async (req, res) => {
  const { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
    req.params.calls,
    req.params.costPerCall
  );
  res.json({ totalEther, totalUsd, signedQuote });
});

env.register({ name: 'eth-monetize-api' }).then(service => {
  api.listen(service.port, () => {
    console.info(`Api listening on port ${service.port}`);
  });
});
