const axios = require('axios');

module.exports = {
    description: "Ask Gemma Google assistant ata hshsh",
    role: "user",
    credits: 'https://nemory-project.vercel.app/',
    cooldown: 8,
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage("Please provide a question.", event.threadID);
            return;
        }
        
        const myOten = event.senderID;
        const question = args.join(" ");
        const searchMessage = `Looking for an answer for "${question}"...`;
        api.sendMessage(searchMessage, event.threadID, event.messageID);
 
 
       const apiUrl = `https://ai-1stclass-nemory-project.vercel.app/api/gemma?ask=${encodeURIComponent(question)}`;
       

        axios.get(apiUrl)
            .then(response => {
                const data = response.data;
                const message = data.response || "Sorry, I couldn't understand the question.";

                // sendinsg
                setTimeout(() => {
                    api.sendMessage(message, event.threadID, event.messageID);
                }, 3000);
            })
            .catch(error => {
                console.error('Error:', error);
                api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
            });
    }
};