const fs = require('fs');

module.exports = {
    description: 'Add or remove thread IDs from SimSimi database',
    role: 'botadmin',
    cooldown: 5,
    execute(api, event, args) {
    
//code here
const path = require('path');
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
        const threadIndex = simsimiDB.indexOf(currentThreadID);
        const addThread = args[0] === 'add';
        if (addThread) {
            if (threadIndex === -1) {
                simsimiDB.push(currentThreadID);
                api.sendMessage(`Thread ID ${currentThreadID} added to the database.`, event.threadID);
            } else {
                api.sendMessage(`Thread ID ${currentThreadID} is already in the simsimi database.`, event.threadID);
            }
        } else {
            if (threadIndex !== -1) {
                simsimiDB.splice(threadIndex, 1);
                api.sendMessage(`Thread ID ${currentThreadID} removed from the database.`, event.threadID);
            } else {
                api.sendMessage(`Thread ID ${currentThreadID} is not in the simsimi database.`, event.threadID);
            }
        }
        fs.writeFile(simsimiDBPath, JSON.stringify(simsimiDB, null, 2), (err) => {
            if (err) {
                console.error('Error saving SimSimi database:', err);
                api.sendMessage('An error occurred while saving the database.', event.threadID);
            }
        });
    }
};