const ApiMonetization = artifacts.require('../contracts/ApiMonetization.sol');
const spec = require('../build/contracts/ApiMonetization.json');
const Web3 = require('web3');
const web3Config = require('../../constants/web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(web3Config.url));
const contractConfig = require('../../constants/contracts.js');
const { MonetizationService } = require('../../ts_build/services/monetization');

contract('ApiMonetization', (accounts) => {

  it('should be able to get a signed quote for 100 api calls', async () => {
    let { totalEther, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
      100,
      1
    );
    assert(totalUsd === 100, "We asked for 100 api calls at 1 dollar per call");
    assert(totalEther > 0, "Uhm, $0 ether seems bad");
  });

  it('should be able to purchase the api calls', async () => {
    let { totalEther, totalWei, totalUsd, signedQuote } = await MonetizationService.getQuoteForApiCalls(
      100,
      1
    );
    console.log(totalEther, totalUsd, totalWei, signedQuote);
    const instance = await ApiMonetization.deployed();
    const { expiration, payloadHash, payload, hash, v, r, s, amount } = signedQuote;
    const { nonce } = payload;


    const wei = web3.utils.toWei(totalEther.toString(), 'ether');
    const solidityHash = await instance.validate('100', nonce);
    assert(solidityHash === payloadHash, 'The hash of nonce and callCount should equal the payloadHash');


    const signingKey = accounts[3];
    const tx = await instance.purchaseApiCalls(signingKey, '100', nonce, expiration, payloadHash, hash, v, r, s, {from: accounts[2], value: wei});
    console.log(tx);
  });
});
