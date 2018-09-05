const PaymentValidator = artifacts.require('../contracts/PaymentValidator.sol');
const { SignerUtil } = require('../../lib/signer');
const Web3 = require('web3');
const web3Config = require('../../constants/web3');
const web3 = new Web3(new Web3.providers.HttpProvider(web3Config.url));
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
    const contract = await PaymentValidator.at(contractConfig.PaymentValidator);
    const { expiration, nonce, hash, v, r, s, amount } = invoice;
    let tx = await contract.pay(expiration, nonce, hash, v, r, s, {from: accounts[2], value: 10});
    assert(tx.logs[0].event === 'PaymentAccepted');
  });

  it('should not be able to pay a wrong value', async () => {
    const signer = new SignerUtil(web3, accounts[1]);
    const invoice = await signer.makeInvoice(10);
    const contract = await PaymentValidator.deployed();
    const { expiration, nonce, hash, v, r, s, amount } = invoice;
    try {
      const tx = await contract.pay(expiration, nonce, hash, v, r, s, {from: accounts[2], value: 1});
      assert(false, "This payment should have failed");
    } catch(err) {
      assert(true, "This payment should fail");
    }
  });

});
