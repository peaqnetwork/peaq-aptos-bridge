//aptos-bridge contract
address {{sender}} {
module aptosBridge::aptos-bridge {
    use 0x1::Signer;
    use 0x1::signer;
    use 0x1::vector;
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

    // bridge  status
    struct bridgeStatus has store {
        active: boolean,
        escrowAccounts:Table<address,u128>,
        fee:u64
    }
    // we will use deposit instead of transfer as transfer does'nt emit any event on aptos
    struct eventDeposit has store {
        amount: u128,
        recipent: address,
        metadata: vector<u8>
    }

    struct Configuration has key {
        admin: address,
        active: bridgeStatus<active>,
        nonce: u128,
        event_deposit: EventHandle<eventDeposit>
        
    }

    public fun intialize(account: &signer) {
        let address_ = Signer::address_of(account)
        assert(addr == DEPLOYER, E_INVALID_DEPLOYER);
        
        move_to<bridgeStatus>(
            account,
            active:true,
            escrowAccounts:table::new(),
            fee:0
        )
    }

    public entry fun transfer_from (userAccount:&signer, bridgeAddress:address, amount:u64){
        
        let user_add = signer::address_of(userAccount)
        let bridge_data = borrow_global_mut<bridgeStatus>(admin_add);

        let (active,escrowAccounts) =&mut bridge_data.active;
        assert!(*active == true, E_BRIDGE_PAUSED);
        
        let balance = coin::balance<aptos_coin::AptosCoin>(user_add);
        assert!(balance >= amount ,E_INSUFFICIENT_BALANCE);
        
        coin::transfer<aptos_coin::AptosCoin>(user_add,bridgeAddress,amount);
        coin::transfer<wraped_apt::WrappedApt>(bridgeAddress,user_add,amount);
        
        let currentAmount =table::borrow(escrowAccounts,user_add);
        table::upsert(escrowAccounts,user_add,currentAmount+amount);
        
        let config =borrow_global_mut<Configuration>(DEPLOYER);
        Event::emit_event(
            &mut config.event_deposit,
            eventDeposit {
                amount:amount,
                recipent:user_add
            }
        );
    }

    public entry fun pause(admin:&signer) {
        let admin_add = signer::address_of(admin)
        assert!(exists<bridgeStatus>(admin_add), E_ADMIN_NOT_INITIALIZED);
        
        let bridge_data = borrow_global_mut<bridgeStatus>(admin_add);
        let active = &mut bridge_data.active;
        assert!(*active == true, E_ALREADY_PAUSED);
        *active = false;
    }

    public entry fun un_pause(admin:&signer) {
        
        let admin_add = signer::address_of(admin)
        assert!(exists<bridgeStatus>(admin_add), E_ADMIN_NOT_INITIALIZED);
        
        let bridge_data = borrow_global_mut<bridgeStatus>(admin_add);
        let active = &mut bridge_data.active;
        assert!(*active == false, E_ALREADY_UNPAUSED);
        *active = true;
    }
}
}