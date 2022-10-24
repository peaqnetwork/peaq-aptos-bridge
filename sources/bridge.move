//aptos-bridge contract
module AptosPeaqBridge::aptos_peaq_bridge {

    use std::signer;
    use std::event::{Self, EventHandle};
    use aptos_framework::account::{Self};
    use aptos_framework::coin::{Self};
    use aptos_framework::timestamp;
    use std::string::String;
    use WrappedAptCoin::wrapped_apt::WrappedApt;

    // bridge admin
    const ADMIN:address = @AptosPeaqBridge;

    // error constants
    const E_ALREADY_DEPLOYED: u64 = 0;
    const E_ALREADY_PAUSED: u64 =1; 
    const E_ALREADY_UNPAUSED: u64 =2;
    const E_BRIDGE_PAUSED: u64 =3;
    const E_ADMIN_NOT_INITIALIZED: u64 =4;
    const E_INVALID_DEPLOYER: u64 =5;
    const E_INSUFFICIENT_BALANCE: u64 =6;
    const E_FORBIDDEN: u64 =7;
    const E_CONFIGURATION_ALREADY_EXISTS: u64 =8;
    const E_CONFIGURATION_NOT_INITIALIZED:u64 =9;
    const E_INSUFFICIENT_APTOS_FEE:u64 =10;
    const E_ZERO_INPUT_NOT_ALLOWED: u64 = 11;

    // we will use deposit instead of transfer as transfer does'nt emit any event on aptos
    struct EventDeposit has store,drop {
        amount: u64,
        recipent: String,
        timestamp: u64,
        nonce: u128,
        chainId: u8,
    }

    struct Configuration has key,store {
        admin: address,
        chainId: u8,
        nonce: u128,
        active: bool,
        fee:u64,
        event_deposit: EventHandle<EventDeposit>
    }

    /**
       * @param account this is the signer to which will hold the configuration for the bridge
       * @param chainId_ chain id record for the bridge
       * @param active should the bridge initialized in active state
       * @param amount of fee which will be charged for using bridge services
    */
    public entry fun intialize(account: &signer,chainId_:u8,active_:bool,fee_:u64) {

        let address_ = signer::address_of(account);
        assert!(address_ == ADMIN, E_INVALID_DEPLOYER);

        assert!(!exists<Configuration>(address_), E_CONFIGURATION_ALREADY_EXISTS);
        
        move_to<Configuration>(account, Configuration {
                admin: address_,
                chainId:chainId_,
                nonce: 0,
                active:active_,
                fee:fee_,
                event_deposit: account::new_event_handle<EventDeposit>(account),
            }
        );
    }

    /**
    *   @param userAddressPeaq destination address on evm to which we want to transfer to
    *   @param amount wrapped coin amoun which will be transfer
    */
    public entry fun transfer_from (userAccount:&signer,userAddressPeaq:String, amount:u64) acquires Configuration{
        // check if the bridge is configured
        assert_is_configured();
        
        assert!( amount > 0 , E_ZERO_INPUT_NOT_ALLOWED);
        let user_add = signer::address_of(userAccount);

        let bridge_data = borrow_global_mut<Configuration>(ADMIN);

        let active = &bridge_data.active;
        let nonce = &mut bridge_data.nonce;
        let chainId = &bridge_data.chainId;
        // let fee = &bridge_data.fee;


        assert!(*active == true,  E_BRIDGE_PAUSED);
        
        let balance = coin::balance<WrappedApt>(user_add);
        assert!(balance >= amount , E_INSUFFICIENT_BALANCE);

        // let aptosbalance = coin::balance<aptos_coin::AptosCoin>(user_add);
        // assert!(aptosbalance > *fee , E_INSUFFICIENT_APTOS_FEE);

        *nonce = *nonce + 1;

        coin::transfer<WrappedApt>(userAccount,@AptosPeaqBridge,amount);
        // coin::transfer<aptos_coin::AptosCoin>(@newBridgeLatest,userAccount,*fee);

       
        event::emit_event(
            &mut bridge_data.event_deposit,
            EventDeposit {
                amount:amount,
                recipent:userAddressPeaq,
                timestamp:timestamp::now_seconds(),
                nonce:*nonce,
                chainId:*chainId,
            }
        );

    }

        /**
           * @param userAccount account of the user which we will mint the coins to
           * @param amount the amoun which will be minted to the provided user address
        */
      public entry fun transfer_to (account:&signer,userAccount:address, amount:u64) acquires Configuration{
        // only admin can call this method
        assert_is_admin(account);
        assert_is_configured();
        
        let bridge_data = borrow_global_mut<Configuration>(ADMIN);

        let active = &bridge_data.active;
        let nonce = &mut bridge_data.nonce;
        assert!(*active == true, E_BRIDGE_PAUSED);
        
        *nonce = *nonce + 1;

        WrappedAptCoin::wrapped_apt::mint_to(account,userAccount,amount);

    }

    // utility methods
    public entry fun pause(admin:&signer) acquires Configuration {

        assert_is_admin(admin);
        assert_is_configured();

        let admin_add = signer::address_of(admin);
        let bridge_data = borrow_global_mut<Configuration>(admin_add);
        let active = &mut bridge_data.active;

        assert!(*active == true, E_ALREADY_PAUSED);
        *active = false;

    }

    public entry fun un_pause(admin:&signer) acquires Configuration {
        
        assert_is_admin(admin);
        assert_is_configured();
        
        let admin_add = signer::address_of(admin);
        let bridge_data = borrow_global_mut<Configuration>(admin_add);
        let active = &mut bridge_data.active;
        assert!(*active == false, E_ALREADY_UNPAUSED);
        *active = true;
    }

    public fun modify_fee(admin:&signer, amount:u64) acquires Configuration {
        
        assert_is_admin(admin);
        assert_is_configured();

        let config = borrow_global_mut<Configuration>(ADMIN);
        config.fee = amount

    }

    public fun get_fee():u64 acquires Configuration {
        assert_is_configured();
        borrow_global<Configuration>(ADMIN).fee
    }

    public fun get_chain_id():u8 acquires Configuration {
        assert_is_configured();
        borrow_global<Configuration>(ADMIN).chainId
    }

    public fun set_chain_id(admin:&signer, new_id:u8) acquires Configuration {

        assert_is_admin(admin);
        assert_is_configured();

        let config = borrow_global_mut<Configuration>(ADMIN);
        config.chainId = new_id;

    }

    /**
        * @notice assertion validating that the signer is the admin
    */
    fun assert_is_admin(admin:&signer) {
        let admin_add = signer::address_of(admin);
        assert!(admin_add == ADMIN,E_FORBIDDEN);
    }

    /**
        * @notice assetion verifying that the bridge is actually deployed
    */
    fun assert_is_configured (){
        assert!(exists<Configuration>(@AptosPeaqBridge), E_CONFIGURATION_NOT_INITIALIZED);
    }

}
