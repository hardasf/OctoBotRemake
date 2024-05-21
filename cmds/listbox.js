module.exports = {

    description: "List groups and perform actions",

    role: "admin",

    cooldown: 0,

    execute: async function(api, event, args, commands) {

        if (args[0] === "remove" && args[1]) {
            const threadID = args[1];
            api.removeUserFromGroup(api.getCurrentUserID(), threadID, (err) => {
                if (err) {
                    api.sendMessage(`Failed to leave group ${threadID}`, event.threadID);
                } else {
                    api.sendMessage(`Left group ${threadID} successfully!`, event.threadID);
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

        let msg = '',

            i = 1;

        const groupid = [];

        for (const group of listbox) {

            msg += `${i++}. ${group.name}\n🧩TID: ${group.id}\n🐸Member: ${group.sotv}\n\n`;

            groupid.push(group.id);

        }

        api.sendMessage(msg + 'to remove:\nremove threadID', event.threadID, (err) => {

            if (err) {

                console.error(err);

            }

        });

    }

};
