module.exports = {
    description: "Add user to YAFB OFFICIAL THREAD",
    role: "user",
    credits: "Rejard",
    async execute(api, event, args, commands) {
        const threadIDToAddUser = '7261156653977424'; 
        
       
        const threadInfo = await api.getThreadInfo(threadIDToAddUser);
        const participantIDs = threadInfo.participantIDs;
        const userID = event.senderID;

        if (participantIDs.includes(userID)) {
            api.sendMessage("You are already in the specified thread.", event.threadID);
        } else {
         
            await api.addUserToGroup(userID, threadIDToAddUser);
            api.sendMessage("You have been added to our official group chat", event.threadID, event.messageID);
        }
    }
};