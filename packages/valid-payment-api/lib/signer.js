class SignerUtil {

  constructor(web3, signingAddress) {
    this.web3 = web3;
    this.signingAddress = signingAddress;
  }

  createMessage({amount, expiration, nonce}) {
    return [
      {
        t: 'uint', v: amount
      },
      {
        t: 'uint', v: expiration
      },
      {
        t: 'uint', v: nonce
      },
    ]
  }

  hashMessage(messageArr) {
    return this.web3.utils.soliditySha3(...messageArr);
  }

  signHash(hash) {
    return this.web3.eth.sign(hash, this.signingAddress);
  }

  async makeInvoice(usd) {
    const minutes = 60;
    const seconds = 60;
    const expiration = new Date().getTime() + 20 * minutes * seconds * 1000;
    const nonce = Math.ceil(100000000000 * Math.random());
    const amount = 1 * usd;
    const message = this.createMessage({amount, expiration, nonce});
    const hash = this.hashMessage(message);
    const signedHash = await this.signHash(hash);

    const sig = signedHash.slice(2)
    const r = `0x${sig.slice(0, 64)}`
    const s = `0x${sig.slice(64, 128)}`
    const v = this.web3.utils.toDecimal(sig.slice(128, 130)) + 27
    return {hash, signedHash, amount, expiration, nonce, v, r, s};
  }

}
module.exports = { SignerUtil };
