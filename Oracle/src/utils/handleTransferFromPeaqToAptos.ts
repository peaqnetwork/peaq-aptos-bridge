import { BCS, TxnBuilderTypes } from "aptos";
import Web3 from "web3";
import { Log } from "web3-core";
import { TransactionPeaq } from "../entity/TransactionsPeaq";
import { ChainData } from "../entity/ChainData";
import {
  AppDataSource,
  aptosBridgeModule,
  aptosCoinDecimals,
  aptosTransaction,
} from "../config";
import { peaqTransferFromInputs } from "../types/inputs";
import BigNumber from "bignumber.js";

export default async function (params: Log, web3: Web3) {
  try {
    const transactionPeaqRepo = AppDataSource.getRepository(TransactionPeaq);

    const checkTransactionAlreadyHappened = await transactionPeaqRepo.findOne({
      where: {
        txHash: params.transactionHash,
        chain: "peaq",
      },
    });

    if (checkTransactionAlreadyHappened) {
      return Promise.resolve("Transaction already processed");
    }

    const decodedData = web3.eth.abi.decodeLog(
      peaqTransferFromInputs,
      params.data,
      params.topics
    );
    // convert amount value from peaq decimals to aptos wrapped coin decimals
    const aptosAmount = BigNumber(String(decodedData.amount))
      .dividedBy(BigNumber(1e18))
      .multipliedBy(BigNumber(aptosCoinDecimals))
      .toFixed();

    console.log("aptos amount", aptosAmount);
    console.log("amount", Number(String(aptosAmount)));

    const { AccountAddress } = TxnBuilderTypes;
    const { success, timestamp } =
      await aptosTransaction.submitRawTransactionAndWaitForResult(
        "transfer_to",
        aptosBridgeModule,
        [
          BCS.bcsToBytes(AccountAddress.fromHex(decodedData.recipent)),
          BCS.bcsSerializeUint64(Number(String(aptosAmount))),
        ]
      );
    if (success) {
      const transactionPeaq = new TransactionPeaq();
      transactionPeaq.amount = decodedData.amount;
      transactionPeaq.processedAt = String(Math.floor(timestamp / 1000));
      transactionPeaq.blockTime = decodedData.timestamp;
      transactionPeaq.nonce = decodedData.nonce;
      transactionPeaq.txHash = params.transactionHash;
      transactionPeaq.chain = "peaq";
      await transactionPeaqRepo.save(transactionPeaq);
      return Promise.resolve("Log Processed sucessfully");
    }
    return Promise.reject("Transaction failed to process");
  } catch (error) {
    console.error("error", error);
    return Promise.reject("Transaction failed to process");
  }
}
