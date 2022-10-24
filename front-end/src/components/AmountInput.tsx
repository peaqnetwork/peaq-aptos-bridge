import { ChangeEventHandler } from "react";

type Props = {
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  value: string;
  resource: any;
  isAptosToPeaq: boolean;
};

export const AmountInput = ({
  onChange,
  value,
  resource,
  isAptosToPeaq,
}: Props) => {
  const _onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    onChange(e);
  };

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
        <p className="textarea__currency">{isAptosToPeaq ? "WAPT" : "AGNG"}</p>
        <p className="textarea__balance">
          {" "}
          {isAptosToPeaq && resource ? resource.data.coin.value / 1e6 : ""}{" "}
          Balance
        </p>
      </div>
    </div>
  );
};
