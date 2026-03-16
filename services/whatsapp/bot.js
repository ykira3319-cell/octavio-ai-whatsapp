import makeWASocket, { useSingleFileAuthState, DisconnectReason } from "@whiskeysockets/baileys"
import P from "pino"
import fs from "fs"
import path from "path"
import axios from "axios"
import { addMessage } from "../../api/controllers/messageController.js"
import { config } from "../../config/config.js"

// Fichier session
const SESSION_FILE_PATH = path.resolve("./sessions/whatsapp/session.json")
const { state, saveState } = useSingleFileAuthState(SESSION_FILE_PATH)

// Fonction principale pour démarrer le bot
export async function startBot() {
  const sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: "silent" })
  })

  // Sauvegarde la session à chaque changement
  sock.ev.on("creds.update", saveState)

  // Gestion des messages entrants
  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0]
    if (!msg.message || msg.key.fromMe) return

    const from = msg.key.remoteJid
    const isGroup = from.endsWith("@g.us")
    if (isGroup) return // ignore les groupes

    const text = msg.message.conversation || msg.message.extendedTextMessage?.text
    if (!text) return

    console.log(`💬 Message reçu de ${from}: ${text}`)
    addMessage(from, text)

    // Appeler l'API IA
    try {
      const response = await axios.get(`${config.AI_API}${encodeURIComponent(text)}`)
      const answer = response.data?.response || "Désolé, je n'ai pas compris."

      // Envoyer la réponse au même utilisateur
      await sock.sendMessage(from, { text: answer })
    } catch (err) {
      console.error("❌ Erreur IA:", err.message)
      await sock.sendMessage(from, { text: "❌ Une erreur est survenue côté IA." })
    }
  })

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log("⚠️ Déconnecté:", reason)
      // Reconnect automatique
      startBot()
    } else if (connection === "open") {
      console.log("✅ Bot WhatsApp connecté !")
    }
  })
  }
