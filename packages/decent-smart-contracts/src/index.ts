import Web3 = require('web3');
type Spec = { address: string; abi: any };
export const SmartContracts = {
  PaymentValidator: {
    getFor,
    spec: require('../blockchain/build/contracts/PaymentValidator.json')
  },
  ApiMonetization: {
    getFor,
    spec: require('../blockchain/build/contracts/ApiMonetization.json')
  }
};
function getFor(web3: Web3): Promise<Spec> {
  return new Promise<Spec>((resolve, reject) => {
    web3.eth.net.getId((err, resp) => {
      if (err) reject(err);
      if (!this.spec.networks[resp]) reject();
      const address = this.spec.networks[resp].address;
      if (!address) reject("This contract hasn't been deployed");
      resolve({ address, abi: this.spec.abi });
    });
  });
}
