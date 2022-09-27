//aptos-bridge contract
address {{sender}} {
module aptosBridge::aptos_bridge {

    use 0x1::Signer;
    use 0x1::vector;
    use 0x1::Errors;
    use 0x1::Event::{Self, EventHandle};
    use aptos_std::event;
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::table::{Self, Table};

    // bridge admin
    const ADMIN:address = @{{sender}};

    // error constants
    const E_ALREADY_DEPLOYED =0;
    const E_ALREADY_PAUSED =1; 
    const E_ALREADY_UNPAUSED =2;
    const E_BRIDGE_PAUSED =3;
    const E_ADMIN_NOT_INITIALIZED =4;
    const E_INVALID_DEPLOYER =5;
    const E_INSUFFICIENT_BALANCE =6;
    const E_FORBIDDEN =7;
    const E_CONFIGURATION_ALREADY_EXISTS =8;

    // we will use deposit instead of transfer as transfer does'nt emit any event on aptos
    struct eventDeposit has store {
        amount: u128,
        recipent: address,
        timestamp: u64,
        nonce: u128,
        chainId: u8,
    }

    struct eventBurned has store {
        amount: u128,
        recipent: address,
        timestamp: u64,
        nonce: u128,
        chainId: u8,
    }

    struct Configuration has key,store {
        admin: address,
        chainId: u8,
        nonce: u128,
        active: boolean,
        escrowAccounts:Table<address,u128>,
        fee:u64,
        event_deposit: EventHandle<eventDeposit>
        event_burned: EventHandle<eventBurned>
    }

    public fun intialize(account: &signer, chainId:u8, fee:u64) {

        let address_ = Signer::address_of(account);
        assert!(addr == ADMIN, E_INVALID_DEPLOYER);

        assert!(!exists<Configuration>(address), Errors::custom(E_CONFIGURATION_ALREADY_EXISTS));
        
        move_to<Configuration>(account, Configuration {
                admin: address,
                chainId,
                nonce: 0,
                active:true,
                escrowAccounts:table::new(),
                fee,
                event_deposit: Event::new_event_handle<eventDeposit>(account),
                event_burned: Event::new_event_handle<eventBurned>(account),
            }
        );
    }

    public entry fun transfer_from (userAccount:&signer, bridgeAddress:address, amount:u64) acquires Configuration{
        
        let user_add = signer::address_of(userAccount);
        let bridge_data = borrow_global_mut<Configuration>(ADMIN);

        let (active,escrowAccounts,nonce,chainId) = &mut bridge_data;
        assert!(*active == true, Errors::custom( E_BRIDGE_PAUSED));
        
        let balance = coin::balance<aptos_coin::AptosCoin>(user_add);
        assert!(balance > amount , Errors::custom(E_INSUFFICIENT_BALANCE));
        
        
        let currentAmount = table::borrow(escrowAccounts,user_add);
        table::upsert(escrowAccounts,user_add,currentAmount+amount);
        
        coin::transfer<aptos_coin::AptosCoin>(user_add,bridgeAddress,amount);
        coin::transfer<wraped_apt::WrappedApt>(bridgeAddress,user_add,amount);
        bridge_data.nonce = nonce + 1;
       
        Event::emit_event(
            &mut bridge_data.event_deposit,
            eventDeposit {
                amount:amount,
                recipent:user_add,
                timestamp:timestamp::now_seconds(),
                nonce:nonce,
                chainId,
            }
        );

    }

    public entry fun burn_wrapped (userAccount:&signer, bridgeAddress:address, amount:u64) acquires Configuration{
        
        let user_add = signer::address_of(userAccount);
        let bridge_data = borrow_global_mut<Configuration>(ADMIN);
        
        let (active,escrowAccounts,nonce,chainId) =&mut bridge_data;
        assert!(*active == true, Errors::custom(E_BRIDGE_PAUSED));

        let balance = coin::balance<wraped_apt::WrappedApt>(user_add);
        assert!(balance > amount , Errors::custom(E_INSUFFICIENT_BALANCE));

        let currentAmount = table::borrow(escrowAccounts, user_add);
        table::upsert(escrowAccounts,user_add,currentAmount - amount);

        coin::burn_from<wraped_apt::WrappedApt>(user_add,amount);
        coin::transfer<aptos_coin::AptosCoin>(bridgeAddress,user_add,amount);
        bridge_data.nonce = nonce + 1;

        Event::emit_event(
            &mut bridge_data.event_burned,
            eventBurned {
                amount:amount,
                recipent:user_add,
                timestamp:timestamp::now_seconds(),
                nonce:nonce,
                chainId,
            }
        );

    }

    // utility methods
    public entry fun pause(admin:&signer) acquires Configuration {

        check_is_admin(admin);

        let admin_add = Signer::address_of(admin);
        let bridge_data = borrow_global_mut<Configuration>(admin_add);
        let active = &mut bridge_data.active;

        assert!(*active == true, Errors::custom(E_ALREADY_PAUSED));
        *active = false;

    }

    public entry fun un_pause(admin:&signer) acquires Configuration {
        
        check_is_admin(admin);
        
        let admin_add = Signer::address_of(admin);
        let bridge_data = borrow_global_mut<Configuration>(admin_add);
        let active = &mut bridge_data.active;

        assert!(*active == false, Errors::custom(E_ALREADY_UNPAUSED));
        *active = true;
    }

    public fun modify_fee(admin:&signer, amount:u64) acquires Configuration {
        
        check_is_admin(admin);

        let config = borrow_global_mut<Configuration>(ADMIN);
        config.fee = amount;

    }

    public fun get_fee():u64 acquires Configuration {
        borrow_global<Configuration>(ADMIN).fee
    }

    public fun get_chain_id():u64 acquires Configuration {
        borrow_global<Configuration>(ADMIN).chainId
    }

    public fun set_chain_id(admin:&signer, new_id:u8) acquires Configuration {

        check_is_admin(admin);

        let config = borrow_global_mut<Configuration>(ADMIN);
        config.chainId = new_id;

    }

    fun check_is_admin(admin:&signer) {
        let admin_add = Signer::address_of(admin);
        assert!(admin_add == ADMIN,Errors::custom(E_FORBIDDEN));
    }

}
}