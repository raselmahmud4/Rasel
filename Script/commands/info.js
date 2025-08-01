module.exports.config = {
  name: "info",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Displays bot and admin info with dynamic group & user count",
  commandCategory: "Information",
  usages: "[info | botinfo | aboutbot | magicinfo]",
  cooldowns: 5,
  aliases: ["info", "botinfo", "aboutbot", "magicinfo"]
};

module.exports.run = async ({ api, event }) => {
  const prefix = global.config.PREFIX || "*";
  const botName = global.config.BOT_NAME || "MAGIC OF SOUND";

  try {
    // গ্রুপ লিস্ট নিয়ে আসা (100 টা থ্রেড পর্যন্ত)
    const allThreads = await api.getThreadList(100, null, ["INBOX"]);
    const groupThreads = allThreads.filter(thread => thread.isGroup);
    const totalGroups = groupThreads.length;

    // গ্রুপ গুলোর সব মেম্বার আইডি নিয়ে ইউনিক ইউজার হিসেব করা
    let userSet = new Set();
    for (const thread of groupThreads) {
      try {
        const info = await api.getThreadInfo(thread.threadID);
        info.participantIDs.forEach(id => userSet.add(id));
      } catch (e) {
        // error হ্যান্ডেলিং, কোনো সমস্যা হলে স্কিপ করবে
      }
    }
    const totalUsers = userSet.size;

    const message = `
╭───💠 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 💠───╮
┃ 🤖 Bot Name       : ${namebot}
┃ 👑 Owner          : RASEL MAHMUD
┃ 🔗 Group Support  : https://m.me/j/AbZnvggXXnMoLZd7/
┃ ✨ Prefix         : ${prefix}
┃ 📦 Modules        : ${commands.size}
┃ ⚡ Ping           : ${Date.now() - dateNow}ms
┃ ⏱ Uptime         : ${hours}h ${minutes}m ${seconds}s
┃ 👥 Total Users    : ${totalUsers}
┃ 💬 Total Groups   : ${totalGroups}
╰───────────────╯

🌟 Thank you for using our bot!
🔔 Stay connected & spread love 💙

📘 Facebook: https://www.facebook.com/raselmahmud.q
`;

    return api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    return api.sendMessage("⚠️ তথ্য আনতে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।", event.threadID);
  }
};
