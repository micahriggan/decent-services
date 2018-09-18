import express = require('express');
import { EnvConstants } from 'decent-service-registry-client';
import { SmartContractsClient, PaymentValidatorUtil } from 'smart-contracts-client';
import { ValidPaymentClient } from 'valid-payment-client';

import Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8545'));
const smartContractsClient = new SmartContractsClient();

web3.eth.getAccounts(async (err, accounts) => {
  const contract = await smartContractsClient.getContract('PaymentValidator');
  const validatorUtil = new PaymentValidatorUtil(web3, contract.spec.abi, contract.address);
  const api = express();
  const client = new ValidPaymentClient();

  const data = await smartContractsClient.getContract('PaymentValidator');
  const PaymentValidator = new web3.eth.Contract(data.spec.abi, data.address);

  api.get('/quote/:wei/:data', async (req, res) => {
    console.log('creating invoice quote');
    const payload = await validatorUtil.makeInvoice(req.params.wei, req.params.data);
    res.send(payload);
  });

  api.get('/quote/:wei', async (req, res) => {
    console.log('creating invoice quote');
    const payload = await validatorUtil.makeInvoice(req.params.wei);
    res.send(payload);
  });

  client.register().then(service => {
    api.listen(service.port, () => {
      console.info(`Api listening on port ${service.port}`);
      validatorUtil.watchForPayment(console.log);
    });
  });
});
