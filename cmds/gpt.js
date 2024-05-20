const axios = require('axios');
module.exports = {
    description: "Ask the GPT a question",
    role: "user",
    cooldown: 8,
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage("Please provide a question.", event.threadID);
            return;
        }

        const question = args.join(" ");
        const searchMessage = `Looking for an answer for "${question}"...`;
        api.sendMessage(searchMessage, event.threadID);

        const apiUrl = `https://openai-rest-api.vercel.app/hercai?model=v3&ask=${encodeURIComponent(question)}`;

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.reply || "Sorry, I couldn't understand the question.";

                // Add a delay before sending the actual response message
                setTimeout(() => {
                    api.sendMessage(message, event.threadID);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
            });
    }
};