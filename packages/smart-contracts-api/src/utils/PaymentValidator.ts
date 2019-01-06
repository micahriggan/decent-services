import Web3 = require('web3');
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export class PaymentValidatorUtil {
  private contract;
  private web3: Web3;
  private wssWeb3: Web3;
  constructor(abi, address?: string, web3?: Web3) {
    this.web3 =
      web3 && web3.currentProvider
        ? new Web3(web3.currentProvider)
        : new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    this.contract = new this.web3.eth.Contract(abi, address);
  }

  createMessage({ amount, expiration, payloadHash, tokenContract }) {
    return [
      {
        t: 'uint',
        v: amount
      },
      {
        t: 'uint',
        v: expiration
      },
      {
        t: 'bytes32',
        v: payloadHash
      },
      {
        t: 'address',
        v: tokenContract
      }
    ];
  }

  createPayloadMessage({ nonce, dataStr }) {
    return [
      {
        t: 'uint',
        v: nonce
      },
      {
        t: 'string',
        v: dataStr
      }
    ];
  }

  hashMessage(messageArr) {
    return this.web3.utils.soliditySha3(...messageArr);
  }

  async signHash(hash) {
    const signingAddress = await this.contract.methods.quoteSigner().call();
    return this.web3.eth.sign(hash, signingAddress);
  }

  async makeInvoice(amount, { data = '0', tokenContract = ZERO_ADDRESS } = {}) {
    const nonce = Math.ceil(100000000000 * Math.random());
    const dataStr = parseInt(data, 10).toString();
    const payload = { nonce, dataStr };
    const payloadMsg = this.createPayloadMessage(payload);
    const payloadHash = this.hashMessage(payloadMsg);

    const minutes = 60;
    const seconds = 60;
    const expiration = new Date().getTime() + 20 * minutes * seconds * 1000;
    const message = this.createMessage({ amount, expiration, payloadHash, tokenContract });
    const hash = this.hashMessage(message);
    const signedHash = await this.signHash(hash);

    const sig = signedHash.slice(2);
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = this.web3.utils.toDecimal(sig.slice(128, 130)) + 27;
    return { hash, signedHash, amount, expiration, payload, payloadHash, v, r, s, tokenContract };
  }

  watchForPayment(cb) {
    var event = this.contract.events.PaymentAccepted({}, (err, resp) => {
      if (err) return cb(err);
      if (!err) {
        return cb(null, resp);
      }
    });
  }

  isValidPayment({ hash, signedHash, amount, expiration, nonce, v, r, s, tokenContract }) {
    const isValid = this.contract.methods
      .isValidPayment(amount, expiration, nonce, hash, v, r, s, tokenContract)
      .call();
    return isValid;
  }
}
