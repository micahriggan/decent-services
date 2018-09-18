var PaymentValidator = artifacts.require("./PaymentValidator.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(PaymentValidator, accounts[1]);
}
