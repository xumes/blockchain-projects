pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";

contract Token is StandardToken, DetailedERC20 {
    function Token(uint256 _totalSupply, string name, string symbol, uint8 decimals) DetailedERC20(name, symbol, decimals) public {
        totalSupply_ = _totalSupply;
    }
}