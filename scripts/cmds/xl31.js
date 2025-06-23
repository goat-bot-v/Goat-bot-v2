module.exports = {
  config: {
    name: "xl31",
    aliases: ["aiimage", "ximg"],
    version: "1.0",
    author: "sasuke_roy",
    countDown: 5,
    role: 0,
    shortDescription: "Xl31 AI দিয়ে ছবি বানাও",
    longDescription: "তোমার দেওয়া প্রম্পট অনুযায়ী FluxPro model ব্যবহার করে AI ছবি বানাবে",
    category: "ai",
    guide: "{pn} <প্রম্পট>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("📌 অনুগ্রহ করে কী ছবি বানাতে চাও তা লিখো।\nউদাহরণ: xl31 একটি বৃষ্টির দিনে গ্রামে হাঁটা ছেলে");

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=fluxpro`;

    try {
      message.reply({
        body: `🖼️ [Xl31 z AI Image]\n🔍 Prompt: "${prompt}"`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ FluxPro API থেকে ছবি আনতে সমস্যা হয়েছে।");
    }
  }
};
