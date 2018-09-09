const express = require('express');
const { SignerUtil } = require('./lib/signer');
const { Monitor } = require('./lib/monitor');

const Web3 = require('web3');
const web3Config = require('./constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const spec = require('./blockchain/build/contracts/PaymentValidator.json');
const contracts = require('./constants/contracts');

const api = express();

web3.eth.getAccounts((err, accounts) => {
  const signer = new SignerUtil(web3, accounts[1]);
  const PaymentValidator = new web3.eth.Contract(spec.abi, contracts.PaymentValidator);
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

  const port = 5000;
  api.listen(port, () => {
    console.info(`Api listening on port ${port}`);
    monitor.watchForPayment();
  });
});

