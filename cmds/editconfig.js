const fs = require('fs');
const path = require('path');

module.exports = {
    description: "Modify the configuration settings",
    role: "admin",
    credits: "Rejard",
    async execute(api, event, args, commands) {
        const configPath = path.join(__dirname, '../config.json');
        
        try {
            if (args.length < 2) {
                api.sendMessage("Usage: configedit <prefix|password|addadmin> <value>", event.threadID);
                return;
            }
            const action = args[0];
            const value = args[1];
            
            const configData = fs.readFileSync(configPath, 'utf-8');
            const config = JSON.parse(configData);

            switch(action.toLowerCase()) {
                case 'prefix':
                    config.PREFIX = value;
                    break;
                
                case 'password':
                    config.dakogOten = value;
                    break;
                
                case 'addadmin':
                    if (!config.admin.includes(value)) {
                        config.admin.push(value);
                    } else {
                        api.sendMessage(`Admin ${value} is already in the list.`, event.threadID);
                        return;
                    }
                    break;
                
                default:
                    api.sendMessage("Invalid action. Use one of the following: prefix, password, addadmin", event.threadID);
                    return;
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf-8');
            api.sendMessage("Configuration updated successfully.", event.threadID, () => {
                // Delay
                setTimeout(() => {
                    process.exit(1);
                }, 3000);
            });
            
        } catch (error) {
            console.error("An error occurred:", error);
            api.sendMessage("An error occurred while trying to update the configuration. Please try again later.", event.threadID);
        }
    }
};