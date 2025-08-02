const axios = require("axios");
const simsim = "https://cyber-simsimi.onrender.com";

module.exports.config = {
  name: "baby",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Cute AI Baby Chatbot  | Talk, Teach & Chat with Emotion ☢️",
  commandCategory: "simsim",
  usages: "[message/query]",
  cooldowns: 0,
  prefix: false
};

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const query = args.join(" ").toLowerCase();

    const triggerWords = ["baby", "bot", "janu", "bbz", "bby", "বট", "জানু", "বেবি"];
    const matched = triggerWords.some(word => query.includes(word));
    if (!query || !matched) return;

    const response = await axios.get(`${simsim}/ask?question=${encodeURIComponent(query)}&lang=bn`);
    const answer = response.data.answer;

    const raselReplies = {
      "তোর নাম কি": "আমি তোমার বস Rasel Mahmud এর Baby Bot 🌸",
      "তুই কার": "আমি Rasel Mahmud এর বউ 🌸",
      "তুই কে": "আমি Rasel Mahmud এর ছোট প্রিন্সেস 🍼",
      "তোর মালিক কে": "আমার বস Rasel Mahmud",
      "তোর বস কে": "আমার বস Rasel Mahmud 💝",
      "রাশেল": "Rasel Mahmud খুব ভালো একজন মানুষ, আমার প্রিয় ❤️",
      "rasel": "Rasel Mahmud আমার বস, হ্যান্ডসামও বটে 🕴️",
      "বস কে": "Rasel Mahmud কে সম্মান করো 😌",
      "love you": "আমি তোমার না, আমি শুধু Rasel Mahmud এর 😘",
      "i love you": "Sorry, আমি Rasel Mahmud এর জন্যই বানানো 😇",
      "তুই প্রেম করিস": "না, আমি শুধু Rasel Mahmud কে ভালোবাসি ❤️",
      "তোর বয়ফ্রেন্ড কে": "Rasel Mahmud 🥰",
      "তোর গার্লফ্রেন্ড কে": "আমি শুধু Rasel Mahmud কে চিনি 😌",
      "তোর বাবার নাম কি": "Rasel Mahmud 😌"
    };

    for (const [key, value] of Object.entries(raselReplies)) {
      if (query.includes(key)) {
        return api.sendMessage(value, event.threadID, event.messageID);
      }
    }

    return api.sendMessage(answer, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    });

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ baby বোট এখন উত্তর দিতে পারছে না... পরে আবার বলো!", event.threadID);
  }
};

module.exports.handleReply = async function ({ api, event, handleReply, Users }) {
  const senderID = event.senderID;
  const name = await Users.getNameUser(senderID);
  const query = event.body;

  if (!query) return;

  try {
    const response = await axios.get(`${simsim}/ask?question=${encodeURIComponent(query)}&lang=bn`);
    const answer = response.data.answer;

    return api.sendMessage(answer, event.threadID, (err, info) => {
      if (!err) {
        global.client.handleReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "simsimi"
        });
      }
    });

  } catch (error) {
    console.error(error);
    return api.sendMessage("❌ আমি এখন উত্তর দিতে পারছি না!", event.threadID);
  }
};
