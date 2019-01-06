const TinyProxyFactory = artifacts.require("../contracts/TinyProxyFactory.sol");
const Web3 = require('web3');

contract("TinyProxyFactory", accounts => {
  const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  describe("Making tiny proxies", () => {
    it("should make tiny proxies", async () => {
      let factory = await TinyProxyFactory.deployed();
      let proxy = await factory.make(accounts[1], 0, false);
      assert.equal(proxy != null, true, "The proxy should be created");
    });
    it("should track the tiny proxies", async () => {
      let factory = await TinyProxyFactory.deployed();
      let proxy = await factory.make(accounts[1], 0, true);
      assert.equal(proxy != null, true, "The proxy should be created");
      const proxyAddr = await factory.proxyFor.call(accounts[1], 0);
      assert.equal(proxyAddr != null, true, "The proxy should be tracked");
    });
  });
});
