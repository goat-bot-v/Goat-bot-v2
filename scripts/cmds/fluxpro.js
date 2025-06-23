module.exports = {
  config: {
    name: "fluxpro",
    aliases: ["fluxai", "hdimg"],
    version: "1.0",
    author: "sasuke_roy",
    countDown: 5,
    role: 0,
    shortDescription: "FluxPro দিয়ে AI ছবি বানাও",
    longDescription: "তোমার লেখা অনুযায়ী FluxPro মডেল দিয়ে হাই কোয়ালিটি ছবি বানাবে",
    category: "image gen",
    guide: "{pn} <প্রম্পট>"
  },

  onStart: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("📝 অনুগ্রহ করে কী ছবি বানাতে চাও তা লিখো।\nউদাহরণ: fluxpro বৃষ্টিতে দাঁড়িয়ে থাকা একটি মেয়ে");

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=fluxpro`;

    try {
      message.reply({
        body: `🖼️ FluxPro Image Generated:\n"${prompt}"`,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      });
    } catch (err) {
      console.error(err);
      message.reply("❌ FluxPro API থেকে ছবি আনতে সমস্যা হয়েছে।");
    }
  }
};
