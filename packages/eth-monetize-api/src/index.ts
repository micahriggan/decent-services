import * as paymentClient from 'valid-payment-client';
const express = require('express');
const Web3 = require('web3');
const web3Config = require('./constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const spec = require('./blockchain/build/contracts/PaymentValidator.json');
const contracts = require('./constants/contracts');

const api = express();

web3.eth.getAccounts((err, accounts) => {

  api.post('/calls', async (req, res) => {
    const callCount = req.body.callCount;

    // calculate cost per call
    const costPerCall = 1;
    res.send(payload);
  });

  const port = 3000;
  api.listen(port, () => {
    console.info(`Api listening on port ${port}`);
    monitor.watchForPayment();
  });
});

