// cmds/gemini.js

const axios = require("axios");

module.exports = {

    description: "Talk to Gemini (conversational)",

    role: "user",

    cooldown: 5,

    execute: async function(api, event, args) {

        let prompt = args.join(" ");

        if (!prompt) {

            api.sendMessage(`🪷 | Please enter a prompt.`, event.threadID);

            return;

        }

        api.sendTypingIndicator(event.threadID);

        try {

            const geminiApi = `https://69070.replit.app/gemini`;

            let url = "";

            if (event.type === "message_reply") {

                if (event.messageReply.attachments[0]?.type === "photo") {

                    url = encodeURIComponent(event.messageReply.attachments[0].url);

                } else {

                    api.sendMessage('Please reply to an image.', event.threadID);

                    return;

                }

            }

            const response = await axios.get(`${geminiApi}?prompt=${encodeURIComponent(prompt)}&url=${url}`);

            api.sendMessage(response.data.success, event.threadID);

        } catch (error) {

            console.error(error);

            api.sendMessage('❌ | An error occurred. You can try typing your query again or resending it. There might be an issue with the server that\'s causing the problem, and it might resolve on retrying.', event.threadID);

        }

    }

};