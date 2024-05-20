const axios = require('axios');
const fs = require('fs');

module.exports = {
    description: "Random Hentai Image",
    role: "user",
    cooldown: 18,
    execute(api, event, args, commands) {
      /*  if (args.length === 0) {
            api.sendMessage("Please provide a clan tag.", event.threadID);
            return;
        }
*/
        const apiUrl = "https://nekos.pro/api/random/";

        // Fetch data from the provided API
        axios.get(apiUrl)
            .then(response => {
                const imageUrl = response.data.url;
              //  const charName = response.data.character_name;
                // Download and send the image
                downloadAndSendImage(api, event, imageUrl);
            })
            .catch(error => {
                console.error('Error fetching data from API:', error);
                api.sendMessage('Error fetching data from API.', event.threadID);
            });
    }
};

// Function to download and send image
async function downloadAndSendImage(api, event, imageUrl) {
    try {
        const response = await axios.get(imageUrl, { responseType: 'stream' });
        const imagePath = 'cache/cache.jpg'; // Change the filename as needed
        const writer = fs.createWriteStream(imagePath);
        response.data.pipe(writer);

        // Wait for the download to finish
        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Send the downloaded image as an attachment
        const msg = {
            body: `😖`,
            attachment: fs.createReadStream(imagePath),
        };
        api.sendMessage(msg, event.threadID);

        // Optionally, you can delete the downloaded image after sending
       // fs.unlinkSync(imagePath);
    } catch (error) {
        console.error('Error downloading or sending image:', error);
        api.sendMessage('Error downloading or sending image.', event.threadID);
    }
}