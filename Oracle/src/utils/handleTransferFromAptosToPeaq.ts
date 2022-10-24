import { checkTxStatus } from "./checkTxStatus";
import {
  AppDataSource,
  peaqContractAddress,
  peaqRpcUrl,
  peaqWalletPrivateKey,
} from "../config";
import { abi } from "../abi/abi";
import Web3 from "web3";
import handleburnFromAptos from "./handleburnFromAptos";
import BigNumber from "bignumber.js";
import { AbiItem } from "web3-utils";
import { PendingTransactions } from "../entity/PendingTransactions";

export default async function (txHash: string) {
  const res = await checkTxStatus(txHash);

  if (!res) {
    return;
  }
  const pendingTransactionsRepo =
    AppDataSource.getRepository(PendingTransactions);
  const { payload } = res as any;
  const web3 = new Web3(peaqRpcUrl);

  web3.eth.setProvider(peaqRpcUrl);

  const [peaqUserAddress, amount] = payload.arguments;

  const account = web3.eth.accounts.privateKeyToAccount(peaqWalletPrivateKey);

  web3.eth.accounts.wallet.add(account);
  web3.eth.defaultAccount = account.address;

  const contract = new web3.eth.Contract(abi as AbiItem[], peaqContractAddress);
  web3.eth.handleRevert = true;

  const amountForPeaq = BigNumber(String(amount))
    .dividedBy(BigNumber(1e6))
    .multipliedBy(BigNumber(1e18))
    .toFixed();

  const checkSumPeaqAddress = web3.utils.toChecksumAddress(peaqUserAddress);

  try {
    const estimatedGas = await contract.methods
      .transferTo(checkSumPeaqAddress, String(amountForPeaq))
      .estimateGas();

    await contract.methods
      .transferTo(checkSumPeaqAddress, String(amountForPeaq))
      .send({
        from: account.address,
        gas: estimatedGas + 100,
      });

    // remove transfer_to from pending transactions as it processed succesfully
    const alreadyInPending = await pendingTransactionsRepo.findOneBy({
      txHash,
      to: "peaq",
      from: "aptos",
      method: "transfer_to",
    });

    alreadyInPending &&
      (await pendingTransactionsRepo.remove(alreadyInPending));
  } catch (error) {
    console.log("error in handle transfer from aptos to peaq", error);
    // check if this transaction is already in pending transactions or not
    const alreadyInPending = await pendingTransactionsRepo.findOneBy({
      txHash,
      to: "peaq",
      from: "aptos",
      method: "transfer_to",
    });
    if (alreadyInPending) {
      throw new Error("Transaction failed on peaq chain");
    }
    // put the whole transaction in pending so both transfer_to and burn methods will be executed
    const pendingTransaction = new PendingTransactions();
    pendingTransaction.txHash = txHash;
    pendingTransaction.argumments = [peaqUserAddress, amountForPeaq];
    pendingTransaction.to = "peaq";
    pendingTransaction.from = "aptos";
    pendingTransaction.method = "transfer_to";

    await pendingTransactionsRepo.save(pendingTransaction);
    throw new Error("Transaction failed");
  }
  await handleburnFromAptos(amount, txHash);
}
