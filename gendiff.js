const { Command } = require('commander');

function gengiff() {
    const program = new Command();

    program.version('0.0.1');
    program
        .arguments('<filepath1>')
        .arguments('<filepath2>')
        .description('Compares two configuration files and shows a difference.')
        .option('-h, --help', 'output extra debugging')
        .option('-f, --format [type]', 'output format')
        
    program.parse(process.argv);

    if (program.opts().help) {
        console.log(program.help('Compares two configuration files and shows a difference.'));
    } 
    if (program.opts().format){
        console.log(program.opts().format);
    }
    if (program.args) {
        console.log(program.args);
    }
}

gengiff();