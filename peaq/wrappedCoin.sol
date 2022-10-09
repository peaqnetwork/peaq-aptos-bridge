// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedCoin is ERC20 {

    constructor (uint256 initialSupply) public ERC20("Wrapped Aung", "Waung") {
        _mint(msg.sender, initialSupply);
    }
    function mint(address beneficiary, uint256 mintAmount) external {
        _mint(beneficiary, mintAmount);
            
    }

    function burnFrom(address account, uint256 amount) external {
        _burn(account, amount);
    }
}