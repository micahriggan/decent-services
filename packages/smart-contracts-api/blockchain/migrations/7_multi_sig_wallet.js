var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");
module.exports = function(deployer, network, accounts) {
  return deployer.deploy(MultiSigWallet, accounts, 2);
}
