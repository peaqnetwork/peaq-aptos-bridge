// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IBridge {
    
    function transferFrom(bytes32 aptosAddress) external payable;

    function transferTo (address user,uint amount) external;

    function pause() external;

    function unPause() external;

    function modifyFee(uint256 amount) external;

    function getFee() external view returns(uint256);

    function setChainId(uint8 chainId) external;

    function getChainId() external view returns(uint8);

    event eventDeposit(uint128 amount,bytes32 recipent,uint64 timestamp,uint128 nonce ,uint8 chainId );

}