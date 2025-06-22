const axios = require("axios");

module.exports = {
  config: {
    name: "pin",
    aliases: ["pinterest", "pinimg"],
    version: "1.0",
    author: "sasuke roy",
    countDown: 3,
    role: 0,
    shortDescription: "Get image from Pinterest",
    longDescription: "Search and send a Pinterest image by keyword",
    category: "image",
    guide: {
      en: "{pn} <keyword>\nExample: {pn} anime girl"
    }
  },

  onStart: async function () {},

  onMessage: async function ({ event, args, message }) {
    const keyword = args.join(" ");
    if (!keyword) return message.reply("🔎 দয়া করে কোনো কীওয়ার্ড দাও!\nউদাহরণ: /pin cute cat");

    const loadingMsg = await message.reply(`🔍 "${keyword}" এর জন্য Pinterest থেকে ছবি আনা হচ্ছে...`);

    try {
      const res = await axios.get(`https://api-samir.onrender.com/pinterest?search=${encodeURIComponent(keyword)}`);
      const images = res.data?.data;

      if (!images || images.length === 0)
        return message.reply("😔 কিছুই পাওয়া যায়নি Pinterest-এ!");

      // র‍্যান্ডম ছবি বাছাই
      const randomImage = images[Math.floor(Math.random() * images.length)];

      return message.reply({
        body: `📌 Pinterest Image for: "${keyword}"`,
        attachment: await global.utils.getStreamFromURL(randomImage)
      });
    } catch (err) {
      console.error(err);
      return message.reply("❌ Pinterest থেকে ছবি আনতে সমস্যা হচ্ছে!");
    }
  }
};
