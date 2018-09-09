pragma solidity ^0.4.23;

import "./PaymentValidator.sol";

contract ApiMonetization {

  address public owner;
  PaymentValidator validator;
  mapping(address => uint) public purchases;

  constructor(address paymentVerifier) public {
    owner = msg.sender;
    validator = PaymentValidator(paymentVerifier);
  }

  function purchaseApiCalls(address signingKey,  uint numCalls, uint expiration, bytes32 payload, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public payable {
    // need to check H(nonce, numCalls) = payload
    validator.pay(expiration, payload, hash, uint8 v, bytes32 r, bytes32 s);
    purchases[signingKey] = numCalls;
  }
}
