var SplitCoinFactory = artifacts.require("SplitCoinFactory.sol");
module.exports = function(deployer) {


  // 1 GWEI
  /*
   *deployer.deploy(SplitCoinFactory, {
   *  gas: '0x30D400',
   *  gasPrice: '0x3B9ACA00'
   *});
   */

  // 6 GWEI
  return deployer.deploy(SplitCoinFactory, {
    gas: '0x30D400',
    gasPrice: '0x165A0BC00'
  });


  // 15 GWEI
  /*
   *deployer.deploy(SplitCoinFactory, {
   *  gas: '0x30D400',
   *  gasPrice: '0x37E11D600'
   *});
   */

  // 15 GWEI
  /*
   *deployer.deploy(SplitCoinFactory, {
   *  gas: '0x30D400',
   *  gasPrice: '0x37E11D600'
   *});
   */

  // 20 GWEI
  /*
   *deployer.deploy(SplitCoinFactory, {
   *  gas: '0x30D400',
   *  gasPrice: '0x4A817C800'
   *});
   */
};
