module.exports.config = {
  name: "joinNoti",
  eventType: ["log:subscribe"],
  version: "1.0.1",
  credits: "RASEL MAHMUD",
  description: "Notification of bots or people entering groups with random gif/photo/video",
  dependencies: {
    "fs-extra": "",
    "path": "",
    "pidusage": ""
  }
};

module.exports.onLoad = function () {
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { join } = global.nodemodule["path"];
  const path = join(__dirname, "cache", "joinvideo");
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
  const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
  if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
};

module.exports.run = async function ({ api, event }) {
  const { join } = global.nodemodule["path"];
  const { threadID } = event;

  if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
    api.changeNickname(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? " " : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
    const fs = require("fs");

    return api.sendMessage("", event.threadID, () =>
      api.sendMessage({
        body: `╭•┄┅═══❁🌺❁═══┅┄•╮\nআসসালামু আলাইকুম-!!🖤💫\n╰•┄┅═══❁🌺❁═══┅┄•╯

𝐓𝐡𝐚𝐧𝐤 𝐲𝐨𝐮 𝐬𝐨 𝐦𝐮𝐜𝐡 𝐟𝐨𝐫 𝐡𝐚𝐯𝐢𝐧𝐠 𝐦𝐞 𝐢𝐧 𝐲𝐨𝐮𝐫 𝐠𝐫𝐨𝐮𝐩! 🖤🤗

𝐈'𝐥𝐥 𝐝𝐨 𝐦𝐲 𝐛𝐞𝐬𝐭 𝐭𝐨 𝐬𝐞𝐫𝐯𝐞 𝐲𝐨𝐮, 𝐈𝐧 𝐒𝐡𝐚 𝐀𝐥𝐥𝐚𝐡. 🌺❤️

📌 𝐓𝐨 𝐯𝐢𝐞𝐰 𝐚𝐧𝐲 𝐜𝐨𝐦𝐦𝐚𝐧𝐝: ${global.config.PREFIX}help | ${global.config.PREFIX}menu

𝐁𝐎𝐓 𝐍𝐀𝐌𝐄: ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾`,
        attachment: fs.createReadStream(__dirname + "/cache/ullash.mp4")
      }, threadID));
  } else {
    try {
      const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
      let { threadName, participantIDs } = await api.getThreadInfo(threadID);
      const threadData = global.data.threadData.get(parseInt(threadID)) || {};
      const path = join(__dirname, "cache", "joinvideo");
      const pathGif = join(path, `${threadID}.video`);

      var mentions = [], nameArray = [], memLength = [], i = 0;
      for (let id in event.logMessageData.addedParticipants) {
        const userName = event.logMessageData.addedParticipants[id].fullName;
        nameArray.push(userName);
        mentions.push({ tag: userName, id: event.logMessageData.addedParticipants[id].userFbId });
        memLength.push(participantIDs.length - i++);
      }

      memLength.sort((a, b) => a - b);

      let msg = threadData.customJoin || `✨🥰━━━━━━━━━━━━━━🥰✨
𝗪𝗘𝗟𝗖𝗢𝗠𝗘 ✨ {name} ✨ 𝗧𝗢 💖 {threadName} 💖
━━━━━━━━━━━━━━━━━━
🌸 আপনি আমাদের গ্রুপের ✨ {soThanhVien} ✨ নং সদস্য!
🥰 আশাকরি আপনি আমাদের সঙ্গে সুন্দর সময় কাটাবেন।
𝗛𝗮𝘃𝗲 𝗮 𝗻𝗶𝗰𝗲 𝘁𝗶𝗺𝗲 𝗵𝗲𝗿𝗲! 💬
✨━━━━━━━━━━━━━━✨
~ 𝐁𝐘: ༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾`;

      msg = msg
        .replace(/{name}/g, nameArray.join(', '))
        .replace(/{type}/g, (memLength.length > 1) ? 'Friends' : 'Friend')
        .replace(/{soThanhVien}/g, memLength.join(', '))
        .replace(/{threadName}/g, threadName);

      if (!existsSync(path)) mkdirSync(path, { recursive: true });

      const randomPath = readdirSync(join(__dirname, "cache", "joinvideo", "randomgif"));
      let formPush;
      if (existsSync(pathGif)) {
        formPush = { body: msg, attachment: createReadStream(pathGif), mentions };
      } else if (randomPath.length != 0) {
        const pathRandom = join(__dirname, "cache", "joinvideo", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
        formPush = { body: msg, attachment: createReadStream(pathRandom), mentions };
      } else {
        formPush = { body: msg, mentions };
      }

      return api.sendMessage(formPush, threadID);
    } catch (e) {
      console.log(e);
    }
  }
};
