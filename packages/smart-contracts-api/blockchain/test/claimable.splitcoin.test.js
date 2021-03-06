var SplitCoinFactory = artifacts.require('./SplitCoinFactory.sol');
var SplitCoin = artifacts.require('./ClaimableSplitCoin.sol');
var splitcoinJson = require('../build/contracts/ClaimableSplitCoin.json');
var Web3 = require('web3');

contract('ClaimableSplitCoin', accounts => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  const wssWeb3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8545"));

  let splitCoinContractAddr = null;
  let splitCoinSplits = [];
  let factory = null;

  it('should be able to deploy a ClaimableSplitCoin via factory', () => {
    return SplitCoinFactory.deployed()
      .then(splitFactory => {
        factory = splitFactory;
        const MILLION = 1000000;
        let half = MILLION / 2;
        return factory.make(
          [accounts[0], accounts[1]],
          [half, half],
          '0x0',
          true
        );
      })
      .then(tx => {
        return factory.contracts(accounts[0], 0);
      })
      .then(splitCoinAddr => {
        splitCoinContractAddr = splitCoinAddr;
        return SplitCoin.at(splitCoinAddr);
      })
      .then(splitCoin => {
        assert.equal(
          splitCoin != null,
          true,
          'The splitCoin should be defined'
        );
        return Promise.all([
          splitCoin.splits(1),
          splitCoin.splits(2)
        ]);
      })
      .then(splits => {
        for (let index = 0; index < splits.length; index++) {
          let splitData = {
            to: '',
            ppm: 0
          };
          let split = splits[index];
          splitData.to = split[0];
          splitData.ppm = split[1].toFixed();
          splitCoinSplits.push(splitData);
          assert.equal(
            split != null,
            true,
            'There should be a split at index 1'
          );
          assert.equal(
            splitData.to,
            accounts[index],
            'The contract should have the user at index 1'
          );
          assert.equal(
            splitData.ppm < 1000000,
            true,
            'The user should get less than the whole amount (dev_fee)'
          );
          assert.equal(
            splitData.ppm > 400000,
            true,
            'The user should get almost half'
          );
        }
      });
  });

  it('should be cheap to send to this contract', async () => {
    let amount = await web3.eth.estimateGas({
      from: accounts[0],
      to: splitCoinContractAddr,
      amount: web3.utils.toWei('1', 'ether')
    });
    console.log('ClaimableSplitCoin gas estimate : ', amount);
    assert.equal(amount < 50000, true);
  });

  it('should be able to transfer some of the ownership', async () => {
    let splitContract = SplitCoin.at(splitCoinContractAddr);
    let ownershipBefore = Number(await splitContract.ownership(accounts[0], 1));
    let ownership2Before = Number(
      await splitContract.ownership(accounts[1], 1)
    );
    let ownershipAfter = null;
    let ownership2After = null;
    console.log('User 1 Ownership Before transfer: ', ownershipBefore);
    console.log('User 2 Ownership Before transfer: ', ownership2Before);
    await splitContract.transfer(
      accounts[0],
      Math.floor(ownershipBefore / 2),
      accounts[1],
      accounts[0],
      {
        from: accounts[0]
      }
    );
    ownershipAfter = Number(await splitContract.ownership(accounts[0], 1));
    ownership2After = Number(await splitContract.ownership(accounts[1], 1));
    console.log(
      'User 1 Ownership Before transfer: ',
      ownershipBefore,
      'Ownership After Transfer: ',
      ownershipAfter
    );
    console.log(
      'User 2 Ownership Before transfer: ',
      ownership2Before,
      'Ownership After Transfer: ',
      ownership2After
    );
    assert.equal(ownershipAfter, ownershipBefore / 2);
    assert.equal(ownership2After, ownership2Before + ownershipBefore / 2);

  });

  it('should have a claimable balance for dev, acc1, acc2 equal to 1 ether', async () => {
    let splitContract = SplitCoin.at(splitCoinContractAddr);
    let sendAmount = web3.utils.toWei('1', 'ether');
    const result = await web3.eth.sendTransaction({
      from: accounts[3],
      to: splitCoinContractAddr,
      value: web3.utils.toWei('1', 'ether')
    });

    let claimable1 = await splitContract.getClaimableBalance({
      from: accounts[0]
    });

    let claimable2 = await splitContract.getClaimableBalance({
      from: accounts[1]
    });

    let developer = await splitContract.developer.call();
    let devCharge = await splitContract.getClaimableBalance({
      from: developer
    });

    assert.equal(
      claimable1.toNumber() + claimable2.toNumber() + devCharge.toNumber(),
      sendAmount
    );
  });

  it('should send the ether to 2 accounts, acc1, acc2', done => {
    //let splitContract = SplitCoin.at(splitCoinContractAddr);
    const splitCoin = new wssWeb3.eth.Contract(splitcoinJson.abi, splitCoinContractAddr);
    let found = [];

    let splitEvent = splitCoin.events.SplitTransfer({}, (err, eventRes) => {
      console.log(
        `${eventRes.event}: ${eventRes.returnValues.amount} to ${eventRes.returnValues.to}`
      );
      for (let split of splitCoinSplits) {
        if (eventRes.returnValues.to.toLowerCase() == split.to.toLowerCase() && found.indexOf(split.to) == -1) {
          found.push(split.to.toLowerCase());
        } else {
          //console.log('Looking for ', split.to, ' saw: ', eventRes.returnValues.to);
        }
      }
      if (found.length == 2) {
        assert.equal(true, true, 'Should fire off transfers for the two users');
        splitEvent.unsubscribe();
        done();
      }
    });

    console.log('Waiting for two transfers...');

    splitCoin.methods.claim().send({
        from: accounts[0]
      })
      .then(() =>
        splitCoin.methods.claim().send({
          from: accounts[1]
        })
      );
  });

  it('should be able to capture remainder with odd number of splits', done => {
    let getAccountPromise = new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
    let splits = null;
    getAccountPromise
      .then(allAcc => {
        const MILLION = 1000000;
        let ninth = MILLION / 9;
        let ppms = [];
        for (let i = 1; i < 10; i++) {
          ppms.push(ninth);
        }
        splits = allAcc.slice(0, 9);
        assert.equal(ppms.length, 9);
        assert.equal(splits.length, 9);
        return factory.make(splits, ppms, '0x0', true);
      })
      .then(tx => {
        let deployedAddr = tx.logs[0].args._deployed;
        return deployedAddr;
      })
      .then(addr => {
        web3.eth.sendTransaction(
          {
            from: accounts[3],
            to: addr,
            value: web3.utils.toWei('1', 'ether')
          },
          async (err, result) => {
            let ninContractSplit = SplitCoin.at(addr);
            let developer = '0xaB48Dd4b814EBcb4e358923bd719Cd5cd356eA16';
            let splitPpm = await ninContractSplit.splits(0);
            let ppm = Number(splitPpm[1].toFixed());
            let remainder = (2500 % splits.length) * splits.length / 10;
            console.log('Remainder from 9 users', remainder);
            assert.equal(ppm, 2500 + Math.floor(remainder));
            done();
          }
        );
      });
  });
});
