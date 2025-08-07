module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Check bot prefix",
  commandCategory: "system",
  usages: "[prefix]",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args, Threads }) {
  const threadID = event.threadID;
  const data = await Threads.getData(threadID);
  const prefix = global.config.PREFIX;

  if (data.PREFIX == null) {
    return api.sendMessage(
      `🌐 System prefix: ${prefix}\n🛸 Your box chat prefix: ${prefix}`,
      threadID
    );
  } else {
    return api.sendMessage(
      `🌐 System prefix: ${prefix}\n🛸 Your box chat prefix: ${data.PREFIX}`,
      threadID
    );
  }
};
