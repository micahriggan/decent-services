const express = require('express');
const { SignerUtil } = require('./lib/signer');
const { Monitor } = require('./lib/monitor');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
const spec = require('./blockchain/build/contracts/PaymentValidator.json');
const contracts = require('./constants/contracts');

const api = express();

web3.eth.getAccounts((err, accounts) => {
  const signer = new SignerUtil(web3, accounts[1]);
  const PaymentValidator = new web3.eth.Contract(spec.abi, contracts.PaymentValidator);
  const monitor = new Monitor(PaymentValidator);

  api.get('/invoice/:usd', async (req, res) => {
    console.log('creating invoice');
    const payload = await signer.makeInvoice(req.params.usd);
    const isValid = await monitor.isValidPayment(payload);
    console.log(isValid);
    res.send(payload);
  });

  const port = 3000;
  api.listen(port, () => {
    console.info(`Api listening on port ${port}`);
    monitor.watchForPayment(PaymentValidator);
  });
});

