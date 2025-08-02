module.exports.config = {
  name: "help",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Display all commands grouped in a single-page decorative format",
  commandCategory: "system",
  usages: "[command name]",
  cooldowns: 5
};

module.exports.languages = {
  "en": {
    "moduleInfo":
      "🔹 Command: %1\n📄 Description: %2\n📌 Usage: %3\n📂 Category: %4\n⏱ Cooldown: %5s\n👤 Permission: %6\n💠 Credit: %7",
    "user": "User",
    "adminGroup": "Admin (Group)",
    "adminBot": "Admin (Bot)",
    "notFound": "❌ No command named '%1' was found."
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || !body.toLowerCase().startsWith("help")) return;

  const args = body.trim().split(/\s+/);

  // If only "help" is typed
  if (args.length === 1) {
    module.exports.run({ api, event });
    return;
  }

  const cmd = args[1].toLowerCase();
  if (!commands.has(cmd)) {
    return api.sendMessage(getText("notFound", cmd), threadID, messageID);
  }

  const command = commands.get(cmd);
  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  const perm =
    command.config.hasPermssion === 0
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
};

module.exports.run = async function ({ api, event }) {
  const { commands } = global.client;
  const categories = {};

  // Group commands by category
  for (const [, command] of commands) {
    const category = command.config.commandCategory || "Others";
    if (!categories[category]) categories[category] = [];
    categories[category].push(command.config.name);
  }

  // Sort command names alphabetically in each category
  for (const cat in categories) {
    categories[cat].sort((a, b) => a.localeCompare(b));
  }

  // Category icon mapping
  const catIcons = {
    media: "🎥 MEDIA",
    ai: "🤖 AI",
    fun: "🎮 FUN",
    system: "⚙️ SYSTEM",
    group: "👥 GROUP",
    info: "📌 INFO",
    others: "📁 OTHERS"
  };

  // Build message
  let msg = "╭─────•◈•─────╮\n│ ✨ MAGIC OF SOUND ✨\n╰─────•◈•─────╯\n";
  for (const [cat, cmds] of Object.entries(categories)) {
    const title = catIcons[cat.toLowerCase()] || `📁 ${cat.toUpperCase()}`;
    msg += `\n${title}\n• ${cmds.join(" • ")}\n`;
  }

  msg += `\n╭─────•◈•─────╮\n│ Use: help [command name]\n│ OWNER: Rasel Mahmud\n│ TOTAL: ${commands.size} Commands\n╰─────•◈•─────╯`;

  return api.sendMessage(msg, event.threadID, event.messageID);
};
