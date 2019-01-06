var SplitCoinFactory = artifacts.require('./SplitCoinFactory.sol');
var SplitCoin = artifacts.require('./ClaimableSplitCoin.sol');
var splitcoinJson = require('../build/contracts/ClaimableSplitCoin.json');
const Web3 = require('web3');

contract('SplitCoin', (accounts) => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  const wssWeb3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));

  let splitCoinContractAddr = null;
  let splitCoinContract = null;
  let splitCoinSplits = [];

  it("should be able to deploy a SplitCoin via factory", async() => {
    let factory = await SplitCoinFactory.deployed();
    const MILLION = 1000000;
    let half = MILLION / 2;
    const tx = await factory.make([accounts[0], accounts[1]], [half, half], "0x0", false);
    const deployed = await factory.contracts(accounts[0], 0);
    splitCoinContractAddr = deployed;
    const splitCoin =  new web3.eth.Contract(splitcoinJson.abi, deployed);
    assert.equal(splitCoin != null, true, "The splitCoin should be defined");
    const splits = await Promise.all([splitCoin.methods.splits(1).call(), splitCoin.methods.splits(2).call()])
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

  it("should send the ether to 3 accounts, dev, acc1, acc2", async () => {
    let sendAmount = web3.utils.toWei('1', "ether");
    const contract = new wssWeb3.eth.Contract( splitcoinJson.abi, splitCoinContractAddr);
    let found = [];
    let sumSent = 0;
    const events = new Promise((resolve) => {
      let splitEvent = contract.events.SplitTransfer({}, (err, res) => {
        console.log(`${res.event}: ${res.returnValues.amount} to ${res.returnValues.to}`);
        sumSent += Number(res.returnValues.amount);
        for (let split of splitCoinSplits) {
          if (res.returnValues.to == split.to && found.indexOf(split.to) == -1) {
            found.push(split.to);
          }
        }
        if (found.length == 2) {
          assert.equal(found.length, 2, "Should fire off transfers for the two users");
          assert.equal(sumSent, sendAmount, "The total amount of Ether should be accounted for");
          resolve();
        }
      });
    });

    await web3.eth.sendTransaction({
      from: accounts[3],
      to: splitCoinContractAddr,
      value: sendAmount
    });

    return events;
  });

});
