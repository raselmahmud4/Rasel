const fs = require("fs"); 

module.exports.config = {
    name: "RaselInfo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rasel Mahmud",
    description: "Rasel এর তথ্য পাঠায়",
    commandCategory: "No command marks needed",
    usages: "owner/rasel/magic",
    cooldowns: 5,
};

const uptime = Date.now();

module.exports.handleEvent = function({ api, event }) {
    const { threadID, messageID, body } = event;
    if (!body) return;

    const text = body.toLowerCase();

    // Add the new keywords to the condition
    if (text.includes("owner") || text.includes("rasel") || text.includes("magic of sound") || text.includes("in") || text.includes("info") || text.includes("information") || text.includes("bot admin")) {
        // রিয়েল টাইম তারিখ
        const date = new Date();
        const today = date.toLocaleDateString("bn-BD", { day: "2-digit", month: "2-digit", year: "numeric" });

        // বট চালুর সময় হিসাব
        const up = Date.now() - uptime;
        const hours = Math.floor(up / (1000 * 60 * 60));
        const minutes = Math.floor((up / (1000 * 60)) % 60);
        const seconds = Math.floor((up / 1000) % 60);

        const msg = {
            body: `🌹𝙰𝙳𝙼𝙸𝙽 𝙰𝙽𝙳 𝙱𝙾𝚃 𝙸𝙽𝙵𝙾𝚁𝙼𝙰𝚃𝙸𝙾𝙽 💙
   ☄️𝗕𝗢𝗧 𝗡𝗔𝗠𝗘☄️ ⚔ ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾ ⚔
   🔥𝗢𝗪𝗡𝗘𝗥 🔥☞︎︎︎ *RASEL MAHMUD* ☜︎︎︎✰
   🙈🄾🅆🄽🄴🅁 🄲🄾🄽🅃🄰🄲🅃 🄻🄸🄽🄺🅂🙈➪
   📘 ফেসবুক: https://www.facebook.com/raselmahmud.q 
   📷 ইনস্টাগ্রাম: @rmsilentgaming 
   🛡️ ইউটিউব: https://youtube.com/@rmsilentgaming?si=h2TtPwckEgvY_wXy
   ✧══════•❁❀❁•══════✧
   🌸𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅🌸: * (স্টার চিহ্ন) 
   📅 আজকের তারিখ: ${today} 
   🕰️ বট চালু আছে: ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড
   ✅Thanks for using MAGIC OF SOUND ❤`
        };

        api.sendMessage(msg, threadID, messageID);
        api.setMessageReaction("🤺", messageID, () => {}, true);
    }
};

module.exports.run = function() {};
