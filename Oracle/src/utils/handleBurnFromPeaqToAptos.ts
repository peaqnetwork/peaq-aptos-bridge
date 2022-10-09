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

export default async function (params) {
  const { sequence_number: sequenceNumber } = await aptosClient.getAccount(
    aptosContractAddress
  );

  const transaction = JSON.stringify({
    sender: aptosContractAddress,
    sequence_number: sequenceNumber,
    max_gas_amount: `${aptosMaxGas}`,
    gas_unit_price: `${aptosDefaultGas}`,
    expiration_timestamp_secs: "32425224034",
    payload: {
      type: "entry_function_payload",
      function: `${aptosContractAddress}::bridge::burn_to`,
      type_arguments: [],
      arguments: [params.returnValues.aptosAddress, params.returnValues.amount],
    },
    signature: {
      type: "ed25519_signature",
      public_key: aptosPublicKey,
      signature: HexString.fromUint8Array(new Uint8Array(64)).hex(),
    },
  });
  const options = {
    method: "POST",
    url: `${aptosUrlDev}/transactions`,
    headers: { "Content-Type": "application/json" },
    data: transaction,
  };
  try {
    const response = await axios.request(options);
    console.log("response in burn from peaq to aptos", response.data);
  } catch (error) {
    console.log("error in sending transfer to for aptos");
  }
}
