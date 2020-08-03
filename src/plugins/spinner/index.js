const ora = require("ora");
const chalk = require('chalk');

let log = console.log;
log(chalk.red("start..."));
// const spinner = ora('Loading ... ').start();
spinner = ora({
    text:"Loading ...",
    prefixText:"pre",
    // spinner:"-",
    spinner:{
        interval:800,
        frames:['-','+','$']
    },
    color:"green",
    hideCursor:false,
    indent:10,
}).start("start...");

setTimeout(()=>{
    spinner.color= "yellow";
    spinner.text = "load complete!";

    // spinner.stop("stop");
     spinner.succeed("success!");
},4000);
