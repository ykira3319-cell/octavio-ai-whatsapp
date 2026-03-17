const makeWASocket = require("@whiskeysockets/baileys").default;
const { useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const handler = require("./handler");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("sessions/whatsapp");

  const sock = makeWASocket({
    auth: state
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { qr, connection } = update;

    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log("📱 Scan le QR code");
    }

    if (connection === "open") {
      console.log("✅ Bot connecté !");
    }
  });

  sock.ev.on("messages.upsert", async (m) => {
    await handler(sock, m);
  });
}

startBot();
