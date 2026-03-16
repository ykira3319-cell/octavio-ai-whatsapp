// api/server.js

import express from "express"
import activationRouter from "./routes/activation.js"
import { startBot } from "../services/whatsapp/bot.js"

const app = express()

app.use(express.json())

// Route pour générer le code
app.use("/activate", activationRouter)

// Démarre le serveur
const PORT = 3000
app.listen(PORT, () => {
  console.log(`🚀 Octavio AI server running on port ${PORT}`)
})

// Démarre le bot WhatsApp
startBot()
