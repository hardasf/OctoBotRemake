const axios = require('axios');

function sendHourlyMessage(api, message) {
    setInterval(() => {
        api.getThreadList(100, null, ["INBOX"], (err, list) => {
            if (err) {
                console.error('Error fetching thread list:', err);
                return;
            }
            list.forEach(thread => {
                api.sendMessage(message, thread.threadID, (err) => {
                    if (err) {
                        console.error(`Error sending hourly message to thread ${thread.threadID}:`, err);
                    } else {
                        console.log(`Hourly message sent to thread ${thread.threadID}`);
                    }
                });
            });
        });
    }, 29 * 60 * 1000); 
}

function init(api) {

    const message = "Hey 👋 Wanna Create Bot like this you can fork this project here https://github.com/hardasf/OctoBotRemake and start exploring 🥰 any suggestions feedback don't hesitate to contact us❤️";
    
    /* using fs 
    const message  = {
        body: `WELCOME TO YETANOTHERFBBOT`,
        attachment: fs.createReadStream('cache/logo1.png')
      };
      */
      
    sendHourlyMessage(api, message);
}

module.exports = {
    init
};
