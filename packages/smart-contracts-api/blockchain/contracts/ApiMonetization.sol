pragma solidity ^0.4.23;

import "./PaymentValidator.sol";

contract ApiMonetization {

  address public owner;
  PaymentValidator public validator;
  mapping(address => string) public purchases;
  event ApiPurchase(address indexed signingKey, address indexed purchaser, uint paid);

  constructor(address paymentVerifier) public {
    owner = msg.sender;
    validator = PaymentValidator(paymentVerifier);
  }


  function validate(string numCalls, uint nonce) public pure returns(bytes32 hash) {
    return keccak256(abi.encodePacked(nonce, numCalls));
  }

  function purchaseApiCalls(
    address signingKey,
    string numCalls,
    uint nonce,
    uint expiration,
    bytes32 payload,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public payable
  {
    bytes32 ourHash = keccak256(abi.encodePacked(nonce, numCalls));
    require(ourHash == payload, "Mismatch between hash of number of calls and user input");
    require(validator.validatePayment(msg.value, expiration, payload, hash, v, r, s), "Payment must be valid");
    emit ApiPurchase(signingKey, msg.sender, msg.value);
    purchases[signingKey] = numCalls;
  }
}
