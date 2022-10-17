// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./IBridge.sol";


contract Bridge  {
    
    address public admin;
    uint8 public chainId;
    uint128 nonce;
    bool public active;
    uint64 public fee;


    event eventDeposit(
        uint256 amount,
        bytes32 recipent,
        uint256 timestamp,
        uint128 nonce,
        uint8 chainId
    );


    modifier onlyAdmin() {
        require(msg.sender == admin, "Not Allowed");
        _;
    }
    
    constructor(
        uint8 chainId_,
        bool active_,
        uint64 fee_
    ) {
        admin = msg.sender;
        nonce = 0;
        chainId = chainId_;
        active = active_;
        fee = fee_;
    }

    function transfer_from(bytes32 peaqAddress) external payable
     {
        require(active == true, "Bridge is paused");
        uint256 balance = msg.sender.balance;
        require(balance > msg.value, "Insufficient balance");
        nonce = nonce + 1;
        emit eventDeposit(msg.value,peaqAddress, block.timestamp, nonce, chainId);
    }

    function transfer_to(address payable user,uint256 amount) external onlyAdmin {
        require(active == true, "Bridge is paused");
        nonce = nonce + 1;
        user.transfer(amount);
    }

    function pause() external onlyAdmin {
        require(active == false, "Bridge Already Active");
        active = true;
    }

    function un_pause() external onlyAdmin {
        require(active == true, "Bridge Already Paused");
        active = false;
    }

    function get_fee() external view  onlyAdmin returns (uint64){
        return fee;
    }

    function modify_fee(uint64 amount) external onlyAdmin {
        fee = amount;
    }

    function get_chain_id() external view returns (uint8) {
        return chainId;
    }

    function set_chain_id(uint8 chainId_) external onlyAdmin {
        chainId = chainId_;
    }

}
