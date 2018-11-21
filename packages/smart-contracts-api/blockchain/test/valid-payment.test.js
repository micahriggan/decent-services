const PaymentValidator = artifacts.require('../contracts/PaymentValidator.sol');
const TestToken = artifacts.require('../contracts/TestToken.sol');
const { PaymentValidatorUtil } = require('../../ts_build/utils/PaymentValidator.js');
const spec = require('../build/contracts/PaymentValidator.json');
const Web3 = require('web3');

contract('PaymentValidator', (accounts) => {

  before(() => {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  });

  after(() => {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  });


  it('should be able to generate an invoice', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
    assert(invoice != null, "An invoice was not created");
  });

  it('should be able to pay an invoice', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
    const { amount, expiration, payloadHash, hash, v, r, s, tokenContract } = invoice;
    let tx = await contract.pay(amount, expiration, payloadHash, hash, v, r, s, tokenContract, {from: accounts[2], value: 10});
    assert(tx.logs[0].event === 'PaymentAccepted');
  });

  it('should be able to pay an ERC20 invoice', async () => {
    // Only account 0 has a token balance
    // After the test, the contract should have a token balance equal to the amount paid
    const contract = await PaymentValidator.deployed();
    const token = await TestToken.deployed();
    const validator = new PaymentValidatorUtil(spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10, {tokenContract: token.address});
    const { amount, expiration, payloadHash, hash, v, r, s, tokenContract } = invoice;
    const tokenBalanceBefore = await token.balanceOf(contract.address);
    assert(tokenBalanceBefore >= 0, "Should have a balance of zero or higher");
    await token.approve(contract.address, 10);
    let tx = await contract.pay(amount, expiration, payloadHash, hash, v, r, s, tokenContract, {from: accounts[0], value: 10});
    const tokenBalanceAfter = await token.balanceOf(contract.address);
    const tokenBalanceDiff = tokenBalanceAfter - tokenBalanceBefore;
    assert(tokenBalanceAfter > tokenBalanceBefore, "Balance should increase");
    assert(tokenBalanceDiff == amount, "Balance should equal amount of invoice");
    assert(tx.logs[0].event === 'PaymentAccepted');
  });


  it('should not be able to pay a wrong value', async () => {
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(spec.abi, contract.address);
    const invoice = await validator.makeInvoice(10);
    const { amount, expiration, payloadHash, hash, v, r, s, tokenContract } = invoice;
    try {
      const tx = await contract.pay(amount, expiration, payloadHash, hash, v, r, s, tokenContract, {from: accounts[2], value: 1});
      assert(tx == null, "This payment should have failed");
    } catch(err) {
      assert(err.message.includes('revert'), "This payment should fail");
    }
  });

  it('should trigger the PaymentAccepted event', async() => {
    web3 = new Web3(new Web3.providers.WebsocketProvider("http://localhost:8545"));
    const contract = await PaymentValidator.deployed();
    const validator = new PaymentValidatorUtil(spec.abi, contract.address);
    const web3Contract = new web3.eth.Contract(spec.abi, contract.address);
    const PaymentEvent = new Promise((resolve) => {
      web3Contract.events.PaymentAccepted({}, (err, resp) => {
        resolve(resp);
      });
    });

    const invoice = await validator.makeInvoice(10);
    const { amount, expiration, payloadHash, hash, v, r, s, tokenContract } = invoice;
    let tx = await contract.pay(amount, expiration, payloadHash, hash, v, r, s, tokenContract, {from: accounts[2], value: 10});
    assert.equal(tx.logs[0].event, 'PaymentAccepted');

    const payment = await PaymentEvent;
    assert(payment != null, 'There should be a payment');
    assert(payment.event == 'PaymentAccepted');
    assert(payment.returnValues.value == amount, "The amount paid should match the invoice");
    assert(payment.returnValues.hash === hash, "The hash emitted from the contract should match");
    assert(payment.returnValues.time < expiration, "The emitted time should be less than the expiration time");
  });
});
