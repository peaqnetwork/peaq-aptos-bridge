import Web3 from "web3";
import { SandboxedJob } from "bullmq";
import { aptosContractAddress, aptosUrlDev, peaqRpcUrl } from "../config";
import handleTransferFromPeaqToAptos from "../utils/handleTransferFromPeaqToAptos";
const bridge_abi = require("../abi/bridge_abi.json");
const Contract = require("web3-eth-contract");

module.exports = async (job: SandboxedJob) => {
  Contract.setProvider(aptosUrlDev);

  const contract = new Contract(bridge_abi, aptosContractAddress);
  const options = {
    filter: {
      value: [],
    },
    fromBlock: 0,
  };

  contract.events
    .eventDeposit(options)
    .on("data", async (event) => {
      await handleTransferFromPeaqToAptos(event);
    })
    .on("error", (err) => console.error);
};
