pragma solidity ^0.4.23;
import "./ERC20.sol";

contract TestToken is ERC20 {

  string public name = "TestToken";
  string public symbol = "MICAH";
  uint public decimals = 18;
  uint public INITIAL_SUPPLY = 10**6 * 10**18;

  constructor() public ERC20() {
    _totalSupply = INITIAL_SUPPLY;
    _balances[msg.sender] = INITIAL_SUPPLY;
  }
}
