export const checkIfMetaMaskInstalled = () => {
    const ethereum = (window as any)?.ethereum;
    return Boolean(ethereum && ethereum.isMetaMask);
};
