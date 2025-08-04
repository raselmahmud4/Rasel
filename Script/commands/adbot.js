*install ckbot2.js module.exports.config = {

    name: "ckbot",

    version: "1.0.0",

    hasPermssion: 0,

    credits: "RASEL MAHMUD",

    description: "DESCRIPTION ABOUT BOT",

    commandCategory: "Media",

    usages: "",

    cooldowns: 4,

    dependencies: {

        "request": "",

        "fs": ""

    }

};


module.exports.run = async({ api, event, args }) => {

    const fs = global.nodemodule["fs-extra"];

    const request = global.nodemodule["request"];

    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};

    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;


    if (args.length == 0) return api.sendMessage(

        `You can use:\n\n${prefix}${this.config.name} user => it will take your own information.\n\n${prefix}${this.config.name} user @[Tag] => it will get friend information tag.\n\n${prefix}${this.config.name} box => it will get your box information (number of members, djt each other,...)\n\n${prefix}${this.config.name} user box [uid || tid.:\n\n${prefix}${this.config.name} admin => Admin Bot's Personal Information]`,

        event.threadID, event.messageID

    );


    if (args[0] == "box") {

        if (args[1]) {

            let threadInfo = await api.getThreadInfo(args[1]);

            let imgg = threadInfo.imageSrc;

            var gendernam = [];

            var gendernu = [];


            for (let z in threadInfo.userInfo) {

                var gioitinhone = threadInfo.userInfo[z].gender;

                if (gioitinhone == "MALE") {

                    gendernam.push(gioitinhone);

                } else {

                    gendernu.push(gioitinhone);

                }

            }


            var nam = gendernam.length;

            var nu = gendernu.length;

            let sex = threadInfo.approvalMode;

            var pd = sex == false ? "Turn off" : sex == true ? "Turn on" : "NS";


            if (!imgg) {

                api.sendMessage(

                    `Group name: ${threadInfo.threadName}\nTID: ${args[1]}\nApproved: ${pd}\nEmoji: ${threadInfo.emoji}\nInformation: \n»${threadInfo.participantIDs.length} members and ${threadInfo.adminIDs.length} administrators.\n»Including ${nam} boy and ${nu} female.\n»Total number of messages: ${threadInfo.messageCount}.`,

                    event.threadID, event.messageID

                );

            } else {

                var callback = () => api.sendMessage({

                    body: `Group name: ${threadInfo.threadName}\nTID: ${args[1]}\nApproved: ${pd}\nEmoji: ${threadInfo.emoji}\nInformation: \n»${threadInfo.participantIDs.length} members and ${threadInfo.adminIDs.length} administrators.\n»Including ${nam} boy and ${nu} female.\n»Total number of messages: ${threadInfo.messageCount}.`,

                    attachment: fs.createReadStream(__dirname + "/cache/1.png")

                }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);


                return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

            }

        }


        let threadInfo = await api.getThreadInfo(event.threadID);

        let img = threadInfo.imageSrc;

        var gendernam = [];

        var gendernu = [];


        for (let z in threadInfo.userInfo) {

            var gioitinhone = threadInfo.userInfo[z].gender;

            if (gioitinhone == "MALE") {

                gendernam.push(gioitinhone);

            } else {

                gendernu.push(gioitinhone);

            }

        }


        var nam = gendernam.length;

        var nu = gendernu.length;

        let sex = threadInfo.approvalMode;

        var pd = sex == false ? "Turn off" : sex == true ? "Turn on" : "NS";


        if (!img) {

            api.sendMessage(

                `Group name: ${threadInfo.threadName}\nTID: ${event.threadID}\nApproved: ${pd}\nEmoji: ${threadInfo.emoji}\nInformation: \n»${threadInfo.participantIDs.length} members and ${threadInfo.adminIDs.length} administrators.\n»Including ${nam} boy and ${nu} female.\n»Total number of messages: ${threadInfo.messageCount}.`,

                event.threadID, event.messageID

            );

        } else {

            var callback = () => api.sendMessage({

                body: `Group name: ${threadInfo.threadName}\nTID: ${event.threadID}\nBrowser: ${pd}\nEmoji: ${threadInfo.emoji}\nInformation: \n»${threadInfo.participantIDs.length} members and ${threadInfo.adminIDs.length} administrators.\n»Including ${nam} boy and ${nu} female.\n»Total number of messages: ${threadInfo.messageCount}.`,

                attachment: fs.createReadStream(__dirname + "/cache/1.png")

            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);


            return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

        }

    }


    if (args[0] == "admin") {

        var callback = () => api.sendMessage({

            body: `———»ADMIN BOT«———\n❯ Name: 𝐑𝐚𝐬𝐞𝐥 𝐌𝐚𝐡𝐦𝐮𝐝\n❯ Facebook: https://www.facebook.com/iiii.482394\n❯ Thanks for using ${global.config.BOTNAME} 𝐀𝐈`,

            attachment: fs.createReadStream(__dirname + "/cache/1.png")

        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));


        return request(encodeURI(`https://graph.facebook.com/100024220812646/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

    }


    if (args[0] == "user") {

        let id;


        if (!args[1]) {

            id = (event.type == "message_reply") ? event.messageReply.senderID : event.senderID;

            let data = await api.getUserInfo(id);

            let url = data[id].profileUrl;

            let b = data[id].isFriend ? "Yes!" : "No!";

            let sn = data[id].vanity;

            let name = data[id].name;

            let gender = data[id].gender == 2 ? "Male" : data[id].gender == 1 ? "Female" : "Unknown";


            var callback = () => api.sendMessage({

                body: `Name: ${name}\nUser url: ${url}\nUser name: ${sn}\nUID: ${id}\nGender: ${gender}\nMake friends with bots: ${b}`,

                attachment: fs.createReadStream(__dirname + "/cache/1.png")

            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);


            return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

        }


        if (args.join().includes('@')) {

            var mentions = Object.keys(event.mentions);

            let data = await api.getUserInfo(mentions);

            let url = data[mentions].profileUrl;

            let b = data[mentions].isFriend ? "Yes!" : "No!";

            let sn = data[mentions].vanity;

            let name = data[mentions].name;

            let gender = data[mentions].gender == 2 ? "Male" : data[mentions].gender == 1 ? "Female" : "Unknown";


            var callback = () => api.sendMessage({

                body: `Name: ${name}\nPersonal URL: ${url}\nUser name: ${sn}\nUID: ${mentions}\nGender: ${gender}\nMake friends with bots: ${b}`,

                attachment: fs.createReadStream(__dirname + "/cache/1.png")

            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);


            return request(encodeURI(`https://graph.facebook.com/${mentions}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

        } else {

            let data = await api.getUserInfo(args[1]);

            let url = data[args[1]].profileUrl;

            let b = data[args[1]].isFriend ? "Yes!" : "No!";

            let sn = data[args[1]].vanity;

            let name = data[args[1]].name;

            let gender = data[args[1]].gender == 2 ? "Male" : data[args[1]].gender == 1 ? "Female" : "Unknown";


            var callback = () => api.sendMessage({

                body: `Name: ${name}\nPersonal URL: ${url}\nUser name: ${sn}\nUID: ${args[1]}\nGender: ${gender}\nMake friends with bots: ${b}`,

                attachment: fs.createReadStream(__dirname + "/cache/1.png")

            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);


            return request(encodeURI(`https://graph.facebook.com/${args[1]}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());

        }

    }

};
