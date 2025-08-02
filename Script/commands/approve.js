module.exports.config = {
  name: "approve",
  version: "1.0.3",
  hasPermssion: 2,
  credits: "Rasel Mahmud (Enhanced)",
  description: "Approve groups for bot access with style",
  commandCategory: "Admin",
  cooldowns: 5,
};

const fs = require("fs");
const axios = require("axios");
const request = require("request");

const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";

module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
  if (handleReply.author != event.senderID) return;
  const { body, threadID, messageID } = event;
  const { type } = handleReply;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = args[0] || threadID;

  switch (type) {
    case "pending": {
      if (body.toUpperCase() === "A") {
        if (!data.includes(idBox)) data.push(idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        api.sendMessage(`✅ গ্রুপটি সফলভাবে অনুমোদিত হয়েছে:\n${idBox}`, threadID, () => {
          dataP.splice(dataP.indexOf(idBox), 1);
          fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
        }, messageID);
      }
      break;
    }
  }
};

module.exports.run = async function ({ event, api, args, Threads, Users }) {
  const { threadID, messageID } = event;
  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = args[1] || threadID;
  let reason = args.slice(2).join(" ");

  switch (args[0]) {
    case "list":
    case "l": {
      let msg = `=====「 ✅ অনুমোদিত গ্রুপসমূহ: ${data.length} 」=====\n`;
      let count = 0;
      for (const e of data) {
        let info = await api.getThreadInfo(e);
        msg += `\n〘${++count}〙» ${info.threadName || await Users.getNameUser(e)}\n${e}`;
      }
      return api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "a",
        });
      }, messageID);
    }

    case "pending":
    case "p": {
      let msg = `=====「 ⏳ অনুমোদনের অপেক্ষায় গ্রুপ: ${dataP.length} 」=====\n`;
      let count = 0;
      for (const e of dataP) {
        let info = await api.getThreadInfo(e);
        msg += `\n〘${++count}〙» ${info.threadName || await Users.getNameUser(e)}\n${e}`;
      }
      return api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          type: "pending",
        });
      }, messageID);
    }

    case "del":
    case "d": {
      if (!data.includes(idBox)) return api.sendMessage("❌ এই গ্রুপ অনুমোদিত তালিকায় নেই!", threadID, messageID);
      api.sendMessage(`⚠️ এই গ্রুপটি অনুমোদিত তালিকা থেকে সরানো হয়েছে:\n${idBox}\nকারণ: ${reason || "নির্ধারিত নয়"}`, threadID);
      api.sendMessage(`🗑️ আপনার গ্রুপটি এখন আর অনুমোদিত নয়।`, idBox);
      data.splice(data.indexOf(idBox), 1);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      return;
    }

    case "help":
    case "h": {
      const prefix = global.config.PREFIX;
      return api.sendMessage(
        `🛠️ [ Approve Module Help ] 🛠️

${prefix}approve l / list
→ অনুমোদিত গ্রুপের তালিকা দেখুন

${prefix}approve p / pending
→ অনুমোদনের অপেক্ষায় থাকা গ্রুপ দেখুন

${prefix}approve d / del [ID] [কারণ]
→ গ্রুপ আইডি দিয়ে বাতিল করুন

${prefix}approve [ID]
→ গ্রুপ অনুমোদন দিন

👤 মডিউল নির্মাতা: Rasel Mahmud`,
        threadID,
        messageID
      );
    }

    default: {
      if (isNaN(parseInt(idBox))) return api.sendMessage("❌ সঠিক গ্রুপ ID দিন।", threadID, messageID);
      if (data.includes(idBox)) return api.sendMessage(`✅ এই গ্রুপটি আগেই অনুমোদিত:\n${idBox}`, threadID, messageID);

      // Approve Group
      data.push(idBox);
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      dataP.splice(dataP.indexOf(idBox), 1);
      fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));

      // Change Nickname
      api.changeNickname(
        `『 ${global.config.PREFIX} 』⇝ ${global.config.BOTNAME || "BOT"}`,
        idBox,
        global.data.botID
      );

      // Fetch Owner Name for message
      const ownerID = "100024220812646"; // Rasel Mahmud
      api.getUserInfo(ownerID, async (err, info) => {
        const name = info?.[ownerID]?.name || "Admin";

        axios.get("https://anime.apibypriyansh.repl.co/img/anime").then(res => {
          const ext = res.data.url.split(".").pop();
          const filePath = `${__dirname}/cache/approved.${ext}`;
          const callback = () => {
            api.sendMessage({
              body:
`✅ আপনার গ্রুপটি সফলভাবে অনুমোদিত হয়েছে!

🌟 Bot Connected:
➤ BOT: ${global.config.BOTNAME}
➤ Prefix: ${global.config.PREFIX}
➤ Groups: ${global.data.allThreadID.length}
➤ Users: ${global.data.allUserID.length}

👤 Owner: ${name}
🌐 fb.com/raselmahmud.q

📜 ${global.config.PREFIX}help দিয়ে কমান্ড লিস্ট দেখুন`,
              attachment: fs.createReadStream(filePath),
            }, idBox, () => fs.unlinkSync(filePath));
          };

          request(res.data.url).pipe(fs.createWriteStream(filePath)).on("close", callback);
        });
      });
    }
  }
};
