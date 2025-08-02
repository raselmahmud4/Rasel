module.exports.config = {
  name: "logo",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud x ChatGPT",
  description: "Generate stylish logo using Popcat API",
  commandCategory: "tools",
  usages: "[text] [style]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const axios = require("axios");
  const request = require("request");

  if (args.length === 0)
    return api.sendMessage("📌 ব্যবহার:\n/logo [টেক্সট] [স্টাইল(optional)]\n\nউদাহরণ:\n/logo Fire Tech neon", event.threadID);

  // 🎨 Input আলাদা করলাম
  const styleList = ["neon", "gold", "glitch", "blue", "red"];
  const style = styleList.includes(args[args.length - 1].toLowerCase()) ? args.pop().toLowerCase() : "neon";
  const text = args.join(" ");

  const loading = await api.sendMessage(`🎨 “${text}” এর জন্য ‘${style}’ লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    // ✅ Custom image bg/icon per style (optional)
    const styleImageMap = {
      neon: "https://i.ibb.co/vJvbq9b/logo.png",
      gold: "https://i.ibb.co/MfTRnMQ/gold-logo.png",
      glitch: "https://i.ibb.co/7rX3dXM/glitch-logo.png",
      blue: "https://i.ibb.co/4WJ9bd1/blue.png",
      red: "https://i.ibb.co/YphQgsD/red.png",
    };

    const imageUrl = styleImageMap[style] || styleImageMap["neon"];

    const apiUrl = `https://api.popcat.xyz/logo?text=${encodeURIComponent(text)}&image=${encodeURIComponent(imageUrl)}`;
    const path = __dirname + `/cache/logo_${Date.now()}.png`;

    await new Promise((resolve, reject) => {
      request(apiUrl)
        .pipe(fs.createWriteStream(path))
        .on("close", resolve)
        .on("error", reject);
    });

    api.sendMessage(
      {
        body: `✅ “${text}” এর ‘${style}’ স্টাইল লোগো তৈরি হয়েছে:`,
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
    api.sendMessage("⚠️ দুঃখিত, লোগো তৈরি করতে সমস্যা হয়েছে!", event.threadID);
  }
};
