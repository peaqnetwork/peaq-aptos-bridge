import express from "express";
import handleburnFromAptosToPeaq from "../utils/handleburnFromAptosToPeaq";
import handleTransferFromAptosToPeaq from "../utils/handleTransferFromAptosToPeaq";
const router = express.Router();

router.post("/process-transfer", async (req, res) => {
  const { txHash } = req.body;
  if (!txHash) {
    return res.json({ status: 400, message: "invalid or missing txHash" });
  }
  await handleTransferFromAptosToPeaq(txHash);
});

router.post("/process-burn", async (req, res) => {
  const { txHash } = req.body;
  if (!txHash) {
    return res.json({ status: 400, message: "invalid or missing txHash" });
  }
  await handleburnFromAptosToPeaq(txHash);
});

export = router;
