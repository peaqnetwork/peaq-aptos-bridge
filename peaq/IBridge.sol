// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

interface IBridge {
    
    function transfer_from(bytes32 aptosAddress) external payable;

    function transfer_to (address payable user,uint amount) external;

    function pause() external;

    function un_pause() external;

    function modify_fee(uint256 amount) external;

    function get_fee() external view returns(uint256);

    function set_chain_id(uint8 chainId) external;

    function get_chain_id() external view returns(uint8);

    event eventDeposit(uint128 amount,address recipent,uint64 timestamp,uint128 nonce ,uint8 chainId );

}