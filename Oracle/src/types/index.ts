import { AbiItem } from "web3-utils";
import { Log } from "web3-core";
import { AptosAccount, AptosClient, TxnBuilderTypes } from "aptos";

export interface IChainData {
  chainID: number;
  chain: string;
  lastProccessedBlock: string;
}
export interface IHandleLog {
  rpc_url: string;
  log: Log;
  abi: AbiItem[];
  contract_address: string;
}

export interface IAptosTransactionConstructorParams {
  aptosContractAddress: string;
  aptosClient: AptosClient;
}

interface ISubmitTransactionReturn {
  success: boolean;
  timestamp: number;
}
export interface IAptosTransaction extends IAptosTransactionConstructorParams {
  aptosAccount: AptosAccount;

  getSequenceNumber(): Promise<string>;
  getChainID(): Promise<number>;

  getPayload(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ): TxnBuilderTypes.TransactionPayloadEntryFunction;

  generateRawTransaction(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ): Promise<TxnBuilderTypes.RawTransaction>;

  submitRawTransactionAndWaitForResult(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ): Promise<ISubmitTransactionReturn>;
}
