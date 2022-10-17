import { ChangeEventHandler, KeyboardEventHandler } from "react";
import { REGEXT_NUMBERS_WITH_DECIMALS } from "../utils/constants";

type Props = {
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    value: string;
};

export const AmountInput = ({ onChange, value }: Props) => {
    const _onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
     onChange(e);
    };

    // const onKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    //     if (
    //         !REGEXT_NUMBERS_WITH_DECIMALS.test(e.key) 
     
    //     )
    //         return e.preventDefault();
    //     else if (e.key !== ".") {
    //         return e.preventDefault()
    //         // @ts-ignore
    //     } else if (e.key !== "Backspace") {
    //         return e.preventDefault()
    //     }

    // };

    return (
        <div className="textarea__container">
            <p className="textarea__send">SEND</p>
            <textarea
                onChange={_onChange}
                // onKeyDown={onKeyDown}
                value={value}
                className="textarea"
            />
            <div className="textarea__currency-wrapper">
                <p className="textarea__currency">AGNG</p>
                <p className="textarea__balance">Balance</p>
            </div>
        </div>
    );
};
