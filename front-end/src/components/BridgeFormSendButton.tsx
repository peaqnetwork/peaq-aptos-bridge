type Props = {
    isButtonEnabled?: boolean;
    onClick: () => void
};

export const BridgeFormSendButton = ({
   isButtonEnabled = false,
   onClick
}: Props) => (
    <button
        onClick={isButtonEnabled ? onClick : undefined}
        className={`form__submit ${
            isButtonEnabled
                ? "form__submit--enabled"
                : "form__submit--disabled"
        }`}
    >
        Send
    </button>
);
