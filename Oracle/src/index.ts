import path from "path";
import { AppDataSource, listenerRefresh } from "./config";
import { ChainData } from "./entity/ChainData";
import { createBullQueue } from "./utils/setupBullQueue";

AppDataSource.initialize()
  .then(async () => {
    const chainDataRepo = AppDataSource.getRepository(ChainData);
    const chainData = await chainDataRepo.find();
    if (chainData.length == 0) {
      const newChainData = new ChainData();
      newChainData.chainID = 1;
      newChainData.chainName = "Agung";
      newChainData.lastProccessedBlock = 2763074;
      await chainDataRepo.save(newChainData);
    }
    require("./server");
    await createBullQueue(
      "transferListenerQueue",
      "transferListenerJob",
      "transferListenerJobId",
      listenerRefresh,
      path.join(
        __dirname,
        process.env.NODE_ENV === "production"
          ? "./jobs/transferListener.js"
          : "./jobs/transferListener.ts"
      )
    );

    // await createBullQueue(
    //   "burnListenerQueue",
    //   "burnListenerJob",
    //   "burnListenerJobId",
    //   listenerRefresh,
    //   path.join(
    //     __dirname,
    //     process.env.NODE_ENV === "production"
    //       ? "./jobs/burnListener.js"
    //       : "./jobs/burnListener.ts"
    //   )
    // );
  })
  .catch((error) => console.log(error));
