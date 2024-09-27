const { Command } = require('commander');
const program = new Command();


program 
    .option("-p <port> ", "Puerto por defecto", 8080)
    .option("--mode <mode>", "Modo de ejecucion", "dev")    
program.parse();

console.log("opciones", program.opts());

module.exports = program;













