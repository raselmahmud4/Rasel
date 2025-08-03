const fs = require("fs");
const path = __dirname + "/simsimi-learn.json";

if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}));

module.exports.config = {
  name: "simteach",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Rasel Mahmud",
  description: "Simsimi bot কে কিছু শেখাও",
  commandCategory: "chat",
  usages: "simteach প্রশ্ন => উত্তর",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const input = args.join(" ");
  if (!input.includes("=>"))
    return api.sendMessage("📌 ফরম্যাট ভুল!\nসঠিক উদাহরণ:\n\nsimteach তুমি কে => আমি একটা AI চ্যাটবট", threadID, messageID);

  const [ask, answer] = input.split("=>").map(i => i.trim().toLowerCase());

  if (!ask || !answer)
    return api.sendMessage("❌ প্রশ্ন বা উত্তর খালি রাখা যাবে না!", threadID, messageID);

  const db = JSON.parse(fs.readFileSync(path));

  if (!db[ask]) db[ask] = [];
  if (!db[ask].includes(answer)) db[ask].push(answer);

  fs.writeFileSync(path, JSON.stringify(db, null, 2));
  return api.sendMessage(`✅ শেখানো সম্পন্ন!\n\n❓ প্রশ্ন: ${ask}\n💡 উত্তর: ${answer}`, threadID, messageID);
};
