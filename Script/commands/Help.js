module.exports.config = {
  name: "help",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Paginated help command with rich formatting",
  commandCategory: "system",
  usages: "[command name | page number]",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    "moduleInfo": "🔹 Command: %1\n📄 Description: %2\n📌 Usage: %3\n📂 Category: %4\n⏱ Cooldown: %5s\n👤 Permission: %6\n💠 Credit: %7",
    "user": "User",
    "adminGroup": "Admin (Group)",
    "adminBot": "Admin (Bot)",
    "notFound": "❌ No command named '%1' was found.",
    "pageNotFound": "❌ No help page numbered %1 found."
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || !body.toLowerCase().startsWith("help")) return;

  const args = body.trim().split(/\s+/);
  if (args.length === 1) return module.exports.run({ api, event });

  const query = args[1].toLowerCase();
  const command = commands.get(query);

  if (command) {
    const threadSetting = global.data.threadData.get(threadID) || {};
    const prefix = threadSetting.PREFIX || global.config.PREFIX;
    const perm = command.config.hasPermssion === 0
      ? getText("user")
      : command.config.hasPermssion === 1
      ? getText("adminGroup")
      : getText("adminBot");

    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name}${command.config.usages ? " " + command.config.usages : ""}`,
        command.config.commandCategory || "Uncategorized",
        command.config.cooldowns || 5,
        perm,
        command.config.credits || "Unknown"
      ),
      threadID,
      messageID
    );
  } else if (!isNaN(query)) {
    return module.exports.run({ api, event, args });
  } else {
    return api.sendMessage(getText("notFound", query), threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const categories = {};
  const catIcons = {
    media: "🎥 MEDIA",
    ai: "🤖 AI",
    fun: "🎮 FUN",
    system: "⚙️ SYSTEM",
    group: "👥 GROUP",
    info: "📌 INFO",
    tools: "🛠 TOOLS",
    user: "👤 USER",
    others: "📁 OTHERS"
  };

  for (const [, command] of commands) {
    const category = command.config.commandCategory?.toLowerCase() || "others";
    if (!categories[category]) categories[category] = [];
    categories[category].push(command.config.name);
  }

  const sortedCategories = Object.entries(categories)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([name, cmds]) => ({
      name,
      icon: catIcons[name] || `📁 ${name.toUpperCase()}`,
      commands: cmds.sort((a, b) => a.localeCompare(b))
    }));

  const pageSize = 5;
  const page = args?.[0] ? parseInt(args[0]) : 1;
  const totalPages = Math.ceil(sortedCategories.length / pageSize);

  if (page > totalPages || page < 1) {
    return api.sendMessage(global.getText("help", "pageNotFound", page), event.threadID, event.messageID);
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageCategories = sortedCategories.slice(start, end);

  let msg = `╭━〔✨ 𝗠𝗔𝗚𝗜𝗖 𝗢𝗙 𝗦𝗢𝗨𝗡𝗗 ✨〕━╮\n│  📄 Help Page ${page}/${totalPages}\n╰━━━━━━━━━━━━━━━━╯`;

  for (const cat of pageCategories) {
    msg += `\n\n${cat.icon}\n• ${cat.commands.join(" • ")}`;
  }

  msg += `\n\nℹ️ কমান্ড বিস্তারিত জানতে: help [কমান্ডের_নাম]\n📖 অন্য পেজ দেখতে: help [page number]`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
