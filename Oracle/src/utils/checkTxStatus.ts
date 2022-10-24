import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AppDataSource, aptosUrlDev, checkTxStatusTimeoutMs } from "../config";
import { PendingTransactions } from "../entity/PendingTransactions";

/**
 * @description utility function for checking the validity of the transaction hash provided
 * @param txhash hash of the transaction which we want to check the validity of
 * @returns transaction data if transaction was succesfull
 */
export const checkTxStatus = async (txhash: string, fromRoute = false) => {
  try {
    if (fromRoute) {
      return await addToPending(txhash);
    }
    const options: AxiosRequestConfig = {
      method: "GET",
      url: `${aptosUrlDev}/transactions/by_hash/${txhash}`,
      headers: { "Content-Type": "application/json" },
      timeout: checkTxStatusTimeoutMs,
      timeoutErrorMessage: "Timeout of selected time",
    };
    const response = await axios.request(options);
    if (response.data.success) {
      return response.data;
    }
    return undefined;
  } catch (error) {
    console.log("error in check tx", error.message as AxiosError);
    if (error.message === "Timeout of selected time") {
      await addToPending(txhash, "Timed out so no arguments");
    }
    throw new Error("Error in checkTx");
  }
};

const addToPending = async (txHash: string, message = "") => {
  const pendingTransactionsRepo =
    AppDataSource.getRepository(PendingTransactions);
  const checkAlreadyPending = await pendingTransactionsRepo.findOne({
    where: {
      to: "peaq",
      from: "aptos",
      method: "transfer_to",
      txHash,
    },
  });

  if (checkAlreadyPending) {
    throw new Error("Transaction already in pending");
  }

  const newPendingTransaction = new PendingTransactions();
  newPendingTransaction.txHash = txHash;
  newPendingTransaction.argumments = [message];
  newPendingTransaction.to = "peaq";
  newPendingTransaction.from = "aptos";
  newPendingTransaction.method = "transfer_to";
  return await pendingTransactionsRepo.save(newPendingTransaction);
};
