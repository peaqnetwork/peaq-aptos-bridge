import express from "express";
import morgan from "morgan";
import { ORACLE_API_END_POINT, ORACLE_API_KEY, PORT } from "./config";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use(morgan("dev"));

app.use(
  "*",
  createProxyMiddleware({
    target: ORACLE_API_END_POINT,
    changeOrigin: true,
    headers: { authorization: ORACLE_API_KEY },
  })
);

app.listen(PORT, () => {
  console.log(`Proxy Listening at ${PORT}`);
});
