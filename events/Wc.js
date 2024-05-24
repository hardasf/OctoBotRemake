module.exports = {
  async handleEvent(api, event) {
    if (event.logMessageData?.addedParticipants) {
      const groupInfo = await api.getThreadInfo(event.threadID);
      const memberCount = groupInfo.participantIDs.length;
      const groupName = groupInfo.threadName;

      event.logMessageData.addedParticipants.forEach(async (participant) => {
        try {
          const info = await api.getUserInfo(participant.userFbId);
          const { name } = info[participant.userFbId];
          const welcomeMessage = `Welcome ${name} to ${groupName}, Congrats! You are the ${memberCount}th member!`;
          api.sendMessage(welcomeMessage, event.threadID);
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }
  }
};
