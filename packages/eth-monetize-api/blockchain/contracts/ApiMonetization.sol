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

  function purchaseApiCalls(address signingKey,  uint numCalls, uint nonce, uint expiration, bytes32 payload, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public payable {
    bytes32 ourHash = keccak256(abi.encodePacked(nonce, numCalls))
    require(payload == ourHash, "Mismatch between hash of number of calls and user input")
    validator.pay(expiration, payload, hash, v, r, s);
    purchases[signingKey] = numCalls;
  }
}
