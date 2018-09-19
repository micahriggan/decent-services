var BillableWallet = artifacts.require("./BillableWallet.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(BillableWallet);
}
