const axios = require('axios');

module.exports = {
    description: "teaches an ai how to speak",
    role: "user",
    cooldown: 8,
    execute(api, event, args, commands) {
        if (args.length === 0) {
            api.sendMessage("Please provide a message and answer separated by '=>'.", event.threadID);
            return;
        }

        // Combine all arguments into a single string
        const input = args.join(' ');

        // Use '=>' as a separator to split into message and answer
        const separatorIndex = input.indexOf('=>');
        if (separatorIndex === -1) {
            api.sendMessage("Please use '=>' to separate the message and answer.", event.threadID);
            return;
        }

        const message = input.slice(0, separatorIndex).trim();
        const answer = input.slice(separatorIndex + 2).trim();

        // Make a request to the SimSimi API
        axios.get(`https://simsimi.fun/api/v2/?mode=teach&lang=en&message=${encodeURIComponent(message)}&answer=${encodeURIComponent(answer)}`)
            .then(response => {
                // Handle the response from the API
                const simSimiResponse = response.data.success;
                if (simSimiResponse) {
                    // Extract the success message and credits
                    const successMessage = simSimiResponse;
                    const credits = response.data.credits;

                    // Example: Sending the success message and credits back to the user
                    api.sendMessage(`${successMessage}\n\nCredits: ${credits}`, event.threadID);
                } else {
                    api.sendMessage("No success message received from SimSimi API", event.threadID);
                }
            })
            .catch(error => {
                // Handle any errors that occurred during the API request
                console.error("Error making SimSimi API request:", error);
                api.sendMessage("An error occurred while processing your request.", event.threadID);
            });
    }
};