import "reflect-metadata";
import { DataSource } from "typeorm";
import { ChainData } from "./entity/ChainData";
import { config } from "dotenv";
import { IChainData } from "./types";
import { createClient } from "redis";

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
  entities: [ChainData],
  migrations: [],
  subscribers: [],
});

const chainData: IChainData[] = JSON.parse(
  JSON.stringify(process.env.CHAIN_DATA)
);

const redisUrl: string = process.env.REDIS_URL;

const redisClient = createClient({
  url: redisUrl || "",
});

export { chainData, AppDataSource, redisClient };
