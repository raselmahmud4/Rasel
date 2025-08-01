const fs = require("fs-extra"); const path = require("path");

const approvedPath = path.join(__dirname, "..", "..", "cache", "duy", "approved.json"); const pendingPath = path.join(__dirname, "..", "..", "cache", "duy", "pending.json");

if (!fs.existsSync(path.dirname(approvedPath))) fs.mkdirSync(path.dirname(approvedPath), { recursive: true }); if (!fs.existsSync(approvedPath)) fs.writeFileSync(approvedPath, JSON.stringify([])); if (!fs.existsSync(pendingPath)) fs.writeFileSync(pendingPath, JSON.stringify([]));

let approved = JSON.parse(fs.readFileSync(approvedPath)); let pending = JSON.parse(fs.readFileSync(pendingPath));

module.exports.config = { name: "duyet", version: "1.1.0", permission: 2, credits: "Rasel Mahmud + ChatGPT", description: "পেন্ডিং গ্রুপ রিভিউ করে reply বা approve কমান্ডের মাধ্যমে approve/remove করুন", commandCategory: "system", usages: "[duyet] → পেন্ডিং গ্রুপ লিস্ট দেখুন\n[reply 0] → অ্যাপ্রুভ করুন\n[reply 0 cancel] → বাতিল করুন", cooldowns: 5 };

module.exports.handleReply = async function ({ handleReply, api, event }) { const { threadID, messageID, body } = event; const index = parseInt(body.split(" ")[0]); const cancel = body.toLowerCase().includes("cancel"); const target = handleReply.list[index];

if (!target) return api.sendMessage("❌ সঠিক নাম্বার দিন।", threadID, messageID);

if (cancel) { pending = pending.filter(id => id !== target.threadID); fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2)); return api.sendMessage(❌ '${target.name}' গ্রুপটি বাতিল করা হয়েছে।, threadID, messageID); } else { approved.push(target.threadID); pending = pending.filter(id => id !== target.threadID); fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2)); fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2)); api.setTitle(global.config.BOTNAME || "Approved Bot", target.threadID); return api.sendMessage( "🎉 Congratulations! This group is now approved.\n🔓 All bot features are now unlocked for this group.", target.threadID ); } };

module.exports.handleEvent = async function ({ event, api }) { const { threadID, body, logMessageType, logMessageData } = event;

// যদি নতুন গ্রুপে অ্যাড হয় if (logMessageType === "log:subscribe" && logMessageData.addedParticipants.some(p => p.userFbId == api.getCurrentUserID())) { const authorID = event.author; const friends = await api.getFriendsList(); const isFriend = friends.some(f => f.userID == authorID);

if (isFriend) {
  if (!approved.includes(threadID)) {
    approved.push(threadID);
    fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2));
  }
} else {
  if (!pending.includes(threadID)) {
    pending.push(threadID);
    fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2));
  }
}
return;

}

// যদি গ্রুপেই approve <group name> লেখা হয় if (body && body.toLowerCase().startsWith("approve")) { const inputName = body.slice(7).trim().toLowerCase(); for (let id of pending) { try { const info = await api.getThreadInfo(id); const name = info.threadName?.toLowerCase() || ""; if (name === inputName) { if (!approved.includes(id)) approved.push(id); pending = pending.filter(x => x !== id); fs.writeFileSync(approvedPath, JSON.stringify(approved, null, 2)); fs.writeFileSync(pendingPath, JSON.stringify(pending, null, 2)); api.setTitle(global.config.BOTNAME || "Approved Bot", id); return api.sendMessage( "🎉 Congratulations! This group is now approved.\n🔓 All bot features are now unlocked for this group.", id ); } } catch {} } } };

module.exports.run = async function ({ api, event }) { const { threadID, messageID } = event;

if (pending.length === 0) return api.sendMessage("⚠️ কোনো পেন্ডিং গ্রুপ নেই।", threadID, messageID);

let msg = "📥 পেন্ডিং গ্রুপ তালিকা:\n"; const list = [];

for (let i = 0; i < pending.length; i++) { try { const info = await api.getThreadInfo(pending[i]); const name = info.threadName || "No Name"; list.push({ threadID: pending[i], name }); msg += ${i}. ${name} (${pending[i]})\n; } catch { msg += ${i}. Unknown (${pending[i]})\n; } }

msg += "\n👉 Reply করে নাম্বার লিখে অ্যাপ্রুভ করুন\n👉 নাম্বার + cancel লিখে বাতিল করুন";

return api.sendMessage(msg, threadID, (err, info) => { global.client.handleReply.push({ name: module.exports.config.name, messageID: info.messageID, list }); }); };

