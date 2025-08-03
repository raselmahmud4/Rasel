module.exports.config = {
  name: "antiout",
  eventType: ["log:unsubscribe"],
  version: "1.0.0",
  credits: "CYBER ☢️ TEAM",
  description: "Auto re-add if member leaves."
};

module.exports.run = async ({ event, api, Threads, Users }) => {
  let data = (await Threads.getData(event.threadID)).data || {};
  if (data.antiout === false) return;

  const leftID = event.logMessageData.leftParticipantFbId;
  if (leftID === api.getCurrentUserID()) return;

  const isSelfLeave = event.author === leftID;

  if (isSelfLeave) {
    api.addUserToGroup(leftID, event.threadID, (err) => {
      if (err) {
        return api.sendMessage(
          `⚠️ 𝗔𝗻𝘁𝗶𝗼𝘂𝘁 𝗙𝗮𝗶𝗹 ❌`,
          event.threadID
        );
      }

      return api.sendMessage(
        `☕︎ 𝗔𝗻𝘁𝗶𝗼𝘂𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 ✅\n♲︎︎︎ 𝗥𝗲-𝗮𝗱𝗱𝗲𝗱 ✔︎`,
        event.threadID
      );
    });
  }
};
