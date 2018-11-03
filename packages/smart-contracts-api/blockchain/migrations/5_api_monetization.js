var PaymentValidator = artifacts.require("./PaymentValidator.sol");
var ApiMonetization = artifacts.require("./ApiMonetization.sol");
module.exports = function(deployer, network, accounts) {
  return deployer.deploy(ApiMonetization, PaymentValidator.address);
}

