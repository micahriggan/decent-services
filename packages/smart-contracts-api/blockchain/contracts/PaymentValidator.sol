pragma solidity ^0.4.23;


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
    bytes32 s
  ) public view returns(bool valid) {
    bool isValid = true;
    isValid = isValid && block.timestamp <= expiration;
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 ourHash = keccak256(abi.encodePacked(value, expiration, payload));
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
    bytes32 s
  ) public view returns(bool valid) {
    require(block.timestamp <= expiration, "Payment is late");
    bytes memory prefix = "\x19Ethereum Signed Message:\n32";
    bytes32 ourHash = keccak256(abi.encodePacked(value, expiration, payload));
    bytes32 payloadHash = keccak256(abi.encodePacked(prefix, ourHash));
    require(ourHash == hash, "Hash mismatch");
    require(ecrecover(payloadHash, v, r, s) == quoteSigner, "Signature mismatch for quote");
    return true;
  }


  function pay(
    uint expiration,
    bytes32 payload,
    bytes32 hash,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public payable {
    require(validatePayment(msg.value, expiration, payload, hash, v, r, s), "Only accept valid payments");
    emit PaymentAccepted(hash, block.timestamp, msg.value);
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
