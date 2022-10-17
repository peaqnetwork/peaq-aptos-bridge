import {
  aptosClient,
  aptosContractAddress,
  aptosDefaultGas,
  aptosMaxGas,
  aptosPrivateKey,
  aptosPublicKey,
} from "../config";
import {
  AptosAccount,
  AptosAccountObject,
  AptosClient,
  BCS,
  TxnBuilderTypes,
} from "aptos";

export default async function (amount: number) {
  const { sequence_number: sequenceNumber } = await aptosClient.getAccount(
    aptosContractAddress
  );
  const chainID = await aptosClient.getChainId();

  const {
    AccountAddress,
    EntryFunction,
    TransactionPayloadEntryFunction,
    RawTransaction,
    ChainId,
  } = TxnBuilderTypes;

  const payload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      `${aptosContractAddress}::wrapped_apt_new_latest`,
      "burn_from",
      [],
      [BCS.bcsSerializeUint64(amount)]
    )
  );

  const rawTxn = new RawTransaction(
    AccountAddress.fromHex(aptosContractAddress),
    BigInt(sequenceNumber),
    payload,
    BigInt(aptosMaxGas),
    BigInt(aptosDefaultGas),
    BigInt(Math.floor(Date.now() / 1000) + 10),
    new ChainId(chainID)
  );
  const accountObject: AptosAccountObject = {
    privateKeyHex: aptosPrivateKey,
    publicKeyHex: aptosPublicKey,
    address: aptosContractAddress,
  };
  const account = AptosAccount.fromAptosAccountObject(accountObject);

  const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  const transactionRes = await aptosClient.submitSignedBCSTransaction(bcsTxn);
  console.log("transaction", transactionRes);

  //@ts-ignore
  const { vm_status } = await aptosClient.waitForTransactionWithResult(
    transactionRes.hash
  );
  console.log("vm_status", vm_status);

  if (vm_status === "Executed successfully") {
    console.log("success yo");
  }
}
