const fs = require('fs');
const path = require('path');

module.exports = {
    description: "List groups and perform actions",
    role: "admin",
    cooldown: 0,
    execute: async function(api, event, args, commands) {
        const threadsFilePath = path.join(__dirname, '../database/threads.json');

        // Ensure the directory exists
        fs.mkdirSync(path.dirname(threadsFilePath), { recursive: true });

        if (args[0] === "remove" && args[1]) {
            const rank = parseInt(args[1], 10);

            // Read the stored thread data
            let storedData;
            try {
                storedData = JSON.parse(fs.readFileSync(threadsFilePath, 'utf8'));
            } catch (err) {
                api.sendMessage(`Failed to read stored thread data`, event.threadID);
                return;
            }

            // Find the thread by rank
            const threadToRemove = storedData.find(thread => thread.rank === rank);
            if (!threadToRemove) {
                api.sendMessage(`Invalid rank: ${rank}`, event.threadID);
                return;
            }

            const threadID = threadToRemove.threadid;

            // Remove user from the group
            api.removeUserFromGroup(api.getCurrentUserID(), threadID, (err) => {
                if (err) {
                    api.sendMessage(`Failed to leave group ${threadToRemove.threadname} (ID: ${threadID})`, event.threadID);
                } else {
                    api.sendMessage(`Left group ${threadToRemove.threadname} (rank ${rank}, ID: ${threadID}) successfully!`, event.threadID);
                }
            });
            return;
        }

        const inbox = await api.getThreadList(100, null, ['INBOX']);
        const list = [...inbox].filter(group => group.isSubscribed && group.isGroup);

        const listthread = [];

        for (const groupInfo of list) {
            const data = await api.getThreadInfo(groupInfo.threadID);
            listthread.push({
                id: groupInfo.threadID,
                name: groupInfo.name,
                sotv: data.userInfo.length,
            });
        }

        const listbox = listthread.sort((a, b) => b.sotv - a.sotv);
        let msg = '', i = 1;
        const groupid = [];

        // Prepare data to store in the JSON file
        const storedData = listbox.map((group, index) => ({
            threadname: group.name,
            threadid: group.id,
            rank: index + 1
        }));

        // Write data to the JSON file
        fs.writeFileSync(threadsFilePath, JSON.stringify(storedData, null, 2), 'utf8');

        for (const group of listbox) {
            msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🐸Member: ${group.sotv}\n\n`;
            groupid.push(group.id);
        }

        api.sendMessage(msg + 'To remove:\nremove <rank>', event.threadID, (err) => {
            if (err) {
                console.error(err);
            }
        });
    }
};