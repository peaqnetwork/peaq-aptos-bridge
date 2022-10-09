type Props = {
    onClickConnect: () => void
    heading: string;
    label?: string
}

export const WalletConnect = ({onClickConnect, heading, label}: Props) => (
    <div className="wallet-connect__container" onClick={onClickConnect}>
        <p className="wallet-connect__heading">{heading}</p>
        <button className="wallet-connect__button">{label}</button>
    </div>
);
