const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

module.exports.config = {
  name: "magicchat",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Rasel Mahmud",
  description: "Magic Chat: AI chat & coding assistant (supports reply)",
  commandCategory: "ai",
  usages: "[message or reply]",
  cooldowns: 5
};

module.exports.languages = {
  en: {
    noPrompt: "❌ দয়া করে কিছু লিখো বা কোনো মেসেজে রিপ্লাই করো!",
    running: "🔮 Magic Chat চিন্তা করছে... অপেক্ষা করো...",
    error: "🚫 সমস্যা হয়েছে: %1"
  }
};

module.exports.run = async function({ api, event, args, getText }) {
  try {
    const { threadID, messageID, messageReply } = event;

    const prompt = messageReply?.body || args.join(" ").trim();

    if (!prompt) return api.sendMessage(getText("noPrompt"), threadID, messageID);

    api.sendMessage(getText("running"), threadID, messageID);

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(configuration);

    const res = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful and kind assistant. You can reply in Bangla or English based on user input." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 700
    });

    const answer = res.data.choices[0].message.content;
    const finalAns = answer.length > 1900 ? answer.slice(0, 1900) + "\n\n...(বাকিটা কেটে গেছে)" : answer;

    return api.sendMessage(`💬 Magic Chat:\n\n${finalAns}`, threadID, messageID);

  } catch (err) {
    return api.sendMessage(getText("error", err.message), event.threadID, event.messageID);
  }
};
