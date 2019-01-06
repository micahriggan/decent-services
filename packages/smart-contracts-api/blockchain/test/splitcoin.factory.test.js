var SplitCoinFactory = artifacts.require('./SplitCoinFactory.sol');
var SplitCoin = artifacts.require('./ClaimableSplitCoin.sol');
var splitcoinJson = require('../build/contracts/ClaimableSplitCoin.json');
const Web3 = require('web3');

contract('SplitCoinFactory', (accounts) => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  let splitCoinSplits = [];

  it("should deploy a contract with two splits for correct gas cost", () => {
    let factory = null;
    return SplitCoinFactory.deployed()
      .then(async (splitFactory) => {
        factory = splitFactory;
        const MILLION = 1000000;
        let half = MILLION / 2;
        let gas = await factory.make.estimateGas([accounts[0], accounts[1]], [half, half], "0x0", false);
        console.log('Deploying takes', gas, 'gas');
        assert.equal(gas <= 1870000, true, "Deploying should take < 1.37 Mil Gas");
      })
  });


  it("should deploy a contract with two splits", () => {
    let factory = null;
    return SplitCoinFactory.deployed()
      .then((splitFactory) => {
        factory = splitFactory;
        const MILLION = 1000000;
        let half = MILLION / 2;
        return factory.make([accounts[0], accounts[1]], [half, half], "0x0", false);
      })
      .then((tx) => {
        return tx.logs[0].args._deployed;
      })
      .then((splitCoinAddr) => {
        return new web3.eth.Contract(splitcoinJson.abi, splitCoinAddr);
      })
      .then(async (splitCoin) => {
        assert.equal(splitCoin != null, true, "The splitCoin should be defined");
        return Promise.all([await splitCoin.methods.splits(1).call(), await splitCoin.methods.splits(2).call()])
      })
      .then((splits) => {
        for (let index = 0; index < splits.length; index++) {
          let splitData = {
            to: '',
            ppm: 0
          };
          let split = splits[index];
          splitData.to = split[0];
          splitData.ppm = split[1];
          splitCoinSplits.push(splitData);
          assert.equal(split != null, true, "There should be a split at index 1");
          assert.equal(splitData.to.toLowerCase(), accounts[index].toLowerCase(), "The contract should have the user at index 1");
          assert.equal(splitData.ppm < 1000000, true, "The user should get less than the whole amount (dev_fee)");
          assert.equal(splitData.ppm > 400000, true, "The user should get almost half");
        }
      });
  });


  it("Should be able to generate a referal address", () => {
    let factory = null;
    return SplitCoinFactory.deployed()
      .then((splitFactory) => {
        factory = splitFactory;
        return factory.generateReferralAddress('0x0');
      })
      .then((tx) => {
        return tx.logs[0].args._deployed;
      })
      .then(async(splitCoinAddr) => {
        return new web3.eth.Contract(splitcoinJson.abi, splitCoinAddr);
      })
      .then(async (splitCoin) => {
        assert.equal(splitCoin != null, true, "The splitCoin should be defined");
        return splitCoin.methods.splits(1).call();
      })
      .then((split) => {
        let splitData = {
          to: '',
          ppm: 0
        };
        splitData.to = split[0];
        splitData.ppm = split[1];
        assert.equal(split != null, true, "There should be a split at index 1");
        assert.equal(splitData.to.toLowerCase(), accounts[0].toLowerCase(), "The contract should have the user at index 1");
        assert.equal(splitData.ppm < 1000000, true, "The user should get less than the whole amount (dev_fee)");
        assert.equal(splitData.ppm > 900000, true, "The user should get more than 90%");
      });
  });
});
