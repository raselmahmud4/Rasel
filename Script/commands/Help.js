module.exports.config = {
  name: "help2",
  version: "1.0.0",
  permission: 0,
  credits: "Rasel Mahmud",
  description: "Get command details or see full command list",
  prefix: true,
  category: "system",
  usages: "[command name]",
  cooldowns: 1,
};

module.exports.run = async ({ api, event, args, commands, getText }) => {
  const axios = require("axios");
  const fs = require("fs-extra");

  const prefix = global.config.PREFIX;
  const { threadID, messageID } = event;
  const threadSetting = global.data.threadData.get(threadID) || {};
  const command = args[0];

  const autoUnsend = true;
  const delayUnsend = 300;

  const commandList = Array.from(commands.keys());

  if (command) {
    const cmd = commands.get(command.toLowerCase());
    if (!cmd) return api.sendMessage(`❌ No command named '${command}' found.`, threadID, messageID);

    return api.sendMessage(
      `「 ${cmd.config.name} 」\n` +
      `${cmd.config.description || "No description available."}\n\n` +
      `❯ Usage: ${cmd.config.usages || "No usage provided"}\n` +
      `❯ Category: ${cmd.config.category || "Uncategorized"}\n` +
      `❯ Waiting time: ${cmd.config.cooldowns || 1} seconds(s)\n` +
      `❯ Permission: ${cmd.config.permission == 0 ? "User" : cmd.config.permission == 1 ? "Admin" : "Adminbot"}\n\n` +
      `» Module code by ${cmd.config.credits || "Unknown"} «`,
      threadID,
      async (err, info) => {
        if (autoUnsend) {
          await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
          return api.unsendMessage(info.messageID);
        }
      }
    );
  }

  let page = parseInt(args[0]) || 1;
  const itemsPerPage = 30;
  const totalPages = Math.ceil(commandList.length / itemsPerPage);

  if (page < 1 || page > totalPages) page = 1;

  const startIdx = (page - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const displayedCommands = commandList.slice(startIdx, endIdx);

  const msg = displayedCommands.map((name, index) => `✰『 ${startIdx + index + 1} 』 ➬${name}`).join("\n");

  api.sendMessage(
    `Page Cmds  💯💯💖𝐌𝐚𝐝𝐞 𝐁𝐲 𝐑𝐚𝐬𝐞𝐥 𝐌𝐚𝐡𝐦𝐮𝐝\n\n${msg}\n\nPage (${page}/${totalPages})`,
    threadID,
    async (err, info) => {
      if (autoUnsend) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    }
  );
};
