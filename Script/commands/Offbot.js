module.exports.config = {
    name: "offbot",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Rasel Mahmud",
    description: "Turn the bot off",
    commandCategory: "System",
    cooldowns: 0
};

module.exports.run = ({ event, api }) => {
    // শুধু এই দুটি UID ব্যবহার করতে পারবে
    const permission = ["61571550050635", "100024220812646"];
    
    if (!permission.includes(event.senderID)) {
        return api.sendMessage(
            `[❌] You do not have permission to use this command.\nOnly authorized users can turn off the bot.\n\n🔐 Contact: \n• https://www.facebook.com/raselmahmud.q\n• https://www.facebook.com/iiii.482394`,
            event.threadID,
            event.messageID
        );
    }

    api.sendMessage(
        `[✔️] ${global.config.BOTNAME || "༊✨𝐌𝐀𝐆𝐈𝐂🔹𝐎𝐅🔸𝐒𝐎𝐔𝐍𝐃✨᯾"} bot is now shutting down...`,
        event.threadID,
        () => process.exit(0)
    );
};
