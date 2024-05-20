const fs = require('fs');
const axios = require('axios');

module.exports = {
    description: "Add a new command from a given URL",
    role: "admin",
    cooldown: 5,
    execute(api, event, args, commands) {
        if (args.length !== 2) {
            api.sendMessage("Please provide the URL and the name of the command file.", event.threadID);
            return;
        }

        const url = args[0];
        const fileName = args[1];

        axios.get(url)
            .then(response => {
                const code = response.data;
                const filePath = `./cmds/${fileName}`;

                fs.writeFile(filePath, code, (err) => {
                    if (err) {
                        console.error('Error:', err);
                        api.sendMessage("Failed to add the command.", event.threadID);
                    } else {
                        api.sendMessage(`Command "${fileName}" added successfully!`, event.threadID, event.messageID);
                    }
                });
            })
            .catch(error => {
                console.error('Error:', error);
                api.sendMessage("Failed to download the command code.", event.threadID);
            });
    }
};