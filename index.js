#!/usr/bin/env node
import { Command } from 'commander';
import genDiff from './src/gendiff.js';

const program = new Command();

program.version('0.0.1');
program
  .arguments('<filepath1>')
  .arguments('<filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .option('-h, --help', 'output extra debugging')
  .option('-f, --format [type]', 'output format')
  .action((name, options, command) => {
    console.log(name);
    console.log(options);
    console.log(command);
    if (program.opts().help) {
      program.help('Compares two configuration files and shows a difference.');
    }

    if (program.args) {
      // console.log(program.args);
      // const { format } = program.opts();
      const [file1, file2] = program.args;
      console.log(genDiff(file1, file2));
    }
  });

program.parse(process.argv);
