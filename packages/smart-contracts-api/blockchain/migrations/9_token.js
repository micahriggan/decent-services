var Token = artifacts.require("./TestToken.sol");

module.exports = function(deployer) {
  deployer.deploy(Token);
};
