module.exports.config = {
  name: "help",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Modified by Rasel Mahmud",
  description: "Show all commands with category",
  commandCategory: "system",
  usages: "[name/all/page]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  const fs = require("fs-extra");
  const request = require("request");
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const prefix = global.config.PREFIX;

  if (args[0] && args[0].toLowerCase() == "all") {
    const commandGroups = {};

    for (const [, cmd] of commands) {
      const cat = cmd.config.commandCategory || "Other";
      if (!commandGroups[cat]) commandGroups[cat] = [];
      commandGroups[cat].push(cmd.config.name);
    }

    let msg = "╭──────•◈•──────╮\n";
    msg += " | ✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨\n";
    msg += " |  🄲🄾🄼🄼🄰🄽🄳 🄻🄸🅂🅃\n";
    msg += "╰──────•◈•──────╯\n\n";

    for (const group in commandGroups) {
      msg += `◉━━━━「${group.toUpperCase()}」━━━━◉\n`;
      msg += "◍" + commandGroups[group].join(" ◍") + "\n\n";
    }

    msg += `╭──────•◈•──────╮\n│𝗨𝘀𝗲 ${prefix}help [name]\n│𝗡𝗔𝗠𝗘 𝗢𝗪𝗡𝗘𝗥 │𝐑𝐀𝐒𝐄𝐋\n│𝗧𝗢𝗧𝗔𝗟 : [${commands.size}]\n╰──────•◈•──────╯`;

    return api.sendMessage(msg, threadID, messageID);
  }

  if (args[0] && commands.has(args[0].toLowerCase())) {
    const cmd = commands.get(args[0].toLowerCase());
    const perm = cmd.config.hasPermssion == 0 ? "User" : cmd.config.hasPermssion == 1 ? "Admin Group" : "Admin Bot";
    const usage = cmd.config.usages || "No usage info.";
    const desc = cmd.config.description || "No description.";
    const cat = cmd.config.commandCategory || "Other";
    const time = cmd.config.cooldowns || 1;

    const detail = `╭──────•◈•──────╮\n` +
      `│𝗡𝗮𝗺𝗲: ${cmd.config.name}\n` +
      `│𝗨𝘀𝗮𝗴𝗲: ${prefix}${cmd.config.name} ${usage}\n` +
      `│𝗗𝗲𝘀𝗰: ${desc}\n` +
      `│𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${cat}\n` +
      `│𝗧𝗶𝗺𝗲: ${time}s\n` +
      `│𝗣𝗲𝗿𝗺: ${perm}\n` +
      `╰──────•◈•──────╯`;

    return api.sendMessage(detail, threadID, messageID);
  }

  const allCmds = Array.from(commands.keys());
  const perPage = 15;
  const page = parseInt(args[0]) || 1;
  const totalPage = Math.ceil(allCmds.length / perPage);
  const start = (page - 1) * perPage;
  const sliced = allCmds.slice(start, start + perPage);
  let list = "";

  for (const cmd of sliced) list += `•—» [ ${cmd} ] «—•\n`;

  const text = `╭──────•◈•──────╮\n│𝗨𝘀𝗲 ${prefix}help [Name?]\n│𝗣𝗔𝗚𝗘: [${page}/${totalPage}]\n│𝗧𝗢𝗧𝗔𝗟 : ${commands.size}\n╰──────•◈•──────╯`;

  return api.sendMessage(list + "\n" + text, threadID, messageID);
};
