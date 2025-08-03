module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "RASEL MAHMUD",
	description: "Notify when someone leaves with a gif/photo/video",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = function () {
	const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];

	const path = join(__dirname, "cache", "leaveGif", "randomgif");
	if (!existsSync(path)) mkdirSync(path, { recursive: true });
};

module.exports.run = async function ({ api, event, Users }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;

	const { createReadStream, existsSync, readdirSync } = global.nodemodule["fs-extra"];
	const { join } = global.nodemodule["path"];
	const { threadID } = event;

	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	let msg = `💔 ${name} 𝗹𝗲𝗳𝘁 𝘁𝗵𝗲 𝗴𝗿𝗼𝘂𝗽.`;

	const randomPath = readdirSync(join(__dirname, "cache", "leaveGif", "randomgif"));
	let formPush;

	if (randomPath.length !== 0) {
		const pathRandom = join(__dirname, "cache", "leaveGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
		formPush = { body: msg, attachment: createReadStream(pathRandom) };
	} else {
		formPush = { body: msg };
	}

	return api.sendMessage(formPush, threadID);
};
