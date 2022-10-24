import path from "path";
import {
  AppDataSource,
  chainDataPeaq,
  listenerRefresh,
  redisClient,
} from "./config";
import { ChainData } from "./entity/ChainData";
import { createBullQueue } from "./utils/setupBullQueue";

AppDataSource.initialize()
  .then(async () => {
    const chainDataRepo = AppDataSource.getRepository(ChainData);
    const chainData = await chainDataRepo.findOne({
      where: {
        chainName: chainDataPeaq.chain,
      },
    });

    if (!chainData) {
      const newChainData = new ChainData();
      newChainData.chainID = chainDataPeaq.chainID;
      newChainData.chainName = chainDataPeaq.chain;
      newChainData.lastProccessedBlock = Number(
        chainDataPeaq.lastProccessedBlock
      );
      await chainDataRepo.save(newChainData);
    }
    await redisClient.connect();
    require("./server");
    await createBullQueue(
      "transferListenerQueue",
      "transferListenerJob",
      "transferListenerJobId",
      listenerRefresh,
      path.join(
        __dirname,
        process.env.NODE_ENV === "production"
          ? "./jobs/processLogs.js"
          : "./jobs/processLogs.ts"
      )
    );

    await createBullQueue(
      "pendingTransactionsQueue",
      "pendingTransactionsJob",
      "pendingTransactionsJobId",
      listenerRefresh,
      path.join(
        __dirname,
        process.env.NODE_ENV === "production"
          ? "./jobs/processPendingTransactions.js"
          : "./jobs/processPendingTransactions.ts"
      )
    );
  })
  .catch((error) => console.error(error));
