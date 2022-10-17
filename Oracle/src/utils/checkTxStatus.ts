import axios from "axios";
import { AppDataSource, aptosUrlDev } from "../config";
import { TransactionPeaq } from "../entity/TransactionsPeaq";

export const checkTxStatus = async (txhash: string) => {
  const transactionRepo = AppDataSource.getRepository(TransactionPeaq);
  const checkTxProcessed = await transactionRepo.findOne({
    where: {
      txHash: txhash,
      chain: "aptos",
    },
  });
  if (checkTxProcessed) {
    return;
  }
  try {
    const options = {
      method: "GET",
      url: `${aptosUrlDev}/transactions/by_hash/${txhash}`,
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.request(options);
    if (response.data.type === "pending_transaction") {
      checkTxStatus(txhash);
    } else {
      return response.data;
    }
  } catch (error) {
    checkTxStatus(txhash);
  }
};
