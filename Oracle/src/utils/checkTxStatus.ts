import axios from "axios";
import { aptosUrlDev } from "../config";

export const checkTxStatus = async (txhash: string) => {
  const options = {
    method: "GET",
    url: `${aptosUrlDev}/transactions/by_hash/${txhash}`,
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.request(options);
  if (response.data.type === "pending_transaction") {
    checkTxStatus(txhash);
  } else {
    return response.data;
  }
};
