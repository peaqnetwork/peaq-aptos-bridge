import { SandboxedJob } from "bullmq";
import { aptosContractAddress, peaqRpcUrl } from "../config";
import handleBurnFromPeaqToAptos from "../utils/handleBurnFromPeaqToAptos";
const bridge_abi = require("../abi/bridge_abi.json");
const Contract = require("web3-eth-contract");

module.exports = async (job: SandboxedJob) => {
  
 Contract.setProvider(peaqRpcUrl);

  const contract = new Contract(bridge_abi, aptosContractAddress);
  const options = {
    filter: {
      value: [],
    },
    fromBlock: 0,
  };

  contract.events
    .eventBurned(options)
    .on("data", async (event) => {
      await handleBurnFromPeaqToAptos(event);
    })
    .on("error", (err) => console.error);
};
