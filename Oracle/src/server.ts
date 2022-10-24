import "reflect-metadata";
import express from "express";
import { port, proxyAuthKey } from "./config";
import routes from "./routes/index";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.headers.authorization !== proxyAuthKey) {
    return res.status(403).end();
  }
  return next();
});

app.use("/api", routes);

app.listen(port || 3000, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`);
});
