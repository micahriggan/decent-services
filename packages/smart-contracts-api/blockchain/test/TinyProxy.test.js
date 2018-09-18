const web3 = global.web3;
const TinyProxy = artifacts.require("../contracts/TinyProxy.sol");

contract("TinyProxy", accounts => {
  describe("Contract creation", () => {
    it("should be creatable without gasLimit", async () => {
      let proxy = await TinyProxy.new(accounts[1], 0);
      assert.equal(proxy != null, true, "The proxy should be defined");
      assert.equal(
        await proxy.receiver.call(),
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
        web3.toWei(1, "ether", { from: accounts[0] })
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
        web3.toWei(1, "ether", { from: accounts[0] })
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
      const balanceBefore = web3.eth.getBalance(accounts[1]).toNumber();
      let release = await proxy.release();
      assert.equal(
        release.tx != null,
        true,
        "The contract should allow the release method to be called by anyone"
      );

      const balanceAfter = web3.eth.getBalance(accounts[1]).toNumber();
      const gain = balanceAfter - balanceBefore;
      const oneEth = web3.toWei(1, "ether");
      assert(gain, oneEth, "Should have received the one ether");
    });


    it("should release the funds to account 1 with gas limit", async () => {
      const balanceBefore = web3.eth.getBalance(accounts[1]).toNumber();
      let release = await proxyWithGas.release();
      assert.equal(
        release.tx != null,
        true,
        "The contract should allow the release method to be called by anyone"
      );

      const balanceAfter = web3.eth.getBalance(accounts[1]).toNumber();
      const gain = balanceAfter - balanceBefore;
      const oneEth = web3.toWei(1, "ether");
      assert(gain, oneEth, "Should have received the one ether");
    });
  });
});
