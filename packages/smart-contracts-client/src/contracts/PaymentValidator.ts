export class PaymentValidatorUtil {
  private contract;
  constructor(private web3, abi, address?: string) {
    this.contract = new web3.eth.Contract(abi, address);
  }

  createMessage({ amount, expiration, payloadHash }) {
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
    console.log(signingAddress);
    return this.web3.eth.sign(hash, signingAddress);
  }

  async makeInvoice(wei, data = '') {
    const nonce = Math.ceil(100000000000 * Math.random());
    const dataStr = parseInt(data, 10).toString();
    const payload = { nonce, dataStr };
    const payloadMsg = this.createPayloadMessage(payload);
    const payloadHash = this.hashMessage(payloadMsg);

    const minutes = 60;
    const seconds = 60;
    const expiration = new Date().getTime() + 20 * minutes * seconds * 1000;
    const amount = wei;
    const message = this.createMessage({ amount, expiration, payloadHash });
    const hash = this.hashMessage(message);
    const signedHash = await this.signHash(hash);

    const sig = signedHash.slice(2);
    const r = `0x${sig.slice(0, 64)}`;
    const s = `0x${sig.slice(64, 128)}`;
    const v = this.web3.utils.toDecimal(sig.slice(128, 130)) + 27;
    return { hash, signedHash, amount, expiration, payload, payloadHash, v, r, s };
  }

  watchForPayment(cb) {
    var event = this.contract.events.PaymentAccepted({}, (err, resp) => {
      if (err) return cb(err);
      if (!err) {
        return cb(null, resp);
      }
    });
  }

  isValidPayment({ hash, signedHash, amount, expiration, nonce, v, r, s }) {
    const isValid = this.contract.methods.isValidPayment(amount, expiration, nonce, hash, v, r, s).call();
    return isValid;
  }
}
