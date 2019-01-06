const TinyProxy = artifacts.require("../contracts/TinyProxy.sol");
const Web3 = require('web3');

contract("TinyProxy", accounts => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

  describe("Contract creation", () => {
    it("should be creatable without gasLimit", async () => {
      let proxy = await TinyProxy.new(accounts[1], 0);
      let receiver = await proxy.receiver.call();
      assert.equal(proxy != null, true, "The proxy should be defined");
      assert.equal(
        receiver,
        accounts[1],
        "The proxy should have account 1 as the receiver"
      );
    });

    it("should be creatable with gasLimit", async () => {
      let proxy = await TinyProxy.new(accounts[1], 2000);
      assert.equal(
        proxy != null,
        true,
        "The proxy should be defined with gas limit"
      );
    });
  });

  describe("Proxy behavior", () => {
    let proxy;
    it("should cheaply accept funds", async () => {
      proxy = await TinyProxy.new(accounts[1], 0);
      let sent = await proxy.send(
        web3.utils.toWei('1', "ether", { from: accounts[0] })
      );
      assert.equal(
        sent.tx != null,
        true,
        "The contract should accept funds and not throw"
      );
      assert.equal(
        sent.receipt.gasUsed < 25000,
        true,
        "The contract should not use much gas"
      );
    });

    it("should cheaply accept funds with gasLimit", async () => {
      proxyWithGas = await TinyProxy.new(accounts[1], 50000);
      let sent = await proxyWithGas.send(
        web3.utils.toWei('1', "ether", { from: accounts[0] })
      );
      assert.equal(
        sent.tx != null,
        true,
        "The contract should accept funds and not throw"
      );
      assert.equal(
        sent.receipt.gasUsed < 25000,
        true,
        "The contract should not use much gas"
      );
    });



    it("should release the funds to account 1", async () => {
      const balanceBefore = await web3.eth.getBalance(accounts[1]);
      let release = await proxy.release();
      assert.equal(
        release.tx != null,
        true,
        "The contract should allow the release method to be called by anyone"
      );

      const balanceAfter = await web3.eth.getBalance(accounts[1]);
      const gain = balanceAfter - balanceBefore;
      const oneEth = web3.utils.toWei('1', "ether").toString();
      const event = release.logs[0];
      assert.equal(event.args.to, accounts[1], "Account[1] should have received ether");
      assert.equal(event.args.amount.toString(), oneEth.toString(), "Should have received one ETH");
    });
  });
});
