const fs = require('fs');

const adminFilePath = './database/botadmin.json';

module.exports = {
    description: "manage bot admin add or delete",
    role: "admin",
    credits: "Rejardgwapo",
    cooldown: 15,
    async execute(api, event, args, commands) {
        if (args.length < 1) {
            return api.sendMessage("Usage: !botadmin <add/delete/list> [<uid>]", event.threadID);
        }

        const action = args[0].toLowerCase();

        try {
            let adminList = JSON.parse(fs.readFileSync(adminFilePath));

            if (action === 'list') {
                let adminNames = [];

                // Fetch names for each user ID in the admin list
                for (const uid of adminList) {
                    try {
                        const userInfo = await api.getUserInfo(uid);
                        const name = userInfo[uid].name;
                        adminNames.push(name);
                    } catch (error) {
                        console.error("Error fetching user info:", error);
                        adminNames.push("Unknown");
                    }
                }

                return api.sendMessage("Admins: " + adminNames.join("\n❤️"), event.threadID);
            }

            const uid = args[1];

            if (!uid) {
                return api.sendMessage("Please provide a user ID.", event.threadID);
            }

            if (action === 'add') {
                adminList.push(uid);
            } else if (action === 'delete') {
                adminList = adminList.filter(id => id !== uid);
            } else {
                return api.sendMessage("Invalid action. Use 'add', 'delete', or 'list'.", event.threadID);
            }

            fs.writeFileSync(adminFilePath, JSON.stringify(adminList, null, 2));
            return api.sendMessage(`User ${uid} ${action === 'add' ? 'added to' : 'deleted from'} admin list.`, event.threadID);
        } catch (error) {
            console.error(error);
            return api.sendMessage("An error occurred while updating admin.json", event.threadID);
        }
    }
};