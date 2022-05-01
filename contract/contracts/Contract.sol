//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Contract {

    uint public balance;

    constructor() {
    }

    function increase_balance(uint256 amount) public{
        balance += amount;
    }

  
}
