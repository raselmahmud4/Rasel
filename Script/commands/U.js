module.exports.config = {
  name: "u",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Silent mode: শুধু রিপ্লাই করা মেসেজ আনসেন্ড করবে",
  commandCategory: "utility",
  usages: "[reply]",
  cooldowns: 3,
  prefix: true
};

module.exports.run = async ({ api, event }) => {
  const { threadID, messageReply, messageID } = event;

  if (!messageReply) {
    return api.sendMessage("⚠️ দয়া করে একটি মেসেজে reply দিন আনসেন্ড করার জন্য!", threadID, messageID);
  }

  try {
    await api.unsendMessage(messageReply.messageID);
    // কিছুই return করবে না — No message
  } catch (err) {
    console.error(err);
    // ব্যর্থ হলে শুধু error message দিবে
    return api.sendMessage("❌ আনসেন্ড ব্যর্থ হয়েছে!", threadID, messageID);
  }
};
