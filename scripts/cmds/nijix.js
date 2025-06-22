const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "nijix",
    aliases: ["niji", "animegen"],
    version: "1.0",
    author: "sasuke roy",
    countDown: 5,
    role: 0,
    shortDescription: "Anime image generator (Niji style)",
    longDescription: "Generate anime-style image using Niji・Journey (niji anime) by prompt",
    category: "ai",
    guide: {
      en: "{pn} <anime style prompt>\nExample: {pn} fox girl in kimono under cherry blossom"
    }
  },

  onStart: async function () {},

  onMessage: async function ({ event, args, message }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("🎨 দয়া করে anime-style প্রম্পট লেখো!\nউদাহরণ: `/nijix a catgirl with red eyes`");

    const loadingMsg = await message.reply(`🖌️ Anime image তৈরি হচ্ছে Niji style এ...\nPrompt: "${prompt}"`);

    try {
      const response = await axios.get(`https://api.nijix.ai/gen?prompt=${encodeURIComponent(prompt)}`);
      const imgURL = response.data?.image || response.data?.data;

      if (!imgURL) return message.reply("❌ ছবি পাওয়া যায়নি, আবার চেষ্টা করুন।");

      const imgPath = path.join(__dirname, "cache", `niji-${event.senderID}.jpg`);
      const imgRes = await axios.get(imgURL, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));

      return message.reply({
        body: `✨ Niji Anime Image:\n"${prompt}"`,
        attachment: fs.createReadStream(imgPath)
      }, () => fs.unlinkSync(imgPath));

    } catch (err) {
      console.error(err);
      return message.reply("❌ ইমেজ জেনারেট করতে সমস্যা হয়েছে!");
    }
  }
};
