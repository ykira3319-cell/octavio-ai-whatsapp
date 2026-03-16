// api/routes/activation.js

import express from "express"
import { generateCodeForNumber } from "../../services/activation/codeGenerator.js"

const router = express.Router()

// Route POST pour générer un code réel
router.post("/", (req, res) => {
  const { numero } = req.body
  if (!numero) return res.status(400).json({ error: "Numéro requis" })

  const code = generateCodeForNumber(numero)

  res.json({
    numero,
    code
  })
})

export default router
