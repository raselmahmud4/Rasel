module.exports.config = {
  name: "info",
  version: "1.2.7",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "🥰আসসালামু আলাইকুম 🥰",
  commandCategory: "For users",
  usages: "",
  cooldowns: 5,
  aliases: ["botinfo", "bot info", "magicinfo"]
};

module.exports.run = async function ({ api, event, args, Users, permssion, getText, Threads }) {
  const { threadID } = event;
  const { configPath } = global.client;
  const { ADMINBOT, NDH } = global.config;
  const { allUserID, allThreadID } = global.data;
  const request = global.nodemodule["request"];
  const fs = global.nodemodule["fs-extra"];
  const moment = require("moment-timezone");

  delete require.cache[require.resolve(configPath)];
  var config = require(configPath);

  const listAdmin = ADMINBOT || config.ADMINBOT || [];
  const listNDH = NDH || config.NDH || [];
  const PREFIX = config.PREFIX;
  const namebot = "༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾";
  const { commands } = global.client;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : PREFIX;
  const dateNow = Date.now();
  const time = process.uptime(),
    hours = Math.floor(time / (60 * 60)),
    minutes = Math.floor((time % (60 * 60)) / 60),
    seconds = Math.floor(time % 60);

  var link = [
    "https://i.imgur.com/kp7kn4T.jpeg"
  ];
  var i = 1;
  var msg = [];
  for (const idAdmin of listAdmin) {
    if (parseInt(idAdmin)) {
      const name = await Users.getNameUser(idAdmin);
      msg.push(`${i++}/ ${name} - ${idAdmin}`);
    }
  }

  var msg1 = [];
  for (const idNDH of listNDH) {
    if (parseInt(idNDH)) {
      const name1 = (await Users.getData(idNDH)).name;
      msg1.push(`${i++}/ ${name1} - ${idNDH}`);
    }
  }

  const totalUsers = allUserID.length;
  const totalGroups = allThreadID.length;

  const body = `
╭───🔹 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 🔹───╮
┃ 🤖 Bot Name       : ${namebot}
┃ 👑 Owner          : RASEL MAHMUD
┃ 🔗 Group Support  : https://m.me/j/AbZnvggXXnMoLZd7/
┃ ✨ Prefix          : ${prefix}
┃ 📦 Modules        : ${commands.size}
┃ ⚡ Ping            : ${Date.now() - dateNow}ms
┃ ⏱ Uptime          : ${hours}h ${minutes}m ${seconds}s
┃ 👥 Total Users     : ${totalUsers}
┃ 💬 Total Groups    : ${totalGroups}
╰───────────────╯
`;

  var callback = () =>
    api.sendMessage({
      body: body,
      attachment: fs.createReadStream(__dirname + "/cache/kensu.jpg")
    }, threadID, () => fs.unlinkSync(__dirname + "/cache/kensu.jpg"));

  return request(encodeURI(link[0]))
    .pipe(fs.createWriteStream(__dirname + "/cache/kensu.jpg"))
    .on("close", () => callback());
};
