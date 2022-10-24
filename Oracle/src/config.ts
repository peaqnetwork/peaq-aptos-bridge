import "reflect-metadata";
import { DataSource } from "typeorm";
import { ChainData } from "./entity/ChainData";
import { config } from "dotenv";
import { IChainData } from "./types";
import { createClient } from "redis";
import { AptosClient } from "aptos";
import { TransactionPeaq } from "./entity/TransactionsPeaq";
import { PendingTransactions } from "./entity/PendingTransactions";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { AptosTransaction } from "./utils/classess/AptosTransaction";

config();

const dbConfig = JSON.parse(process.env.DB_CONFIG!);

const AppDataSource = new DataSource({
  type: "postgres",
  host: dbConfig.host || "localhost",
  port: dbConfig.port || 5432,
  username: dbConfig.dbUser,
  password: dbConfig.dbPass,
  database: dbConfig.dbName,
  synchronize: true,
  logging: false,
  entities: [ChainData, TransactionPeaq, PendingTransactions],
  migrations: [],
  subscribers: [],
});

const port = process.env.PORT;

const chainDataPeaq: IChainData = JSON.parse(process.env.CHAIN_DATA_PEAQ!);

const redisUrl: string = process.env.REDIS_URL;
const redisClient = createClient({
  url: redisUrl || "",
  legacyMode: true,
});
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "txHashLock",
  points: 1,
  duration: Number(process.env.TX_HASH_LOCK_DURATION),
});

const aptosClient = new AptosClient(process.env.APTOS_DEV_NET_URL);
const aptosUrlDev = process.env.APTOS_DEV_NET_URL;
const aptosCoinModule = process.env.APTOS_WRAPPED_COIN_MODULE;
const aptosContractAddress = process.env.APTOS_CONTRACT_ADDRESS;
const aptosCoinDecimals = Number(process.env.APTOS_WRAPPED_COIN_DECIMALS);
const aptosBridgeModule = process.env.APTOS_BRIDGE_MODULE;
const aptosPublicKey = process.env.APTOS_PUBLIC_KEY;
const aptosPrivateKey = process.env.APTOS_PRIVATE_KEY;
const aptosMaxGas = process.env.MAX_GAS_APTOS;
const aptosDefaultGas = process.env.DEFAULT_GAS_APTOS;
const aptosTransaction = new AptosTransaction({
  aptosClient,
  aptosContractAddress,
});

const peaqRpcUrl = process.env.PEAQ_RPC_URL;
const peaqWalletPrivateKey = process.env.PEAQ_WALLET_PRIVATE_KEY;
const peaqContractAddress = process.env.PEAQ_CONTRACT_ADDRESS;

const listenerRefresh = String(process.env.Listener_Refresh_Interval);

const promiseTimeoutMs = Number(process.env.PROMISE_TIMEOUT_MS);
const blocksToProcessInOneGo = Number(process.env.BLOCKS_TO_PROCESS_IN_ONE_GO);

const proxyAuthKey = process.env.PROXY_AUTH_KEY;

const checkTxStatusTimeoutMs = Number(process.env.CHECK_TX_STATUS_TIMEOUT_MS);

export {
  port,
  chainDataPeaq,
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
  aptosPrivateKey,
  peaqWalletPrivateKey,
  rateLimiter,
  aptosTransaction,
  aptosCoinModule,
  aptosBridgeModule,
  aptosCoinDecimals,
  promiseTimeoutMs,
  blocksToProcessInOneGo,
  proxyAuthKey,
  checkTxStatusTimeoutMs,
};
