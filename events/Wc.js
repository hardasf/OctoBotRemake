module.exports = {
  async handleEvent(api, event) {
    if (event.logMessageData?.addedParticipants) {
      event.logMessageData.addedParticipants.forEach(async (participant) => {
        try {
          const info = await api.getUserInfo(participant.userFbId);
          const { name } = info[participant.userFbId];
          api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
        } catch (error) {
          console.error("Error:", error);
        }
      });
    }
  }
};