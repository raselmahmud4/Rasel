module.exports.config = {
  name: "logo",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "AI দিয়ে একাধিক লোগো তৈরি",
  commandCategory: "tools",
  usages: "[ব্র্যান্ড নাম]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");

  const brandName = args.join(" ");
  if (!brandName) {
    return api.sendMessage("🔤 দয়া করে একটি ব্র্যান্ড নাম লিখুন!\nউদাহরণ: /logo Apple", event.threadID);
  }

  const waiting = await api.sendMessage(`🎨 “${brandName}” এর জন্য লোগো তৈরি হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...`, event.threadID);

  try {
    const prompt = encodeURIComponent(`${brandName} logo, minimal, vector, modern, clean white background`);
    const res = await axios.get(`https://lexica.art/api/v1/search?q=${prompt}`);
    const images = res.data.images?.slice(0, 5); // সর্বোচ্চ ৫টা লোগো

    if (!images || images.length === 0) {
      return api.sendMessage("😓 দুঃখিত, কোনো লোগো পাওয়া যায়নি!", event.threadID);
    }

    const files = [];

    for (let i = 0; i < images.length; i++) {
      const url = images[i].src;
      const filePath = __dirname + `/cache/${brandName}_logo_${i}.png`;

      await new Promise((resolve) => {
        request(url)
          .pipe(fs.createWriteStream(filePath))
          .on("close", () => {
            files.push(fs.createReadStream(filePath));
            resolve();
          });
      });
    }

    api.sendMessage(
      {
        body: `✅ “${brandName}” এর জন্য ${files.length} টি লোগো পাওয়া গেছে:\n🖼️ নিচে দেখুন 👇`,
        attachment: files,
      },
      event.threadID,
      () => {
        api.unsendMessage(waiting.messageID);
        files.forEach((f) => fs.unlinkSync(f.path));
      }
    );
  } catch (e) {
    console.error(e);
    api.sendMessage("❌ লোগো তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন!", event.threadID);
  }
};
