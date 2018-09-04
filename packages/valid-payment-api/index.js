import * as express from 'express';
import { SignerUtil } from './lib/signer';
import { Monitor } from './lib/monitor';

var PaymentValidator = artifacts.require("./blockchain/contracts/PaymentValidator.sol");
const api = express();

api.get('/invoice/:usd', (req, res) => {
  const payload = SignerUtil.makeInvoice(req.params.usd);
  res.send(payload);
});

PaymentValidator.deployed().then((instance) => {
  Monitor.watchForPayment(instance);  
});
