// bot.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, delay } = require("@adiwajshing/baileys");
const P = require("pino");
const fs = require("fs");
const path = require("path");
const handler = require("./handler");
require("dotenv").config();

const SESSION_FILE = path.join(__dirname, "../../sessions/whatsapp/session.json");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_FILE);

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`📱 WA Version: ${version.join(".")} | Latest: ${isLatest}`);

  const sock = makeWASocket({
    logger: P({ level: "silent" }),
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      console.log("❌ Disconnected, reason:", reason);
      // reconnect automatically
      startBot();
    } else if (connection === "open") {
      console.log("✅ Bot connecté !");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    try {
      // On ne répond qu'aux messages privés
      const msg = m.messages[0];
      if (!msg.message) return;
      const from = msg.key.remoteJid;
      if (!from.endsWith("@s.whatsapp.net")) return; // ignore groupes
      await handler(sock, m);
    } catch (err) {
      console.error("Erreur messages.upsert:", err);
    }
  });

  console.log("🤖 Octavio AI WhatsApp Bot prêt !");
}

startBot();
