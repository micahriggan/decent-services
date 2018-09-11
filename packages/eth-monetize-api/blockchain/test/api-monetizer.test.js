const ApiMonetization = artifacts.require('../contracts/ApiMonetization.sol');
const spec = require('../build/contracts/ApiMonetization.json');
const Web3 = require('web3');
const web3Config = require('../../constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const contractConfig = require('../../constants/contracts.js');
const { MonetizationService } = require('../../ts_build/services/monetization');

contract('ApiMonetization', (accounts) => {

  const purchaseAmount = 100;
  const payer = accounts[2];
  const signingKey = accounts[3];

  it(`should be able to get a signed quote for ${purchaseAmount} api calls`, async () => {
    let { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
      purchaseAmount,
      1
    );
    assert(totalUsd === purchaseAmount, "We asked for 100 api calls at 1 dollar per call");
    assert(totalEther > 0, "Uhm, $0 ether seems bad");
  });

  it('should be able to purchase the api calls', async () => {
    let { totalEther, totalWei, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
      purchaseAmount,
      1
    );
    const instance = await ApiMonetization.deployed();
    const { expiration, payloadHash, payload, hash, v, r, s, amount } = signedQuote;
    const { nonce } = payload;

    const solidityHash = await instance.validate(purchaseAmount.toString(), nonce);
    assert(solidityHash === payloadHash, 'The hash of nonce and callCount should equal the payloadHash');


    const monetizationContract = new web3.eth.Contract(spec.abi, instance.address);

    const apiPurchased = new Promise((resolve, reject) => {
      monetizationContract.events.ApiPurchase({}, (err, resp) => {
        resolve(resp.returnValues);
      });
    });

    const tx = await instance.purchaseApiCalls(signingKey, purchaseAmount.toString(), nonce, expiration, payloadHash, hash, v, r, s, {from: payer, value: totalWei});
    assert(tx.receipt.logs[0] != null, 'Payment event should have happened');
    assert(tx.receipt.logs.length == 2, 'ApiPurchased and ValidPayment should have occurred');

    function lc(arg1) {
      return arg1.toLowerCase();
    }
    const eventResults = await apiPurchased;
    assert(lc(eventResults.signingKey) == lc(signingKey), `signingKey : lc(${eventResults.signingKey}) ==  lc(${signingKey})`);
    assert(lc(eventResults.purchaser) == lc(payer), `purchaser : lc(${eventResults.purchaser}) ==  lc(${accounts[2]})`);
    assert(eventResults.paid == totalWei, `paid : ${eventResults.paid} ==  ${totalWei}`);
  });

  it('should have recorded the purchase in the purchases mapping', async() => {
    const instance = await ApiMonetization.deployed();
    const purchased = await instance.purchases(signingKey);
    assert(purchased == purchaseAmount.toString(), `purchased: ${purchased} == ${purchaseAmount}`);
  })
});
