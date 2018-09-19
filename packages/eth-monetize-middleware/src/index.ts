import Web3 = require('web3');
import { SmartContractsClient } from 'smart-contracts-client';
import { Signature } from 'web3/eth/accounts';
const smartContractClient = new SmartContractsClient();
let web3 = new Web3();

let _contract = null;
const allocations: { [pubKey: string]: number | string } = {};

export function MonetizeMiddleware(contractAddr?: string) {
  web3 = new Web3(new Web3.providers.WebsocketProvider('http://localhost:8545'));
  async function getContract() {
    if (!_contract) {
      const apiMonetizationConfig = await smartContractClient.getContract('ApiMonetization');
      const address = contractAddr || apiMonetizationConfig.address;
      _contract = new web3.eth.Contract(apiMonetizationConfig.spec, address);
    }
    return _contract;
  }

  async function monetize(req, res, next) {
    const message = [req.method, req.originalUrl, JSON.stringify(req.body || {})].join('|');
    const signature = req.headers['x-signature'];
    const pubKey = recoverPubKey(message, signature);
    const contract = await getContract();
    if (!allocations[pubKey]) {
      allocations[pubKey] = await contract.methods.purchases(pubKey);
    }
    const purchases: number = Number(allocations[pubKey]);
    if (purchases > 0) {
      allocations[pubKey] = purchases - 1;
      next();
    } else {
      const PAYMENT_REQUIRED = 402;
      res.status(PAYMENT_REQUIRED).send('Please purchase api calls from ' + contract.address);
    }
  }
  return monetize;
}

export function recoverPubKey(message, signature) {
  const pubKey = web3.eth.accounts.recover(message, signature).toLowerCase();
  return pubKey;
}

export function buildSignature(privKey, method, url, body = {}) {
  const message = [method, url, JSON.stringify(body)].join('|');
  const sig: any = web3.eth.accounts.sign(message, privKey);
  return sig;
}
