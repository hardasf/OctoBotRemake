const axios = require('axios');
const fs = require('fs');

module.exports = {
    description: "Random Anime Image",
    role: "user",
    cooldown: 18,
    credits: "Neku",
    execute(api, event, args, commands) {
      /*  if (args.length === 0) {
            api.sendMessage("Please provide a clan tag.", event.threadID, event.messageID);
            return;
        }
*/
        const apiUrl = "https://nekos.pro/api/neko/";

        // Fetch data from the provided API
        axios.get(apiUrl)
            .then(response => {
                const imageUrl = response.data.url;

                // Download and send the image
                downloadAndSendImage(api, event, imageUrl);
            })
            .catch(error => {
                console.error('Error fetching data from API:', error);
                api.sendMessage('Error fetching data from API.', event.threadID);
            });
    }
};

// download 
async function downloadAndSendImage(api, event, imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'stream' });
        const imagePath = 'cache/cache.jpg'; 
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

//sending...
        const msg = {
            body: 'Hi💓',
            attachment: fs.createReadStream(imagePath),
        };
        api.sendMessage(msg, event.threadID, event.messageID);
       // fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error downloading or sending image:', error);
        api.sendMessage('Error downloading or sending image.', event.threadID);
    }
}