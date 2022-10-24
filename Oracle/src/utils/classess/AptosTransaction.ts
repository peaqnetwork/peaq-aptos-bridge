import {
  AptosAccount,
  AptosAccountObject,
  AptosClient,
  TxnBuilderTypes,
} from "aptos";
import {
  aptosDefaultGas,
  aptosMaxGas,
  aptosPrivateKey,
  aptosPublicKey,
} from "../../config";
import {
  IAptosTransaction,
  IAptosTransactionConstructorParams,
} from "../../types/index";

/**
 *
 * @description Utility class for generating and submiting tranasctions to aptos block chain
 */

export class AptosTransaction implements IAptosTransaction {
  public aptosContractAddress: string;
  public aptosClient: AptosClient;
  public aptosAccount: AptosAccount;


  constructor(params: IAptosTransactionConstructorParams) {
    this.aptosContractAddress = params.aptosContractAddress;
    this.aptosClient = params.aptosClient;
    const accountObject: AptosAccountObject = {
      privateKeyHex: aptosPrivateKey,
      publicKeyHex: aptosPublicKey,
      address: params.aptosContractAddress,
    };
    this.aptosAccount = AptosAccount.fromAptosAccountObject(accountObject);
  }

  /**
   *
   * @returns current sequence number for the aptos contract address, it is needed to make transactions on aptos block chain
   */
  async getSequenceNumber(): Promise<string> {
    const { sequence_number: sequenceNumber } =
      await this.aptosClient.getAccount(this.aptosContractAddress);
    return sequenceNumber;
  }

  /**
   *
   * @returns chain id of aptos block chain
   */
  async getChainID(): Promise<number> {
    return await this.aptosClient.getChainId();
  }

  /**
   *
   * @param method name of the method which we want to call of aptos module
   * @param aptosModule name of the module to interact
   * @param args BCS serialized array of arguments for aptos module method
   * @returns payload which can be provied to generateRawTransaction method to generate raw transaction
   */
  getPayload(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ): TxnBuilderTypes.TransactionPayloadEntryFunction {
    const { TransactionPayloadEntryFunction, EntryFunction } = TxnBuilderTypes;
    return new TransactionPayloadEntryFunction(
      EntryFunction.natural(
        `${this.aptosContractAddress}::${aptosModule}`,
        method,
        [],
        args
      )
    );
  }

  /**
   *
   * @param method name of the method which we want to call of aptos module
   * @param aptosModule name of the module to interact
   * @param args BCS serialized array of arguments for aptos module method
   * @returns raw transaction which can be used BCS transaction ready to be submitted to block chain
   */
  async generateRawTransaction(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ): Promise<TxnBuilderTypes.RawTransaction> {
    const { AccountAddress, ChainId, RawTransaction } = TxnBuilderTypes;
    return new RawTransaction(
      AccountAddress.fromHex(this.aptosContractAddress),
      BigInt(await this.getSequenceNumber()),
      this.getPayload(method, aptosModule, args),
      BigInt(aptosMaxGas),
      BigInt(aptosDefaultGas),
      BigInt(Math.floor(Date.now() / 1000) + 30000),
      new ChainId(await this.getChainID())
    );
  }

  /**
   * 
   * @param method name of the method which we want to call of aptos module
   * @param aptosModule name of the module to interact
   * @param args BCS serialized array of arguments for aptos module method
   * @returns success indicator and timestamp indicating if the transaction was succesfull and time
   */
  async submitRawTransactionAndWaitForResult(
    method: string,
    aptosModule: string,
    args: Array<Uint8Array>
  ) {
    const bcsTxn = AptosClient.generateBCSTransaction(
      this.aptosAccount,
      await this.generateRawTransaction(method, aptosModule, args)
    );
    const transactionRes = await this.aptosClient.submitSignedBCSTransaction(
      bcsTxn
    );

    //@ts-ignore
    const { success, timestamp } =
      await this.aptosClient.waitForTransactionWithResult(transactionRes.hash, {
        checkSuccess: true,
      });

    return { success, timestamp };
  }
}
