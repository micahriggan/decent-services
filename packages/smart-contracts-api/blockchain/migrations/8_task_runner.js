var TaskRunner = artifacts.require("./TaskRunner.sol");
module.exports = function(deployer, network, accounts) {
  return deployer.deploy(TaskRunner);
}
