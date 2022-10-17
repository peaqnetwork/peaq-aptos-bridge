import { checkTxStatus } from "./checkTxStatus";
const Contract = require("web3-eth-contract");
import { peaqContractAddress, peaqRpcUrl } from "../config";
import { abi } from "./abi";
import Web3 from "web3";
import handleburnFromAptos from "./handleburnFromAptos";

export default async function (txHash: string) {
  const res = await checkTxStatus(txHash);
  if (!res) {
    return;
  }
  const { payload } = res as any;
  const web3 = new Web3(peaqRpcUrl);

  web3.eth.setProvider(peaqRpcUrl);

  const [peaqUserAddress, amount] = payload.arguments;

  const account = web3.eth.accounts.privateKeyToAccount(
    "ea9d9369cd43422d82b649c68b0886725375d695a218bc5269074f6d99b0bf50"
  );

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;
  const contract = new web3.eth.Contract(abi as any, peaqContractAddress);
  web3.eth.handleRevert = true;
  const amountForPeaq = (amount / 1e6) * 1e18;

  const estimatedGas = await contract.methods
    .transfer_to(
      web3.utils.toChecksumAddress(peaqUserAddress),
      BigInt(String(amountForPeaq))
    )
    .estimateGas();
  try {
    await contract.methods
      .transfer_to(
        web3.utils.toChecksumAddress(peaqUserAddress),
        BigInt(String(amountForPeaq))
      )
      .send({
        from: account.address,
        gas: estimatedGas,
      });
    await handleburnFromAptos(amount);
  } catch (error) {
    console.log("error", error);
  }
}
