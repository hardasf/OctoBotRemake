const fs = require('fs');
const path = require('path');

module.exports = {
    description: 'Add or remove thread IDs from SimSimi database',
    role: 'botadmin',
    cooldown: 5,
    async execute(api, event, args) {
        const simsimiDBPath = path.join(__dirname, '../database/simsimi.json');
        let simsimiDB = [];
        
        try {
            simsimiDB = require(simsimiDBPath);
        } catch (error) {
            console.error('Error loading SimSimi database:', error);
            api.sendMessage(`An error occurred while loading the database.\n\n${error}`, event.threadID);
            return;
        }

        const currentThreadID = event.threadID;

        // Fetch thread name
        let threadName = 'this thread';
        try {
            const threadInfo = await api.getThreadInfo(currentThreadID);
            threadName = threadInfo.name || threadName;
        } catch (error) {
            console.error('Error fetching thread info:', error);
        }

        const threadIndex = simsimiDB.indexOf(currentThreadID);

        if (args.length === 0) {
            const status = threadIndex !== -1 ? 'is in' : 'is not in';
            api.sendMessage(`${threadName} ${status} the SimSimi database.`, event.threadID, event.messageID);
            return;
        }

        const action = args[0];
        
        if (action === 'on') {
            if (threadIndex === -1) {
                simsimiDB.push(currentThreadID);
                api.sendMessage(`${threadName} added to the database.`, event.threadID, event.messageID);
            } else {
                api.sendMessage(`${threadName} is already in the SimSimi database.`, event.threadID);
            }
        } else if (action === 'off') {
            if (threadIndex !== -1) {
                simsimiDB.splice(threadIndex, 1);
                api.sendMessage(`${threadName} removed from the database.`, event.threadID, event.messageID);
            } else {
                api.sendMessage(`${threadName} is not in the SimSimi database.`, event.threadID, event.messageID);
            }
        } else {
            api.sendMessage(`Invalid argument. Use "on" to add or "off" to remove ${threadName} from the database.`, event.threadID, event.messageID);
            return;
        }

        fs.writeFile(simsimiDBPath, JSON.stringify(simsimiDB, null, 2), (err) => {
            if (err) {
                console.error('Error saving SimSimi database:', err);
                api.sendMessage('An error occurred while saving the database.', event.threadID);
            }
        });
    }
};
