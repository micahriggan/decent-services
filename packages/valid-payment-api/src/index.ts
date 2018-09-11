import express = require('express');
import { DecentEnvClient, EnvConstants } from 'decent-env-client';
import { SignerUtil } from './lib/signer';
import { Monitor } from './lib/monitor';
import { SmartContracts } from 'decent-smart-contracts';

import Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(EnvConstants.web3.url));

const api = express();
const env = new DecentEnvClient();
web3.eth.getAccounts(async (err, accounts) => {
  const signer = new SignerUtil(web3, accounts[1]);
  const data = await SmartContracts.PaymentValidator.getFor(web3);
  const PaymentValidator = new web3.eth.Contract(data.abi, data.address);
  const monitor = new Monitor(PaymentValidator);

  api.get('/quote/:wei/:data', async (req, res) => {
    console.log('creating invoice quote');
    const payload = await signer.makeInvoice(req.params.wei, req.params.data);
    res.send(payload);
  });

  api.get('/quote/:wei', async (req, res) => {
    console.log('creating invoice quote');
    const payload = await signer.makeInvoice(req.params.wei);
    res.send(payload);
  });

  env.register({ name: 'valid-payments-api' }).then(service => {
    api.listen(service.port, () => {
      console.info(`Api listening on port ${service.port}`);
      monitor.watchForPayment(console.log);
    });
  });
});
