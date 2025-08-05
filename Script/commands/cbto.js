const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "joinNoti",
  eventType: ["message"],
  version: "1.0.0",
  credits: "🥀 𝑹𝒂𝒔𝒆𝒍 𝑴𝒂𝒉𝒎𝒖𝒅 🥀",
  description: "Trigger love message if message includes Rasel with certain symbols",
};

const enableProfilePic = true; // ⬅️ false করলে প্রোফাইল ফটো বন্ধ থাকবে

const triggerPatterns = [
  /(ﹺ٭ ﹺ٭ ﹺ٭ ﹺ٭, @ﹺ٭ ﹺ٭ ﹺ٭ ﹺ٭)/,
];

const raselRegex = /(রাসেল|রািসেল|r[a@4]s[e3]l|r[a@4]s[e3]l|r4s3l|r@s3l)/i;

const loveMessages = [
  "💖 আহারে... রাসেল নাম শুনলেই মনটা কেমন জানি করে 😌",
  "✨ রাসেল মানেই শান্তি... কে ডাকে ওকে এত ভালোবাসায়? 🥺",
  "🌸 রাসেল কি জানে কেউ তাকে মনে মনে এভাবে ভালোবাসে? 😚",
  "💘 রাসেল নাম শুনলেই হৃদয়টা নরম হয়ে যায়... তুমি জানো রাসেল? 😇",
  "🌟 ওরে মনের মানুষ রাসেল... তোমারে ছাড়া চলেই না 😍",
  "🔥 রাসেল আসলেই একটা আগুন নাম! কে বলছে ওরে আজ? 😏",
  "💫 রাসেল আসলে একেকটা অনুভব... তাকে মেসেজ দিলে আকাশের তারা নাচে! 🌌",
];

const reactList = ["❤️", "😍", "🥰", "😚", "😘", "😻", "💞", "💗", "🤍"];

module.exports.run = async ({ api, event }) => {
  try {
    const { threadID, messageID, senderID, body } = event;

    if (!body) return;

    // যদি trigger pattern ও রাসেল নাম থাকে
    if (
      triggerPatterns.some((regex) => regex.test(body)) &&
      raselRegex.test(body)
    ) {
      // ইউজার প্রোফাইল নাম আনা
      const userInfo = await api.getUserInfo(senderID);
      const name = userInfo[senderID]?.name || "👤 Someone";

      // রেন্ডম রোমান্টিক মেসেজ
      const message = loveMessages[Math.floor(Math.random() * loveMessages.length)].replace("রাসেল", `💘 রাসেল`);
      
      // রেন্ডম রিঅ্যাকশন
      const react = reactList[Math.floor(Math.random() * reactList.length)];

      // প্রোফাইল পিক
      if (enableProfilePic) {
        const imgPath = __dirname + `/cache/${senderID}.jpg`;
        const imgURL = `https://graph.facebook.com/${senderID}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

        const imgRes = (await axios.get(imgURL, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(imgPath, Buffer.from(imgRes, "utf-8"));

        // মেসেজ সেন্ড
        api.sendMessage(
          {
            body: `${message}\n\n— তোমারে বললাম ${name} 💌`,
            mentions: [{ tag: name, id: senderID }],
            attachment: fs.createReadStream(imgPath),
          },
          threadID,
          () => fs.unlinkSync(imgPath),
          messageID
        );
      } else {
        // without image
        api.sendMessage(
          {
            body: `${message}\n\n— ${name}, তুমি কি জানো রাসেল কতটা স্পেশাল? 💖`,
            mentions: [{ tag: name, id: senderID }],
          },
          threadID,
          messageID
        );
      }

      // অটো রিঅ্যাক্ট
      api.setMessageReaction(react, messageID, (err) => {}, true);
    }
  } catch (e) {
    console.log("joinNoti error:", e);
  }
};
