var PaymentValidator = artifacts.require("./PaymentValidator.sol");
module.exports = function(deployer) {
   web3.eth.getAccounts((err, accounts) => {
    deployer.deploy(PaymentValidator, accounts[1]);
  });
};
