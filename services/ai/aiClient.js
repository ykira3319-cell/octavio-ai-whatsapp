const axios = require("axios");
const Conversation = require("../../database/models/Conversation");
require("dotenv").config();

const API_URL = process.env.CHRISTUS_API_URL;

async function askAI(message, userId) {
  try {
    // récupérer conversation existante
    let convo = await Conversation.findOne({ userId });
    if (!convo) {
      convo = new Conversation({ userId, messages: [] });
    }

    // ajouter message utilisateur
    convo.messages.push({ role: "user", content: message });

    // limiter mémoire à 20 derniers messages
    if (convo.messages.length > 20) {
      convo.messages = convo.messages.slice(-20);
    }

    // envoyer à l’API Christus
    const response = await axios.post(API_URL, {
      messages: convo.messages
    });

    const reply = response.data.reply || "🤖 Pas de réponse";

    // ajouter réponse IA
    convo.messages.push({ role: "assistant", content: reply });

    await convo.save();

    return reply;
  } catch (err) {
    console.error("Erreur IA:", err.message);
    return "❌ Erreur mémoire IA";
  }
}

module.exports = { askAI };
