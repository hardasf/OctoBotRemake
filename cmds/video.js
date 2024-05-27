module.exports = {
    description: "Play a music video",
    role: "user",
    cooldown: 15,
    execute: async function(api, event, args, commands) {
        const fs = require("fs-extra");
        const ytdl = require("ytdl-core");
        const yts = require("yt-search");

        const videoName = args.join(' ');

        if (!videoName) {
            api.sendMessage(`To get started, type "music video" followed by the title of the video you want to play.`, event.threadID, event.messageID);
            return;
        }

        try {
            api.sendMessage(`Searching for "${videoName}"...`, event.threadID, event.messageID);

            const searchResults = await yts(videoName);

            if (!searchResults.videos.length) {
                return api.sendMessage("Can't find the video you searched for.", event.threadID, event.messageID);
            } else {
                const video = searchResults.videos[0];
                const videoUrl = video.url;
                const stream = ytdl(videoUrl, {
                    filter: "audioandvideo"
                });

                const time = new Date();
                const timestamp = time.toISOString().replace(/[:.]/g, "-");
                const filePath = `cache/${timestamp}_music_video.mp4`;

                stream.pipe(fs.createWriteStream(filePath));
                stream.on('response', () => {});
                stream.on('info', (info) => {});
                stream.on('end', () => {
                    if (fs.statSync(filePath).size > 26214400) {
                        fs.unlinkSync(filePath);
                        return api.sendMessage('The video could not be sent because it is larger than 25MB.', event.threadID);
                    }
                    const message = {
                        body: `${video.title}`,
                        attachment: fs.createReadStream(filePath)
                    };
                    api.sendMessage(message, event.threadID, () => {
                        fs.unlinkSync(filePath);
                    }, event.messageID);
                });
            }
        } catch (error) {
            console.error(error);
            api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
        }
    }
};