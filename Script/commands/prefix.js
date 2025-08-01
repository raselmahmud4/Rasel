module.exports.config = {
  name: "prefix",
  version: "1.0.1",
  permission: 0,
  credits: "Rasel Mahmud",
  description: "বর্তমান বটের গ্লোবাল প্রিফিক্স দেখায়",
  commandCategory: "system",
  usages: "[prefix]",
  cooldowns: 2
};

module.exports.run = async function({ api, event }) {
  const prefix = global.config.PREFIX || "!";
  const message = 
`╔════════════════╗
🔧 𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 তথ্য
╚════════════════╝
📌 বর্তমানে ব্যবহৃত প্রিফিক্স: [ ${prefix} ]

💡 আপনি বট কমান্ড চালাতে চাইলে উদাহরণস্বরূপ লিখুন:
${prefix}help
${prefix}menu

📣 বটের সেটিংস চেঞ্জ করার জন্য আপনার permission থাকতে হবে।

🤖 Bot: ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾
👤 Dev: Rasel Mahmud`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
