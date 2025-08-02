const fs = require("fs");
const path = __dirname + "/cache/notext.json";

module.exports.config = {
  name: "notext",
  version: "2.0.0",
  hasPermission: 1,
  credits: "Rasel Mahmud",
  description: "Remove anyone who sends anything at all in the group",
  commandCategory: "Group Moderation",
  usages: "[on/off]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify([]));
  let data = JSON.parse(fs.readFileSync(path));

  const threadInfo = await api.getThreadInfo(threadID);
  const isAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
  if (!isAdmin) return api.sendMessage("❌ এই কমান্ডটি কেবল গ্রুপ অ্যাডমিন ব্যবহার করতে পারবে।", threadID);

  const isActive = data.includes(threadID);

  if (args[0] === "on") {
    if (isActive) return api.sendMessage("⚠️ NoText মোড ইতিমধ্যেই চালু আছে!", threadID);
    data.push(threadID);
    fs.writeFileSync(path, JSON.stringify(data));
    return api.sendMessage(
      `☠️ 𝐍𝐎𝐓𝐄𝐗𝐓 𝐌𝐎𝐃𝐄 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃 ☠️\n\n⚠️ এখন থেকে কেউ কিছু সেন্ড করলেই তাকে গ্রুপ থেকে রিমুভ করে দেওয়া হবে!`,
      threadID
    );
  }

  if (args[0] === "off") {
    if (!isActive) return api.sendMessage("✅ 𝐓𝐄𝐗𝐓 𝐎𝐍! এখন মেসেজ করা যাবে।", threadID);
    data = data.filter(id => id !== threadID);
    fs.writeFileSync(path, JSON.stringify(data));
    return api.sendMessage("✅ 𝐓𝐄𝐗𝐓 𝐎𝐍! এখন মেসেজ করা যাবে।", threadID);
  }

  return api.sendMessage("📌 সঠিক ফরম্যাট: notext on / notext off", threadID);
};

module.exports.handleEvent = async function({ api, event }) {
  const threadID = event.threadID;
  const senderID = event.senderID;

  if (!fs.existsSync(path)) return;
  const data = JSON.parse(fs.readFileSync(path));
  if (!data.includes(threadID)) return;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const isAdmin = threadInfo.adminIDs.some(admin => admin.id === senderID);
    if (isAdmin) return;

    const sentAnything =
      !!event.body ||
      !!event.stickerID ||
      (event.attachments && event.attachments.length > 0);

    if (sentAnything) {
      await api.removeUserFromGroup(senderID, threadID);
    }
  } catch (err) {
    console.log("❌ Remove Error:", err.message);
  }
};

module.exports.events = ["message"];
