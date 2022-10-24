import Web3 from "web3";
import { SandboxedJob } from "bullmq";

import {
  AppDataSource,
  blocksToProcessInOneGo,
  chainDataPeaq,
  peaqContractAddress,
  peaqRpcUrl,
  promiseTimeoutMs,
} from "../config";

import handleTransferFromPeaqToAptos from "../utils/handleTransferFromPeaqToAptos";
import { ChainData } from "../entity/ChainData";
import { Log } from "web3-core";
import { TRANSFER_FROM_PEAQ_TOPIC } from "../constants";
import promiseTimeOut from "../utils/promiseTimeout";

module.exports = async (job: SandboxedJob) => {
  try {
    // we need to reinitialize data source because its a sandboxed process
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const chainDataRepo = AppDataSource.getRepository(ChainData);
    const chainData = await chainDataRepo.findOne({
      where: {
        chainName: chainDataPeaq.chain,
      },
    });
    const { lastProccessedBlock } = chainData;
    const web3 = new Web3(peaqRpcUrl);

    const numberOfBlocksToProcess: number = blocksToProcessInOneGo;
    const latestBlockNumber = await web3.eth.getBlockNumber();

    const latestBlock =
      latestBlockNumber + numberOfBlocksToProcess < latestBlockNumber
        ? lastProccessedBlock + numberOfBlocksToProcess
        : latestBlockNumber;

    const options = {
      fromBlock: lastProccessedBlock,
      toBlock: latestBlock,
      address: peaqContractAddress,
    };

    const logs: Log[] = await promiseTimeOut<Log[]>(
      promiseTimeoutMs,
      web3.eth.getPastLogs(options)
    );

    for (const log of logs) {
      // skip the iteration if the topic is not a transfer topic
      if (log.topics[0] !== TRANSFER_FROM_PEAQ_TOPIC) {
        continue;
      }
      await handleTransferFromPeaqToAptos(log, web3);
    }

    chainData.lastProccessedBlock = latestBlock;
    await chainDataRepo.save(chainData);

    return Promise.resolve("Processd the current logs");
  } catch (error) {
    console.log("Error in processing logs", error);
    throw new Error(JSON.stringify(error.message));
  }
};
