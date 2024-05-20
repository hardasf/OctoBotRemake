// cmds/listbox.js

module.exports = {

    description: "List groups and perform actions",

    role: "admin",

    cooldown: 0,

    execute: async function(api, event, args, commands) {

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

        api.sendMessage(msg + 'YAFB✅', event.threadID, (err, data) => {

            if (!err) {

                global.client.handleReply.push({

                    name: 'listbox',

                    author: event.senderID,

                    messageID: data.messageID,

                    groupid,

                    type: 'reply'

                });

            } else {

                console.error(err);

            }

        });

    },

    handleReply: async function({ api, event, args, Threads, handleReply }) {

        if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;

        const arg = event.body.split(" ");

        const idgr = handleReply.groupid[arg[1] - 1];

        switch (handleReply.type) {

            case "reply":

                if (arg[0] === "ban" || arg[0] === "Ban") {

                    const data = (await Threads.getData(idgr)).data || {};

                    data.banned = 1;

                    await Threads.setData(idgr, { data });

                    global.data.threadBanned.set(parseInt(idgr), 1);

                    api.sendMessage(`[${idgr}] It was successful!`, event.threadID, event.messageID);

                } else if (arg[0] === "out" || arg[0] === "Out") {

                    api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr);

                    api.sendMessage("Out thread with id: " + idgr + "\n" + (await Threads.getData(idgr)).name, event.threadID, event.messageID);

                }

                break;

        }

    }

};