pragma solidity ^0.4.17;
import "./TinyProxy.sol";

contract TinyProxyFactory {
  mapping(address => mapping(uint => address)) public proxyFor;
  mapping(address => address[]) public userProxies;

  event ProxyDeployed(address to, uint gas);
  function make(address to, uint gas, bool track) public returns(address proxy){
    proxy = proxyFor[to][gas];
    if(proxy == 0x0) {
      proxy = new TinyProxy(to, gas);
      proxyFor[to][gas] = proxy;
      emit ProxyDeployed(to, gas);
    }
    if(track) {
      userProxies[msg.sender].push(proxy);
    }
    return proxy;
  }

  function untrack(uint index) public {
    uint lastProxy = userProxies[msg.sender].length - 1;
    userProxies[msg.sender][index] = userProxies[msg.sender][lastProxy];
    delete userProxies[msg.sender][lastProxy];
  }
}
