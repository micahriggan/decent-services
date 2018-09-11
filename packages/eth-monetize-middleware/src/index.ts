import Web3 = require('web3');
import { SmartContracts } from 'decent-smart-contracts';
const contractAddress = process.env.ApiMonetization || '';
const web3Config = require('./constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const monetizeContract = new web3.eth.Contract(
  SmartContracts.ApiMonetization.abi,
  SmartContracts.ApiMonetization.address
);

export function monetize(req, res, next) {
  const message = [req.method, req.originalUrl, JSON.stringify(req.body)].join('|');
  const signature = req.headers['x-signature'];
  const pubKey = web3.eth.accounts.recover(message, signature);
}
