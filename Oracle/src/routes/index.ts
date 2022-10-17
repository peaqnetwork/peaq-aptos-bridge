import {
  BCS,
  TxnBuilderTypes,
  AptosClient,
  AptosAccount,
  AptosAccountObject,
} from "aptos";
import express from "express";
import Web3 from "web3";
import {
  aptosClient,
  aptosDefaultGas,
  aptosMaxGas,
  aptosPrivateKey,
  aptosPublicKey,
  peaqRpcUrl,
} from "../config";

import handleburnFromAptosToPeaq from "../utils/handleburnFromAptos";
import handleTransferFromAptosToPeaq from "../utils/handleTransferFromAptosToPeaq";
const router = express.Router();

router.post("/process-transfer", async (req, res) => {
  const { txHash } = req.body;
  if (!txHash) {
    return res.json({ status: 400, message: "invalid or missing txHash" });
  }
  await handleTransferFromAptosToPeaq(txHash);
});

router.post("/process-burn", async (req, res) => {
  const { txHash } = req.body;
  if (!txHash) {
    return res.json({ status: 400, message: "invalid or missing txHash" });
  }
  await handleburnFromAptosToPeaq(txHash);
});

router.get("/test", async (req, res) => {
  const { sequence_number: sequenceNumber } = await aptosClient.getAccount(
    "452ba70027d6d98a4658420c121e54d3f76d0f2c0c74fb084b9de73e00bf86a9"
  );
  const chainID = await aptosClient.getChainId();

  const {
    AccountAddress,
    TypeTagStruct,
    EntryFunction,
    StructTag,
    TransactionPayloadEntryFunction,
    RawTransaction,
    ChainId,
  } = TxnBuilderTypes;



  const payload = new TransactionPayloadEntryFunction(
    EntryFunction.natural(
      "452ba70027d6d98a4658420c121e54d3f76d0f2c0c74fb084b9de73e00bf86a9::wrapped_apt_new_latest",
      "burn_from",
      [],
      [
        BCS.bcsSerializeUint64(200000),
      ]
    )
  );

  const rawTxn = new RawTransaction(
    AccountAddress.fromHex(
      "0x452ba70027d6d98a4658420c121e54d3f76d0f2c0c74fb084b9de73e00bf86a9"
    ),
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
    address: "452ba70027d6d98a4658420c121e54d3f76d0f2c0c74fb084b9de73e00bf86a9",
  };
  const account = AptosAccount.fromAptosAccountObject(accountObject);

  const bcsTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  const transactionRes = await aptosClient.submitSignedBCSTransaction(bcsTxn);
  //@ts-ignore
  const {vm_status} = await aptosClient.waitForTransactionWithResult(transactionRes.hash);
  console.log("receipt", vm_status);
  
  
});

router.get("/new", async (req, res) => {
  try {
    console.log("this is getting called");
    const web3 = new Web3(peaqRpcUrl);
    const receipt = await web3.eth.getTransactionReceipt(
      "0x880612996bb8ddad5a00b5b05451d3ac5d32fc46de41745de6ada83a53d55882"
    );
    console.log("receipt", receipt.logs[0].topics);

    const test = web3.eth.abi.decodeLog(
       [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "recipent",
          "type": "bytes32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint128",
          "name": "nonce",
          "type": "uint128"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "chainId",
          "type": "uint8"
        }
      ],
      receipt.logs[0].data,
      receipt.logs[0].topics
    );
    console.log("response", test);
  } catch (error) {
    console.log("Error", error);
  }
});

export = router;
