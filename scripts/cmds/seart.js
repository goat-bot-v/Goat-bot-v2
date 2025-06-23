const axios = require("axios");
const fs = require("fs");
const path = require("path");

const NSFW_KEYWORDS = ["nude", "nsfw", "naked", "sex", "boobs", "hot", "pussy", "fuck", "18+", "xxx"];

module.exports = {
  config: {
    name: "seart",
    aliases: ["saigen", "sai"],
    version: "2.0",
    author: "sasuke roy",
    countDown: 5,
    role: 0,
    shortDescription: "Generate AI image via Seart (multi + filter)",
    longDescription: "Create multiple images from prompts using Seart AI with NSFW filter & aspect ratio",
    category: "ai",
    guide: {
      en: "{pn} <prompt> | [ratio]\nExample: {pn} beautiful anime girl with sword | 2:3"
    }
  },

  onStart: async function () {},

  onMessage: async function ({ event, args, message }) {
    const fullInput = args.join(" ").trim();
    if (!fullInput) return message.reply("📌 উদাহরণ:\n/seart fox in kimono | 2:3");

    // Aspect ratio split
    const [promptRaw, ratioRaw] = fullInput.split("|").map(part => part.trim());
    const prompt = promptRaw;
    const ratio = ratioRaw || "1:1";

    // NSFW Check
    if (NSFW_KEYWORDS.some(word => prompt.toLowerCase().includes(word)))
      return message.reply("❌ NSFW প্রম্পট নিষিদ্ধ! অন্য কিছু চেষ্টা করুন।");

    const loading = await message.reply(`🎨 Seart AI দিয়ে ছবি বানানো হচ্ছে...\n🖋️ Prompt: "${prompt}"\n📐 Ratio: ${ratio}`);

    try {
      const res = await axios.get(`https://seartapi.samirthakuri.repl.co/generate/multi?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`);
      const images = res.data?.data;

      if (!images || images.length === 0) return message.reply("❌ কোনো ছবি পাওয়া যায়নি!");

      // 3 image max
      const attachments = [];
      for (let i = 0; i < Math.min(images.length, 3); i++) {
        const imgRes = await axios.get(images[i], { responseType: "arraybuffer" });
        const imgPath = path.join(__dirname, "cache", `seart-${event.senderID}-${i}.jpg`);
        fs.writeFileSync(imgPath, Buffer.from(imgRes.data, "binary"));
        attachments.push(fs.createReadStream(imgPath));
      }

      await message.reply({
        body: `🖼️ Seart AI Generated:\nPrompt: ${prompt}\nRatio: ${ratio}`,
        attachment: attachments
      });

      // Delete temp files
      attachments.forEach((file) => fs.unlinkSync(file.path));

    } catch (err) {
      console.error(err);
      return message.reply("❌ ছবি আনতে সমস্যা হয়েছে!");
    }
  }
};
