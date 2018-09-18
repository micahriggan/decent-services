const web3 = global.web3;
const TinyProxyFactory = artifacts.require("../contracts/TinyProxyFactory.sol");

contract("TinyProxyFactory", accounts => {
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
