module.exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Generate AI logos based on text (No API Key required)",
  commandCategory: "tools",
  usages: "[text]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const input = args.join(" ");
  if (!input) {
    return api.sendMessage("🔤 দয়া করে একটি টেক্সট লিখুন!\nযেমন: /logo ChatGPT", event.threadID);
  }

  const waitMsg = await api.sendMessage(`🎨 “${input}” এর জন্য লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const query = encodeURIComponent(`${input} logo, minimal, vector, clean white background`);
    const apiUrl = `https://lexica.art/api/v1/search?q=${query}`;
    const res = await axios.get(apiUrl);
    const images = res.data.images?.slice(0, 5);

    if (!images || images.length === 0) {
      return api.sendMessage("❌ কোনো লোগো খুঁজে পাওয়া যায়নি!", event.threadID);
    }

    const files = [];

    for (let i = 0; i < images.length; i++) {
      const url = images[i].src;
      const path = __dirname + `/cache/logo_${Date.now()}_${i}.jpg`;

      await new Promise((resolve, reject) => {
        request(url)
          .pipe(fs.createWriteStream(path))
          .on("close", () => {
            files.push(fs.createReadStream(path));
            resolve();
          })
          .on("error", reject);
      });
    }

    api.sendMessage(
      {
        body: `✅ “${input}” এর জন্য ${files.length} টি লোগো তৈরি হয়েছে:\n🖼️ নিচে দেখুন 👇`,
        attachment: files,
      },
      event.threadID,
      () => {
        files.forEach(f => fs.unlinkSync(f.path));
        api.unsendMessage(waitMsg.messageID);
      }
    );
  } catch (err) {
    console.error("❌ Logo Generator Error:", err.message || err);
    api.sendMessage("⚠️ দুঃখিত, লোগো তৈরি করতে সমস্যা হয়েছে!", event.threadID);
  }
};
