const isPaid = {};

class Monitor {
  constructor(contract) {
    this.contract = contract;
  }
  watchForPayment() {
    console.info('Watching for payments...');
    var event = this.contract.events.PaymentAccepted({}, (err, resp) => {
      if(!err) {
        console.log('Payment Accepted', resp);
      }
    });
  }

  isValidPayment({hash, signedHash, amount, expiration, nonce, v, r, s}) {
    const isValid = this.contract.methods.isValidPayment(amount, expiration, nonce, hash, v, r, s).call();
    return isValid;
  }
}

module.exports = {  Monitor };
