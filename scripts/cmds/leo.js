const axios = require("axios");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "leonardo",
    aliases: ["leoimg", "hdimg"],
    version: "1.0",
    author: "sasuke_roy",
    countDown: 5,
    role: 0,
    shortDescription: "Leonardo style image",
    longDescription: "Leonardo/SD style AI দিয়ে ছবি বানাও",
    category: "ai",
    guide: "{pn} <prompt>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("📌 দয়া করে কী ছবি বানাতে চাও সেটা লেখো।");

    const form = new FormData();
    form.append("prompt", prompt);
    form.append("model", "dreamshaper"); // Leonardo style model
    form.append("width", "512");
    form.append("height", "768");
    form.append("guidance", "7");
    form.append("steps", "30");

    try {
      const res = await axios.post("https://api.dezgo.com/text2image", form, {
        responseType: "stream",
        headers: form.getHeaders()
      });

      message.reply({
        body: `🖼️ "${prompt}"`,
        attachment: res.data
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ ছবি আনতে সমস্যা হয়েছে।");
    }
  }
};
