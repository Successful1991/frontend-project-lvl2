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
    // console.log(name, options, command);
    if (program.opts().help) {
      program.help('Compares two configuration files and shows a difference.');
    }

    if (program.args) {
      // console.log(program.args);
      // const format = program.opts().format ? program.opts().format : 'json';
      console.log(genDiff(...program.args));
    }
  });

program.parse(process.argv);
