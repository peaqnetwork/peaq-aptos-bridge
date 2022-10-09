import path from "path";
import { AppDataSource, listenerRefresh } from "./config";
import { createBullQueue } from "./utils/setupBullQueue";

AppDataSource.initialize()
  .then(async () => {
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

    await createBullQueue(
      "burnListenerQueue",
      "burnListenerJob",
      "burnListenerJobId",
      listenerRefresh,
      path.join(
        __dirname,
        process.env.NODE_ENV === "production"
          ? "./jobs/burnListener.js"
          : "./jobs/burnListener.ts"
      )
    );
  })
  .catch((error) => console.log(error));
