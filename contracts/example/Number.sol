// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

// more precise versioning
// pragma solidity ^0.8.28;

// 
// Simple contract to demonstrate view, and pure functions, as well as events and state variables.
//
contract Number {
    uint public number;

    event NumberChanged(uint oldValue, uint newValue);

    function setNumber(uint _num) public {
        uint oldValue = number;
        number = _num;
        emit NumberChanged(oldValue, number);
    }

    function adder (uint a, uint b) public pure returns (uint) {
        return a + b;
    }

    function doubleNumber() public view returns (uint) {
        return number * 2;
    }

    // there is an additional function generated by the compiler, for the public variable number
    // function number() public view returns (uint) {
    //     return number;
    // }

    // and there is a default constructor generated by the compiler, too
    // constructor() {
    //     number = 0;
    // }

}
