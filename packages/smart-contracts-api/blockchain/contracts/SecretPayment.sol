pragma solidity ^0.4.24;

contract PayToSignatureHash {

  mapping(bytes32 => uint) public balances;


  function payToHash(bytes32 hash) public payable {
    balances[hash] += msg.value;
  }

  function getPaymentHash(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public view returns(bytes32) {
    require(ecrecover(hash, v, r, s) == msg.sender, "Signature mismatch");
    bytes32 fullHash = keccak256(abi.encodePacked(hash, v, r, s, msg.sender));
    return fullHash;
  }

  function balanceOfSigHashes(bytes32[] hash, uint8[] v, bytes32[] r, bytes32[] s) public view returns(uint valid) {
    uint balance = 0;
    for(uint i = 0; i < hash.length; i++) {
      bytes32 fullHash = getPaymentHash(hash[i], v[i], r[i], s[i]);
      balance += balances[fullHash];
    }
    return balance;
  }

  function sendTo(address[] to, bytes32[] paymentHashes,  uint[] values, bytes32[] hash, uint8[] v, bytes32[] r, bytes32[] s) public {
    uint spentSum = 0;
    uint balance = balanceOfSigHashes(hash, v, r, s);
    for(uint i = 0; i < to.length; i++) {
      spentSum += values[i];
      require(spentSum <= balance, "Can't spent more than you have");
      bytes32 fullHash = getPaymentHash(hash[i], v[i], r[i], s[i]);
      balances[fullHash] -= values[i];
      if(to[i] != 0x0) {
        to[i].transfer(values[i]);
      } else {
        payToHash(paymentHashes[i]);
      }
    }
    require(spentSum == balance, "Must spend full value of all hashes");
  }
}
