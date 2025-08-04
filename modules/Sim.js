const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "sim",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Simple Simsimi-style chatbot",
  commandCategory: "chat",
  usages: "[message/query]",
  cooldowns: 1,
  prefix: false
};

const learnFile = path.join(__dirname, "simsimi-learn.json");
if (!fs.existsSync(learnFile)) fs.writeFileSync(learnFile, "[]", "utf-8");

function loadLearned() {
  return JSON.parse(fs.readFileSync(learnFile, "utf-8"));
}

function saveLearned(data) {
  fs.writeFileSync(learnFile, JSON.stringify(data, null, 2));
}

module.exports.handleEvent = async function ({ event, api }) {
  const { body, threadID, messageID } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();
  if (text.startsWith("simteach") || text.startsWith("simremove") || text === "simlist") return;

  const data = loadLearned();
  const found = data.find(e => e.ask.toLowerCase() === text);

  if (found) {
    const reply = Array.isArray(found.reply) ? found.reply[Math.floor(Math.random() * found.reply.length)] : found.reply;
    return api.sendMessage(reply, threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args.join(" ");

  if (!input.includes("=>") && input !== "simlist") {
    return api.sendMessage("📝 শেখাতে:\nsimteach প্রশ্ন => উত্তর\n\n❌ মুছতে:\nsimremove প্রশ্ন\n\n📜 লিস্ট:\nsimlist", threadID, messageID);
  }

  if (input === "simlist") {
    const data = loadLearned();
    if (data.length === 0) return api.sendMessage("😐 এখনো কিছু শেখানো হয়নি!", threadID, messageID);
    const list = data.map((e, i) => `${i + 1}. ${e.ask}`).join("\n");
    return api.sendMessage(`📚 শেখানো প্রশ্ন:\n\n${list}`, threadID, messageID);
  }

  if (input.startsWith("simteach ")) {
    const [ask, reply] = input.slice(9).split("=>").map(s => s.trim());
    if (!ask || !reply) return api.sendMessage("⚠️ সঠিকভাবে লিখুন:\nsimteach প্রশ্ন => উত্তর", threadID, messageID);

    const data = loadLearned();
    data.push({ ask, reply });
    saveLearned(data);
    return api.sendMessage(`✅ শেখানো হয়েছে!\n\n📌 প্রশ্ন: ${ask}\n📥 উত্তর: ${reply}`, threadID, messageID);
  }

  if (input.startsWith("simremove ")) {
    const ask = input.slice(10).trim().toLowerCase();
    const data = loadLearned();
    const updated = data.filter(e => e.ask.toLowerCase() !== ask);
    if (updated.length === data.length) return api.sendMessage("😕 এমন কিছু পাইনি!", threadID, messageID);
    saveLearned(updated);
    return api.sendMessage(`🗑️ "${ask}" মুছে ফেলা হয়েছে!`, threadID, messageID);
  }
};
