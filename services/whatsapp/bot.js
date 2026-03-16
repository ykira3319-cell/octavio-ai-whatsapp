// services/whatsapp/bot.js

import makeWASocket from "@whiskeysockets/baileys"
import { handleMessage } from "./handler.js"

// Fonction pour démarrer le bot
export async function startBot() {

  // Crée le socket WhatsApp
  const sock = makeWASocket({
    printQRInTerminal: true  // Affiche le QR dans le terminal la première fois
  })

  // Écoute les messages entrants
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0]

    if (!msg.message) return

    await handleMessage(sock, msg)
  })

  console.log("🤖 Octavio AI Bot WhatsApp démarré !")
}
