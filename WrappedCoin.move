module WrappedApt::wraped_apt {
    struct WrappedApt {}

    fun init_module(sender: &signer) {
        aptos_framework::managed_coin::initialize<WrappedApt>(
            sender,
            b"Wrapped Apt",
            b"Wapt",
            6,
            false,
        );
    }
}