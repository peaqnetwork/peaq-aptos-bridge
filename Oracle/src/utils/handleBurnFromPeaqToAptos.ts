import { HexString } from "aptos";
import {
  aptosClient,
  aptosContractAddress,
  aptosDefaultGas,
  aptosMaxGas,
  aptosPublicKey,
  aptosUrlDev,
} from "../config";
import axios from "axios";

export default async function (amount: number) {
  const { sequence_number: sequenceNumber } = await aptosClient.getAccount(
    aptosContractAddress
  );

  
}
