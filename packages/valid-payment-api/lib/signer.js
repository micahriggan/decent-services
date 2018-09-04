const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

export class SignerUtil {
  static function createMessage({amount, expiration, nonce}) {
    return `${amount} ${expiration} ${nonce}`;
  }

  static function hashMessage(message) {
    return web3.utils.sha3(message);
  }

  static function signHash(hash) {
    const address = web3.eth.accounts[0];
    return web3.eth.sign(hash, address);
  }


  static function makeInvoice(usd) {
    const minutes, seconds = 60;
    const expiration = new Date().getTime() + 20 * minutes * seconds * 1000;
    const nonce = 100000000000 * Math.random();
    const amount = 1;
    const message = createMessage({amount, expiration, nonce});
    const hash = hashMessage(message);
    const signedHash = signHash(hash);
    return {signedHash, amount, expiration, nonce} ;
  }

}
