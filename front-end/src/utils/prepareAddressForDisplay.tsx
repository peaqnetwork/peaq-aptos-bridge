export const prepareAddressForDisplay = (address: string) => {
    const without0x = address.slice(2);
    const leftPortion = without0x.slice(0, 8);
    const rightPortion = without0x.slice(-8);
    return `${leftPortion}...${rightPortion}`;
};
