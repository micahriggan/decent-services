pragma solidity ^0.4.17;

contract BillableWallet {

  struct Bill {
    uint amount;
    address biller;
    uint createdAt;
  }

  struct Authorization {
    uint amount;
    uint waitTime;
  }

  struct BillerProfile {
    uint lastBilled;
    uint lastPaid;
    uint lastAuthorized;
  }

  address public owner;

  Bill[] public pendingBills;
  Bill[] public paidBills;
  mapping(address => Authorization) authorizations;
  mapping(address => BillerProfile) billerProfiles;


  function BillableWallet(address creator) public {
    owner = creator;
  }

  function authorizedFor(uint amount, address biller) public view returns(bool) {
    BillerProfile storage billerProfile = billerProfiles[biller];
    Authorization storage auth = authorizations[biller];
    uint lastBillTime = billerProfile.lastAuthorized;
    uint waitTime = auth.waitTime;
    uint minTime = lastBillTime + waitTime;
    return now >= minTime && amount <= auth.amount;
  }

  function markPaid(uint pendingBillIndex) internal {
    uint length = pendingBills.length;
    Bill storage paidBill = pendingBills[pendingBillIndex];
    pendingBills[pendingBillIndex] = pendingBills[length - 1];
    delete pendingBills[length - 1];
    pendingBills.length--;
    paidBills.push(paidBill);
    billerProfiles[paidBill.biller].lastPaid = now;
  }

  function bill(uint amount) external returns(bool) {
    billerProfiles[msg.sender].lastBilled = now;
    pendingBills.push(Bill(amount, msg.sender, now));
    if(authorizedFor(amount, msg.sender) && address(this).balance > amount) {
      billerProfiles[msg.sender].lastAuthorized = now;
      markPaid(pendingBills.length - 1);
      msg.sender.transfer(amount);
      return true;
    }
    return false;
  }

  modifier ownerOnly() {
    require(msg.sender == owner, "Must be the owner of the wallet");
    _;
  }

  function approve(uint pendingBillIndex) public ownerOnly {
    uint billAmt = pendingBills[pendingBillIndex].amount;
    if(msg.sender == owner && address(this).balance > billAmt) {
      markPaid(pendingBillIndex);
      msg.sender.transfer(billAmt);
    }
  }

  function authorize(address biller, uint amount, uint waitTime ) public ownerOnly {
    authorizations[biller] = Authorization(amount, waitTime);
  }

  function send(uint amount, address to) public ownerOnly {
    to.transfer(amount);
  }
}
