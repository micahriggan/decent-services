import express = require('express');
import { MonetizationService } from './services/monetization';
import { EthMonetizeClient, MonetizedApp } from 'eth-monetize-client';
import cors = require('cors');

const client = new EthMonetizeClient();
const api = express();
api.use(express.json());
api.use(cors());

api.get('/quote-calls/:calls/:costPerCall', async (req, res) => {
  const { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
    req.params.calls,
    req.params.costPerCall
  );
  res.json({ totalEther, totalUsd, signedQuote });
});

const apps = {} as {[app: string]: MonetizedApp};
api.post('/apps/:app', async (req, res) => {
  const appName = req.params.app;
  if (!apps[appName]) {
    const { costPerCall } = req.body;
    apps[appName] = { costPerCall, appName };
  } else {
    res.status(400).send('App already registered');
  }
});

api.get('/apps/:app', async (req, res) => {
  res.send(apps[req.params.app]);
});

api.get('/apps/:app/quote/:calls', async (req, res) => {
  const { costPerCall } = apps[req.params.app];
  const { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
    req.params.calls,
    costPerCall
  );
  res.json({ totalEther, totalUsd, signedQuote });
});


api.get('/apps', async (req, res) => {
  res.send(Object.values(apps));
});

client.register().then(service => {
  api.listen(service.port, () => {
    console.info(`Api listening on port ${service.port}`);
  });
});
