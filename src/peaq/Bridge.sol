// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import './IBridge.sol';

contract Bridge is IBridge {

    using SafeERC20 for IERC20;
    
    address public admin;
    uint8 public chainId;
    uint128 nonce;
    bool public active;
    uint64 public fee;

    IERC20 public transerCoin;
    IERC20 public wrappedCoin;

    mapping(address=>uint128) public  escrowAccounts;

    event eventDeposit(uint128 amount,address recipent,uint64 timestamp,uint128 nonce ,uint8 chainId );

    event eventBurned(uint128 amount,address recipent,uint64 timestamp,uint128 nonce ,uint8 chainId, bool burned );

    modifier onlyAdmin(){
        require(msg.sender == admin, "Not Allowed");
    } 

    constructor(IERC20 transferCoin,IERC20 wrappedCoin,address admin,uint8 chainId,uint128 nonce,bool active,uint64 fee) {
 
        require(address(transerCoin) != address(0), "Invalid Address");
        require(address(wrappedCoin) != address(0), "Invalid Address");
 
        admin=msg.sender;
        transerCoin= transerCoin;
        wrappedCoin = wrappedCoin;
        nonce=0;
        chainId= chainId;
        active= active;
        fee = fee;
    }

    function transfer_from(uint64 amount) external{
        
        require(active == true, "Bridge is paused");
        
        uint balance = transferCoin.balanceOf(msg.sender);
        require(balance > amount , 'Insufficient balance');
        
        uint128 currentAmount = escrowAccounts[msg.sender];
        escrowAccounts[msg.sender] = currentAmount + amount; 
        nonce = nonce + 1; 

        transferCoin.safeTransferFrom(msg.sender,address(this),amount);
        wrappedCoint._mint(msg.sender,amount);
       
        emit eventDeposit(amount,msg.sender,block.timestamp,nonce, chainId);
                
    }

    function burn_wrapped(uint64 amount) external{
        
        require(active == true, "Bridge is paused");

        uint balance = wrappedCoin.balanceOf(msg.sender);
        require(balance > amount , 'Insufficient balance');

        uint128 currentAmount = escrowAccounts[msg.sender];
        escrowAccounts[msg.sender] = currentAmount - amount;
        nonce = nonce + 1;

        wrappedCoin._burn(msg.sender,amount);
        transferCoin.safeTransferFrom(address(this),msg.sender,amount);

        emit eventBurned(amount,msg.sender,block.timestamp,nonce, chainId);

    }

   function pause() external onlyAdmin {
        require(active == false, 'Bridge Already Active');
        pause = true;
   }

   function un_pause() external onlyAdmin {
        require(active == true, 'Bridge Already Paused');
        pause = false;
   }

   function get_fee() external view returns(uint64) {
        return fee;
   }

   
   function modify_fee(uint64 amount) external onlyAdmin {
        fee = amount;
   }

   function get_chain_id() external view returns(uint8) {
    return chainId;
   }


   function set_chain_id(uint8 chainId) external onlyAdmin {
        fee = chainId;
   }

}