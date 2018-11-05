import express = require('express');
import Web3 = require('web3');
import { ContractsObj, SmartContractsClient } from './client';
export * from './client';
export * from './utils/PaymentValidator';

export const SmartContracts: ContractsObj = {
  PaymentValidator: {
    spec: require('../blockchain/build/contracts/PaymentValidator.json'),
    address: process.env.PaymentValidator
  },
  ApiMonetization: {
    spec: require('../blockchain/build/contracts/ApiMonetization.json'),
    address: process.env.ApiMonetization
  }
};

if (require.main === module) {
  const client = new SmartContractsClient();
  const app = express();

  app.get('/contracts', (req, res) => {
    res.send(SmartContracts);
  });

  app.get('/contracts/:contractName', (req, res) => {
    res.send(SmartContracts[req.params.contractName]);
  });

  client.register().then(service => {
    app.listen(service.port);
  });
}
