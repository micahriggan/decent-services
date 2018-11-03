var PaymentValidator = artifacts.require("./PaymentValidator.sol");
module.exports = function(deployer, network, accounts) {
  return deployer.deploy(PaymentValidator, accounts[1]);
}
