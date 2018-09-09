var PaymentValidator = artifacts.require("./PaymentValidator.sol");
var ApiMonetization = artifacts.require("./ApiMonetization.sol");
module.exports = function(deployer, network, accounts) {
  deployer.deploy(ApiMonetization, PaymentValidator.address);
}
