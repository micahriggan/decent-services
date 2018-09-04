var PaymentValidator = artifacts.require("./PaymentValidator.sol");

module.exports = function(deployer) {
  deployer.deploy(PaymentValidator);
};
