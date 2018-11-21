pragma solidity ^0.4.23;

import "./IERC20.sol";


contract PaymentValidator {
  address public owner;
  address public quoteSigner;

  event PaymentAccepted(bytes32 indexed hash, uint time, uint value);


  constructor(address valueSigner) public {
    owner = msg.sender;
    quoteSigner = valueSigner;
  }

  function isValidPayment(
    uint value,
    uint expiration,
    bytes32 payload,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s,
    address tokenContract
  ) public view returns(bool valid) {
    bool isValid = true;
    isValid = isValid && block.timestamp <= expiration;
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 ourHash = keccak256(abi.encodePacked(value, expiration, payload, tokenContract));
    bytes32 payloadHash = keccak256(abi.encodePacked(prefix, ourHash));
    isValid = isValid && ourHash == hash;
    isValid = isValid && (ecrecover(payloadHash, v, r, s) == quoteSigner);
    return isValid;
  }

  function validatePayment(
    uint value,
    uint expiration,
    bytes32 payload,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s,
    address tokenContract
  ) public view returns(bool valid) {
    require(block.timestamp <= expiration, "Payment is late");
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 ourHash = keccak256(abi.encodePacked(value, expiration, payload, tokenContract));
    bytes32 payloadHash = keccak256(abi.encodePacked(prefix, ourHash));
    require(ourHash == hash, "Hash mismatch");
    require(ecrecover(payloadHash, v, r, s) == quoteSigner, "Signature mismatch for quote");
    return true;
  }


  function pay(
    uint value,
    uint expiration,
    bytes32 payload,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s,
    address tokenContract
  ) public payable {
    if(tokenContract == 0x0) {
      require(validatePayment(msg.value, expiration, payload, hash, v, r, s, tokenContract), "Only accept valid payments");
    } else {
      IERC20 token = IERC20(tokenContract);
      require(token.allowance(msg.sender, address(this)) >= value, "Must have enough tokens to pay");
      require(validatePayment(value, expiration, payload, hash, v, r, s, tokenContract), "Only accept valid payments");
      require(token.transferFrom(msg.sender, address(this), value), "Transfer must succeed");
    }
    emit PaymentAccepted(hash, block.timestamp, msg.value);
  }

  modifier isAdmin() {
    require(msg.sender == owner, "Must be the contract owner");
    _;
  }

  function withdraw(address tokenContract) public isAdmin {
    if(tokenContract == 0x0) {
      owner.transfer(address(this).balance);
    } else {
      IERC20 token = IERC20(tokenContract);
      uint balance = token.balanceOf(address(this));
      require(token.transfer(owner, balance), "Must succeed withdrawing tokens");
    }
  }

  function setSigner(address newQuoteSigner) public isAdmin {
    quoteSigner = newQuoteSigner;
  }
  function setAdmin(address newAdmin) public isAdmin {
    owner = newAdmin;
  }
}
