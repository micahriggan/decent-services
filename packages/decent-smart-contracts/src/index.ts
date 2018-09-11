export const SmartContracts = {
  PaymentValidator: {
    address: process.env.PaymentValidator || '',
    abi: require('../blockchain/build/contracts/PaymentValidator.json')
  },
  ApiMonetization: { 
    address: process.env.ApiMonetization || '',
    abi: require('../blockchain/build/contracts/ApiMonetization.json') 
  }
};
