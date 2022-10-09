import { checkTxStatus } from "./checkTxStatus";
const Contract = require("web3-eth-contract");
import { peaqContractAddress, peaqRpcUrl } from "../config";

export default async function (txHash: string) {
  const res = checkTxStatus(txHash);
  const { sender, payload } = res as any;
  Contract.setProvider(peaqRpcUrl);
  const abi = [];
  const contract = new Contract(abi, peaqContractAddress);
  contract.methods.transfer_to(payload.arguments[2]).send({ from: sender });
}
