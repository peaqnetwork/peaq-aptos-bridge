export const checkIfPetraInstalled = () => {
    const aptos = (window as any).aptos;
    return Boolean(!!aptos);
};
