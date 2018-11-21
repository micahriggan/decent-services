const Web3 = require('web3');
const ApiMonetization = artifacts.require('../contracts/ApiMonetization.sol');
const monetizeSpec = require('../build/contracts/ApiMonetization.json');
const validateSpec = require('../build/contracts/PaymentValidator.json');
const { PaymentValidatorUtil } = require('../../ts_build/utils/PaymentValidator');



contract('ApiMonetization', (accounts) => {

  const totalWei = 100;
  const purchaseAmount = 100;
  const payer = accounts[2];
  const signingKey = accounts[3];

  before(() => {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  });

  after(() => {
    web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));
  });


  it(`should be able to get a signed quote for ${purchaseAmount} api calls`, async () => {
    const instance = await ApiMonetization.deployed();
    const validatorAddr = await instance.validator.call();
    console.log(validatorAddr);
    const validator = new PaymentValidatorUtil(validateSpec.abi, validatorAddr);
    const signedQuote = await validator.makeInvoice(totalWei, purchaseAmount);
    assert(signedQuote != null, "We should be able to get a quote");
  });

    it('should be able to purchase the api calls', async () => {
      const instance = await ApiMonetization.deployed();
      const validatorAddr = await instance.validator.call();
      const validator = new PaymentValidatorUtil(validateSpec.abi, validatorAddr);
      const signedQuote = await validator.makeInvoice(totalWei, purchaseAmount);
  
      const { expiration, payloadHash, payload, hash, v, r, s, amount } = signedQuote;
      const { nonce } = payload;
  
      const solidityHash = await instance.validate(purchaseAmount.toString(), nonce);
      assert(solidityHash === payloadHash, 'The hash of nonce and callCount should equal the payloadHash');
  
  
  
      const tx = await instance.purchaseApiCalls(signingKey, purchaseAmount.toString(), nonce, expiration, payloadHash, hash, v, r, s, {from: payer, value: totalWei});
      assert(tx.receipt.logs[0] != null, 'Payment event should have happened');
      assert(tx.receipt.logs.length == 1, 'ApiPurchased and ValidPayment should have occurred');
  
      function lc(arg1) {
        return arg1.toLowerCase();
      }
      /*
       *const eventResults = await apiPurchased;
       *assert(lc(eventResults.signingKey) == lc(signingKey), `signingKey : lc(${eventResults.signingKey}) ==  lc(${signingKey})`);
       *assert(lc(eventResults.purchaser) == lc(payer), `purchaser : lc(${eventResults.purchaser}) ==  lc(${accounts[2]})`);
       *assert(eventResults.paid == totalWei, `paid : ${eventResults.paid} ==  ${totalWei}`);
       */
    });
  
  it('should have recorded the purchase in the purchases mapping', async() => {
    const instance = await ApiMonetization.deployed();
    const purchased = await instance.purchases(signingKey);
    assert(purchased == purchaseAmount.toString(), `purchased: ${purchased} == ${purchaseAmount}`);
  })
});
