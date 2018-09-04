pragma solidity ^0.4.23;


contract PaymentValidator {
  address public owner;
  address public quoteSigner;

  event PaymentAccepted(bytes32 indexed hash, uint time, uint value);


  constructor(address valueSigner) public {
    owner = msg.sender;
    quoteSigner = valueSigner;
  }

  function isValidPayment(uint value, uint expiration, uint nonce, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns(bool valid) {
    if(now > expiration) {
      return false;
    }
    // amount, SPACE, expiration, SPACE, nonce
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 ourHash = keccak256(abi.encodePacked(value, expiration, nonce));
    bytes32 payloadHash = keccak256(abi.encodePacked(prefix, ourHash));
    if(ourHash != hash) {
      return false;
    }
    return ecrecover(payloadHash, v, r, s) == quoteSigner;
  }

  function pay(uint expiration, uint nonce, bytes32 hash, uint8 v, bytes32 r, bytes32 s) public payable {
    if(now > expiration) {
      revert("Payment is late");
    }

    // amount, SPACE, expiration, SPACE, nonce
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 payloadHash = keccak256(abi.encodePacked(prefix, msg.value, expiration, nonce));
    if(payloadHash == hash && ecrecover(payloadHash, v, r, s) == quoteSigner) {
      emit PaymentAccepted(payloadHash, now, msg.value);
    } else {
      revert("Invalid payload hash");
    }
  }

  modifier isAdmin() {
    require(msg.sender == owner, "Must be the contract owner");
    _;
  }
  function withdraw() public isAdmin {
    owner.transfer(address(this).balance);
  }
  function setSigner(address newQuoteSigner) public isAdmin {
    quoteSigner = newQuoteSigner;
  }
  function setAdmin(address newAdmin) public isAdmin {
    owner = newAdmin;
  }
}
