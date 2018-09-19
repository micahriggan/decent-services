var ClaimableSplitcoinLibrary = artifacts.require("CSCLib.sol");
var SplitCoinFactory = artifacts.require("SplitCoinFactory.sol");
module.exports = function(deployer) {

  deployer.deploy(ClaimableSplitcoinLibrary).then(() => {

    // 1 GWEI
    /*
     *deployer.deploy(SplitCoinFactory, {
     *  gas: '0x2DC6C0',
     *  gasPrice: '0x3B9ACA00'
     *});
     */

    // 6 GWEI
    deployer.deploy(SplitCoinFactory, {
      gas: '0x2DC6C0',
      gasPrice: '0x165A0BC00'
    });

    // 10 GWEI
    /*
     *deployer.deploy(SplitCoinFactory, {
     *  gas: '0x2DC6C0',
     *  gasPrice: '0x2540BE400'
     *});
     */

    // 15 GWEI
    /*
     *deployer.deploy(SplitCoinFactory, {
     *  gas: '0x2DC6C0',
     *  gasPrice: '0x37E11D600'
     *});
     */

    // 20 GWEI
    /*
     *deployer.deploy(SplitCoinFactory, {
     *  gas: '0x2DC6C0',
     *  gasPrice: '0x4A817C800'
     *});
     */
  });
  deployer.link(ClaimableSplitcoinLibrary, SplitCoinFactory); 
};
