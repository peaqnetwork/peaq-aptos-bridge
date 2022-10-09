// @ts-ignore
import SwapWalletArrows from "../assets/swapWallets-arrows.png";

type Props = {
    onClick: () => void
}

export const ConnectWalletArrows = ({onClick}: Props) => (
    <img
        onClick={onClick}
        className="connect-wallet-arrows"
        src={SwapWalletArrows}
        alt="exchange arrows" />
);
