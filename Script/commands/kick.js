module.exports.config = {
	name: "kick",
	version: "1.0.1", 
	hasPermssion: 1,
	credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️",
	description: "the person you need to remove from the group by tag or reply",
	commandCategory: "System", 
	usages: "[tag or reply]", 
	cooldowns: 0,
};

module.exports.languages = {
	"vi": {
		"error": "Đã có lỗi xảy ra, vui lòng thử lại sau",
		"needPermssion": "Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!",
		"missingTag": "Bạn phải tag người cần kick",
		"onlyAdmin": "Chỉ quản trị viên nhóm mới có thể sử dụng lệnh \"kick\""
	},
	"en": {
		"error": "Error! An error occurred. Please try again later!",
		"needPermssion": "Need group admin\nPlease add and try again!",
		"missingTag": "You need to tag someone or reply to kick",
		"onlyAdmin": "❌ | Only group administrators can use the command \"kick\""
	}
};

module.exports.run = async function({ api, event, getText, Threads }) {
	try {
		const { threadID, messageID, mentions, senderID, messageReply } = event;
		const mentionIDs = Object.keys(mentions);
		const dataThread = (await Threads.getData(threadID)).threadInfo;

		// Check if bot is admin
		if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID()))
			return api.sendMessage(getText("needPermssion"), threadID, messageID);

		// Check if sender is admin
		if (!dataThread.adminIDs.some(item => item.id == senderID))
			return api.sendMessage(getText("onlyAdmin"), threadID, messageID);

		// Kick by tag
		if (mentionIDs.length > 0) {
			for (const id of mentionIDs) {
				setTimeout(() => api.removeUserFromGroup(id, threadID), 3000);
			}
			return;
		}

		// Kick by reply
		if (messageReply && messageReply.senderID) {
			setTimeout(() => api.removeUserFromGroup(messageReply.senderID, threadID), 3000);
			return;
		}

		// If no mention or reply
		return api.sendMessage(getText("missingTag"), threadID, messageID);

	} catch (e) {
		console.error(e);
		return api.sendMessage(getText("error"), threadID, messageID);
	}
};
