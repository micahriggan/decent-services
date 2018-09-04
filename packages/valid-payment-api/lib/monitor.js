const isPaid = {};

export class Monitor {
  static watchForPayment(PaymentContract) {
    var event = PaymentContract.PaymentAccepted({},  []);
    event.watch((err, resp) => {
      if(!err) {
        console.log(resp);
      }
    });
  }

  static checkPaid(hash) {
    return isPaid[hash] === true;
  }
}
