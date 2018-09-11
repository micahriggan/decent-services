import * as express from 'express';
import * as ccxt from 'ccxt';
import { ExchangeService } from './services/ExchangeMarkets';
import { MetricService } from './services/Metrics';
import { DecentEnvClient, EnvConstants } from 'decent-env-client';
const app = express();

app.use('/exchanges', (req, res) => {
  res.json(ccxt.exchanges);
});

app.use('/spread/:pair/:exchange', async (req, res) => {
  const pair = req.params.pair;
  const filtered = await MetricService.getSpread(pair, req.params.exchange);
  if (filtered) {
    res.json(filtered);
  } else {
    res.json({});
  }
});

app.use('/prices/:pair/:exchange', async (req, res) => {
  const pair = req.params.pair;
  const filtered = await ExchangeService.tickerForExchange(pair, req.params.exchange);
  if (filtered) {
    res.json(filtered);
  } else {
    res.json({});
  }
});

app.use('/prices/:pair', async (req, res) => {
  const pair = req.params.pair;
  const ticker = await ExchangeService.ticker(pair);
  if (ticker) {
    res.json(ticker);
  } else {
    res.json({});
  }
});

app.use('/prices', async (req, res) => {
  const tickers = await ExchangeService.tickers();
  res.json(tickers);
});

app.use('/arbitrage', async (req, res) => {
  const opportunities = await MetricService.getArbitrageOpportunities();
  res.json(opportunities);
});

const env = new DecentEnvClient();
env.register({ name: 'crypto-markets-api' }).then(service => {
  app.listen(service.port, async () => {
    console.log(`App listening on port ${service.port} `);
    ExchangeService.montior();
  });
});
