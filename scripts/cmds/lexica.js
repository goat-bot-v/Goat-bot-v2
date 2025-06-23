const axios = require("axios");

module.exports = {
  config: {
    name: "lexica",
    aliases: [],
    version: "1.0",
    author: "GoatBot",
    countDown: 5,
    role: 0,
    shortDescription: "AI image from prompt",
    longDescription: "Generate AI image using prompt via Lexica.art",
    category: "ai",
    guide: "{pn} [prompt]"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❗ Please enter a prompt.\nExample: !aivitai fantasy forest");

    try {
      const res = await axios.get(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`);
      const imageUrl = res.data.images[0]?.src || null;

      if (!imageUrl) return message.reply("❌ No image found for this prompt.");

      message.reply({
        body: `🧠 AI image for: "${prompt}"`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Failed to generate image.");
    }
  }
};
