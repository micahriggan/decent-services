pragma solidity ^0.4.21;


contract MultiSigWallet {

  struct Proposal {
    address to;
    uint amount;
    mapping(address => bool) signed;
    bool finalized;
  }

  uint signersRequired;
  address[] public signers;
  Proposal[] public proposals;
  mapping(address => bool) public canSign;

  constructor(address[] initSigners, uint m) public {
    if(m == 0) {
      signersRequired = initSigners.length;
    } else {
      signersRequired = m;
    }
    signers = initSigners;
    for(uint i = 0; i < initSigners.length; i++) {
      canSign[initSigners[i]] = true;
    }
  }

  function () public payable {

  }

  function balance() public view returns(uint) {
    return address(this).balance;
  }


  modifier isSigner(address user) {
    require(canSign[user] == true, "Must Be a signer");
    _;
  }
  function submitProposal(uint amount, address to) public isSigner(msg.sender) {
    proposals.push(Proposal({
      to: to,
      amount: amount,
      finalized: false
    }));
  }

  modifier proposalExists(uint index) {
    require(index >= 0, "Must be a valid index");
    require(index < proposals.length, "Must be a valid index");
    _;
  }
  function sign(uint proposalIndex) public isSigner(msg.sender) proposalExists(proposalIndex) {
    proposals[proposalIndex].signed[msg.sender] = true;
  }

  function signerRequirementsMet(uint index) public proposalExists(index)  view returns(bool) {
    uint signedCount = 0;
    for(uint i = 0; i < signers.length; i++) {
      if(proposals[index].signed[signers[i]]){
        signedCount++;
      }
    }
    return signedCount >= signersRequired;
  }

  modifier isFullySigned(uint index) {
    require(signerRequirementsMet(index), "Must be fully signed");
    _;
  }

  function finalizeProposal(uint index) public isFullySigned(index) isSigner(msg.sender) {
    require(address(this).balance >= proposals[index].amount, "Must have enough balance to fufill the proposal");
    require(proposals[index].finalized == false, "Must be an unfinalized proposal");
    proposals[index].finalized = true;
    proposals[index].to.transfer(proposals[index].amount);
  }


}
