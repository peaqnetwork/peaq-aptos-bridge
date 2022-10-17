import "reflect-metadata";
import { DataSource } from "typeorm";
import { ChainData } from "./entity/ChainData";
import { config } from "dotenv";
import { IChainData } from "./types";
import { createClient } from "redis";
import { AptosClient } from "aptos";
import { TransactionPeaq } from './entity/TransactionsPeaq';

config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "apple",
  password: "game1992",
  database: "oracle",
  synchronize: true,
  logging: false,
  entities: [ChainData,TransactionPeaq],
  migrations: [],
  subscribers: [],
});

const port = process.env.PORT;

const chainData: IChainData[] = JSON.parse(
  JSON.stringify(process.env.CHAIN_DATA)
);

const redisUrl: string = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl || "",
});

const aptosClient = new AptosClient(process.env.APTOS_DEV_NET_URL);
const aptosUrlDev = process.env.APTOS_DEV_NET_URL;
const peaqRpcUrl = process.env.PEAQ_RPC_URL;

const aptosContractAddress = process.env.APTOS_CONTRACT_ADDRESS;
const peaqContractAddress = process.env.PEAQ_CONTRACT_ADDRESS;
const aptosPublicKey = process.env.APTOS_PUBLIC_KEY;
const aptosPrivateKey = process.env.APTOS_PRIVATE_KEY;

const aptosMaxGas = process.env.MAX_GAS_APTOS;
const aptosDefaultGas = process.env.DEFAULT_GAS_APTOS;

const listenerRefresh = process.env.Listener_Refersh_Interval

export {
  port,
  chainData,
  AppDataSource,
  redisClient,
  aptosClient,
  aptosContractAddress,
  peaqContractAddress,
  aptosMaxGas,
  aptosDefaultGas,
  aptosPublicKey,
  aptosUrlDev,
  peaqRpcUrl,
  redisUrl,
  listenerRefresh,
  aptosPrivateKey
};
