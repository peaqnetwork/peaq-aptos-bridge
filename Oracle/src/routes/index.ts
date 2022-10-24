import express, { Request, Response } from "express";

import { AppDataSource } from "../config";
import { PendingTransactions } from "../entity/PendingTransactions";

import { TransactionPeaq } from "../entity/TransactionsPeaq";
import txHashLock from "../middleware/txHashLock";

import { checkTxStatus } from "../utils/checkTxStatus";

const router = express.Router();

router.post(
  "/process-transfer",
  txHashLock,
  async (req: Request, res: Response) => {
    try {
      const { txHash } = req.body;

      if (!txHash) {
        return res.json({ status: 400, message: "invalid or missing txHash" });
      }

      // check if transaction is already processed
      const transactionRepo = AppDataSource.getRepository(TransactionPeaq);
      const pendingTransactionsRepo =
        AppDataSource.getRepository(PendingTransactions);
      const checkTxProcessed = await transactionRepo.findOne({
        where: {
          txHash,
          chain: "aptos",
        },
      });

      if (checkTxProcessed) {
        return res
          .status(200)
          .json({ success: true, message: "Transaction already processed" });
      }

      // check if the transaction is in already pending transactions
      const checkAlreadyInPending = await pendingTransactionsRepo.findOneBy({
        txHash,
        to: "peaq",
        from: "aptos",
      });

      // if the transaction is already in pending dont proceed furthur because processPendingTransaction job will process the pending transaction
      if (checkAlreadyInPending) {
        return res.status(400).json({
          success: false,
          message: "Transaction is already in process please wait",
        });
      }

      const res_ = await checkTxStatus(txHash, true);
      if (res_) {
        return res
          .status(200)
          .json({ success: true, message: "Transaction successfull" });
      }
      return res.status(400).json({
        success: false,
        message: "Something went wrong please try again later",
      });
    } catch (error) {
      console.error("error in process transfer", error);
      return res.status(500).json({
        success: false,
        message: "Something went wrong please try again later",
      });
    }
  }
);

router.get("/ping", (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Pong",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

export = router;
