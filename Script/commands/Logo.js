module.exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Generate free AI logos based on user input (no API key needed)",
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
    return api.sendMessage("🔤 দয়া করে একটি টেক্সট দিন!\nউদাহরণ: /logo OpenAI", event.threadID);
  }

  const waitMsg = await api.sendMessage(`🎨 “${input}” এর জন্য AI লোগো তৈরি হচ্ছে, একটু অপেক্ষা করুন...`, event.threadID);

  try {
    const query = encodeURIComponent(`${input} logo, minimal, vector, clean`);
    const apiUrl = `https://lexica.art/api/v1/search?q=${query}`;
    const res = await axios.get(apiUrl);
    const images = res.data.images?.slice(0, 5); // সর্বোচ্চ ৫টা লোগো

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
        body: `✅ “${input}” এর জন্য ${files.length} টি লোগো পাওয়া গেছে:\n🖼️ নিচে দেখুন 👇`,
        attachment: files,
      },
      event.threadID,
      () => {
        files.forEach(file => fs.unlinkSync(file.path));
        api.unsendMessage(waitMsg.messageID);
      }
    );
  } catch (err) {
    console.error("Logo Error:", err.message || err);
    api.sendMessage("❌ লোগো তৈরি করতে সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।", event.threadID);
  }
};module.exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud x ChatGPT",
  description: "Create a logo using DALL·E AI",
  commandCategory: "tools",
  usages: "[text]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const promptText = args.join(" ");
  if (!promptText) return api.sendMessage("🔤 দয়া করে একটি টেক্সট দিন! যেমন: /logo OpenAI", event.threadID);

  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // 🔐 <-- এখানে আপনার API Key দিন
  const waiting = await api.sendMessage(`🧠 “${promptText}” এর জন্য AI লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const prompt = `modern minimal vector logo of ${promptText}, white background, clean, profe.join(" ");
  if (!promptText) return api.sendMessage("🔤 দয়া করে একটি টেক্সট দিন! যেমন: /logo OpenAI", event.threadID);

  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // 🔐 <-- এখানে আপনার API Key দিন
  const waiting = await api.sendMessage(`🧠 “${promptText}” এর জন্য AI লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const prompt = `modern minimal vector logo of ${promptText}, white background, clean, professional`;
    const dalleRes = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "512x512"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const imageUrl = dalleRes.data.data[0].url;
    const filePath = __dirname + `/cache/logo_dalle_${Date.now()}.png`;

    request(imageUrl).pipe(fs.createWriteStream(filePath)).on("close", () => {
      api.sendMessage(
        {
          body: `✅ AI দিয়ে “${promptText}” এর জন্য একটি লোগো তৈরি করা হয়েছে:`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          fs..exports.config = {
  name: "logo",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud x ChatGPT",
  description: "Create a logo using DALL·E AI",
  commandCategory: "tools",
  usages: "[text]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const promptText = args.join(" ");
  if (!promptText) return api.sendMessage("🔤 দয়া করে একটি টেক্সট দিন! যেমন: /logo OpenAI", event.threadID);

  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // 🔐 <-- এখানে আপনার API Key দিন
  const waiting = await api.sendMessage(`🧠 “${promptText}” এর জন্য AI লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const prompt = `modern minimal vector logo of ${promptText}, white background, clean, profe.join(" ");
  if (!promptText) return api.sendMessage("🔤 দয়া করে একটি টেক্সট দিন! যেমন: /logo OpenAI", event.threadID);

  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // 🔐 <-- এখানে আপনার API Key দিন
  const waiting = await api.sendMessage(`🧠 “${promptText}” এর জন্য AI লোগো তৈরি হচ্ছে...`, event.threadID);

  try {
    const prompt = `modern minimal vector logo of ${promptText}, white background, clean, professional`;
    const dalleRes = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        prompt: prompt,
        n: 1,
        size: "512x512"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const imageUrl = dalleRes.data.data[0].url;
    const filePath = __dirname + `/cache/logo_dalle_${Date.now()}.png`;

    request(imageUrl).pipe(fs.createWriteStream(filePath)).on("close", () => {
      api.sendMessage(
        {
          body: `✅ AI দিয়ে “${promptText}” এর জন্য একটি লোগো তৈরি করা হয়েছে:`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => {
          fs.unlinkSync(filePath);
          api.unsendMessage(waiting.messageID);
        }
      );
    });

  } catch (err) {
    console.error("DALL·E Error:", err.response?.data || err.message);
    api.sendMessage("❌ লোগো তৈরি করতে সমস্যা হয়েছে! হয়তো API Key ভুল বা লিমিট শেষ হয়ে গেছে।", event.threadID);
  }
};
