import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { port } from "./config";
import routes from "./routes/index";
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", routes);

app.listen(port || 3000, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
