module.exports.config = {
  name: "all",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Mention all group members with styled text",
  commandCategory: "group",
  usages: "[message]",
  cooldowns: 5,
  prefix: true
};

module.exports.run = async ({ api, event, args }) => {
  if (!event.isGroup) {
    return api.sendMessage("⛔ এই কমান্ডটি শুধু গ্রুপে ব্যবহার করা যাবে।", event.threadID, event.messageID);
  }

  const threadInfo = await api.getThreadInfo(event.threadID);
  const members = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());
  const totalMembers = members.length;

  // ইউজারের ইনপুট
  const inputMessage = args.join(" ");

  let finalMessage = "";
  let mentions = [];

  // যদি কিছু না লিখে শুধু all দেয়
  if (inputMessage.length === 0) {
    // all শব্দটাই নিয়ে শেষ অক্ষর বাড়িয়ে দিবে
    const base = "all";
    const repeatCount = Math.max(totalMembers - 3, 0);
    finalMessage = base + "l".repeat(repeatCount);

    for (let i = 0; i < totalMembers; i++) {
      const index = i < finalMessage.length ? i : finalMessage.length - 1;
      mentions.push({
        tag: finalMessage[index],
        id: members[i],
        fromIndex: index
      });
    }

    return api.sendMessage({ body: finalMessage, mentions }, event.threadID, event.messageID);
  }

  // যদি কিছু লেখা থাকে all এর পরে
  let letters = inputMessage.split(""); // স্পেসসহ প্রতিটি অক্ষর

  // যদি অক্ষর কম হয় মেম্বারের চেয়ে
  while (letters.length < totalMembers) {
    letters.push(letters[letters.length - 1]); // শেষ অক্ষর রিপিট
  }

  finalMessage = letters.join("");

  let currentIndex = 0;
  for (let i = 0; i < totalMembers; i++) {
    const mentionChar = letters[i];
    const mentionPos = finalMessage.indexOf(mentionChar, currentIndex);
    mentions.push({
      tag: mentionChar,
      id: members[i],
      fromIndex: mentionPos
    });
    currentIndex = mentionPos + 1;
  }

  return api.sendMessage({ body: finalMessage, mentions }, event.threadID, event.messageID);
};
