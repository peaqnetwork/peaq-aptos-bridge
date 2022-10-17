//aptos-bridge contract
module newBridgeLatest::new_bridge_latest {

    use std::signer;
    use std::event::{Self, EventHandle};
    use aptos_framework::account::{Self};
    use aptos_framework::coin::{Self};
    use aptos_framework::timestamp;
    use aptos_framework::aptos_coin;
    use std::string::String;
    use WrappedAptNewLatest::wrapped_apt_new_latest::WrappedApt;

    // bridge admin
    const ADMIN:address = @newBridgeLatest;

    // error constants
    const E_ALREADY_DEPLOYED: u8 = 0;
    const E_ALREADY_PAUSED: u8 =1; 
    const E_ALREADY_UNPAUSED: u8 =2;
    const E_BRIDGE_PAUSED: u8 =3;
    const E_ADMIN_NOT_INITIALIZED: u8 =4;
    const E_INVALID_DEPLOYER: u8 =5;
    const E_INSUFFICIENT_BALANCE: u8 =6;
    const E_FORBIDDEN: u8 =7;
    const E_CONFIGURATION_ALREADY_EXISTS: u8 =8;
    const E_CONFIGURATION_NOT_INITIALIZED:u8 =9;
    const E_INSUFFICIENT_APTOS_FEE:u8 =10;

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

    public entry fun intialize(account: &signer) {

        let address_ = signer::address_of(account);
        assert!(address_ == ADMIN, E_INVALID_DEPLOYER);

        assert!(!exists<Configuration>(address_), E_CONFIGURATION_ALREADY_EXISTS);
        
        move_to<Configuration>(account, Configuration {
                admin: address_,
                chainId:2,
                nonce: 0,
                active:true,
                fee:0,
                event_deposit: account::new_event_handle<EventDeposit>(account),
            }
        );
    }

    public entry fun transfer_from (userAccount:&signer,userAddressPeaq:String, amount:u64) acquires Configuration{
        assert_is_configured();
        
        let user_add = signer::address_of(userAccount);

        let bridge_data = borrow_global_mut<Configuration>(ADMIN);

        let active = &bridge_data.active;
        let nonce = &mut bridge_data.nonce;
        let chainId = &bridge_data.chainId;
        let fee = &bridge_data.fee;


        assert!(*active == true,  E_BRIDGE_PAUSED);
        
        let balance = coin::balance<WrappedApt>(user_add);
        assert!(balance > amount , E_INSUFFICIENT_BALANCE);

        let aptosBalanace = coin::balance<aptos_coin::AptosCoin>(user_add);
        assert!(aptosBalanace > fee , E_INSUFFICIENT_APTOS_FEE);

        coin::transfer<aptos_coin::AptosCoin>(@newBridgeLatest,userAccount,*fee);
        coin::transfer<WrappedApt>(userAccount,@newBridgeLatest,amount);

        *nonce = *nonce + 1;
       
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

      public entry fun transfer_to (account:&signer,userAccount:address, amount:u64) acquires Configuration{
        assert_is_admin(account);
        assert_is_configured();
        
        let bridge_data = borrow_global_mut<Configuration>(ADMIN);

        let active = &bridge_data.active;
        let nonce = &mut bridge_data.nonce;
        assert!(*active == true, E_BRIDGE_PAUSED);
        
        WrappedAptNewLatest::wrapped_apt_new_latest::mint_to(account,userAccount,amount);

        *nonce = *nonce + 1;

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

    fun assert_is_admin(admin:&signer) {
        let admin_add = signer::address_of(admin);
        assert!(admin_add == ADMIN,E_FORBIDDEN);
    }

    fun assert_is_configured (){
        assert!(exists<Configuration>(@newBridgeLatest), E_CONFIGURATION_NOT_INITIALIZED);
    }

}
