const PaymentValidator = artifacts.require('../contracts/PaymentValidator.sol');
const { SignerUtil } = require('../../lib/signer');
const { Monitor } = require('../../lib/monitor');
const spec = require('../build/contracts/PaymentValidator.json');
const Web3 = require('web3');
const web3Config = require('../../constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const contractConfig = require('../../constants/contracts.js');

contract('PaymentValidator', (accounts) => {
  it('should be able to generate an invoice', async () => {
    const signer = new SignerUtil(web3, accounts[1]);
    const invoice = await signer.makeInvoice(10);
    assert(invoice != null, "An invoice was not created");
  });

  it('should be able to pay an invoice', async () => {
    const signer = new SignerUtil(web3, accounts[1]);
    const invoice = await signer.makeInvoice(10);
    const contract = await PaymentValidator.deployed();
    const { expiration, payloadHash, hash, v, r, s, amount } = invoice;
    let tx = await contract.pay(expiration, payloadHash, hash, v, r, s, {from: accounts[2], value: 10});
    assert(tx.logs[0].event === 'PaymentAccepted');
  });

  it('should not be able to pay a wrong value', async () => {
    const signer = new SignerUtil(web3, accounts[1]);
    const invoice = await signer.makeInvoice(10);
    const contract = await PaymentValidator.deployed();
    const { expiration, payloadHash, hash, v, r, s, amount } = invoice;
    try {
      const tx = await contract.pay(expiration, payloadHash, hash, v, r, s, {from: accounts[2], value: 1});
      assert(tx == null, "This payment should have failed");
    } catch(err) {
      assert(err.message.includes('revert'), "This payment should fail");
    }
  });

  it('should trigger the PaymentAccepted event', async() => {
    const contract = await PaymentValidator.deployed();
    const web3Contract = new web3.eth.Contract(spec.abi, contract.address);
    const monitor = new Monitor(web3Contract);
    const signer = new SignerUtil(web3, accounts[1]);


    const PaymentEvent = new Promise((resolve) => {
      monitor.watchForPayment((err, payment) => {
        resolve(payment);
      });
    });

    const invoice = await signer.makeInvoice(10);
    const { expiration, payloadHash, hash, v, r, s, amount } = invoice;
    let tx = await contract.pay(expiration, payloadHash, hash, v, r, s, {from: accounts[2], value: 10});
    assert(tx.logs[0].event === 'PaymentAccepted');

    const payment = await PaymentEvent;
    assert(payment != null, 'There should be a payment');
    assert(payment.event == 'PaymentAccepted');
    assert(payment.returnValues.value == amount, "The amount paid should match the invoice");
    assert(payment.returnValues.hash === hash, "The hash emitted from the contract should match");
    assert(payment.returnValues.time < expiration, "The emitted time should be less than the expiration time");
  });
});
