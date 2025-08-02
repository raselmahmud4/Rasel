const fs = require("fs");

module.exports.config = {
  name: "owner",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Sends stylish owner info",
  commandCategory: "No command marks needed",
  usages: `${global.config.PREFIX}owner / adminbot / bot admin`,
  cooldowns: 5,
};

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, body } = event;
  if (!body) return;

  const prefix = global.config.PREFIX || "*";
  const text = body.toLowerCase().trim();

  const validCommands = [
    `${prefix}owner`,
    `${prefix}adminbot`,
    `${prefix}bot admin`,
  ];

  if (validCommands.includes(text)) {
    const msg = {
      body: `
╔═══════◇🌟◇═══════╗
        𝘽𝙊𝙏 𝙊𝙒𝙉𝙀𝙍 𝙄𝙉𝙁𝙊
╚═══════◇💠◇═══════╝

╔🪪 Name       : Rasel Mahmud
╚📏 Height     : 5 feet 8 inches

╔🏠 Location   : Mymensingh
╚🎓 Education  : Studying in Rajshahi

╔🌐 Social Links:
╔📘 Facebook   : fb.com/raselmahmud.q
╚📷 Instagram  : @rmsilentgaming
╚🛡️ YouTube    : youtube.com/@rmsilentgaming

═══════════◇✨◇═════════
Thanks for your interest in the owner!
   ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾
═══════════◇🔮◇════════`
    };

    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🤺", messageID, () => {}, true);
  }
};

module.exports.run = function () {};
