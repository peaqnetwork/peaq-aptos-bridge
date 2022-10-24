import { AppDataSource, aptosCoinModule, aptosTransaction } from "../config";
import { BCS } from "aptos";
import { PendingTransactions } from "../entity/PendingTransactions";
import { TransactionPeaq } from "../entity/TransactionsPeaq";

/**
 *
 * @param amount amount of coins which we want to burn (cannot be in decimals) e.g. 0.2 = 200000
 * @param txHash hash of the transaction which we already processing
 * @returns Promise resolve if the process was succesfull otherwise rejects
 */
export default async function (amount: number, txHash: string) {
  const pendingTransactionsRepo =
    AppDataSource.getRepository(PendingTransactions);
  try {
    const { success, timestamp } =
      await aptosTransaction.submitRawTransactionAndWaitForResult(
        "burn_from",
        aptosCoinModule,
        [BCS.bcsSerializeUint64(amount)]
      );
    if (success) {
      const transactionRepo = AppDataSource.getRepository(TransactionPeaq);
      const transaction = new TransactionPeaq();
      transaction.amount = amount.toString();
      transaction.blockTime = timestamp;
      transaction.chain = "aptos";
      transaction.txHash = txHash;
      transaction.processedAt = String(Math.floor(Date.now() / 1000));
      await transactionRepo.save(transaction);

      // check if any pending transaction
      const alreadyInPending = await pendingTransactionsRepo.findOneBy({
        txHash,
        to: "peaq",
        from: "aptos",
        method: "burn_from",
      });

      alreadyInPending &&
        (await pendingTransactionsRepo.remove(alreadyInPending));
      return Promise.resolve("Successfully burned");
    }
  } catch (error) {
    console.log("error", error.message);

    const alreadyInPending = await pendingTransactionsRepo.findOneBy({
      txHash,
      to: "peaq",
      from: "aptos",
      method: "burn_from",
    });

    if (alreadyInPending) {
      return Promise.reject("Transaction already in pending");
    }
    // we are only putting this part of the transaction inside pending transactions because only this part failed
    // transfer_to method was succesfull so we don'nt want process that again
    const pendingTransaction = new PendingTransactions();
    pendingTransaction.method = "burn_from";
    pendingTransaction.argumments = [String(amount)];
    pendingTransaction.to = "peaq";
    pendingTransaction.from = "aptos";
    pendingTransaction.txHash = txHash;
    await pendingTransactionsRepo.save(pendingTransaction);
    throw new Error("Could'nt process burn for aptos");
  }
}
