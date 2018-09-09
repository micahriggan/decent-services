var PaymentValidator = artifacts.require("./PaymentValidator.sol");
var ApiMonetization = artifacts.require("./ApiMonetization.sol");
module.exports = function(deployer, network, accounts) {
  return PaymentValidator.deployed().then((instance) => {
    return deployer.deploy(ApiMonetization, instance.address);
  });
}
