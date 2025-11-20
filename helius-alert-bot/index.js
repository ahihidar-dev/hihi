import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3000;

if (!TELEGRAM_TOKEN || !CHAT_ID) {
  console.error("TELEGRAM_TOKEN and TELEGRAM_CHAT_ID must be set in environment");
  process.exit(1);
}

const app = express();
app.use(express.json());

// Route untuk menerima transaksi dari Helius
app.post("/webhook", async (req, res) => {
  const tx = req.body || {};

  const msg = [
    "🚨 Transaksi Baru Terdeteksi",
    `Wallet: ${tx.account || "-"}`,
    `Signature: ${tx.signature || "-"}`,
    `Type: ${tx.type || "-"}`,
    `Amount: ${tx.amount || "-"}`,
  ].join("\n");

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: msg
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("Failed to send telegram message:", err?.response?.data || err.message);
    res.sendStatus(500);
  }
});

app.listen(PORT, () => console.log(`BOT RUNNING on port ${PORT}`));
