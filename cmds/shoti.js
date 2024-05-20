const axios = require('axios');
const fs = require('fs');
const request = require('request');

module.exports = {
  description: "Sends a shawty toktik videos",
  role: "user",
  cooldown: 28,
  execute: async function (api, event, args, commands) {
    try {
      var msg1 = {
        body: "Sending Babes...😘"
      };

      const apiUrl = "https://shoti-srv1.onrender.com/api/v1/get";

      const { data } = await axios.post(apiUrl, {
        apikey: "$shoti-1ho3b41uiohngdbrgk8",
      });
       //https://shoti-api.deno.dev
      // Destructure relevant information from the response data
      const { url: videoUrl, user: { username, nickname } } = data.data;
      const videoStream = fs.createWriteStream('cache/shoti.mp4');
      await new Promise((resolve, reject) => {
        const rqs = request(encodeURI(videoUrl));
        rqs.pipe(videoStream);
        rqs.on('end', resolve);
        rqs.on('error', reject);
      });

      // send vid
      var msg2 = {
        body: `ToktikUser: ${username} (${nickname})`,
        attachment: fs.createReadStream('cache/shoti.mp4')
      };

      // Send 
      api.sendMessage(msg1, event.threadID, event.messageID);
      setTimeout(() => {
        api.sendMessage(msg2, event.threadID, event.messageID);
      }, 2000);

    } catch (error) {
      console.error(error);
      api.sendMessage(`${error}`, event.threadID);
    }
  }
};