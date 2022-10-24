import { config } from "dotenv";

config();

const PORT: number = Number(process.env.PORT);

const ORACLE_API_END_POINT = process.env.ORACLE_END_POINT;

const ORACLE_API_KEY = process.env.ORACLE_API_KEY;

export { PORT, ORACLE_API_END_POINT, ORACLE_API_KEY };
