import Web3 from "web3";
import { SandboxedJob } from "bullmq";
import {
  AppDataSource,
  peaqContractAddress,
  peaqRpcUrl,
} from "../config";
import handleTransferFromPeaqToAptos from "../utils/handleTransferFromPeaqToAptos";
import { ChainData } from "../entity/ChainData";
import { Log } from "web3-core";

module.exports = async (job: SandboxedJob) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // const contract = new Contract(bridge_abi, aptosContractAddress);
  const chainDataRepo = AppDataSource.getRepository(ChainData);
  const chainData = await chainDataRepo.find();

  const options = {
    fromBlock: chainData[0].lastProccessedBlock,
    address: peaqContractAddress,
  };

  const web3 = new Web3(peaqRpcUrl);
  const logs: Log[] = await web3.eth.getPastLogs(options);

  for (const log of logs) {
    await handleTransferFromPeaqToAptos(log);
  }
};
