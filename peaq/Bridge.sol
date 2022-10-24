// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "./IBridge.sol";

contract Bridge is IBridge{
    address public admin;
    uint8 public chainId;
    uint128 nonce;
    bool public active;
    uint256 public fee;

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

    function transferFrom(bytes32 peaqAddress) external payable {
        require(active == true, "Bridge is paused");
        require(msg.value > 0 , "Value should be greater then zero");
        nonce = nonce + 1;
        emit eventDeposit(
            msg.value,
            peaqAddress,
            block.timestamp,
            nonce,
            chainId
        );
    }

    function transferTo(address user, uint256 amount)
        external
        onlyAdmin
    {
        require(active == true, "Bridge is paused");
        require(amount > 0, "Insufficient funds in bridge");
        nonce = nonce + 1;
        payable(user).transfer(amount);
    }

    function pause() external onlyAdmin {
        require(active == false, "Bridge Already Active");
        active = true;
    }

    function unPause() external onlyAdmin {
        require(active == true, "Bridge Already Paused");
        active = false;
    }

    function getFee() external view onlyAdmin returns (uint256) {
        return fee;
    }

    function modifyFee(uint256 amount) external onlyAdmin {
        fee = amount;
    }

    function getChainId() external view returns (uint8) {
        return chainId;
    }

    function setChainId(uint8 chainId_) external onlyAdmin {
        chainId = chainId_;
    }
}
