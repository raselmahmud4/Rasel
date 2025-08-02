module.exports.config = {
  name: "logo",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud x ChatGPT",
  description: "Generate stylish logo using public API",
  commandCategory: "tools",
  usages: "[text]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const request = require("request");

  const text = args.join(" ");
  if (!text) return api.sendMessage("📌 একটি টেক্সট দিন!\nযেমন: /logo ChatGPT", event.threadID);

  const loading = await api.sendMessage(`🎨 “${text}” এর জন্য লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const url = `https://api.popcat.xyz/logo?text=${encodeURIComponent(text)}&image=https://i.ibb.co/vJvbq9b/logo.png`;
    const path = __dirname + `/cache/logo_${Date.now()}.png`;

    await new Promise((resolve, reject) => {
      request(url)
        .pipe(fs.createWriteStream(path))
        .on("close", resolve)
        .on("error", reject);
    });

    api.sendMessage(
      {
        body: `✅ “${text}” এর জন্য লোগো তৈরি হয়েছে:`,
        attachment: fs.createReadStream(path)
      },
      event.threadID,
      () => {
        fs.unlinkSync(path);
        api.unsendMessage(loading.messageID);
      }
    );

  } catch (err) {
    console.error("❌ Logo Error:", err.message || err);
    api.sendMessage("⚠️ দুঃখিত, লোগো তৈরি করা যায়নি। পরে আবার চেষ্টা করুন।", event.threadID);
  }
};
