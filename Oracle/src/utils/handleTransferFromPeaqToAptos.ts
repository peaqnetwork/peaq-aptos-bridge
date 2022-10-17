import {
  AptosAccount,
  AptosAccountObject,
  AptosClient,
  BCS,
  TxnBuilderTypes,
} from "aptos";
import Web3 from "web3";
import { Log } from "web3-core";
import { TransactionPeaq } from "../entity/TransactionsPeaq";
import { toBN } from "web3-utils";
import { ChainData } from "../entity/ChainData";
import {
  AppDataSource,
  aptosClient,
  aptosContractAddress,
  aptosDefaultGas,
  aptosMaxGas,
  aptosPrivateKey,
  aptosPublicKey,
  peaqRpcUrl,
} from "../config";

export default async function (params: Log) {
  console.log("log", params);

  const transactionPeaqRepo = AppDataSource.getRepository(TransactionPeaq);
  const chainDataRepo = AppDataSource.getRepository(ChainData);
  const checkTransactionAlreadyHappened = await transactionPeaqRepo.findOne({
    where: {
      txHash: params.transactionHash,
    },
  });

  if (checkTransactionAlreadyHappened) {
    return;
  }
  const { sequence_number: sequenceNumber } = await aptosClient.getAccount(
    aptosContractAddress
  );
  const web3 = new Web3(peaqRpcUrl);
  const decodedData = web3.eth.abi.decodeLog(
    [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "recipent",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint128",
        name: "nonce",
        type: "uint128",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "chainId",
        type: "uint8",
      },
    ],
    params.data,
    params.topics
  );

  const chainID = await aptosClient.getChainId();

  const {
    AccountAddress,
    EntryFunction,
    TransactionPayloadEntryFunction,
    RawTransaction,
    ChainId,
  } = TxnBuilderTypes;
  const aptosAmount = toBN(String(decodedData.amount))
    .div(toBN("100000000000000000"))
    .mul(toBN("100000"));
  const payload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      `${aptosContractAddress}::wrapped_apt_new_latest`,
      "mint_to",
      [],
      [
        BCS.bcsToBytes(AccountAddress.fromHex(decodedData.recipent)),
        BCS.bcsSerializeUint64(aptosAmount.toNumber()),
      ]
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
  //@ts-ignore
  const { vm_status } = await aptosClient.waitForTransactionWithResult(
    transactionRes.hash
  );
  if (vm_status === "Executed successfully") {
    const transactionPeaq = new TransactionPeaq();
    transactionPeaq.amount = decodedData.amount;
    transactionPeaq.processedAt = Math.floor(Date.now() / 1000);
    transactionPeaq.blockTime = decodedData.timestamp;
    transactionPeaq.nonce = decodedData.nonce;
    transactionPeaq.txHash = params.transactionHash;
    await transactionPeaqRepo.save(transactionPeaq);
    // update last block read
    const chainData = await chainDataRepo.findOne({
      where: {
        chainName: "Agung",
      },
    });
    chainData.lastProccessedBlock = params.blockNumber;
    return await chainDataRepo.save(chainData);
  }
  return;
}
