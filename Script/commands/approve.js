// 📁 modules/commands/approve.js

const fs = require("fs-extra"); const path = require("path"); const axios = require("axios"); const request = require("request"); const moment = require("moment-timezone"); const { getPrefix } = global.utils;

const dataPath = path.join(__dirname, "../data/approved.json"); if (!fs.existsSync(dataPath)) fs.writeJsonSync(dataPath, {});

module.exports = { config: { name: "approve", version: "2.0", author: "Rasel Mahmud", countDown: 5, role: 2, shortDescription: "গ্রুপ অনুমোদন ব্যবস্থা", longDescription: "বট চালানোর জন্য গ্রুপ অনুমোদন করুন বা বাতিল করুন", category: "admin", guide: { en: "!approve [groupID]\n!approve list\n!approve pending\n!approve del [groupID] [reason]", bn: "!approve [groupID]\n!approve list (অনুমোদিত)\n!approve pending (অপেক্ষমাণ)\n!approve del [groupID] [কারণ]" } },

onStart: async function ({ api, args, message, event }) { const { threadID, senderID } = event; const prefix = getPrefix(threadID); const approved = fs.readJsonSync(dataPath); const input = args[0];

if (!input) return message.reply(`📌 Approve Module Help 📌\n

${prefix}approve [groupID]\n→ অনুমোদন দিন\n ${prefix}approve list\n→ অনুমোদিত তালিকা\n ${prefix}approve pending\n→ অপেক্ষমাণ তালিকা\n ${prefix}approve del [ID] [কারণ]\n→ বাতিল করুন`);

if (["list", "l"].includes(input)) {
  const approvedGroups = Object.keys(approved);
  if (approvedGroups.length === 0) return message.reply("❌ কোনো গ্রুপ অনুমোদিত নয়।");

  let listMsg = "=====「 ✅ অনুমোদিত গ্রুপসমূহ 」=====\n";
  for (let i = 0; i < approvedGroups.length; i++) {
    const gid = approvedGroups[i];
    listMsg += `〘${i + 1}〙» ${approved[gid].name || "Unknown"}\n${gid}\n`;
  }
  return message.reply(listMsg.trim());
}

if (["pending", "p"].includes(input)) {
  const allThreads = global.data.allThreadID || [];
  const pending = allThreads.filter(tid => !approved[tid]);
  if (pending.length === 0) return message.reply("🎉 কোনো অপেক্ষমাণ গ্রুপ নেই।");

  let pendingMsg = "=====「 ⏳ অনুমোদনের অপেক্ষায় গ্রুপ 」=====\n";
  for (let i = 0; i < pending.length; i++) {
    const name = global.data.threadInfo?.[pending[i]]?.threadName || "Unknown";
    pendingMsg += `〘${i + 1}〙» ${name}\n${pending[i]}\n`;
  }
  return message.reply(pendingMsg.trim());
}

if (["del", "d"].includes(input)) {
  const delID = args[1];
  const reason = args.slice(2).join(" ") || "কারণ প্রদান করা হয়নি।";
  if (!delID || !approved[delID]) return message.reply("❌ বৈধ groupID দিন যা অনুমোদিত আছে।");

  delete approved[delID];
  fs.writeJsonSync(dataPath, approved);

  message.reply(`✅ গ্রুপ ${delID} এর অনুমোদন বাতিল হয়েছে।\nকারণ: ${reason}`);
  return api.sendMessage(`⚠️ আপনার গ্রুপটি এখন আর অনুমোদিত নয়।\nবাতিলের কারণ: ${reason}`, delID);
}

// Approve process
const targetID = input;
if (approved[targetID]) return message.reply("✅ এই গ্রুপটি ইতিমধ্যে অনুমোদিত।");

const name = global.data.threadInfo?.[targetID]?.threadName || "Unknown";
approved[targetID] = {
  name,
  time: moment().tz("Asia/Dhaka").format("DD-MM-YYYY hh:mm A"),
  approvedBy: senderID
};
fs.writeJsonSync(dataPath, approved);

// nickname change
api.setTitle(`『 ${prefix} 』⇝ ${global.config.BOTNAME}`, targetID);

// Send welcome message
api.getUserInfo(senderID, async (err, info) => {
  const ownerName = info?.[senderID]?.name || "Owner";

  axios.get("https://anime.apibypriyansh.repl.co/img/anime").then(res => {
    const ext = res.data.url.split(".").pop();
    const filePath = path.join(__dirname, `../cache/welcome.${ext}`);

    const callback = () => {
      api.sendMessage({
        body:

`🎉 স্বাগতম! আপনার গ্রুপটি এখন থেকে ${global.config.BOTNAME} দ্বারা পরিচালিত।

📌 বট সফলভাবে কানেক্ট হয়েছে: ┏━━━━━━━━━━━━━━┓ 🔹 BOT: ${global.config.BOTNAME} 🔸 Prefix: ${prefix} 👥 Total Users: ${global.data.allUserID.length} 👨‍👩‍👧‍👦 Total Groups: ${global.data.allThreadID.length} ┗━━━━━━━━━━━━━━┛

🛠️ কমান্ড লিস্ট পেতে লিখুন: ${prefix}help

👤 Approver: ${ownerName}\n🌐 fb.com/raselmahmud.q`, attachment: fs.createReadStream(filePath), }, targetID, () => fs.unlinkSync(filePath)); };

request(res.data.url).pipe(fs.createWriteStream(filePath)).on("close", callback);
  });
});

return message.reply(`✅ গ্রুপ ${targetID} সফলভাবে অনুমোদিত হয়েছে!`);

} };

