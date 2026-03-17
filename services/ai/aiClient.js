const axios = require("axios");

async function askAI(message) {
  try {
    // Simulation IA (tu peux connecter OpenAI plus tard)
    return `🤖 Octavio AI:\nTu as dit: "${message}"`;
  } catch (error) {
    return "❌ Erreur IA";
  }
}

module.exports = { askAI };
