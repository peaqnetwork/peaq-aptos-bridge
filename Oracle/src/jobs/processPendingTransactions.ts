import { SandboxedJob } from "bullmq";

import { AppDataSource } from "../config";
import { PendingTransactions } from "../entity/PendingTransactions";
import handleburnFromAptos from "../utils/handleburnFromAptos";
import handleTransferFromAptosToPeaq from "../utils/handleTransferFromAptosToPeaq";

module.exports = async (job: SandboxedJob) => {

  // we need to reinitialize data source because its a sandboxed process
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const pendingTransactionsRepo =
    AppDataSource.getRepository(PendingTransactions);
  const currentPendingTransactions = await pendingTransactionsRepo.find();

  for (const pendingTransaction of currentPendingTransactions) {
    try {
      //  only the burn section of the transaction failed process only the burned transaction
      if (
        pendingTransaction.from === "aptos" &&
        pendingTransaction.method === "burn_from"
      ) {
        await handleburnFromAptos(
          Number(pendingTransaction.argumments[0]),
          pendingTransaction.txHash
        );
      } else {
        // otherwise process the whole transaction
        await handleTransferFromAptosToPeaq(pendingTransaction.txHash);
      }
    } catch (error) {
      console.log("error inside pending transactions loop", error);
      continue;
    }
  }
  return Promise.resolve("Pending Transactions completed");
};
