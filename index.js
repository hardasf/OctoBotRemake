/*
(⁠ ⁠ꈍ⁠ᴗ⁠ꈍ⁠) DEV: REJARD BENTAZAR 

* CREDITS TO: 
** AIZENTEL 
**NTKANG
** FCA-UNOFFICIAL
*/

const chalk =  require('chalk');
const { spawn } = require("child_process");
const path = require('path');
const YAFB_SYSTEM = "V315.js";
const YAFB_CORE = path.join(__dirname, YAFB_SYSTEM);
console.log(chalk.green('[SUCCES] - OctobotRemake is Now Ready to Use'));
function start() {
    const main = spawn("node", [YAFB_SYSTEM], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });
    main.on("close", (exitCode) => {
        if (exitCode === 0) {
            console.log(chalk.red('YAFB MAIN SYSTEM CLOSE!'));
        } else if (exitCode === 1) {
            console.log(chalk.red('YAFB MAIN SYSTEM RESTARTING PLS WAIT!'));
            start();
        }  else {
            console.error(`Main process exited with code ${exitCode}`);
        }
    });
}
start();
