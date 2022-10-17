import { AptosClient, BCS } from "aptos";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { checkIfMetaMaskInstalled } from "../utils/checkIfMetaMaskInstalled";
import { checkIfPetraInstalled } from "../utils/checkIfPetraInstalled";
import { prepareAddressForDisplay } from "../utils/prepareAddressForDisplay";
import { AmountInput } from "./AmountInput";
import { BridgeFormSendButton } from "./BridgeFormSendButton";
import { ConnectWalletArrows } from "./ConnectWalletArrows";
import { WalletConnect } from "./WalletConnect";
import Web3 from "web3";
import axios from "axios";
import { abi } from "./abi/abi";

const contractAbi: any = abi;
const contractAddress = "0xF8d6945D4D2210b3fdb656612306D8C4546AD04f";

const client = new AptosClient("https://fullnode.devnet.aptoslabs.com/v1");

type Props = {
  setShowSpinner: React.Dispatch<React.SetStateAction<boolean>>;
};

export const BridgeForm = ({ setShowSpinner }: Props) => {
  const [connectedPetraAddress, setConnectedPetraAddress] = useState("");
  const [connectedMetaMaskAddress, setConnectedMetaMaskAddress] = useState("");
  const [originalMaskAddress, setoriginalMaskAddress] = useState("");
  const [originalPetraAddress, setoriginalPetraAddress] = useState("");
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [isPetraInstalled, setIsPetraInstalled] = useState(false);
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);
  const [isAptosToPeaq, setIsAptosToPeaq] = useState(true);
  const [web3js, setWeb3js] = useState<Web3>();
  const [peaqSolidityContract, setPeaqSolidityContract] = useState<any>();
  const [account, setAccount] = useState<any>("");
  const onClickPetraConnect = useCallback(async () => {
    if (!isPetraInstalled) return;
    try {
      setShowSpinner(true);
      const result = await (window as any).aptos.connect();
      const account = await client.getAccount(result.address);
      setoriginalPetraAddress(result.address);
      setConnectedPetraAddress(prepareAddressForDisplay(result.address));
      setAccount(account);
    } catch (error) {
      // TODO add toast
    } finally {
      setShowSpinner(false);
    }
  }, [isPetraInstalled, setShowSpinner]);

  const onClickMetaMaskConnect = useCallback(async () => {
    if (!isMetaMaskInstalled) return;
    try {
      setShowSpinner(true);
      const result = await (window as any)?.ethereum.request({
        method: "eth_requestAccounts",
      });
      setoriginalMaskAddress(result[0]);
      setConnectedMetaMaskAddress(prepareAddressForDisplay(result[0]));
    } catch (error) {
    } finally {
      setShowSpinner(false);
    }
  }, [isMetaMaskInstalled, setShowSpinner]);

  const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setAmount(e.target.value);

    // after validation
    setIsAmountValid(true);
  };

  const sendAptosToPeaqTransaction = useCallback(async () => {
    const transaction = {
      type: "entry_function_payload",
      function: `0xaa15900b0be22a31327223f4f7b26254bb5d36b922a5fcdfa057604cd8754f24::new_bridge_latest::transfer_from`,
      type_arguments: [],
      arguments: [originalMaskAddress, +amount * 1e6],
    };

    try {
      setShowSpinner(true);
      const pendingTransasction = await (
        window as any
      ).aptos.signAndSubmitTransaction(transaction);
      axios({
        method: "post",
        url: "http://localhost:3002/api/process-transfer",
        data: {
          txHash: pendingTransasction.hash,
        },
      });
    } finally {
      setShowSpinner(false);
    }
  }, [originalMaskAddress, setShowSpinner, amount]);

  const sendPeaqToAptosTransaction = async () => {
    try {
      await peaqSolidityContract?.methods
        .transfer_from(originalPetraAddress)
        .send({
          from: originalMaskAddress,
          value: String(BigInt(+amount * 1e18)),
        });
    } catch (error) {
      console.log("error", error);
    } finally {
      setShowSpinner(false);
    }
  };

  const onClickSend = async () => {
    isAptosToPeaq && (await sendAptosToPeaqTransaction());
    !isAptosToPeaq && (await sendPeaqToAptosTransaction());
  };

  const getConnectLabel = useCallback(
    (labelFor: "metamask" | "petra") => {
      return connectedPetraAddress && labelFor === "petra"
        ? connectedPetraAddress
        : connectedMetaMaskAddress && labelFor === "metamask"
        ? connectedMetaMaskAddress
        : (labelFor === "metamask" && isMetaMaskInstalled) ||
          (labelFor === "petra" && isPetraInstalled)
        ? "Connect"
        : "Installed wallet";
    },
    [
      connectedMetaMaskAddress,
      connectedPetraAddress,
      isMetaMaskInstalled,
      isPetraInstalled,
    ]
  );

  const onClickExchangeArrows = useCallback(() => {
    setIsAptosToPeaq(!isAptosToPeaq);
  }, [isAptosToPeaq]);

  const setupPeaqContract = useCallback(async (_isPetraInstalled: boolean) => {
    if (!_isPetraInstalled) return;
    let provider = (window as any).ethereum;
    if (!!provider) {
      try {
        await provider.request({
          method: "eth_requestAccounts",
        });
      } catch (error: any) {
        if (error.code === 401) {
          // User rejected request
        }
      }
    }
    const web3 = new Web3(provider);
    setWeb3js(web3);

    const delanceContract = new web3.eth.Contract(
      contractAbi as any,
      contractAddress
    );

    setPeaqSolidityContract(delanceContract);
  }, []);

  useEffect(() => {
    const _isPetraInstalled = checkIfPetraInstalled();
    setIsMetaMaskInstalled(checkIfMetaMaskInstalled());
    setIsPetraInstalled(_isPetraInstalled);
    setupPeaqContract(_isPetraInstalled);
  }, [setupPeaqContract]);

  return (
    <div className="bridge__form">
      <div className="form__connect-btn-container">
        <WalletConnect
          onClickConnect={
            isAptosToPeaq ? onClickPetraConnect : onClickMetaMaskConnect
          }
          heading={
            isAptosToPeaq
              ? "Origin wallet (PETRA)"
              : "Destination wallet (METAMASK)"
          }
          label={
            isAptosToPeaq
              ? getConnectLabel("petra")
              : getConnectLabel("metamask")
          }
        />
        <ConnectWalletArrows onClick={onClickExchangeArrows} />
        <WalletConnect
          onClickConnect={
            isAptosToPeaq ? onClickMetaMaskConnect : onClickPetraConnect
          }
          heading={
            isAptosToPeaq
              ? "Destination wallet (METAMASK)"
              : "Origin wallet (PETRA)"
          }
          label={
            isAptosToPeaq
              ? getConnectLabel("metamask")
              : getConnectLabel("petra")
          }
        />
      </div>
      <AmountInput value={amount} onChange={onChangeTextarea} />
      <BridgeFormSendButton
        onClick={onClickSend}
        isButtonEnabled={
          isMetaMaskInstalled &&
          isPetraInstalled &&
          isAmountValid &&
          !!connectedMetaMaskAddress &&
          !!connectedPetraAddress
        }
      />
    </div>
  );
};
