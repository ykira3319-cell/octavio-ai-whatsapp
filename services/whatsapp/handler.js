const { askAI } = require("../ai/aiClient");

module.exports = async (sock, m) => {
  try {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    // texte du message
    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    if (!text) return;

    const userId = msg.key.remoteJid;

    console.log("📩", userId, ":", text);

    // récupérer réponse IA avec mémoire
    const reply = await askAI(text, userId);

    // envoyer réponse
    await sock.sendMessage(userId, { text: reply });
  } catch (error) {
    console.error("Erreur handler:", error);
  }
};
