const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

module.exports = {
    description: 'Get reactions for a post',
    role: 'user',
    cooldown: 3,
    execute: async function(api, event, args) {
        const [link, type, cookieCmd, cookieValue] = args;
        if (!link || !type) {
            api.sendMessage(`🪷 | Please provide all required parameters: [link] [type].`, event.threadID);
            api.setMessageReaction( ': heart:', event.messageID);
            return;
        }

        const createDir = async (dir) => {
            try {
                await fs.mkdir(dir, { recursive: true });
            } catch (error) {
                console.error('Error creating directory:', error);
            }
        };

        const userDataDir = path.join(__dirname, '..', 'database', 'users');
        await createDir(userDataDir);
        const uid = event.senderID;
        const userFilePath = path.join(userDataDir, `${uid}.json`);
        const readUserData = async () => {
            try {
                const data = await fs.readFile(userFilePath, 'utf8');
                return JSON.parse(data);
            } catch (error) {
                return {}; // Return empty 
            }
        };

        const writeUserData = async (data) => {
            try {
                await fs.writeFile(userFilePath, JSON.stringify(data, null, 2), 'utf8');
            } catch (error) {
                console.error('Error writing user data:', error);
            }
        };

        // Check if the user wan
        if (cookieCmd === 'addcookie' && cookieValue) {
            const userData = await readUserData();
            userData.cookie = cookieValue;
            await writeUserData(userData);
            api.sendMessage('🍪 Cookie added/updated successfully.', event.threadID);
            return;
        }

        api.sendMessage(`🔄 Fetching reactions for ${link}...`, event.threadID);
        try {
            const userData = await readUserData();
            const cookie = userData.cookie || '';

            const response = await axios.post("https://flikers.net/android/android_get_react.php", {
                post_id: link,
                react_type: type,
                version: "v1.7"
            }, {
                headers: {
                    'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)",
                    'Connection': "Keep-Alive",
                    'Accept-Encoding': "gzip",
                    'Content-Type': "application/json",
                    'Cookie': cookie
                }
            });

            api.sendMessage(JSON.stringify(response.data), event.threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage('An error occurred while fetching reactions.', event.threadID);
        }
    }
};