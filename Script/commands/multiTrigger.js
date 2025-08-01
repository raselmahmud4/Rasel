module.exports.config = {
  name: "multiTrigger",
  version: "1.2.0",
  hasPermssi",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  botName: "༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾",
  description: "Trigger only on specific mention names",
  commandCategory: "no prefix",
  cooldowns: 5,
};

module.exports.handleEvent = function({ api, event }) {
  const { mentions, threadID, messageID } = event;

  if (!mentions || Object.keys(mentions).length === 0) return;

  // অনুমোদিত মেনশন নামের তালিকা
  const allowedMentions = [
    "rasel",
    "rasel mahmud",
    "ﹺ٭ ﹺ٭ ﹺ٭ ﹺ٭"
  ];

  // মেসেজে মেনশন করা নামগুলো নিচে রূপান্তরিত করব:
  // ছোট হাতের, এবং স্পেস ট্রিম/নিয়ন্ত্রিত
  const mentionNames = Object.values(mentions).map(m => 
    m.toLowerCase().trim().replace(/\s+/g, " ")
  );

  // চেক করব মেনশন টেক্সট অনুমোদিত তালিকার সাথে মেলে কিনা
  const isMentionAllowed = mentionNames.some(name => allowedMentions.includes(name));

  if (!isMentionAllowed) return;

  const message =
`🫅 Boss Rasel Mahmud is currently busy with reason:

✧ Assalamualaikum 🌺💙🌹
✧ আমাকে স্মরণ করার জন্য আপনাকে  
° ধন্যবাদ»̶̶͓͓͓̽̽̽⑅⃝✺𝄞𒆜🫰🌺
✧ দুঃখজনক হলেও বলতে হচ্ছে আপনাদের  
° সাথে আমি আর আগের মত আড্ডা দিতে  
° পারব না । আমার আমিটা কে প্রমাণ করতে  
° নিজেকে গুটিয়ে নিলাম ।  

✧ 🫰🌺 রাসেল মাহমুদ 🌺🫰 ✧`;

  api.sendMessage({ body: message }, threadID, messageID);
  api.setMessageReaction("🫅", messageID, () => {}, true);
};

module.exports.run = function () {};
