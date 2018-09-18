pragma solidity ^0.4.17;

contract TinyProxy {
  address public receiver;
  uint public gasBudget;

  function TinyProxy(address toAddr, uint proxyGas) public {
    receiver = toAddr;
    gasBudget = proxyGas;
  }

  event FundsReceived(uint amount);
  event FundsReleased(address to, uint amount);

  function () public payable {
    emit FundsReceived(msg.value);
  }

  function release() public {
    uint balance = address(this).balance;
    if(gasBudget > 0){
      require(receiver.call.gas(gasBudget).value(balance)(), "Transfer must succeed with specified gas");
    } else {
      require(receiver.transfer(balance), "Transfer must succeed");
    }
    emit FundsReleased(receiver, balance);
  }
}
