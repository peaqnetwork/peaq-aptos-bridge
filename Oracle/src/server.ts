import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { port } from "./config";
import routes from "./routes/index";

dotenv.config();

const app = express();

app.use("/api", routes);

app.listen(port || 3000, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
