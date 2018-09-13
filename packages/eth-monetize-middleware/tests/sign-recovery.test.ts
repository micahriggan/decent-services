import Web3 = require('web3');
import { buildSignature, recoverPubKey } from '../src/';
let web3 = new Web3();

test('should be able to sign and recovery the correct pubKey', async () => {
  const method = 'GET';
  const url = 'www.micahriggan.com';
  const body = { data: true };
  const accounts = ['0x71cc7296f45a25cfa0f83eb55974820c45338c56'];
  const { signature } = await buildSignature(
    '0xf7067c68c2b591a71ea6193594bba4e136456a2d918b13df77d493eb878e2922',
    method,
    url,
    body
  );

  const message = [method, url, JSON.stringify(body)].join('|');
  const pubKey = recoverPubKey(message, signature);
  expect(accounts[0].toLowerCase() === pubKey.toLowerCase());
});
