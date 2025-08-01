const fs = require("fs-extra");
const path = require("path");

const approvedPath = path.join(__dirname, "..", "..", "cache", "duy", "approved.json");
const pendingPath = path.join(__dirname, "..", "..", "cache", "duy", "pending.json");

if (!fs.existsSync(path.dirname(approvedPath))) fs.mkdirSync(path.dirname(approvedPath), { recursive: true });
if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([]));
if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));

let approved = JSON.parse(fs.readFileSync(approvedPath));
let pending = JSON.parse(fs.readFileSync(pendingPath));

module.exports.config = {
  name: "duyet",
  version: "1.0.0",
  permission: 2,
  credits: "Rasel Mahmud",
  description: "পেন্ডিং গ্রুপ রিভিউ করে reply এর মাধ্যমে approve/remove করুন",
  commandCategory: "system",
  usages: "[duyet] → সব পেন্ডিং গ্রুপ দেখাবে\n[reply 0] → অ্যাপ্রুভ করবে\n[reply 0 cancel] → বাতিল করবে",
  cooldowns: 5,
  botNickname: "🤖 Magic of Sound"
};

module.exports.handleReply = async function({ handleReply, api, event }) {
  const { threadID, messageID, body } = event;
  const index = parseInt(body.split(" ")[0]);
  const cancel = body.toLowerCase().includes("cancel");
  const target = handleReply.list[index];

  if (!target) return api.sendMessage("❌ সঠিক নাম্বার দিন।", threadID, messageID);

  if (cancel) {
    pending = pending.filter(id => id !== target.threadID);
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
    return api.sendMessage(`❌ '${target.name}' গ্রুপটি বাতিল করা হয়েছে।`, threadID, messageID);
  } else {
    approved.push(target.threadID);
    pending = pending.filter(id => id !== target.threadID);
    fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

    // ✅ অ্যাপ্রুভড গ্রুপে অটো মেসেজ
    await api.sendMessage(
      "🎉 Congratulations! This group is now approved.\n🔓 All bot features are now unlocked for this group.",
      target.threadID
    );

    // ✅ বটের নাম অটো সেট
    await api.changeNickname(module.exports.config.botNickname, target.threadID, api.getCurrentUserID());

    return api.sendMessage(`✅ '${target.name}' গ্রুপটি এখন অ্যাপ্রুভড।`, threadID, messageID);
  }
};

module.exports.handleEvent = async function({ event, api }) {
  const { threadID, body } = event;

  // Approve কমান্ড ধরে অ্যাপ্রুভ করে দাও (শুধু পেন্ডিং এ থাকলে)
  if (body?.toLowerCase().trim() === "approve" && pending.includes(threadID)) {
    approved.push(threadID);
    pending = pending.filter(id => id !== threadID);
    fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));

    await api.sendMessage(
      "🎉 Congratulations! This group is now approved.\n🔓 All bot features are now unlocked for this group.",
      threadID
    );

    await api.changeNickname(module.exports.config.botNickname, threadID, api.getCurrentUserID());

    return;
  }

  // নতুন গ্রুপ হলে pending list এ ঢোকাও
  if (!approved.includes(threadID) && !pending.includes(threadID)) {
    pending.push(threadID);
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
    api.sendMessage(
      "⏳ এই গ্রুপটি পেন্ডিং তালিকায় যোগ হয়েছে।\n" +
      "অনুগ্রহ করে অনুমোদনের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন।\n\n" +
      "🤖 Bot Name: " + module.exports.config.botNickname + "\n" +
      "👤 Moderator: Rasel Mahmud",
      threadID
    );
  }
};

module.exports.run = async function({ api, event }) {
  const { threadID, messageID } = event;

  if (pending.length === 0)
    return api.sendMessage("⚠️ কোনো পেন্ডিং গ্রুপ নেই।", threadID, messageID);

  let msg = "📥 পেন্ডিং গ্রুপ তালিকা:\n";
  const list = [];

  for (let i = 0; i < pending.length; i++) {
    try {
      const info = await api.getThreadInfo(pending[i]);
      const name = info.threadName || "No Name";
      list.push({ threadID: pending[i], name });
      msg += `${i}. ${name} (${pending[i]})\n`;
    } catch {
      msg += `${i}. Unknown (${pending[i]})\n`;
    }
  }

  msg += "\n👉 Reply করে নাম্বার লিখে অ্যাপ্রুভ করুন\n👉 নাম্বার + cancel লিখে বাতিল করুন";

  return api.sendMessage(msg, threadID, (err, info) => {
    global.client.handleReply.push({
      name: module.exports.config.name,
      messageID: info.messageID,
      list
    });
  });
};
