module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "RASEL MAHMUD",
	description: "Send message when someone leaves the group (no media)",
};

module.exports.run = async function ({ api, event, Users }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { threadID } = event;
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);

	const msg = `💔 ${name} 𝗹𝗲𝗳𝘁 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽.`;
	return api.sendMessage(msg, threadID);
};
