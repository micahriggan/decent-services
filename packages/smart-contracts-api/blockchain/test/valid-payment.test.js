const PaymentValidator = artifacts.require('../contracts/PaymentValidator.sol');
const { PaymentValidatorUtil } = require('smart-contracts-client');
const spec = require('../build/contracts/PaymentValidator.json');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:8545"));

contract('PaymentValidator', (accounts) => {
  it('should be able to generate an invoice', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(web3, spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
    assert(invoice != null, "An invoice was not created");
  });

  it('should be able to pay an invoice', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(web3, spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
    const { expiration, payloadHash, hash, v, r, s, amount } = invoice;
    let tx = await contract.pay(expiration, payloadHash, hash, v, r, s, {from: accounts[2], value: 10});
    assert(tx.logs[0].event === 'PaymentAccepted');
  });

  it('should not be able to pay a wrong value', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(web3, spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
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
    const validator = new PaymentValidatorUtil(web3, spec.abi, contract.address);
    const web3Contract = new web3.eth.Contract(spec.abi, contract.address);
    const PaymentEvent = new Promise((resolve) => {
      web3Contract.events.PaymentAccepted({}, (err, resp) => {
        resolve(resp);
      });
    });

    const invoice = await validator.makeInvoice(10);
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
