import { AbiItem } from "web3-utils";
import { Log } from "web3-core";
export interface IChainData {
  chainId: number;
  chain: string;
  rpcUrl: string;
  lastProccessBlock: string;
}
export interface IHandleLog {
  rpc_url: string;
  log: Log;
  abi: AbiItem[];
  contract_address: string;
}
