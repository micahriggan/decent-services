var TaskRunner = artifacts.require("./TaskRunner.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(TaskRunner);
}
