module WrappedAptCoin::wrapped_apt {
    struct WrappedApt {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<WrappedApt>(
            sender,
            b"Wrapped Peaq",
            b"Wpeaq",
            6,
            false,
        );
    }

    public entry fun register_coin(account:&signer){
        aptos_framework::managed_coin::register<WrappedApt>(account);
    }

    public entry fun mint_to(account:&signer,dest_add:address, amount:u64) {
        aptos_framework::managed_coin::mint<WrappedApt>(account,dest_add,amount);
    }

    public entry fun burn_from(account:&signer,amount:u64) {
        aptos_framework::managed_coin::burn<WrappedApt>(account,amount);
    }
}